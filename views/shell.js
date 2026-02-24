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
  <title>Split</title>
  <meta name="description" content="Split costs with friends">
  <meta property="og:title" content="Split">
  <meta property="og:description" content="Split costs with friends">
  <meta property="og:image" content="https://split.noshado.ws/og-image.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://split.noshado.ws">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Split">
  <meta name="twitter:description" content="Split costs with friends">
  <meta name="twitter:image" content="https://split.noshado.ws/og-image.png">
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
      --mono: 'SF Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
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
      padding: 0.75rem 1rem;
      margin: -0.75rem -1rem;
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
      padding: 1rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
    }

    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }
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
      background: #fef2f2;
      color: #dc2626;
      border: none;
    }

    @media (hover: hover) { .btn-danger:hover { background: #fee2e2; } }

    .card {
      background: white;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius);
      padding: 0.75rem 1rem;
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

    .expense-row { transition: background 150ms; border-radius: var(--radius); margin: 0 -0.5rem; padding-left: 0.5rem; padding-right: 0.5rem; }
    .expense-row:active { background: var(--gray-50); }

    .expense-sep { height: 2px; border-radius: 999px; background: var(--gray-100); transition: opacity 150ms; }
    .expense-row:active + .expense-sep { opacity: 0; }
    .expense-sep:has(+ .expense-row:active) { opacity: 0; }

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
      background: white;
      color: var(--gray-900);
      -webkit-appearance: none;
    }

    input:focus, textarea:focus {
      outline: none;
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
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--gray-200);
      object-fit: cover;
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

    .avatar-stack { display: flex; gap: 0.625rem; }
    .avatar-stack img, .avatar-stack .avatar-placeholder {
      width: 28px; height: 28px; border-radius: 50%; object-fit: cover;
    }
    .avatar-placeholder { background: var(--gray-200); flex-shrink: 0; }

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
      font-size: 1rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .expense-amount {
      font-family: var(--mono);
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900);
      white-space: nowrap;
      margin-left: 0.5rem;
    }

    .item-detail-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--green-50);
      color: var(--green-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      margin: 1.5rem auto 1rem;
    }

    .item-detail-amount {
      font-family: var(--mono);
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      color: var(--gray-900);
      margin-bottom: 0.25rem;
    }

    .item-detail-name {
      text-align: center;
      color: var(--gray-500);
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 2px solid var(--gray-100);
      font-size: 0.9375rem;
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: var(--gray-500); }
    .info-value { font-weight: 500; color: var(--gray-900); }

    .spinner {
      width: 48px; height: 48px;
      border: 4px solid var(--gray-200);
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

  // Prevent iOS viewport shift when keyboard opens
  document.addEventListener('focusin', function(e){
    if(e.target.matches('input,textarea')){
      setTimeout(function(){ window.scrollTo(0,0); }, 50);
    }
  });

  (function(){
    // --- Data store ---
    var D = ${JSON.stringify(data)};

    function esc(s){
      if(!s)return '';
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function avatarStack(avatars){
      if(!avatars||!avatars.length) return '';
      var h = '<div class="avatar-stack">';
      avatars.forEach(function(url){
        h += url ? '<img src="'+esc(url)+'" alt="">' : '<div class="avatar-placeholder"></div>';
      });
      h += '</div>';
      return h;
    }

    function fmtAmt(v){
      var n = parseFloat(v);
      return n % 1 === 0 ? '$'+n.toFixed(0) : '$'+n.toFixed(2);
    }

    function timeAgo(dateStr){
      if(!dateStr) return '';
      var d = new Date(dateStr+'Z');
      var now = new Date();
      var s = Math.floor((now - d) / 1000);
      if(s < 60) return 'Just now';
      var m = Math.floor(s / 60);
      if(m < 60) return m + 'm ago';
      var h = Math.floor(m / 60);
      if(h < 24) return h + 'h ago';
      var days = Math.floor(h / 24);
      if(days < 7) return days + 'd ago';
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return months[d.getMonth()] + ' ' + d.getDate();
    }

    function fmtDate(dateStr){
      if(!dateStr) return '';
      var d = new Date(dateStr+'Z');
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var hr = d.getHours();
      var min = d.getMinutes();
      var ampm = hr >= 12 ? 'PM' : 'AM';
      hr = hr % 12 || 12;
      var minStr = min < 10 ? '0'+min : ''+min;
      return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + hr + ':' + minStr + ' ' + ampm;
    }

    function catLabel(cat){
      var labels = {food:'Food',transport:'Transport',entertainment:'Entertainment',shopping:'Shopping',utilities:'Utilities',health:'Health',education:'Education',general:'General'};
      return labels[cat] || 'General';
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

      h += '<div class="section">';
      if(D.groups.length){
        D.groups.forEach(function(g){
          h += '<div class="card card-link" style="margin-bottom:1rem" data-link="/groups/'+g.id+'">'
            + '<div style="font-weight:600;font-size:1.125rem">'+esc(g.name)+'</div>'
            + (g.member_avatars && g.member_avatars.length ? '<div style="margin-top:0.75rem;margin-bottom:0.25rem">'+avatarStack(g.member_avatars)+'</div>' : '')
            + '</div>';
        });
      } else {
        h += '<div class="empty">No groups yet. Create one to get started!</div>';
      }
      h += '<button class="btn" style="margin-top:0.5rem" data-link="/groups/new">New group</button></div>';
      return h;
    }

    function groupCreateView(){
      return '<h1>Create a group</h1>'
        + '<form id="create-group-form">'
        + '<div class="form-group"><label>Title</label>'
        + '<input type="search" id="grp-title" autocomplete="off" role="presentation" placeholder="e.g. Apartment, Trip to Paris"></div>'
        + '<div class="form-group"><label>Invite (optional)</label>'
        + '<textarea id="grp-inv" autocomplete="off" placeholder="One per line"></textarea>'
        + '<div class="form-hint">Enter the Google account addresses of people you want to invite.</div></div>'
        + '<button type="submit" class="btn">Create group</button></form>';
    }

    function groupDetailView(detail, alert){
      var g = detail.group, members = detail.members, isOwner = detail.isOwner;
      var h = '';

      if(alert) h += '<div class="alert '+(alert.type==='error'?'alert-error':'alert-success')+'">'+esc(alert.text)+'</div>';

      h += '<h1 style="margin-bottom:0.5rem">'+esc(g.name)+'</h1>';

      // Avatar row with settled pill
      var settlements = calcSettlements(members, detail.expenses);
      h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">';
      h += '<div data-link="/groups/'+g.id+'/members" style="cursor:pointer;display:flex;align-items:center">'
        + avatarStack(members.map(function(m){return m.avatar_url}))
        + '<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.125rem;line-height:1;color:var(--gray-500);background:var(--gray-100);flex-shrink:0;padding-bottom:1px;margin-left:0.5rem">+</div>'
        + '</div>';
      if(!settlements.length && detail.expenses && detail.expenses.length){
        h += '<span style="display:inline-flex;align-items:center;font-size:0.8125rem;color:var(--green-700);font-weight:500;padding:0.375rem 0.75rem;background:var(--green-100);border-radius:999px"><i class="fa-solid fa-check" style="margin-right:0.25rem"></i>Settled</span>';
      }
      h += '</div>';

      // --- Balances ---
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
            + '<span style="font-family:var(--mono);font-size:0.875rem;font-weight:600;color:'+(isYou?'#dc2626':'var(--green-600)')+'">$'+s.amt.toFixed(2)+'</span>'
            + '</div>';
        });
        h += '</div>';
      }

      var expenses = detail.expenses || [];
      if(expenses.length){
        expenses.forEach(function(ex, idx){
          h += '<div class="expense-row" data-link="/groups/'+g.id+'/items/'+ex.id+'" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0.5rem;cursor:pointer">'
            + '<div class="expense-icon">'+catIcon(ex.category)+'</div>'
            + '<span class="expense-name" style="flex:1;min-width:0">'+esc(ex.name)+'</span>'
            + '<span class="expense-amount">'+fmtAmt(ex.amount)+'</span>'
            + '</div>';
          if(idx < expenses.length - 1) h += '<div class="expense-sep"></div>';
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
      return '<h1>Add item</h1>'
        + '<form id="add-expense-form" data-group-id="'+gid+'">'
        + '<div class="form-group"><label>What was it for?</label>'
        + '<input type="text" id="exp-desc" placeholder="e.g. Pizza, Uber, Groceries"></div>'
        + '<div class="form-group"><label>Amount</label>'
        + '<input type="number" id="exp-cost" inputmode="decimal" step="0.01" placeholder="0.00"></div>'
        + '<button type="submit" class="btn">Add item</button></form>';
    }

    function itemDetailView(gid, ex, isOwner){
      var gInfo = groupCache[gid] ? groupCache[gid].group : D.groups.find(function(g){return g.id==gid});
      var gName = gInfo ? gInfo.name : 'Group';
      var canDelete = ex.paid_by === D.user.id || isOwner;
      var h = '<div class="item-detail-icon">'+catIcon(ex.category)+'</div>';
      h += '<div class="item-detail-amount">'+fmtAmt(ex.amount)+'</div>';
      h += '<div class="item-detail-name">'+esc(ex.name)+'</div>';
      h += '<div style="margin-bottom:1.5rem">';
      h += '<div class="info-row"><span class="info-label">Paid by</span><span class="info-value">'+esc(ex.paid_by === D.user.id ? 'You' : ex.paid_by_name)+'</span></div>';
      h += '<div class="info-row"><span class="info-label">Added</span><span class="info-value">'+fmtDate(ex.created_at)+'</span></div>';
      h += '<div class="info-row"><span class="info-label">Category</span><span class="info-value">'+catLabel(ex.category)+'</span></div>';
      h += '</div>';
      if(canDelete){
        h += '<button class="btn btn-danger" data-action="delete-item" data-id="'+ex.id+'" data-group-id="'+gid+'" style="width:100%">Delete item</button>';
      }
      return h;
    }

    function groupMembersView(detail, alert){
      var g = detail.group, members = detail.members, invites = detail.invites, isOwner = detail.isOwner;
      var h = '';

      if(alert) h += '<div class="alert '+(alert.type==='error'?'alert-error':'alert-success')+'">'+esc(alert.text)+'</div>';

      h += '<h1>Members</h1>';
      members.forEach(function(m){
        h += '<div class="member-row">'
          + (m.avatar_url ? '<img src="'+esc(m.avatar_url)+'" class="member-avatar" alt="">' : '<div class="member-avatar"></div>')
          + '<div class="member-info"><div class="member-name">'+esc(m.name)+'</div>'
          + '<div class="member-email">'+esc(m.email)+'</div></div>'
          + '<span class="badge'+(m.role==='owner'?'':' badge-gray')+'">'+esc(m.role)+'</span></div>';
      });

      if(invites.length){
        h += '<div style="margin-top:1.5rem"><h2>Pending invites</h2>';
        invites.forEach(function(i){
          h += '<div class="invite-row"><span style="font-size:0.875rem">'+esc(i.email)+'</span>'
            + '<span class="badge badge-gray">pending</span></div>';
        });
        h += '</div>';
      }

      if(isOwner){
        h += '<div style="height:5rem"></div>';
        h += '<div class="sticky-bottom"><button class="btn" data-link="/groups/'+g.id+'/add-member">Invite member</button></div>';
      }

      return h;
    }

    function addMemberView(gid){
      return '<h1>Invite member</h1>'
        + '<form id="invite-form" data-group-id="'+gid+'">'
        + '<div class="form-group"><label>Email address</label>'
        + '<input type="email" id="invite-email" placeholder="person@example.com"></div>'
        + '<button type="submit" class="btn">Send invite</button></form>';
    }

    function profileView(){
      var u = D.user;
      return '<div style="text-align:center;padding-top:1.5rem">'
        + (u.avatar_url ? '<img src="'+esc(u.avatar_url)+'" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:1rem" alt="">'
          : '<div style="width:72px;height:72px;border-radius:50%;background:var(--gray-200);margin:0 auto 1rem"></div>')
        + '<div style="font-size:1.25rem;font-weight:600">'+esc(u.name)+'</div>'
        + '<div style="font-size:0.9375rem;color:var(--gray-500);margin-bottom:2rem">'+esc(u.email)+'</div>'
        + '<a href="/logout" class="btn btn-danger">Log out</a></div>';
    }

    // --- Router ---
    var app = document.getElementById('app');
    var groupCache = {};
    var lastNav = 0;
    var routeVer = 0;

    var brandEl = document.querySelector('nav .brand');
    var avatarEl = document.querySelector('nav .user-info');
    function updateNav(path){
      if(path === '/' || path === ''){
        brandEl.innerHTML = 'Split';
        brandEl.setAttribute('data-link','/');
        brandEl.style.fontSize = '1.35rem';
        brandEl.style.color = '';
        avatarEl.style.display = '';
      } else {
        avatarEl.style.display = 'none';
        brandEl.innerHTML = '&larr;';
        brandEl.style.fontSize = '1.5rem';
        brandEl.style.color = 'var(--gray-500)';
        // Set back target based on route depth
        if(path.match(/^\\/groups\\/\\d+\\/add-member/)){
          var gid = path.match(/^\\/groups\\/(\\d+)/)[1];
          brandEl.setAttribute('data-link','/groups/'+gid+'/members');
        } else if(path.match(/^\\/groups\\/\\d+\\/(items|add-expense|members)/)){
          var gid = path.match(/^\\/groups\\/(\\d+)/)[1];
          brandEl.setAttribute('data-link','/groups/'+gid);
        } else {
          brandEl.setAttribute('data-link','/');
        }
      }
    }

    async function route(path, opts){
      var myVer = ++routeVer;
      opts = opts || {};
      updateNav(path);
      var m;

      if(path === '/' || path === ''){
        document.title = 'Dashboard - Split';
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
        document.title = 'Create Group - Split';
        app.innerHTML = groupCreateView();
        var nameInput = document.getElementById('grp-title');
        if(nameInput) nameInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/add-expense$/))){
        var gid = m[1];
        document.title = 'Add Item - Split';
        app.innerHTML = addExpenseView(gid);
        var expInput = document.getElementById('exp-desc');
        if(expInput) expInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/items\\/(\\d+)$/))){
        var gid = m[1], eid = parseInt(m[2]);
        if(groupCache[gid]){
          var ex = (groupCache[gid].expenses||[]).find(function(e){return e.id===eid});
          if(ex){
            document.title = esc(ex.name) + ' - Split';
            app.innerHTML = itemDetailView(gid, ex, groupCache[gid].isOwner);
          } else { nav('/groups/'+gid); }
        } else {
          app.innerHTML = '<div style="display:flex;justify-content:center;padding:3rem 0"><div class="spinner"></div></div>';
          var r = await fetch('/api/groups/'+gid);
          if(myVer !== routeVer) return;
          var d = await r.json();
          groupCache[gid] = d;
          var ex = (d.expenses||[]).find(function(e){return e.id===eid});
          if(ex){
            document.title = esc(ex.name) + ' - Split';
            app.innerHTML = itemDetailView(gid, ex, d.isOwner);
          } else { nav('/groups/'+gid); }
        }
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/add-member$/))){
        var gid = m[1];
        document.title = 'Invite Member - Split';
        app.innerHTML = addMemberView(gid);
        var emailInput = document.getElementById('invite-email');
        if(emailInput) emailInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/members$/))){
        var gid = m[1];
        if(groupCache[gid]){
          document.title = 'Members - ' + groupCache[gid].group.name;
          app.innerHTML = groupMembersView(groupCache[gid], opts.alert);
        } else {
          var gInfo = D.groups.find(function(g){return g.id==gid});
          document.title = 'Members - ' + (gInfo?gInfo.name:'Group');
          app.innerHTML = '<div class="spinner"></div>';
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
          document.title = groupCache[gid].group.name + ' - Split';
          app.innerHTML = groupDetailView(groupCache[gid], opts.alert);
        } else {
          var gInfo = D.groups.find(function(g){return g.id==gid});
          document.title = (gInfo?gInfo.name:'Group') + ' - Split';
          app.innerHTML = '<h1>'+(gInfo?esc(gInfo.name):'')+'</h1><div class="spinner"></div>';
        }
        try{
          var r = await fetch('/api/groups/'+gid);
          if(myVer !== routeVer) return;
          if(!r.ok) { nav('/'); return; }
          var detail = await r.json();
          if(myVer !== routeVer) return;
          groupCache[gid] = detail;
          document.title = detail.group.name + ' - Split';
          app.innerHTML = groupDetailView(detail, opts.alert);
        }catch(e){ if(myVer === routeVer && !groupCache[gid]) nav('/'); }
      }
      else if(path === '/profile'){
        document.title = 'Profile - Split';
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

      // Delete item from detail page
      var delItemBtn = e.target.closest('[data-action="delete-item"]');
      if(delItemBtn){
        e.preventDefault();
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
              nav('/groups/'+expGid, {alert:{text:'Item deleted',type:'success'}});
            } else {
              delItemBtn.disabled=false;delItemBtn.innerHTML=btnText;
            }
          }).catch(function(){delItemBtn.disabled=false;delItemBtn.innerHTML=btnText;});
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

    // Form submissions (add expense, create group, invite member)
    document.addEventListener('submit', function(e){
      e.preventDefault();

      if(e.target.id === 'add-expense-form'){
        var gid3 = e.target.getAttribute('data-group-id');
        var descEl = document.getElementById('exp-desc');
        var costEl = document.getElementById('exp-cost');
        var expName = descEl.value.trim();
        var expAmount = costEl.value.trim();
        if(!expName||!expAmount) return;
        var cat = detectCat(expName);
        var btn = e.target.querySelector('button[type="submit"]');
        var btnText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:3px;margin:0;border-color:rgba(255,255,255,0.3);border-top-color:white"></div>';
        descEl.disabled = true;
        costEl.disabled = true;
        fetch('/api/groups/'+gid3+'/expenses',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:expName,amount:expAmount,category:cat})
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
        var titleEl = document.getElementById('grp-title');
        var invEl = document.getElementById('grp-inv');
        var name = titleEl.value.trim();
        if(!name) return;
        var emails = invEl.value.trim();
        var btn = e.target.querySelector('button[type="submit"]');
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
        var gid2 = e.target.getAttribute('data-group-id');
        var emailEl = document.getElementById('invite-email');
        var email = emailEl.value.trim().toLowerCase();
        if(!email) return;
        var btn = e.target.querySelector('button[type="submit"]');
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
              nav('/groups/'+gid2+'/members', {alert:{text:'Invite sent!',type:'success'}});
            } else if(d.error === 'Already a member'){
              nav('/groups/'+gid2+'/members', {alert:{text:'That person is already a member.',type:'error'}});
            } else if(d.error === 'Already invited'){
              nav('/groups/'+gid2+'/members', {alert:{text:'That email has already been invited.',type:'error'}});
            } else {
              btn.disabled=false;btn.innerHTML=btnText;emailEl.disabled=false;
            }
          }).catch(function(){btn.disabled=false;btn.innerHTML=btnText;emailEl.disabled=false;});
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
