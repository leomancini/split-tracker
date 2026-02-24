function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function shell(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Split Tracker</title>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="theme-color" content="#ffffff">
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/icon.svg">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="/splash-640x1136.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/splash-750x1334.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1242x2208.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1125x2436.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/splash-828x1792.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1242x2688.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1170x2532.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1284x2778.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1179x2556.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1290x2796.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1206x2622.png">
  <link rel="apple-touch-startup-image" media="screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1320x2868.png">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
  <style>
    :root {
      --green-50: #f0fdf4;
      --green-100: #dcfce7;
      --green-500: #22c55e;
      --green-600: #16a34a;
      --green-700: #15803d;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-700: #374151;
      --gray-900: #111827;
      --radius: 12px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }

    input, textarea { -webkit-user-select: text; user-select: text; }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      color: var(--gray-900);
      line-height: 1.5;
      padding-top: env(safe-area-inset-top);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
      padding-bottom: 0;
    }

    nav {
      background: white;
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    nav .brand {
      font-weight: 700;
      font-size: 1.35rem;
      color: var(--green-500);
      text-decoration: none;
      cursor: pointer;
    }

    nav .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    nav .user-info img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 1.5rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
    }

    h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; }
    h2 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem; }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      background: var(--green-500);
      color: white;
      border: none;
      border-radius: 999px;
      padding: 1rem 1.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      text-decoration: none !important;
      transition: background 150ms, transform 100ms;
      -webkit-touch-callout: none !important;
      -webkit-user-select: none;
      user-select: none;
      touch-action: manipulation;
    }

    @media (hover: hover) { .btn:hover { background: var(--green-600); } }
    .btn:active { transform: scale(0.93); transition: transform 150ms; }

    .btn-sm { padding: 1rem 1.25rem; font-size: 1rem; }

    .sticky-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 1rem 1.5rem;
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 35%);
      padding-top: 2.5rem;
      z-index: 10;
      pointer-events: none;
    }
    .sticky-bottom .btn { pointer-events: auto; width: 100%; }

    .btn-outline {
      background: white;
      color: var(--green-600);
      border: 2px solid var(--green-500);
    }

    @media (hover: hover) { .btn-outline:hover { background: var(--green-50); } }

    .btn-danger {
      background: white;
      color: #dc2626;
      border: 2px solid #fca5a5;
    }

    @media (hover: hover) { .btn-danger:hover { background: #fef2f2; } }

    .card {
      background: white;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius);
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .card-link {
      display: block;
      text-decoration: none;
      color: inherit;
      transition: transform 100ms;
      -webkit-touch-callout: none;
      cursor: pointer;
    }

    @media (hover: hover) { .card-link:hover { border-color: var(--green-500); } }
    .card-link:active { transform: scale(0.95); transition: transform 150ms; }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.375rem;
      color: var(--gray-700);
    }

    input, textarea {
      width: 100%;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius);
      padding: 0.625rem 0.75rem;
      font-size: 16px;
      font-family: inherit;
      color: var(--gray-900);
      -webkit-appearance: none;
    }

    input:focus, textarea:focus {
      outline: 2px solid var(--green-500);
      outline-offset: -1px;
      border-color: var(--green-500);
    }

    textarea { resize: vertical; min-height: 80px; }

    .form-group { margin-bottom: 1rem; }

    .form-hint {
      font-size: 0.8125rem;
      color: var(--gray-500);
      margin-top: 0.25rem;
    }

    .badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.125rem 0.5rem;
      border-radius: 999px;
      background: var(--green-100);
      color: var(--green-700);
    }

    .badge-gray {
      background: var(--gray-100);
      color: var(--gray-500);
    }

    .member-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }

    .member-row + .member-row { border-top: 2px solid var(--gray-100); }

    .member-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--gray-200);
    }

    .member-info { flex: 1; }
    .member-name { font-size: 0.875rem; font-weight: 500; }
    .member-email { font-size: 0.8125rem; color: var(--gray-500); }

    .empty {
      text-align: center;
      color: var(--gray-400);
      padding: 2rem 1rem;
      font-size: 0.875rem;
    }

    .section { margin-bottom: 1.5rem; }

    .inline-form { display: flex; gap: 0.5rem; }
    .inline-form input { flex: 1; }

    .invite-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
    }

    .invite-row + .invite-row { border-top: 2px solid var(--gray-100); }

    .invite-actions { display: flex; gap: 0.375rem; }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: var(--radius);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .alert-success {
      background: var(--green-50);
      color: var(--green-700);
      border: 2px solid var(--green-100);
    }

    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 2px solid #fca5a5;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: var(--gray-500);
      text-decoration: none;
      font-size: 0.875rem;
      cursor: pointer;
    }

    @media (hover: hover) { .back-link:hover { color: var(--gray-700); } }

    .balance-row + .balance-row { border-top: 2px solid var(--gray-100); }

    .expense-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--green-50);
      color: var(--green-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .expense-name {
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .expense-amount {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900);
      white-space: nowrap;
      margin-left: 0.5rem;
    }

    .expense-delete {
      background: none;
      border: none;
      color: var(--gray-400);
      cursor: pointer;
      padding: 0.25rem;
      font-size: 0.875rem;
      border-radius: 4px;
      flex-shrink: 0;
    }

    @media (hover: hover) {
      .expense-delete:hover {
        color: #dc2626;
        background: #fef2f2;
      }
    }

    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--green-500);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin: 2rem auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

  </style>
</head>
<body>
  <nav>
    <span class="brand" data-link="/">Split</span>
    <span class="user-info" data-link="/profile">
      ${data.user.avatar_url
        ? `<img src="${esc(data.user.avatar_url)}" alt="">`
        : `<div style="width:32px;height:32px;border-radius:50%;background:var(--gray-200)"></div>`}
    </span>
  </nav>
  <div class="container" id="app"></div>

  <script>
  document.addEventListener('touchstart',function(){},false);
  (function(){
    // --- Data store ---
    var D = ${JSON.stringify(data)};

    function esc(s){
      if(!s)return '';
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function fmtAmt(v){
      var n = parseFloat(v);
      return n % 1 === 0 ? '$'+n.toFixed(0) : '$'+n.toFixed(2);
    }

    // --- Category detection ---
    var CATS = {
      food:          {icon:'fa-utensils',       kw:['food','grocery','groceries','restaurant','pizza','burger','sushi','lunch','dinner','breakfast','cafe','coffee','starbucks','mcdonald','kfc','subway','taco','noodle','rice','bread','meal','eat','snack','bakery','deli','brunch']},
      transport:     {icon:'fa-car',            kw:['uber','lyft','taxi','cab','bus','train','metro','gas','fuel','parking','toll','flight','airline','airbnb','hotel','travel','trip']},
      entertainment: {icon:'fa-film',           kw:['movie','cinema','netflix','spotify','concert','show','theater','game','ticket','museum','bar','club','party','beer','wine','drink','alcohol']},
      shopping:      {icon:'fa-bag-shopping',   kw:['amazon','walmart','target','clothes','shirt','shoes','electronics','phone','laptop','furniture','ikea','home','decor']},
      utilities:     {icon:'fa-bolt',           kw:['electric','electricity','water','internet','wifi','phone','mobile','bill','utility','utilities','rent','mortgage','insurance']},
      health:        {icon:'fa-heart-pulse',    kw:['doctor','hospital','pharmacy','medicine','gym','fitness','health','dental','medical','prescription','vitamin']},
      education:     {icon:'fa-graduation-cap', kw:['book','books','course','school','tuition','class','study','education','library','textbook']},
      general:       {icon:'fa-receipt',        kw:[]}
    };
    function detectCat(name){
      var l=name.toLowerCase();
      for(var c in CATS){if(c==='general')continue;var kw=CATS[c].kw;for(var i=0;i<kw.length;i++){if(l.indexOf(kw[i])!==-1)return c;}}
      return 'general';
    }
    function catIcon(c){return '<i class="fa-solid '+(CATS[c]||CATS.general).icon+'"></i>';}

    // --- Balance calculation ---
    function calcSettlements(members, expenses){
      if(!expenses||!expenses.length||!members.length) return [];
      var n = members.length;
      var bal = {}; // userId -> net balance (positive = owed money, negative = owes)
      members.forEach(function(m){bal[m.id]=0;});
      expenses.forEach(function(ex){
        var share = ex.amount / n;
        members.forEach(function(m){
          if(m.id === ex.paid_by) bal[m.id] += ex.amount - share;
          else bal[m.id] -= share;
        });
      });
      // Build name map
      var names = {};
      members.forEach(function(m){names[m.id]=m.name;});
      // Greedy settle: debtors pay creditors
      var debtors=[], creditors=[];
      for(var id in bal){
        var v=Math.round(bal[id]*100)/100;
        if(v<-0.01) debtors.push({id:id,amt:-v});
        else if(v>0.01) creditors.push({id:id,amt:v});
      }
      debtors.sort(function(a,b){return b.amt-a.amt;});
      creditors.sort(function(a,b){return b.amt-a.amt;});
      var settlements=[];
      var di=0,ci=0;
      while(di<debtors.length && ci<creditors.length){
        var pay=Math.min(debtors[di].amt,creditors[ci].amt);
        if(pay>0.01){
          settlements.push({from:debtors[di].id,to:creditors[ci].id,amt:pay,
            fromName:names[debtors[di].id],toName:names[creditors[ci].id]});
        }
        debtors[di].amt-=pay;
        creditors[ci].amt-=pay;
        if(debtors[di].amt<0.01) di++;
        if(creditors[ci].amt<0.01) ci++;
      }
      return settlements;
    }

    // --- Views ---
    function dashboardView(alert){
      var h = '';
      if(alert) h += '<div class="alert alert-success">'+esc(alert)+'</div>';

      if(D.pendingInvites.length){
        h += '<div class="section"><h2>Pending invites</h2><div class="card">';
        D.pendingInvites.forEach(function(inv){
          h += '<div class="invite-row"><div>'
            + '<div style="font-size:0.875rem;font-weight:500">'+esc(inv.group_name)+'</div>'
            + '<div style="font-size:0.8125rem;color:var(--gray-500)">from '+esc(inv.invited_by_name)+'</div>'
            + '</div><div class="invite-actions">'
            + '<button class="btn btn-sm" data-action="accept-invite" data-id="'+inv.id+'">Accept</button>'
            + '<button class="btn btn-sm btn-danger" data-action="decline-invite" data-id="'+inv.id+'">Decline</button>'
            + '</div></div>';
        });
        h += '</div></div>';
      }

      h += '<div class="section"><h2>Your groups</h2>';
      if(D.groups.length){
        D.groups.forEach(function(g){
          h += '<div class="card card-link" data-link="/groups/'+g.id+'">'
            + '<div style="display:flex;justify-content:space-between;align-items:center"><div>'
            + '<div style="font-weight:500">'+esc(g.name)+'</div>'
            + '<div style="font-size:0.8125rem;color:var(--gray-500)">'+g.member_count+' member'+(g.member_count!==1?'s':'')+'</div>'
            + '</div><span class="badge'+(g.role==='owner'?'':' badge-gray')+'">'+esc(g.role)+'</span></div></div>';
        });
      } else {
        h += '<div class="empty">No groups yet. Create one to get started!</div>';
      }
      h += '<button class="btn" style="margin-top:0.5rem" data-link="/groups/new">New group</button></div>';
      return h;
    }

    function groupCreateView(){
      return '<span class="back-link" data-link="/">&larr; Back to dashboard</span>'
        + '<h1>Create a group</h1>'
        + '<form id="create-group-form">'
        + '<div class="form-group"><label for="name">Group name</label>'
        + '<input type="text" id="name" name="name" required placeholder="e.g. Apartment, Trip to Paris" data-1p-ignore autocomplete="do-not-autofill"></div>'
        + '<div class="form-group"><label for="emails">Invite members (optional)</label>'
        + '<textarea id="emails" name="emails" placeholder="Enter email addresses, one per line" data-1p-ignore autocomplete="do-not-autofill"></textarea>'
        + '<div class="form-hint">Enter the Google account emails of people you want to invite.</div></div>'
        + '<button type="submit" class="btn">Create group</button></form>';
    }

    function groupDetailView(detail, alert){
      var g = detail.group, members = detail.members, isOwner = detail.isOwner;
      var h = '<span class="back-link" data-link="/">&larr; Back to dashboard</span>';

      if(alert) h += '<div class="alert '+(alert.type==='error'?'alert-error':'alert-success')+'">'+esc(alert.text)+'</div>';

      h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1rem">'
        + '<h1 style="margin-bottom:0">'+esc(g.name)+'</h1>'
        + '<span class="back-link" style="margin-bottom:0" data-link="/groups/'+g.id+'/members">'+members.length+' member'+(members.length!==1?'s':'')+'&nbsp;&rarr;</span></div>';

      // --- Balances ---
      var settlements = calcSettlements(members, detail.expenses);
      if(settlements.length){
        h += '<div class="card" style="margin-bottom:1.25rem">';
        settlements.forEach(function(s){
          var isYou = s.from==D.user.id;
          h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.375rem 0">'
            + '<span style="font-size:0.875rem">'
            + '<span style="font-weight:500">'+(isYou?'You':esc(s.fromName))+'</span>'
            + ' owes '
            + '<span style="font-weight:500">'+(s.to==D.user.id?'you':esc(s.toName))+'</span>'
            + '</span>'
            + '<span style="font-size:0.875rem;font-weight:600;color:'+(isYou?'#dc2626':'var(--green-600)')+'">$'+s.amt.toFixed(2)+'</span>'
            + '</div>';
        });
        h += '</div>';
      } else if(detail.expenses && detail.expenses.length){
        h += '<div class="card" style="margin-bottom:1.25rem;text-align:center;font-size:0.875rem;color:var(--green-600);font-weight:500;padding:0.75rem"><i class="fa-solid fa-check" style="margin-right:0.375rem"></i>All settled up</div>';
      }

      var expenses = detail.expenses || [];
      if(expenses.length){
        expenses.forEach(function(ex){
          h += '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.625rem 0;border-bottom:2px solid var(--gray-100)">'
            + '<div class="expense-icon">'+catIcon(ex.category)+'</div>'
            + '<div style="flex:1;min-width:0">'
            + '<span class="expense-name">'+esc(ex.name)+'</span>'
            + '<div style="font-size:0.8125rem;color:var(--gray-500)">'+esc(ex.paid_by_name)+'</div></div>'
            + '<span class="expense-amount">'+fmtAmt(ex.amount)+'</span>';
          if(ex.paid_by === D.user.id || isOwner){
            h += '<button class="expense-delete" data-action="delete-expense" data-id="'+ex.id+'" data-group-id="'+g.id+'" title="Delete">'
              + '<i class="fa-solid fa-xmark"></i></button>';
          }
          h += '</div>';
        });
      } else {
        h += '<div class="empty">No items yet</div>';
      }

      // Bottom padding so list isn't hidden behind sticky button
      h += '<div style="height:5rem"></div>';

      // Sticky add item button
      h += '<div class="sticky-bottom"><button class="btn" data-link="/groups/'+g.id+'/add-expense">Add item</button></div>';

      return h;
    }

    function addExpenseView(gid){
      var gInfo = groupCache[gid] ? groupCache[gid].group : D.groups.find(function(g){return g.id==gid});
      var gName = gInfo ? gInfo.name : 'Group';
      return '<span class="back-link" data-link="/groups/'+gid+'">&larr; Back to '+esc(gName)+'</span>'
        + '<h1>Add item</h1>'
        + '<form id="add-expense-form" data-group-id="'+gid+'">'
        + '<div class="form-group"><label for="exp-desc">What was it for?</label>'
        + '<input type="text" id="exp-desc" name="exp-desc" required placeholder="e.g. Pizza, Uber, Groceries" data-1p-ignore autocomplete="do-not-autofill"></div>'
        + '<div class="form-group"><label for="exp-cost">Amount</label>'
        + '<input type="number" id="exp-cost" name="exp-cost" required placeholder="0.00" step="0.01" min="0.01" data-1p-ignore autocomplete="do-not-autofill"></div>'
        + '<button type="submit" class="btn">Add item</button></form>';
    }

    function groupMembersView(detail, alert){
      var g = detail.group, members = detail.members, invites = detail.invites, isOwner = detail.isOwner;
      var h = '<span class="back-link" data-link="/groups/'+g.id+'">&larr; Back to '+esc(g.name)+'</span>';

      if(alert) h += '<div class="alert '+(alert.type==='error'?'alert-error':'alert-success')+'">'+esc(alert.text)+'</div>';

      h += '<h1>Members</h1>';
      h += '<div class="card">';
      members.forEach(function(m){
        h += '<div class="member-row">'
          + (m.avatar_url ? '<img src="'+esc(m.avatar_url)+'" class="member-avatar" alt="">' : '<div class="member-avatar"></div>')
          + '<div class="member-info"><div class="member-name">'+esc(m.name)+'</div>'
          + '<div class="member-email">'+esc(m.email)+'</div></div>'
          + '<span class="badge'+(m.role==='owner'?'':' badge-gray')+'">'+esc(m.role)+'</span></div>';
      });
      h += '</div>';

      if(invites.length || isOwner){
        h += '<div class="section" style="margin-top:1.5rem"><h2>Pending invites</h2><div class="card">';
        if(invites.length){
          invites.forEach(function(i){
            h += '<div class="invite-row"><span style="font-size:0.875rem">'+esc(i.email)+'</span>'
              + '<span class="badge badge-gray">pending</span></div>';
          });
        } else {
          h += '<div style="font-size:0.875rem;color:var(--gray-400);padding:0.5rem 0">No pending invites</div>';
        }
        h += '</div></div>';
      }

      if(isOwner){
        h += '<div class="section" style="margin-top:1.5rem"><h2>Invite member</h2>'
          + '<form id="invite-form" data-group-id="'+g.id+'" class="inline-form">'
          + '<input type="email" name="email" required placeholder="Email address" data-1p-ignore autocomplete="do-not-autofill">'
          + '<button type="submit" class="btn btn-sm">Invite</button></form></div>';
      }

      return h;
    }

    function profileView(){
      var u = D.user;
      return '<span class="back-link" data-link="/">&larr; Back to dashboard</span>'
        + '<h1>Profile</h1>'
        + '<div class="card" style="display:flex;align-items:center;gap:1rem">'
        + (u.avatar_url ? '<img src="'+esc(u.avatar_url)+'" style="width:56px;height:56px;border-radius:50%" alt="">'
          : '<div style="width:56px;height:56px;border-radius:50%;background:var(--gray-200)"></div>')
        + '<div><div style="font-size:1.125rem;font-weight:600">'+esc(u.name)+'</div>'
        + '<div style="font-size:0.875rem;color:var(--gray-500)">'+esc(u.email)+'</div></div></div>'
        + '<div style="margin-top:1.5rem"><a href="/logout" class="btn btn-danger">Log out</a></div>';
    }

    // --- Router ---
    var app = document.getElementById('app');
    var groupCache = {};
    var lastNav = 0;
    var routeVer = 0;

    async function route(path, opts){
      var myVer = ++routeVer;
      opts = opts || {};
      var m;

      if(path === '/' || path === ''){
        document.title = 'Dashboard - Split Tracker';
        app.innerHTML = dashboardView(opts.alert);
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
        document.title = 'Create Group - Split Tracker';
        app.innerHTML = groupCreateView();
        var nameInput = document.getElementById('name');
        if(nameInput) nameInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/add-expense$/))){
        var gid = m[1];
        document.title = 'Add Item - Split Tracker';
        app.innerHTML = addExpenseView(gid);
        var expInput = document.getElementById('exp-desc');
        if(expInput) expInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/members$/))){
        var gid = m[1];
        if(groupCache[gid]){
          document.title = 'Members - ' + groupCache[gid].group.name;
          app.innerHTML = groupMembersView(groupCache[gid], opts.alert);
        } else {
          var gInfo = D.groups.find(function(g){return g.id==gid});
          document.title = 'Members - ' + (gInfo?gInfo.name:'Group');
          app.innerHTML = '<span class="back-link" data-link="/groups/'+gid+'">&larr; Back</span><div class="spinner"></div>';
        }
        try{
          var r = await fetch('/api/groups/'+gid);
          if(myVer !== routeVer) return;
          if(!r.ok) { nav('/'); return; }
          var detail = await r.json();
          if(myVer !== routeVer) return;
          groupCache[gid] = detail;
          document.title = 'Members - ' + detail.group.name;
          app.innerHTML = groupMembersView(detail, opts.alert);
        }catch(e){ if(myVer === routeVer && !groupCache[gid]) nav('/groups/'+gid); }
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)$/))){
        var gid = m[1];
        // Show cached or placeholder instantly
        if(groupCache[gid]){
          document.title = groupCache[gid].group.name + ' - Split Tracker';
          app.innerHTML = groupDetailView(groupCache[gid], opts.alert);
        } else {
          var gInfo = D.groups.find(function(g){return g.id==gid});
          document.title = (gInfo?gInfo.name:'Group') + ' - Split Tracker';
          app.innerHTML = '<span class="back-link" data-link="/">&larr; Back to dashboard</span><h1>'+(gInfo?esc(gInfo.name):'')+'</h1><div class="spinner"></div>';
        }
        try{
          var r = await fetch('/api/groups/'+gid);
          if(myVer !== routeVer) return;
          if(!r.ok) { nav('/'); return; }
          var detail = await r.json();
          if(myVer !== routeVer) return;
          groupCache[gid] = detail;
          document.title = detail.group.name + ' - Split Tracker';
          app.innerHTML = groupDetailView(detail, opts.alert);
        }catch(e){ if(myVer === routeVer && !groupCache[gid]) nav('/'); }
      }
      else if(path === '/profile'){
        document.title = 'Profile - Split Tracker';
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
      history.pushState({},'',path);
      route(path, opts);
      window.scrollTo(0,0);
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

    // --- Event delegation ---
    document.addEventListener('click', function(e){
      // data-link navigation
      var el = e.target.closest('[data-link]');
      if(el){
        e.preventDefault();
        nav(el.getAttribute('data-link'));
        return;
      }

      // Accept invite
      var acceptBtn = e.target.closest('[data-action="accept-invite"]');
      if(acceptBtn){
        e.preventDefault();
        var id = acceptBtn.getAttribute('data-id');
        acceptBtn.disabled = true;
        fetch('/api/invites/'+id+'/accept',{method:'POST'})
          .then(function(r){ return r.json() })
          .then(function(d){
            if(d.ok){
              D.pendingInvites = D.pendingInvites.filter(function(i){return i.id!=id});
              return refreshData().then(function(){
                if(d.groupId) nav('/groups/'+d.groupId, {alert:{text:'Invite accepted!',type:'success'}});
                else nav('/', {alert:'Invite accepted!'});
              });
            }
          }).catch(function(){acceptBtn.disabled=false});
        return;
      }

      // Delete expense
      var delExpBtn = e.target.closest('[data-action="delete-expense"]');
      if(delExpBtn){
        e.preventDefault();
        if(!confirm('Delete this item?'))return;
        var expId = delExpBtn.getAttribute('data-id');
        var expGid = delExpBtn.getAttribute('data-group-id');
        delExpBtn.disabled = true;
        fetch('/api/groups/'+expGid+'/expenses/'+expId,{method:'DELETE'})
          .then(function(r){return r.json()})
          .then(function(d){
            if(d.ok){
              delete groupCache[expGid];
              route('/groups/'+expGid);
            }
          }).catch(function(){delExpBtn.disabled=false});
        return;
      }

      // Decline invite
      var declineBtn = e.target.closest('[data-action="decline-invite"]');
      if(declineBtn){
        e.preventDefault();
        var id2 = declineBtn.getAttribute('data-id');
        declineBtn.disabled = true;
        fetch('/api/invites/'+id2+'/decline',{method:'POST'})
          .then(function(r){ return r.json() })
          .then(function(d){
            if(d.ok){
              D.pendingInvites = D.pendingInvites.filter(function(i){return i.id!=id2});
              nav('/',{alert:'Invite declined.'});
            }
          }).catch(function(){declineBtn.disabled=false});
        return;
      }
    });

    // Form submissions
    document.addEventListener('submit', function(e){
      var form = e.target;

      if(form.id === 'add-expense-form'){
        e.preventDefault();
        var gid3 = form.getAttribute('data-group-id');
        var expName = form['exp-desc'].value.trim();
        var expAmount = form['exp-cost'].value;
        if(!expName||!expAmount) return;
        var cat = detectCat(expName);
        var btn3 = form.querySelector('button[type="submit"]');
        var btnText = btn3.innerHTML;
        btn3.disabled = true;
        btn3.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;border-color:rgba(255,255,255,0.3);border-top-color:white"></div>';
        form['exp-desc'].disabled = true;
        form['exp-cost'].disabled = true;
        fetch('/api/groups/'+gid3+'/expenses',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:expName,amount:expAmount,category:cat})
        }).then(function(r){return r.json()})
          .then(function(d){
            if(d.ok){
              delete groupCache[gid3];
              nav('/groups/'+gid3, {alert:{text:'Item added!',type:'success'}});
            } else {
              btn3.disabled=false;btn3.innerHTML=btnText;form['exp-desc'].disabled=false;form['exp-cost'].disabled=false;
            }
          }).catch(function(){btn3.disabled=false;btn3.innerHTML=btnText;form['exp-desc'].disabled=false;form['exp-cost'].disabled=false;});
        return;
      }

      if(form.id === 'create-group-form'){
        e.preventDefault();
        var name = form.name.value.trim();
        if(!name) return;
        var emails = form.emails.value.trim();
        var btn = form.querySelector('button[type="submit"]');
        var btnText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;border-color:rgba(255,255,255,0.3);border-top-color:white"></div>';
        form.name.disabled = true;
        form.emails.disabled = true;
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
            btn.disabled=false;btn.innerHTML=btnText;form.name.disabled=false;form.emails.disabled=false;
          }).catch(function(){btn.disabled=false;btn.innerHTML=btnText;form.name.disabled=false;form.emails.disabled=false;});
        return;
      }

      if(form.id === 'invite-form'){
        e.preventDefault();
        var gid2 = form.getAttribute('data-group-id');
        var email = form.email.value.trim().toLowerCase();
        if(!email) return;
        var btn2 = form.querySelector('button[type="submit"]');
        btn2.disabled = true;
        fetch('/api/groups/'+gid2+'/invite',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:email})
        }).then(function(r){return r.json()})
          .then(function(d){
            btn2.disabled = false;
            if(d.ok){
              delete groupCache[gid2];
              route('/groups/'+gid2+'/members', {alert:{text:'Invite sent!',type:'success'}});
            } else if(d.error === 'Already a member'){
              route('/groups/'+gid2+'/members', {alert:{text:'That person is already a member.',type:'error'}});
            } else if(d.error === 'Already invited'){
              route('/groups/'+gid2+'/members', {alert:{text:'That email has already been invited.',type:'error'}});
            }
          }).catch(function(){btn2.disabled=false});
        return;
      }
    });

    // Back/forward
    window.addEventListener('popstate', function(){
      route(location.pathname);
    });

    // Initial render
    route(location.pathname);

  })();

  // Register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js');
  }
  </script>
</body>
</html>`;
}
