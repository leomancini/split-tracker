// --- Router ---
var app = document.getElementById('app');
var groupCache = {};
var lastNav = 0;
var routeVer = 0;
var prevPath = '';
var iconPollTimer = null;

function expenseNeedsIcon(ex){
  return !ex.icon && ex.category !== 'settlement' && !ex.settled_with;
}
function stopIconPoll(){ if(iconPollTimer){ clearTimeout(iconPollTimer); iconPollTimer = null; } }
function startIconPoll(gid, myVer, attempt){
  stopIconPoll();
  var detail = groupCache[gid];
  if(!detail || myVer !== routeVer) return;
  var pending = (detail.expenses||[]).some(expenseNeedsIcon);
  if(!pending) return;
  if(attempt > 20) return; // ~30s cap
  iconPollTimer = setTimeout(function(){
    if(myVer !== routeVer) return;
    fetch('/api/groups/'+gid).then(function(r){return r.json()}).then(function(fresh){
      if(myVer !== routeVer) return;
      groupCache[gid] = fresh;
      // Re-render whichever view the user is on that depends on this cache.
      var path = location.pathname;
      if(path === '/groups/'+gid){
        app.innerHTML = groupDetailView(fresh);
      } else {
        var mItem = path.match(/^\/groups\/\d+\/items\/(\d+)$/);
        if(mItem){
          var ex = (fresh.expenses||[]).find(function(e){return e.id==mItem[1]});
          if(ex) app.innerHTML = itemDetailView(gid, ex, fresh.isOwner);
        }
      }
      startIconPoll(gid, myVer, (attempt||0)+1);
    }).catch(function(){});
  }, 1500);
}

var brandEl = document.querySelector('nav .brand');
var avatarEl = document.querySelector('nav .user-info');
function updateNav(path){
  if(path === '/' || path === ''){
    brandEl.innerHTML = 'Split';
    brandEl.removeAttribute('data-link');
    brandEl.style.fontSize = '1.5rem';
    brandEl.style.color = '';
    brandEl.style.cursor = '';
    avatarEl.style.display = '';
  } else {
    avatarEl.style.display = 'none';
    brandEl.innerHTML = '&larr;';
    brandEl.style.fontSize = '1.5rem';
    brandEl.style.color = 'var(--gray-500)';
    brandEl.style.cursor = 'pointer';
    // Set back target based on route depth
    if(path.match(/^\/groups\/\d+\/add-member/)){
      var gid = path.match(/^\/groups\/(\d+)/)[1];
      brandEl.setAttribute('data-link', prevPath && prevPath.indexOf('/groups/'+gid) === 0 ? prevPath : '/groups/'+gid);
    } else if(path.match(/^\/groups\/\d+\/(items|add-expense|members)/)){
      var gid = path.match(/^\/groups\/(\d+)/)[1];
      brandEl.setAttribute('data-link','/groups/'+gid);
    } else {
      brandEl.setAttribute('data-link','/');
    }
  }
}

async function route(path, opts){
  var myVer = ++routeVer;
  opts = opts || {};
  stopIconPoll();
  updateNav(path);
  var m;

  if(path === '/' || path === ''){
    document.title = 'Split';
    app.innerHTML = dashboardView(opts.alert);
    // Refresh in the background so balances/order reflect changes made in groups.
    refreshData().then(function(){
      if(myVer !== routeVer) return;
      app.innerHTML = dashboardView(opts.alert);
    });
    // Prefetch Font Awesome so it's ready when user opens a group
    if(!document.querySelector('link[data-fa-prefetch]')){
      var faLink = document.createElement('link');
      faLink.rel = 'prefetch';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
      faLink.crossOrigin = 'anonymous';
      faLink.setAttribute('data-fa-prefetch','1');
      document.head.appendChild(faLink);
    }
  }
  else if(path === '/groups/new'){
    document.title = 'Split – New group';
    app.innerHTML = groupCreateView();
    var nameInput = document.getElementById('grp-title');
    if(nameInput) nameInput.focus();
  }
  else if((m = path.match(/^\/groups\/(\d+)\/add-expense$/))){
    var gid = m[1];
    document.title = 'Split – Add item';
    if(!groupCache[gid]){
      app.innerHTML = '<div style="display:flex;justify-content:center;padding:3rem 0"><div class="spinner"></div></div>';
      var r = await fetch('/api/groups/'+gid);
      if(myVer !== routeVer) return;
      groupCache[gid] = await r.json();
    }
    app.innerHTML = addExpenseView(gid);
    var expInput = document.getElementById('exp-desc');
    if(expInput) expInput.focus();
    // Enable "Add item" only when name and amount are both valid
    var nameEl = document.getElementById('exp-desc');
    var amtEl = document.getElementById('exp-cost');
    var addBtn = document.querySelector('button[form="add-expense-form"]');
    function distributeUnevenAmounts(totalVal, inputs) {
      if (!inputs.length) return;
      var totalCents = Math.round((parseFloat(totalVal) || 0) * 100);
      var N = inputs.length;
      var baseShare = Math.floor(totalCents / N);
      var remainder = totalCents % N;
      inputs.forEach(function(inp, idx){
        var cents = baseShare + (idx < remainder ? 1 : 0);
        inp.value = (cents / 100).toFixed(2);
      });
    }
    // Split the leftover (total minus the amounts the user has manually edited)
    // evenly across only the inputs that haven't been touched. Edited inputs
    // stay locked and are never auto-changed again.
    function redistributeUnevenRemaining() {
      var amtElLocal = document.getElementById('exp-cost');
      var totalCents = Math.round((parseFloat(amtElLocal ? amtElLocal.value : 0) || 0) * 100);
      var inputs = document.querySelectorAll('.exp-uneven-amt');
      if (!inputs.length) return;
      var lockedCents = 0;
      var open = [];
      inputs.forEach(function(inp){
        if (inp.dataset.edited === '1') {
          lockedCents += Math.round((parseFloat(inp.value) || 0) * 100);
        } else {
          open.push(inp);
        }
      });
      if (!open.length) return;
      var remaining = totalCents - lockedCents;
      if (remaining < 0) remaining = 0;
      var N = open.length;
      var baseShare = Math.floor(remaining / N);
      var rem = remaining % N;
      open.forEach(function(inp, idx){
        var cents = baseShare + (idx < rem ? 1 : 0);
        inp.value = (cents / 100).toFixed(2);
      });
    }
    function onUnevenAmtInput(e){
      e.target.dataset.edited = '1';
      redistributeUnevenRemaining();
      syncAddBtn();
    }
    function syncAddBtn(){
      var ok = nameEl && amtEl && nameEl.value.trim() && parseFloat(amtEl.value) > 0;
      var splitSel2 = document.getElementById('exp-split-type');
      if(splitSel2 && splitSel2.value === 'uneven'){
        var total2 = parseFloat(amtEl ? amtEl.value : 0) || 0;
        var sum2 = 0;
        document.querySelectorAll('.exp-uneven-amt').forEach(function(inp){ sum2 += parseFloat(inp.value) || 0; });
        var msg2 = document.getElementById('exp-uneven-msg');
        var diffCents2 = Math.round(total2 * 100) - Math.round(sum2 * 100);
        if(diffCents2 !== 0){
          ok = false;
          if(msg2){
            if(total2 > 0){
              var rem2 = Math.abs(diffCents2) / 100;
              msg2.textContent = diffCents2 > 0 ? (fmtAmt(rem2)+' left') : (fmtAmt(rem2)+' over');
              msg2.style.display = '';
            } else { msg2.style.display = 'none'; }
          }
        } else {
          if(msg2) msg2.style.display = 'none';
        }
      }
      if(addBtn) addBtn.disabled = !ok;
    }
    if(nameEl) nameEl.addEventListener('input', syncAddBtn);
    if(amtEl) amtEl.addEventListener('input', function(){
      // When total amount changes while in uneven mode, re-split the leftover
      // across untouched inputs while keeping edited amounts locked.
      var splitSelChk = document.getElementById('exp-split-type');
      if(splitSelChk && splitSelChk.value === 'uneven'){
        redistributeUnevenRemaining();
      }
      syncAddBtn();
    });
    // Wire up split type change handler
    var splitSel = document.getElementById('exp-split-type');
    if(splitSel){
      var cachedMembers = groupCache[gid] ? groupCache[gid].members : [];
      var memberCount = cachedMembers.length;
      splitSel.addEventListener('change', function(){
        var v = splitSel.value;
        var paidByEl = document.getElementById('exp-paid-by');
        var partWrap = document.getElementById('exp-participants-wrap');
        var partLabel = document.getElementById('exp-participants-label');
        // For 2-person groups: auto-switch paid_by
        if(memberCount === 2 && paidByEl){
          var otherVal = null;
          for(var i=0;i<paidByEl.options.length;i++){
            if(parseInt(paidByEl.options[i].value) !== D.user.id){ otherVal = paidByEl.options[i].value; break; }
          }
          if(v === 'you_owe' && otherVal) paidByEl.value = otherVal;
          else if(v === 'they_owe') paidByEl.value = String(D.user.id);
          else if(v === 'equal') paidByEl.value = String(D.user.id);
        }
        // Helper: switch participant rows to checkbox mode
        function showCheckboxMode(){
          var rows = partWrap.querySelectorAll('.exp-participant-row');
          rows.forEach(function(row){ row.style.display = 'flex'; });
          partWrap.querySelectorAll('.exp-participant-cb').forEach(function(cb){ cb.style.display = ''; });
          partWrap.querySelectorAll('.exp-uneven-prefix').forEach(function(p){ p.style.display = 'none'; });
          partWrap.querySelectorAll('.exp-uneven-amt').forEach(function(inp){ inp.style.display = 'none'; });
          var msg = document.getElementById('exp-uneven-msg');
          if(msg) msg.style.display = 'none';
        }
        // Show/hide participant picker based on mode
        if(partWrap){
          if(v === 'equal'){
            if(memberCount > 2) partWrap.style.display = '';
            else partWrap.style.display = 'none';
            partLabel.textContent = 'Split between';
            showCheckboxMode();
            // Check all, show all rows
            var cbs = partWrap.querySelectorAll('.exp-participant-cb');
            cbs.forEach(function(cb){ cb.closest('.exp-participant-row').style.display = 'flex'; cb.checked = true; });
          } else if(v === 'they_owe'){
            if(memberCount > 2) partWrap.style.display = '';
            else partWrap.style.display = 'none';
            partLabel.textContent = 'Who owes';
            showCheckboxMode();
            // Hide "You" checkbox, show & check others
            var cbs = partWrap.querySelectorAll('.exp-participant-cb');
            cbs.forEach(function(cb){
              if(parseInt(cb.value) === D.user.id){ cb.closest('.exp-participant-row').style.display = 'none'; cb.checked = false; }
              else { cb.closest('.exp-participant-row').style.display = 'flex'; cb.checked = true; }
            });
            // Auto-set paid_by to you
            if(paidByEl) paidByEl.value = String(D.user.id);
          } else if(v === 'you_owe'){
            partWrap.style.display = 'none';
            showCheckboxMode();
            // Auto-switch paid_by to someone else if it's you
            if(paidByEl && parseInt(paidByEl.value) === D.user.id){
              for(var i=0;i<paidByEl.options.length;i++){
                if(parseInt(paidByEl.options[i].value) !== D.user.id){ paidByEl.value = paidByEl.options[i].value; break; }
              }
            }
          } else if(v === 'uneven'){
            partWrap.style.display = '';
            partLabel.textContent = 'Amounts';
            // Hide checkboxes, show amount inputs for all rows
            var rows = partWrap.querySelectorAll('.exp-participant-row');
            rows.forEach(function(row){ row.style.display = 'flex'; });
            partWrap.querySelectorAll('.exp-participant-cb').forEach(function(cb){ cb.style.display = 'none'; });
            partWrap.querySelectorAll('.exp-uneven-prefix').forEach(function(p){ p.style.display = ''; });
            var amtInputs = partWrap.querySelectorAll('.exp-uneven-amt');
            var totalAmt = parseFloat(document.getElementById('exp-cost').value) || 0;
            // Fresh entry into uneven mode: clear any prior edits and split evenly.
            amtInputs.forEach(function(inp){ delete inp.dataset.edited; });
            distributeUnevenAmounts(totalAmt, amtInputs);
            amtInputs.forEach(function(inp){
              inp.style.display = '';
              inp.removeEventListener('input', onUnevenAmtInput);
              inp.addEventListener('input', onUnevenAmtInput);
            });
            syncAddBtn();
          }
        }
      });
    }
  }
  else if((m = path.match(/^\/groups\/(\d+)\/items\/(\d+)$/))){
    var gid = m[1], eid = parseInt(m[2]);
    if(groupCache[gid]){
      var ex = (groupCache[gid].expenses||[]).find(function(e){return e.id===eid});
      if(ex){
        document.title = 'Split – ' + esc(ex.name);
        app.innerHTML = itemDetailView(gid, ex, groupCache[gid].isOwner);
        startIconPoll(gid, myVer, 0);
      } else { nav('/groups/'+gid); }
    } else {
      app.innerHTML = '<div style="display:flex;justify-content:center;padding:3rem 0"><div class="spinner"></div></div>';
      var r = await fetch('/api/groups/'+gid);
      if(myVer !== routeVer) return;
      var d = await r.json();
      groupCache[gid] = d;
      var ex = (d.expenses||[]).find(function(e){return e.id===eid});
      if(ex){
        document.title = 'Split – ' + esc(ex.name);
        app.innerHTML = itemDetailView(gid, ex, d.isOwner);
        startIconPoll(gid, myVer, 0);
      } else { nav('/groups/'+gid); }
    }
  }
  else if((m = path.match(/^\/groups\/(\d+)\/add-member$/))){
    var gid = m[1];
    document.title = 'Split – Add person';
    app.innerHTML = addMemberView(gid);
    var emailInput = document.getElementById('invite-email');
    if(emailInput) emailInput.focus();
  }
  else if((m = path.match(/^\/groups\/(\d+)\/members$/))){
    var gid = m[1];
    if(groupCache[gid]){
      document.title = 'Split – ' + groupCache[gid].group.name;
      app.innerHTML = groupMembersView(groupCache[gid], opts.alert);
    } else {
      var gInfo = D.groups.find(function(g){return g.id==gid});
      document.title = 'Split – ' + (gInfo?gInfo.name:'Group');
      app.innerHTML = '<div class="spinner"></div>';
    }
    try{
      var r = await fetch('/api/groups/'+gid);
      if(myVer !== routeVer) return;
      if(!r.ok) { nav('/'); return; }
      var detail = await r.json();
      if(myVer !== routeVer) return;
      groupCache[gid] = detail;
      document.title = 'Split – ' + detail.group.name;
      app.innerHTML = groupMembersView(detail, opts.alert);
    }catch(e){ if(myVer === routeVer && !groupCache[gid]) nav('/groups/'+gid); }
  }
  else if((m = path.match(/^\/groups\/(\d+)$/))){
    var gid = m[1];
    // Show cached or placeholder instantly
    if(groupCache[gid]){
      document.title = 'Split – ' + groupCache[gid].group.name;
      app.innerHTML = groupDetailView(groupCache[gid], opts.alert);
    } else {
      var gInfo = D.groups.find(function(g){return g.id==gid});
      document.title = 'Split – ' + (gInfo?gInfo.name:'Group');
      app.innerHTML = '<h1>'+(gInfo?esc(gInfo.name):'')+'</h1><div class="spinner"></div>';
    }
    try{
      var r = await fetch('/api/groups/'+gid);
      if(myVer !== routeVer) return;
      if(!r.ok) { nav('/'); return; }
      var detail = await r.json();
      if(myVer !== routeVer) return;
      groupCache[gid] = detail;
      document.title = 'Split – ' + detail.group.name;
      app.innerHTML = groupDetailView(detail, opts.alert);
      startIconPoll(gid, myVer, 0);
    }catch(e){ if(myVer === routeVer && !groupCache[gid]) nav('/'); }
  }
  else if(path === '/profile'){
    document.title = 'Split – Profile';
    app.innerHTML = profileView();
  }
  else {
    nav('/');
  }
}

function nav(path, opts){
  var now = Date.now();
  if(now - lastNav < 300 && path === location.pathname) return;
  lastNav = now;
  prevPath = location.pathname;
  history.pushState({},'',path);
  route(path, opts);
  window.scrollTo(0,0);
}

function demoBlocked(){
  if(D.demoMode){
    alert('This is a demo — changes won\'t be saved.');
    return true;
  }
  return false;
}

async function refreshData(){
  try{
    var r = await fetch('/api/data');
    if(r.ok){
      var d = await r.json();
      D.groups = d.groups;
      D.pendingInvites = d.pendingInvites;
    }
  }catch(e){}
}

// --- Touch navigation (fixes long-press not navigating on iOS) ---
var touchStart = null;
document.addEventListener('touchstart', function(e){
  var el = e.target.closest('[data-link]');
  if(el) touchStart = {x:e.touches[0].clientX, y:e.touches[0].clientY};
  else touchStart = null;
}, {passive:true});
document.addEventListener('touchend', function(e){
  if(!touchStart) return;
  var el = e.target.closest('[data-link]');
  if(!el){touchStart=null;return;}
  var t = e.changedTouches[0];
  var dx = Math.abs(t.clientX - touchStart.x), dy = Math.abs(t.clientY - touchStart.y);
  touchStart = null;
  if(dx < 10 && dy < 10){
    e.preventDefault();
    nav(el.getAttribute('data-link'));
  }
});

