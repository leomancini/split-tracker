// --- Event delegation ---
document.addEventListener('click', function(e){
  // Expand pay/request buttons
  var expandBtn = e.target.closest('[data-action="expand-pay"]');
  if(expandBtn){
    e.preventDefault();
    var row = expandBtn.closest('.settlement-row');
    var textEl = row.querySelector('.settlement-text');
    var btnsEl = row.querySelector('.settlement-btns');
    var name = expandBtn.getAttribute('data-other-name');
    var label = expandBtn.getAttribute('data-action-label');
    var vUrl = expandBtn.getAttribute('data-venmo-url');
    var cUrl = expandBtn.getAttribute('data-cashapp-url');
    var btnStyle = expandBtn.style.cssText;
    var isReq = label === 'Request';
    var settleFrom = expandBtn.getAttribute('data-settle-from');
    var settleTo = expandBtn.getAttribute('data-settle-to');
    var settleAmt = expandBtn.getAttribute('data-settle-amt');
    var settleGroup = expandBtn.getAttribute('data-settle-group');
    var origText = textEl.innerHTML;
    var origBtns = btnsEl.innerHTML;
    textEl.innerHTML = (isReq ? 'Request from ' : 'Pay ') + '<span style="font-weight:500">'+name+'</span>';
    var settleAttrs = ' data-action="settle-pay" data-settle-from="'+settleFrom+'" data-settle-to="'+settleTo+'" data-settle-amt="'+settleAmt+'" data-settle-group="'+settleGroup+'" data-other-name="'+name+'"';
    var btns = '';
    if(vUrl) btns += '<a href="'+vUrl+'" target="_blank" rel="noopener" class="pay-btn'+(D.demoMode ? ' demo-pay' : '')+'" style="'+btnStyle+';background:#008CFF"'+settleAttrs+' data-method="Venmo">Venmo</a>';
    if(cUrl) btns += '<a href="'+cUrl+'" target="_blank" rel="noopener" class="pay-btn'+(D.demoMode ? ' demo-pay' : '')+'" style="'+btnStyle+';background:var(--green-500)"'+settleAttrs+' data-method="Cash App">Cash App</a>';
    btns += '<span class="pay-btn" style="font-weight:600;text-decoration:none;border-radius:999px;background:var(--gray-100);color:var(--gray-500);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.375rem;font-weight:400;width:36px;height:36px;flex-shrink:0;line-height:1" data-action="collapse-pay"><svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg></span>';
    btnsEl.innerHTML = btns;
    btnsEl.querySelector('[data-action="collapse-pay"]').addEventListener('click', function(){
      textEl.innerHTML = origText;
      btnsEl.innerHTML = origBtns;
    });
    return;
  }

  // Demo pay button
  var demoBtn = e.target.closest('.demo-pay');
  if(demoBtn){ e.preventDefault(); alert('This is a demo — no real payment will be made.'); return; }

  // Settle pay button (Venmo/Cash App)
  var settleBtn = e.target.closest('[data-action="settle-pay"]');
  if(settleBtn){
    var sFrom = settleBtn.getAttribute('data-settle-from');
    var sTo = settleBtn.getAttribute('data-settle-to');
    var sAmt = settleBtn.getAttribute('data-settle-amt');
    var sGroup = settleBtn.getAttribute('data-settle-group');
    var sName = settleBtn.getAttribute('data-other-name');
    var sMethod = settleBtn.getAttribute('data-method');
    var isFromYou = parseInt(sFrom) === D.user.id;
    var expName = isFromYou
      ? sMethod + ' payment to ' + sName
      : sMethod + ' request from ' + sName;
    fetch('/api/groups/'+sGroup+'/expenses',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:expName,amount:sAmt,category:'settlement',paid_by:parseInt(sFrom),settled_with:parseInt(sTo)})
    }).then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          delete groupCache[sGroup];
          nav('/groups/'+sGroup);
        }
      });
    // Don't prevent default — let the link open
    return;
  }

  // Rename expense (must come before data-link — pencil sits inside a clickable row)
  var renameExpEl = e.target.closest('[data-action="rename-expense"]');
  if(renameExpEl){
    e.preventDefault();
    e.stopPropagation();
    if(demoBlocked()) return;
    var rxGid = renameExpEl.getAttribute('data-group-id');
    var rxId = renameExpEl.getAttribute('data-expense-id');
    var detail = groupCache[rxGid];
    var ex = detail && (detail.expenses||[]).find(function(x){return String(x.id)===rxId});
    if(!ex) return;
    var newName = prompt('Rename item:', ex.name);
    if(!newName || !newName.trim() || newName.trim() === ex.name) return;
    fetch('/api/groups/'+rxGid+'/expenses/'+rxId, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:newName.trim()})
    }).then(function(r){return r.json()}).then(function(d){
      if(d.ok){
        delete groupCache[rxGid];
        route(location.pathname);
      }
    });
    return;
  }

  // data-link navigation
  var el = e.target.closest('[data-link]');
  if(el){
    e.preventDefault();
    nav(el.getAttribute('data-link'));
    return;
  }


  // Toggle demo mode
  if(e.target.id === 'demo-toggle'){
    e.preventDefault();
    e.target.disabled = true;
    fetch('/api/demo-mode',{method:'POST'})
      .then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          D.demoMode = d.demoMode;
          refreshData().then(function(){ nav('/'); });
        }
      }).catch(function(){ e.target.disabled = false; });
    return;
  }

  // Delete item from detail page
  var delItemBtn = e.target.closest('[data-action="delete-item"]');
  if(delItemBtn){
    e.preventDefault();
    if(demoBlocked()) return;
    if(!confirm('Delete this item?'))return;
    var expId = delItemBtn.getAttribute('data-id');
    var expGid = delItemBtn.getAttribute('data-group-id');
    var btnText = delItemBtn.innerHTML;
    delItemBtn.disabled = true;
    delItemBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:3px;margin:0;border-color:rgba(220,38,38,0.3);border-top-color:#dc2626"></div>';
    fetch('/api/groups/'+expGid+'/expenses/'+expId,{method:'DELETE'})
      .then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          delete groupCache[expGid];
          nav('/groups/'+expGid);
        } else {
          delItemBtn.disabled=false;delItemBtn.innerHTML=btnText;
        }
      }).catch(function(){delItemBtn.disabled=false;delItemBtn.innerHTML=btnText;});
    return;
  }

  // Rename group
  var renameEl = e.target.closest('[data-action="rename-group"]');
  if(renameEl){
    e.preventDefault();
    if(demoBlocked()) return;
    var rgId = renameEl.getAttribute('data-group-id');
    var current = renameEl.textContent.trim();
    var newName = prompt('Rename group:', current);
    if(newName && newName.trim() && newName.trim() !== current){
      fetch('/api/groups/'+rgId,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:newName.trim()})
      }).then(function(r){return r.json()})
        .then(function(d){
          if(d.ok){
            delete groupCache[rgId];
            refreshData().then(function(){ nav('/groups/'+rgId); });
          }
        });
    }
    return;
  }

  // Remove member
  var rmBtn = e.target.closest('[data-action="remove-member"]');
  if(rmBtn){
    e.preventDefault();
    if(demoBlocked()) return;
    if(!confirm('Remove this person from the group?'))return;
    var rmGid = rmBtn.getAttribute('data-group-id');
    var rmUid = rmBtn.getAttribute('data-user-id');
    rmBtn.disabled = true;
    fetch('/api/groups/'+rmGid+'/members/'+rmUid,{method:'DELETE'})
      .then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          delete groupCache[rmGid];
          nav('/groups/'+rmGid+'/members', {alert:{text:'Person removed.',type:'success'}});
        } else { rmBtn.disabled=false; }
      }).catch(function(){rmBtn.disabled=false});
    return;
  }

  // Cancel invite
  var cancelBtn = e.target.closest('[data-action="cancel-invite"]');
  if(cancelBtn){
    e.preventDefault();
    if(demoBlocked()) return;
    var ciGid = cancelBtn.getAttribute('data-group-id');
    var ciIid = cancelBtn.getAttribute('data-invite-id');
    cancelBtn.disabled = true;
    fetch('/api/groups/'+ciGid+'/invites/'+ciIid,{method:'DELETE'})
      .then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          delete groupCache[ciGid];
          nav('/groups/'+ciGid+'/members', {alert:{text:'Invite cancelled.',type:'success'}});
        } else { cancelBtn.disabled=false; }
      }).catch(function(){cancelBtn.disabled=false});
    return;
  }

});

// Form submissions (add expense, create group, invite member)
document.addEventListener('submit', function(e){
  e.preventDefault();

  if(e.target.id === 'add-expense-form'){
    if(demoBlocked()) return;
    var gid3 = e.target.getAttribute('data-group-id');
    var descEl = document.getElementById('exp-desc');
    var costEl = document.getElementById('exp-cost');
    var expName = descEl.value.trim();
    var expAmount = costEl.value.trim();
    if(!expName||!expAmount) return;
    var cat = detectCat(expName);
    // Gather split type and participants
    var splitTypeEl = document.getElementById('exp-split-type');
    var splitTypeVal = splitTypeEl ? splitTypeEl.value : 'equal';
    var splitType = 'equal';
    var splitParticipants = null;
    var splitAmountsData = null;
    var cachedMem = groupCache[gid3] ? groupCache[gid3].members : [];
    var paidByEl = document.getElementById('exp-paid-by');
    if(splitTypeVal === 'you_owe'){
      splitType = 'full';
      splitParticipants = [D.user.id];
    } else if(splitTypeVal === 'they_owe'){
      splitType = 'full';
      if(cachedMem.length === 2){
        // 2-person group: the other person owes
        var otherM = cachedMem.find(function(m){return m.id !== D.user.id;});
        splitParticipants = otherM ? [otherM.id] : null;
      } else {
        // 3+ person group: get checked participants
        var cbs = document.querySelectorAll('.exp-participant-cb:checked');
        var ids = [];
        cbs.forEach(function(cb){ if(parseInt(cb.value) !== D.user.id) ids.push(parseInt(cb.value)); });
        splitParticipants = ids.length ? ids : null;
      }
    } else if(splitTypeVal === 'uneven'){
      splitType = 'custom';
      var unevenInputs = document.querySelectorAll('.exp-uneven-amt');
      var ids = [], amts = [];
      unevenInputs.forEach(function(inp){
        ids.push(parseInt(inp.getAttribute('data-member-id')));
        amts.push(parseFloat(inp.value) || 0);
      });
      splitParticipants = ids;
      splitAmountsData = amts;
    } else {
      // equal split
      splitType = 'equal';
      if(cachedMem.length > 2){
        var cbs = document.querySelectorAll('.exp-participant-cb:checked');
        var ids = [];
        cbs.forEach(function(cb){ ids.push(parseInt(cb.value)); });
        // Only send participants if not all are selected
        if(ids.length < cachedMem.length) splitParticipants = ids;
      }
    }
    var bodyData = {name:expName,amount:expAmount,category:cat,paid_by:paidByEl?paidByEl.value:undefined};
    if(splitType !== 'equal') bodyData.split_type = splitType;
    if(splitParticipants) bodyData.split_participants = splitParticipants;
    if(splitAmountsData) bodyData.split_amounts = splitAmountsData;
    var btn = document.querySelector('button[form="add-expense-form"]');
    var btnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:3px;margin:0;border-color:rgba(255,255,255,0.3);border-top-color:white"></div>';
    descEl.disabled = true;
    costEl.disabled = true;
    fetch('/api/groups/'+gid3+'/expenses',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(bodyData)
    }).then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          delete groupCache[gid3];
          return fetch('/api/groups/'+gid3).then(function(r2){return r2.json()}).then(function(detail){
            groupCache[gid3] = detail;
            nav('/groups/'+gid3);
          });
        } else {
          btn.disabled=false;btn.innerHTML=btnText;
          descEl.disabled=false;costEl.disabled=false;
        }
      }).catch(function(){
        btn.disabled=false;btn.innerHTML=btnText;
        descEl.disabled=false;costEl.disabled=false;
      });
    return;
  }

  if(e.target.id === 'create-group-form'){
    if(demoBlocked()) return;
    var titleEl = document.getElementById('grp-title');
    var invEl = document.getElementById('grp-inv');
    var name = titleEl.value.trim();
    if(!name) return;
    var emails = invEl.value.trim().split(/[\s,]+/).filter(function(e){return e}).join('\n');
    var btn = document.querySelector('button[form="create-group-form"]');
    var btnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:3px;margin:0;border-color:rgba(255,255,255,0.3);border-top-color:white"></div>';
    titleEl.disabled = true;
    invEl.disabled = true;
    fetch('/api/groups',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:name,emails:emails})
    }).then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          return refreshData().then(function(){
            nav('/groups/'+d.groupId, {alert:{text:'Group created!',type:'success'}});
          });
        }
        btn.disabled=false;btn.innerHTML=btnText;
        titleEl.disabled=false;invEl.disabled=false;
      }).catch(function(){
        btn.disabled=false;btn.innerHTML=btnText;
        titleEl.disabled=false;invEl.disabled=false;
      });
    return;
  }

  if(e.target.id === 'invite-form'){
    if(demoBlocked()) return;
    var gid2 = e.target.getAttribute('data-group-id');
    var emailEl = document.getElementById('invite-email');
    var email = emailEl.value.trim().toLowerCase();
    if(!email) return;
    var btn = document.querySelector('button[form="invite-form"]');
    var btnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:3px;margin:0;border-color:rgba(255,255,255,0.3);border-top-color:white"></div>';
    emailEl.disabled = true;
    fetch('/api/groups/'+gid2+'/invite',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:email})
    }).then(function(r){return r.json()})
      .then(function(d){
        if(d.ok){
          delete groupCache[gid2];
          nav('/groups/'+gid2+'/members');
        } else if(d.error === 'Already a member'){
          nav('/groups/'+gid2+'/members', {alert:{text:'That person is already in this group.',type:'error'}});
        } else if(d.error === 'Already invited'){
          nav('/groups/'+gid2+'/members', {alert:{text:'That email has already been invited.',type:'error'}});
        } else {
          btn.disabled=false;btn.innerHTML=btnText;emailEl.disabled=false;
        }
      }).catch(function(){btn.disabled=false;btn.innerHTML=btnText;emailEl.disabled=false;});
    return;
  }
});

// Save payment handles on blur
document.addEventListener('focusout', function(e){
  if(e.target.id !== 'venmo-handle' && e.target.id !== 'cashapp-handle') return;
  var venmoEl = document.getElementById('venmo-handle');
  var cashappEl = document.getElementById('cashapp-handle');
  var venmo = venmoEl ? venmoEl.value.trim() : '';
  var cashapp = cashappEl ? cashappEl.value.trim() : '';
  fetch('/api/profile/payment',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({venmo_handle:venmo,cashapp_handle:cashapp})})
    .then(function(r){return r.json()})
    .then(function(d){ if(d.ok){ D.user.venmo_handle = venmo || null; D.user.cashapp_handle = cashapp || null; }});
});

// Push notifications toggle
function urlBase64ToUint8Array(base64){
  var padding = '='.repeat((4 - base64.length % 4) % 4);
  var base = (base64 + padding).replace(/-/g,'+').replace(/_/g,'/');
  var raw = atob(base);
  var out = new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++) out[i] = raw.charCodeAt(i);
  return out;
}
async function enablePush(){
  if(!('serviceWorker' in navigator) || !('PushManager' in window)){
    alert('Push notifications are not supported in this browser.');
    return false;
  }
  var perm = await Notification.requestPermission();
  if(perm !== 'granted'){
    alert('Push permission was denied.');
    return false;
  }
  var reg = await navigator.serviceWorker.ready;
  var keyRes = await fetch('/api/push/vapid-public-key');
  if(!keyRes.ok){ alert('Push notifications are not configured on the server.'); return false; }
  var keyData = await keyRes.json();
  var existing = await reg.pushManager.getSubscription();
  if(existing) await existing.unsubscribe();
  var sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(keyData.key),
  });
  var r = await fetch('/api/push/subscribe',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(sub.toJSON()),
  });
  if(!r.ok) return false;
  D.user.push_enabled = 1;
  return true;
}
async function disablePush(){
  try {
    if('serviceWorker' in navigator){
      var reg = await navigator.serviceWorker.ready;
      var sub = await reg.pushManager.getSubscription();
      if(sub){
        await fetch('/api/push/unsubscribe',{
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
    }
  } catch(e){}
  var r = await fetch('/api/profile/push-enabled',{
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ enabled: false }),
  });
  if(!r.ok) return false;
  D.user.push_enabled = 0;
  return true;
}
document.addEventListener('change', function(e){
  if(e.target.id !== 'push-toggle') return;
  var cb = e.target;
  var wanted = cb.checked;
  cb.disabled = true;
  (wanted ? enablePush() : disablePush())
    .then(function(ok){
      if(!ok) cb.checked = !wanted;
      cb.disabled = false;
    })
    .catch(function(err){
      console.error('push toggle failed:', err);
      cb.checked = !wanted;
      cb.disabled = false;
    });
});

// Back/forward
window.addEventListener('popstate', function(){
  route(location.pathname);
});

// Initial render
route(location.pathname);

