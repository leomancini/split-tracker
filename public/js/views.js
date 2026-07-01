// --- Views ---
function dashboardView(alert){
  var h = '';
  if(alert) h += '<div class="alert alert-success">'+esc(alert)+'</div>';


  h += '<div class="section">';
  if(D.groups.length){
    D.groups.forEach(function(g){
      h += '<div class="card card-link" style="margin-bottom:1rem" data-link="/groups/'+g.id+'">'
        + '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem">'
        + '<div style="font-weight:600;font-size:1.125rem;min-width:0;overflow:hidden;text-overflow:ellipsis">'+esc(g.name)+'</div>'
        + balancePill(g)
        + '</div>'
        + (g.member_avatars && g.member_avatars.length ? '<div style="margin-top:0.75rem;margin-bottom:0.25rem">'+avatarStack(g.member_avatars.map(function(a){return {url:a.url,faded:a.is_pending,letter:a.letter}}))+'</div>' : '')
        + '</div>';
    });
  } else {
    h += '<div class="empty">No groups yet. Create one to get started!</div>';
  }
  h += '<div style="height:5rem"></div></div>';
  h += '<div class="sticky-bottom"><button class="btn" data-link="/groups/new">New group</button></div>';
  return h;
}

function groupCreateView(){
  return '<h1>New group</h1>'
    + '<form id="create-group-form">'
    + '<div class="form-group"><label>Name</label>'
    + '<input type="search" id="grp-title" autocomplete="off" role="presentation" placeholder="Trip to Paris, apartment, groceries"></div>'
    + '<div class="form-group"><label>People</label>'
    + '<textarea id="grp-inv" autocomplete="off" placeholder="Email addresses, one per line"></textarea></div>'
    + '</form>'
    + '<div class="sticky-bottom"><button type="submit" form="create-group-form" class="btn">Create group</button></div>';
}

function groupDetailView(detail, alert){
  var g = detail.group, members = detail.members, isOwner = detail.isOwner;
  var dispNames = buildDisplayNames(members);
  var h = '';

  if(alert) h += '<div class="alert '+(alert.type==='error'?'alert-error':'alert-success')+'">'+esc(alert.text)+'</div>';

  if(isOwner){
    h += '<h1 style="margin-bottom:0.5rem;cursor:pointer" data-action="rename-group" data-group-id="'+g.id+'">'+esc(g.name)+' <i class="fa-solid fa-pen" style="font-size:0.75rem;color:var(--gray-400);vertical-align:middle;transition:color 150ms"></i></h1>';
  } else {
    h += '<h1 style="margin-bottom:0.5rem">'+esc(g.name)+'</h1>';
  }

  // Avatar row with settled pill
  var settlements = calcSettlements(members, detail.expenses);
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:1rem;margin-bottom:1rem">';
  h += '<div style="display:flex;align-items:center">'
    + '<div data-link="/groups/'+g.id+'/members" style="cursor:pointer">' + avatarStack(members.map(function(m){return {url:m.avatar_url,faded:!!m.pending_invite_id,letter:((m.name||m.email||'').charAt(0)||'').toUpperCase()}})) + '</div>'
    + '<div class="add-member-icon" data-link="/groups/'+g.id+'/add-member" style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--gray-500);background:var(--gray-100);flex-shrink:0;margin-left:0.625rem;transition:background 150ms,color 150ms;cursor:pointer;user-select:none;-webkit-user-select:none"><svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="1.5" x2="7" y2="12.5"></line><line x1="1.5" y1="7" x2="12.5" y2="7"></line></svg></div>'
    + '</div>';
  var mySettlements = settlements.filter(function(s){ return s.from==D.user.id || s.to==D.user.id; });
  if(!mySettlements.length && detail.expenses && detail.expenses.length){
    h += '<span style="display:inline-flex;align-items:center;gap:0.4rem;flex-shrink:0;font-size:0.875rem;padding-right:4px;color:var(--gray-500)"><i class="fa-solid fa-check"></i><span style="font-weight:500">Settled</span></span>';
  }
  h += '</div>';

  // --- Balances ---
  if(mySettlements.length){
    var firstSettlement = true;
    settlements.forEach(function(s){
      var isYou = s.from==D.user.id;
      var involvesYou = s.from==D.user.id || s.to==D.user.id;
      if(!involvesYou) return;
      var venmoUrl = '', cashappUrl = '';
      var note = 'Balance on Split for ' + g.name;
      if(isYou){
        if(s.toVenmo){ var vh = s.toVenmo.replace(/^@/, ''); venmoUrl = 'https://venmo.com/'+encodeURIComponent(vh)+'?txn=pay&note='+encodeURIComponent(note).replace(/%20/g,'%C2%A0')+'&amount='+encodeURIComponent(s.amt.toFixed(2)); }
        if(s.toCashapp){
          var tag = s.toCashapp.replace(/^$/, '');
          cashappUrl = 'https://cash.app/$'+encodeURIComponent(tag)+'/'+encodeURIComponent(s.amt.toFixed(2));
        }
      } else if(s.to==D.user.id){
        if(s.fromVenmo){ var vh = s.fromVenmo.replace(/^@/, ''); venmoUrl = 'https://venmo.com/'+encodeURIComponent(vh)+'?txn=charge&note='+encodeURIComponent(note).replace(/%20/g,'%C2%A0')+'&amount='+encodeURIComponent(s.amt.toFixed(2)); }
        if(s.fromCashapp){
          var tag = s.fromCashapp.replace(/^$/, '');
          cashappUrl = 'https://cash.app/$'+encodeURIComponent(tag)+'/'+encodeURIComponent(s.amt.toFixed(2));
        }
      }
      var hasPayOption = venmoUrl || cashappUrl;
      var isRequest = !isYou && s.to==D.user.id;
      var payBtnStyle = 'font-size:1rem;font-weight:600;text-decoration:none;padding:0.375rem 1rem;border-radius:999px';
      if(firstSettlement){
        h += '<div style="margin-top:1.5rem">';
        h += '<div style="height:2px;background:var(--gray-200);border-radius:2px;margin-bottom:0.5rem"></div>';
      }
      var otherName = isYou ? esc(dispNames[s.to]||s.toName) : esc(dispNames[s.from]||s.fromName);
      var actionLabel = isRequest ? 'Request' : 'Pay';
      h += '<div class="settlement-row" style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;min-height:3.25rem">'
        + '<span class="settlement-text" style="font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0">'
        + '<span style="font-weight:500">'+(isYou?'You':esc(dispNames[s.from]||s.fromName))+'</span>'
        + (isYou?' owe ':' owes ')
        + '<span style="font-weight:500">'+(s.to==D.user.id?'you':esc(dispNames[s.to]||s.toName))+'</span>'
        + ' <span style="font-family:var(--mono);font-weight:600;color:'+(isYou?'#dc2626':'var(--green-600)')+'">'+fmtAmt(s.amt)+'</span>'
        + '</span>'
        + '<div class="settlement-btns" style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0;margin-left:0.5rem">'
        + (hasPayOption ? '<span class="pay-btn" style="'+payBtnStyle+';color:#fff;background:var(--green-500);cursor:pointer" data-action="expand-pay"'
          + (venmoUrl ? ' data-venmo-url="'+esc(venmoUrl)+'"' : '')
          + (cashappUrl ? ' data-cashapp-url="'+esc(cashappUrl)+'"' : '')
          + ' data-other-name="'+otherName+'"'
          + ' data-action-label="'+actionLabel+'"'
          + ' data-settle-from="'+s.from+'"'
          + ' data-settle-to="'+s.to+'"'
          + ' data-settle-amt="'+s.amt.toFixed(2)+'"'
          + ' data-settle-group="'+g.id+'"'
          + '>'+actionLabel+'</span>' : '')
        + '</div>'
        + '</div>';
      firstSettlement = false;
    });
    h += '<div style="height:2px;background:var(--gray-200);border-radius:2px;margin-top:0.5rem"></div>';
    h += '</div><div style="margin-bottom:calc(1.25rem - 8px)"></div>';
  }

  var expenses = detail.expenses || [];
  if(expenses.length){
    expenses.forEach(function(ex, idx){
      var isSettlement = ex.category === 'settlement';
      var settlementHtml = '';
      if(isSettlement){
        var payer = ex.paid_by === D.user.id ? 'You' : (dispNames[ex.paid_by] || ex.paid_by_name);
        var payee = ex.settled_with === D.user.id ? 'You' : (dispNames[ex.settled_with] || ex.settled_with_name);
        settlementHtml = '<span style="font-weight:500">'+esc(payer)+'</span> paid <span style="font-weight:500">'+esc(payee)+'</span>';
      }
      h += '<div class="expense-row'+(isSettlement ? ' settlement' : '')+'" data-link="/groups/'+g.id+'/items/'+ex.id+'" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0.5rem;cursor:pointer">'
        + '<div class="expense-icon"'+(isSettlement ? ' style="background:var(--gray-100);color:var(--gray-500)"' : '')+'>'+expenseIcon(ex)+'</div>'
        + '<span class="expense-name" style="flex:1;min-width:0'+(isSettlement ? ';color:var(--gray-500);font-weight:400' : '')+'">'+(isSettlement ? settlementHtml : esc(ex.name))+'</span>'
        + '<span class="expense-amount"'+(isSettlement ? ' style="color:var(--gray-500)"' : '')+'>'+fmtAmt(ex.amount)+'</span>'
        + '</div>';
    });
  } else {
    h += '<div class="empty">No items yet</div>';
  }

  // Bottom padding so list isn't hidden behind sticky button
  h += '<div class="group-bottom-spacer"></div>';

  // Sticky add item button
  h += '<div class="sticky-bottom"><button class="btn" data-link="/groups/'+g.id+'/add-expense">Add item</button></div>';

  return h;
}

function addExpenseView(gid, ex){
  var isEdit = !!ex;
  var members = groupCache[gid] ? groupCache[gid].members : [];
  var dispNames = buildDisplayNames(members);
  var others = members.filter(function(m){ return m.id !== D.user.id; });
  var h = '<h1>'+(isEdit ? 'Edit item' : 'Add item')+'</h1>'
    + '<form id="add-expense-form" data-group-id="'+gid+'"'+(isEdit ? ' data-expense-id="'+ex.id+'"' : '')+'>'
    + '<div class="form-group"><label>Name</label>'
    + '<input type="text" id="exp-desc" placeholder="Pizza, groceries, ride home, etc" data-1p-ignore autocomplete="off" value="'+(isEdit ? esc(ex.name) : '')+'"></div>'
    + '<div class="form-group"><label>Amount</label>'
    + '<input type="number" id="exp-cost" inputmode="decimal" step="0.01" placeholder="0.00" value="'+(isEdit ? esc(String(ex.amount)) : '')+'"></div>';
  if(members.length){
    h += '<div class="form-group"><label>Paid by</label>'
      + '<select id="exp-paid-by">';
    members.forEach(function(m){
      var sel = isEdit ? (m.id === ex.paid_by) : (m.id === D.user.id);
      h += '<option value="'+m.id+'"'+(sel ? ' selected' : '')+'>'+esc(m.id === D.user.id ? 'You' : (dispNames[m.id]||m.name))+'</option>';
    });
    h += '</select></div>';
  }
  // Split type selector
  if(members.length >= 2){
    h += '<div class="form-group"><label>Split</label>'
      + '<select id="exp-split-type">'
      + '<option value="equal">Split equally</option>';
    if(members.length === 2 && others.length === 1){
      h += '<option value="you_owe">You owe '+esc(dispNames[others[0].id]||others[0].name)+'</option>';
      h += '<option value="they_owe">'+esc(dispNames[others[0].id]||others[0].name)+' owes you</option>';
    } else {
      h += '<option value="you_owe">You owe full amount</option>';
      h += '<option value="they_owe">They owe full amount</option>';
    }
    h += '<option value="uneven">Split unequally</option>';
    h += '</select></div>';
    // Participant picker — always rendered for 2+ members; hidden for 2-person groups until uneven is selected
    var wrapHidden = members.length === 2 ? 'display:none;' : '';
    h += '<div id="exp-participants-wrap" class="form-group" style="'+wrapHidden+'">'
      + '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.375rem">'
        + '<label id="exp-participants-label" style="margin-bottom:0">Split between</label>'
        + '<span id="exp-uneven-msg" style="display:none;font-size:0.8125rem;color:#e53e3e"></span>'
      + '</div>'
      + '<div id="exp-participants" style="border:2px solid var(--gray-200);border-radius:var(--radius);overflow:hidden">';
    members.forEach(function(m, idx){
      var isLast = idx === members.length - 1;
      var borderStyle = isLast ? '' : ';border-bottom:1px solid var(--gray-100)';
      h += '<div class="exp-participant-row" style="display:flex;align-items:center;gap:0.625rem;padding:0.75rem;margin:0'+borderStyle+'">'
        + '<input type="checkbox" class="exp-participant-cb" value="'+m.id+'" checked style="flex-shrink:0">'
        + '<span class="exp-participant-name" style="flex:1;font-size:0.9375rem;color:var(--gray-900)">'+esc(m.id === D.user.id ? 'You' : (dispNames[m.id]||m.name))+'</span>'
        + '<input type="number" class="exp-uneven-amt" data-member-id="'+m.id+'" step="0.01" min="0" placeholder="0.00"'
        + ' style="display:none;width:72px;height:1.4rem;text-align:right;padding:0 0.375rem;border:1px solid var(--gray-300);border-radius:4px;font-size:16px">'
        + '</div>';
    });
    h += '</div>'
      + '</div>';
  }
  h += '</form>'
    + '<div class="add-expense-bottom-spacer"></div>'
    + '<div class="sticky-bottom"><button type="submit" form="add-expense-form" class="btn"'+(isEdit ? '' : ' disabled')+'>'+(isEdit ? 'Save' : 'Add item')+'</button></div>';
  return h;
}

function itemDetailView(gid, ex, isOwner){
  var gInfo = groupCache[gid] ? groupCache[gid].group : D.groups.find(function(g){return g.id==gid});
  var gName = gInfo ? gInfo.name : 'Group';
  var detailMembers = groupCache[gid] ? groupCache[gid].members : [];
  var dispNames = buildDisplayNames(detailMembers);
  var canDelete = ex.paid_by === D.user.id || isOwner;
  var detailNameHtml;
  if(ex.settled_with){
    var payer = ex.paid_by === D.user.id ? 'You' : (dispNames[ex.paid_by] || ex.paid_by_name);
    var payee = ex.settled_with === D.user.id ? 'You' : (dispNames[ex.settled_with] || ex.settled_with_name);
    detailNameHtml = '<span style="font-weight:600">'+esc(payer)+'</span> paid <span style="font-weight:600">'+esc(payee)+'</span>';
  } else {
    detailNameHtml = esc(ex.name);
  }
  var h = '<div class="item-detail-icon"'+(ex.settled_with ? ' style="background:var(--gray-100);color:var(--gray-500)"' : '')+'>'+expenseIcon(ex, 32)+'</div>';
  h += '<div class="item-detail-amount">'+fmtAmt(ex.amount)+'</div>';
  h += '<div class="item-detail-name">'+detailNameHtml+'</div>';
  h += '<div style="margin-top:5rem;margin-bottom:1.5rem">';
  h += '<div class="info-row"><span class="info-label">Date</span><span class="info-value">'+fmtDate(ex.created_at)+'</span></div>';
  h += '<div class="info-row"><span class="info-label">Type</span><span class="info-value">'+(ex.settled_with ? 'Payment' : 'Expense')+'</span></div>';
  if(!ex.settled_with){
    h += '<div class="info-row"><span class="info-label">Category</span><span class="info-value">'+catLabel(ex.category)+'</span></div>';
  }
  if(ex.settled_with){
    var method = ex.name.indexOf('Venmo') !== -1 ? 'Venmo' : ex.name.indexOf('Cash App') !== -1 ? 'Cash App' : '';
    if(method) h += '<div class="info-row"><span class="info-label">Method</span><span class="info-value">'+method+'</span></div>';
    h += '<div class="info-row"><span class="info-label">Paid by</span><span class="info-value">'+esc(ex.paid_by === D.user.id ? 'You' : (dispNames[ex.paid_by] || ex.paid_by_name))+'</span></div>';
    h += '<div class="info-row"><span class="info-label">Received by</span><span class="info-value">'+esc(ex.settled_with === D.user.id ? 'You' : (dispNames[ex.settled_with] || ex.settled_with_name))+'</span></div>';
  } else {
    h += '<div class="info-row"><span class="info-label">Paid by</span><span class="info-value">'+esc(ex.paid_by === D.user.id ? 'You' : (dispNames[ex.paid_by] || ex.paid_by_name))+'</span></div>';
    var allIds = detailMembers.map(function(m){return m.id;});
    function memberName(uid){
      if(uid === D.user.id) return 'You';
      return dispNames[uid] || 'Unknown';
    }
    if(ex.split_type === 'full'){
      var owes = ex.split_participants ? JSON.parse(ex.split_participants) : [];
      var names = owes.map(memberName);
      var verb = owes.length === 1 && names[0] !== 'You' ? 'owes' : (names[0] === 'You' && owes.length === 1 ? 'owe' : 'owe');
      var splitText = names.join(', ') + ' ' + verb + ' full amount';
      h += '<div class="info-row"><span class="info-label">Split</span><span class="info-value">'+esc(splitText)+'</span></div>';
    } else if(ex.split_type === 'custom'){
      h += '<div class="info-row" style="border-bottom:none; padding-bottom:10px"><span class="info-label">Split</span><span class="info-value">Unequally</span></div>';
      var parts = ex.split_participants ? JSON.parse(ex.split_participants) : [];
      var amts = ex.split_amounts ? JSON.parse(ex.split_amounts) : [];
      var activeParts = [];
      parts.forEach(function(pid, idx){
        var a = amts[idx] || 0;
        if(a > 0){
          activeParts.push({ pid: pid, amt: a });
        }
      });
      activeParts.forEach(function(item, idx){
        var pid = item.pid;
        var a = item.amt;
        var isLastPart = idx === activeParts.length - 1;
        var m = detailMembers.find(function(mem){ return mem.id === pid; }) || (pid === D.user.id ? D.user : null);
        var avatarHtml = '';
        if(m){
          var avUrl = m.avatar_url;
          if(avUrl){
            avatarHtml = '<img src="'+esc(getCachedAvatar(avUrl))+'" style="width:24px;height:24px;border-radius:50%;object-fit:cover;background:var(--gray-200);flex-shrink:0" alt="">';
          } else {
            var letter = ((m.name||m.email||'').charAt(0)||'').toUpperCase();
            avatarHtml = '<div style="width:24px;height:24px;border-radius:50%;background:var(--gray-200);color:var(--gray-500);font-size:0.75rem;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-transform:uppercase">'+esc(letter)+'</div>';
          }
        }
        var rowStyle = 'display:flex; align-items:center;';
        if(isLastPart){
          rowStyle += ' border-bottom:none; padding:10px 0 16px 0;';
        } else {
          rowStyle += ' border-bottom:none; padding:10px 0;';
        }
        h += '<div class="info-row" style="'+rowStyle+'">'
          + '<span class="info-label" style="display:flex;align-items:center;gap:0.5rem">'
          + avatarHtml
          + '<span>'+esc(memberName(pid))+'</span>'
          + '</span>'
          + '<span class="info-value">'+esc(fmtAmt(a))+'</span>'
          + '</div>';
      });
    } else {
      var parts = ex.split_participants ? JSON.parse(ex.split_participants) : allIds;
      var splitText;
      if(parts.length >= allIds.length){
        splitText = 'Equally';
      } else {
        splitText = 'Equally between ' + parts.map(memberName).join(', ');
      }
      h += '<div class="info-row"><span class="info-label">Split</span><span class="info-value">'+esc(splitText)+'</span></div>';
    }
  }
  h += '</div>';
  // Bottom padding so content isn't hidden behind sticky button
  h += '<div class="group-bottom-spacer"></div>';
  if(canDelete){
    h += '<div class="sticky-bottom"><button class="btn btn-danger" data-action="delete-item" data-id="'+ex.id+'" data-group-id="'+gid+'">Delete item</button></div>';
  }
  return h;
}

function groupMembersView(detail, alert){
  var g = detail.group, members = detail.members, invites = detail.invites, isOwner = detail.isOwner;
  var dispNames = buildDisplayNames(members);
  var h = '';

  if(alert) h += '<div class="alert '+(alert.type==='error'?'alert-error':'alert-success')+'">'+esc(alert.text)+'</div>';

  h += '<h1>People</h1>';
  h += '<div style="margin-top:-12px">';
  members.forEach(function(m){
    var pending = !!m.pending_invite_id;
    var avatarOpacity = pending ? ';opacity:0.25' : '';
    var avatarHtml = m.avatar_url
      ? '<img src="'+esc(getCachedAvatar(m.avatar_url))+'" class="member-avatar" alt=""'+(pending?' style="opacity:0.25"':'')+'>'
      : '<div class="member-avatar" style="display:flex;align-items:center;justify-content:center;color:var(--gray-500);font-size:1rem'+avatarOpacity+'">'+esc((m.email||'?').charAt(0).toUpperCase())+'</div>';
    h += '<div class="member-row" style="align-items:center">'
      + avatarHtml
      + '<div class="member-info"><div class="member-name">'+esc(dispNames[m.id]||m.name)+'</div>'
      + '<div class="member-email">'+esc(m.email)
        + (m.role==='owner' ? ' &middot; Group creator' : (pending ? ' &middot; Pending' : ''))
        + '</div></div>';
    if(isOwner && m.role !== 'owner'){
      if(pending && m.pending_invite_id){
        h += '<button class="btn btn-xs btn-danger" data-action="cancel-invite" data-group-id="'+g.id+'" data-invite-id="'+m.pending_invite_id+'">Cancel</button>';
      } else {
        h += '<button class="btn btn-xs btn-danger" data-action="remove-member" data-group-id="'+g.id+'" data-user-id="'+m.id+'">Remove</button>';
      }
    }
    h += '</div>';
  });

  invites.forEach(function(i){
    h += '<div class="member-row">'
      + '<div class="member-avatar" style="display:flex;align-items:center;justify-content:center;color:var(--gray-500);font-size:1rem;opacity:0.25">'+esc(i.email.charAt(0).toUpperCase())+'</div>'
      + '<div class="member-info"><div class="member-name">'+esc(i.email)+'</div>'
      + '<div class="member-email">Pending</div></div>';
    h += '<button class="btn btn-xs btn-danger" data-action="cancel-invite" data-group-id="'+g.id+'" data-invite-id="'+i.id+'">Cancel</button>';
    h += '</div>';
  });

  h += '</div>';

  h += '<div style="height:5rem"></div>';
  h += '<div class="sticky-bottom"><button class="btn" data-link="/groups/'+g.id+'/add-member">Add person</button></div>';

  return h;
}

function addMemberView(gid){
  return '<h1>Add person</h1>'
    + '<form id="invite-form" data-group-id="'+gid+'">'
    + '<div class="form-group"><label>Email address</label>'
    + '<input type="email" id="invite-email" placeholder="person@example.com"></div>'
    + '</form>'
    + '<div class="sticky-bottom"><button type="submit" form="invite-form" class="btn">Send invite</button></div>';
}

function profileView(){
  var u = D.user;
  var avatarSrc = u.avatar_url ? getCachedAvatar(u.avatar_url) : null;
  var pushSupported = ('serviceWorker' in navigator) && ('PushManager' in window) && ('Notification' in window);
  var pushOn = !!u.push_enabled;
  return '<div style="display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;min-height:calc(100vh - 200px);margin-top:-8rem">'
    + (avatarSrc ? '<img src="'+esc(avatarSrc)+'" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:1rem;background:var(--gray-200)" alt="">'
      : '<div style="width:72px;height:72px;border-radius:50%;background:var(--gray-200);margin:0 auto 1rem"></div>')
    + '<div style="font-size:1.25rem;font-weight:600">'+esc(u.name)+'</div>'
    + '<div style="font-size:0.9375rem;color:var(--gray-500)">'+esc(u.email)+'</div>'
    + '<div class="form-group" style="margin-top:3rem;text-align:left;width:100%"><label>Venmo</label>'
    + '<input type="text" id="venmo-handle" value="'+esc(u.venmo_handle||'')+'" placeholder="@username" autocomplete="off"></div>'
    + '<div class="form-group" style="text-align:left;width:100%"><label>Cash App</label>'
    + '<input type="text" id="cashapp-handle" value="'+esc(u.cashapp_handle||'')+'" placeholder="$cashtag" autocomplete="off"></div>'
    + (pushSupported
        ? '<div class="form-group toggle-row" style="text-align:left;width:100%;margin-top:0.5rem">'
          + '<label class="toggle-label" for="push-toggle">Push notifications</label>'
          + '<label class="toggle-switch"><input type="checkbox" id="push-toggle"'+(pushOn?' checked':'')+'><span class="toggle-slider"></span></label>'
          + '</div>'
        : '')
    + '</div>'
    + '<div style="height:5rem"></div>'
    + '<div class="sticky-bottom">'
    + '<button class="btn" id="demo-toggle" style="margin-bottom:0.75rem;background:var(--gray-100);color:var(--gray-700)">'
    + (D.demoMode ? 'Disable demo mode' : 'Enable demo mode') + '</button>'
    + '<a href="/logout" class="btn btn-danger" onclick="sessionStorage.clear()">Log out</a></div>';
}

