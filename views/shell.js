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
      --green-50: #e5f9ec;
      --green-100: #dcfce7;
      --green-200: #c0edcf;
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    input, textarea, select { -webkit-user-select: text; user-select: text; }
    ::selection { background: var(--green-100); }
    .settlement ::selection { background: var(--gray-200); }

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
      padding: 0.75rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 600px;
      margin: 0 auto;
    }

    nav .brand {
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--green-500);
      padding: 0.75rem 1rem;
      margin: -0.75rem -1rem;
      -webkit-user-select: none;
      user-select: none;
    }
    nav .brand[data-link] { transition: color 150ms, transform 100ms; -webkit-user-select: none; user-select: none; }
    @media (hover: hover) { nav .brand[data-link]:hover { color: var(--gray-700) !important; } }
    nav .brand[data-link]:active { transform: scale(0.85); }

    nav .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: transform 100ms;
    }
    nav .user-info:active { transform: scale(0.85); }

    nav .user-info img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
    }

    @media (max-width: 600px) {
      nav { padding: 1rem 1.5rem; }
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
      border-radius: 32px;
      height: 56px;
      padding: 0 1.5rem;
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

    @media (max-width: 600px) { .btn { height: 64px; font-size: 1.25rem; } }
    @media (hover: hover) { .btn:hover { background: var(--green-600); } }
    .btn:active { transform: scale(0.93); transition: transform 150ms; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn:disabled:active { transform: none; }
    @media (hover: hover) { .btn:disabled:hover { background: var(--green-500); } }
    #demo-toggle { transition: filter 150ms, transform 150ms; }
    @media (hover: hover) { #demo-toggle:hover { filter: brightness(0.95); } }
    #demo-toggle:active { transform: scale(0.93); filter: brightness(0.9); }

    .toggle-switch { position: relative; display: inline-block; width: 51px; height: 31px; flex-shrink: 0; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; margin: 0; }
    .toggle-slider { position: absolute; inset: 0; background: var(--gray-200); border-radius: 31px; cursor: pointer; transition: background 200ms; }
    .toggle-slider::before { content: ''; position: absolute; left: 2px; top: 2px; width: 27px; height: 27px; background: white; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: transform 200ms; }
    .toggle-switch input:checked + .toggle-slider { background: var(--green-500); }
    .toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); }
    .toggle-switch input:disabled + .toggle-slider { opacity: 0.5; cursor: not-allowed; }
    .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .toggle-row label.toggle-label { margin: 0; font-weight: 500; color: var(--gray-900); }

    .bal-pill {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      font-size: 0.8125rem;
      font-weight: 500;
      padding: 0.375rem 0.75rem;
      border-radius: 999px;
      white-space: nowrap;
    }
    .bal-settled { background: var(--green-100); color: var(--green-700); }
    .bal-owed { background: var(--green-100); color: var(--green-700); }
    .bal-owe { background: #fef2f2; color: #dc2626; }

    .group-bottom-spacer { height: 5rem; }
    @media (min-width: 601px) { .group-bottom-spacer { height: 9rem; } }
    .add-expense-bottom-spacer { height: 9rem; }
    .add-expense-bottom-spacer { height: 9rem; }

    .btn-sm { padding: 1rem 1.25rem; font-size: 1rem; width: auto; height: auto; }
    .btn-xs { padding: 0.5rem 0.875rem; font-size: 0.8125rem; width: auto; height: auto; }
    .pay-btn { transition: transform 150ms; -webkit-user-select: none; user-select: none; }
    .pay-btn:active { transform: scale(0.9); }


    .sticky-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 24px 24px;
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 35%);
      padding-top: 2.5rem;
      z-index: 10;
      pointer-events: none;
      max-width: 600px;
      margin: 0 auto;
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
      padding: 0.875rem 1rem;
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

    @media (hover: hover) { h1[data-action="rename-group"]:hover .fa-pen { color: var(--gray-700) !important; } }
    .edit-expense-pen { font-size: 0.75rem; color: var(--gray-400); vertical-align: middle; cursor: pointer; padding: 0.125rem 0.25rem 0.25rem 0.25rem; transition: color 150ms; }
    @media (hover: hover) { .edit-expense-pen:hover { color: var(--gray-700); } }
    @media (hover: hover) { .add-member-icon:hover { background: var(--gray-200) !important; color: var(--gray-700) !important; } }

    .expense-row { transition: background 150ms, transform 100ms; border-radius: var(--radius); margin: 0 -0.5rem; padding-left: 0.5rem; padding-right: 0.5rem; }
    @media (hover: hover) { .expense-row:hover { background: var(--green-50); } }
    @media (hover: hover) { .expense-row:hover .expense-name, .expense-row:hover .expense-amount { color: #064e1e; } }
    .expense-row:active { background: var(--green-50); transform: scale(0.97); }
    .expense-row:active .expense-name, .expense-row:active .expense-amount { color: #064e1e; }
    @media (hover: hover) { .expense-row.settlement:hover { background: var(--gray-100); color: var(--gray-700); } }
    @media (hover: hover) { .expense-row.settlement:hover .expense-name, .expense-row.settlement:hover .expense-amount { color: var(--gray-700) !important; } }
    .expense-row.settlement:active { background: var(--gray-100); transform: scale(0.97); }
    .expense-row.settlement:active .expense-name, .expense-row.settlement:active .expense-amount { color: var(--gray-700) !important; }


    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.375rem;
      color: var(--gray-700);
    }

    input, textarea, select {
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

    input[type="checkbox"].exp-participant-cb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      min-width: 22px;
      border: 2px solid var(--gray-300, #d1d5db);
      border-radius: 50%;
      background: white;
      padding: 0;
      margin: 0;
      cursor: pointer;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    input[type="checkbox"].exp-participant-cb:checked {
      background: var(--green-500);
      border-color: var(--green-500);
    }
    input[type="checkbox"].exp-participant-cb:checked::after {
      content: '';
      display: block;
      width: 5px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      margin-top: -3px;
      margin-left: 0.5px;
    }
    input[type="checkbox"].exp-participant-cb:focus {
      outline: none;
    }
    input[type="checkbox"].exp-participant-cb:active {
      transform: none;
      opacity: 1;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--green-500);
    }

    select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='2' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.75rem center; padding-right: 2rem; }

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
      padding: 0.75rem 0.5rem;
      margin: 0 -0.5rem;
    }



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
      font-size: 1rem;
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
      font-size: 1rem;
    }

    .alert-success {
      background: var(--green-50);
      color: var(--green-700);
    }

    .alert-error {
      background: #fef2f2;
      color: #dc2626;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: var(--gray-500);
      text-decoration: none;
      font-size: 0.875rem;
      cursor: pointer;
      transition: color 150ms, transform 100ms;
    }

    @media (hover: hover) { .back-link:hover { color: var(--gray-700); } }
    .back-link:active { transform: scale(0.9); }

    .balance-row + .balance-row { border-top: 2px solid var(--gray-100); }

    .avatar-stack { display: flex; gap: 0.625rem; user-select: none; -webkit-user-select: none; }
    .avatar-stack img, .avatar-stack .avatar-placeholder {
      width: 28px; height: 28px; border-radius: 50%; object-fit: cover; background: var(--gray-200);
    }
    .avatar-placeholder { background: var(--gray-200); flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--gray-500); font-size: 0.8125rem; font-weight: 500; text-transform: uppercase; }

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
      transition: background 150ms, color 150ms;
    }
    @media (hover: hover) { .expense-row:hover .expense-icon { background: #cef3da; color: var(--green-700); } }
    .expense-row:active .expense-icon { background: #cef3da; color: var(--green-700); }
    @media (hover: hover) { .expense-row.settlement:hover .expense-icon { background: var(--gray-200) !important; color: var(--gray-700) !important; } }
    .expense-row.settlement:active .expense-icon { background: var(--gray-200) !important; color: var(--gray-700) !important; }

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
      padding-right: 0.25rem;
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
    <span class="brand">Split</span>
    <span class="user-info" data-link="/profile">
      ${data.user.avatar_url
        ? `<img data-avatar-url="${esc(data.user.avatar_url)}" style="width:32px;height:32px;border-radius:50%;user-select:none;-webkit-user-select:none" alt="">`
        : `<div style="width:32px;height:32px;border-radius:50%;background:var(--gray-200)"></div>`}
    </span>
  </nav>
  <div class="container" id="app"></div>

  <script>
  document.addEventListener('touchstart',function(){},false);

  // Prevent iOS viewport shift when keyboard opens
  document.addEventListener('focusin', function(e){
    if(e.target.matches('input,textarea') && !e.target.closest('#add-expense-form')){
      setTimeout(function(){ window.scrollTo(0,0); }, 50);
    }
  });

  // Cache avatars to avoid Google rate limits
  var avatarCache = {};
  (function(){
    // Load all cached avatars from sessionStorage
    for(var i=0;i<sessionStorage.length;i++){
      var k = sessionStorage.key(i);
      if(k.indexOf('avc_')===0) avatarCache[k.slice(4)] = sessionStorage.getItem(k);
    }
    // Set nav avatar
    var navImg = document.querySelector('.user-info img[data-avatar-url]');
    if(navImg){
      var url = navImg.getAttribute('data-avatar-url');
      if(avatarCache[url]) navImg.src = avatarCache[url];
      else cacheAvatar(url, function(data){ navImg.src = data; });
    }
  })();
  function cacheAvatar(url, cb){
    if(!url || avatarCache[url]) return;
    avatarCache[url] = url; // mark in-flight
    fetch(url).then(function(r){ return r.blob(); }).then(function(blob){
      var reader = new FileReader();
      reader.onloadend = function(){
        avatarCache[url] = reader.result;
        try{ sessionStorage.setItem('avc_'+url, reader.result); }catch(e){}
        if(cb) cb(reader.result);
      };
      reader.readAsDataURL(blob);
    }).catch(function(){});
  }
  function getCachedAvatar(url){ return avatarCache[url] || url; }

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
      avatars.forEach(function(a){
        var url = (typeof a === 'string') ? a : (a && a.url);
        var faded = (typeof a === 'object') && a && a.faded;
        var letter = (typeof a === 'object') && a && a.letter ? a.letter.charAt(0) : '';
        var styleAttr = faded ? ' style="opacity:0.25"' : '';
        if(url){ cacheAvatar(url); h += '<img src="'+esc(getCachedAvatar(url))+'" alt=""'+styleAttr+'>'; }
        else h += '<div class="avatar-placeholder"'+styleAttr+'>'+esc(letter)+'</div>';
      });
      h += '</div>';
      return h;
    }

    function fmtAmt(v){
      var n = parseFloat(v);
      if(n % 1 === 0) return '$'+n.toFixed(0);
      var s = n.toFixed(2);
      return '$'+s;
    }

    function balancePill(g){
      if(!g.expense_count) return '';
      var bal = g.my_balance || 0;
      if(Math.abs(bal) < 0.01){
        return '<span style="display:inline-flex;align-items:center;gap:0.4rem;flex-shrink:0;font-size:0.875rem;padding-right:4px;color:var(--gray-500)">'
          + '<i class="fa-solid fa-check"></i>'
          + '<span style="font-weight:500">Settled</span>'
          + '</span>';
      }
      var label = bal < 0 ? 'You owe' : 'Owed';
      var color = bal < 0 ? '#dc2626' : 'var(--green-600)';
      var amt = fmtAmt(Math.abs(bal));
      return '<span style="display:inline-flex;align-items:baseline;gap:0.375rem;flex-shrink:0;font-size:0.875rem;padding-right:4px">'
        + '<span style="font-weight:500">'+label+'</span>'
        + '<span style="font-family:var(--mono);font-weight:600;color:'+color+'">'+amt+'</span>'
        + '</span>';
    }

    // Build a map of userId → display name for a group. Uses first names unless
    // two or more members share a first name — those keep full names.
    function buildDisplayNames(members){
      var counts = {};
      (members||[]).forEach(function(m){
        var first = ((m.name||'').trim().split(/\\s+/)[0] || m.name || '').toLowerCase();
        counts[first] = (counts[first]||0) + 1;
      });
      var map = {};
      (members||[]).forEach(function(m){
        var raw = (m.name||'').trim();
        var first = raw.split(/\\s+/)[0] || raw;
        map[m.id] = counts[first.toLowerCase()] > 1 ? raw : first;
      });
      return map;
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
      var labels = {food:'Food',transport:'Transport',housing:'Housing',entertainment:'Entertainment',shopping:'Shopping',utilities:'Utilities',health:'Health',education:'Education',subscriptions:'Subscriptions',gifts:'Gifts',pets:'Pets',settlement:'Settlement',general:'General'};
      return labels[cat] || 'General';
    }

    // --- Category detection ---
    var CATS = {
      food:          {icon:'fa-utensils',       kw:['food','grocery','groceries','restaurant','pizza','burger','sushi','lunch','dinner','breakfast','cafe','coffee','starbucks','mcdonald','kfc','subway','taco','noodle','rice','bread','meal','eat','snack','bakery','deli','brunch']},
      transport:     {icon:'fa-car',            kw:['uber','lyft','taxi','cab','bus','train','metro','gas','fuel','parking','toll','flight','airline','travel','trip']},
      housing:       {icon:'fa-house',          kw:['rent','mortgage','airbnb','hotel','lodging','lease','apartment']},
      entertainment: {icon:'fa-film',           kw:['movie','cinema','netflix','spotify','concert','show','theater','game','ticket','museum','bar','club','party','beer','wine','drink','alcohol']},
      shopping:      {icon:'fa-bag-shopping',   kw:['amazon','walmart','target','clothes','shirt','shoes','electronics','phone','laptop','furniture','ikea','home','decor']},
      utilities:     {icon:'fa-bolt',           kw:['electric','electricity','water','internet','wifi','phone','mobile','bill','utility','utilities','insurance']},
      health:        {icon:'fa-heart-pulse',    kw:['doctor','hospital','pharmacy','medicine','gym','fitness','health','dental','medical','prescription','vitamin']},
      education:     {icon:'fa-graduation-cap', kw:['book','books','course','school','tuition','class','study','education','library','textbook']},
      subscriptions: {icon:'fa-credit-card',    kw:['subscription','membership','hosting','domain','renewal','plan','dropbox','prime','adobe','icloud']},
      gifts:         {icon:'fa-gift',           kw:['gift','present','birthday','anniversary','wedding','donation','charity']},
      pets:          {icon:'fa-paw',            kw:['pet','dog','cat','vet','kibble','litter','grooming']},
      settlement:    {icon:'fa-dollar-sign',     kw:[]},
      general:       {icon:'fa-receipt',        kw:[]}
    };
    function detectCat(name){
      var l=name.toLowerCase();
      for(var c in CATS){if(c==='general')continue;var kw=CATS[c].kw;for(var i=0;i<kw.length;i++){if(l.indexOf(kw[i])!==-1)return c;}}
      return 'general';
    }
    function catIcon(c){return '<i class="fa-solid '+(CATS[c]||CATS.general).icon+'"></i>';}
    function expenseIcon(ex, size){
      // Settlements always render as the dollar-sign icon, regardless of any stored value.
      if(ex && (ex.category === 'settlement' || ex.settled_with)) return '<i class="fa-solid '+CATS.settlement.icon+'"></i>';
      if(ex && ex.icon) return '<i class="fa-solid '+ex.icon+'"></i>';
      // No icon yet — show a spinner while Haiku picks one.
      var s = size || 18;
      var bw = Math.max(2, Math.round(s/9));
      return '<div class="spinner" style="width:'+s+'px;height:'+s+'px;border-width:'+bw+'px;margin:0;border-color:rgba(34,197,94,0.2);border-top-color:currentColor"></div>';
    }

    // --- Balance calculation ---
    function calcSettlements(members, expenses){
      if(!expenses||!expenses.length||!members.length) return [];
      var n = members.length;
      var allIds = members.map(function(m){return m.id;});
      var bal = {}; // userId -> net balance (positive = owed money, negative = owes)
      members.forEach(function(m){bal[m.id]=0;});
      expenses.forEach(function(ex){
        if(ex.settled_with){
          // Settlement: direct payment between two people
          bal[ex.paid_by] += ex.amount;
          bal[ex.settled_with] -= ex.amount;
        } else if(ex.split_type === 'full'){
          // Full amount owed by specific participants to the payer
          var owes = ex.split_participants ? JSON.parse(ex.split_participants) : [];
          if(owes.length){
            bal[ex.paid_by] += ex.amount;
            var perPerson = ex.amount / owes.length;
            owes.forEach(function(pid){
              if(bal[pid] !== undefined) bal[pid] -= perPerson;
            });
          }
        } else if(ex.split_type === 'custom'){
          // Each participant owes a specific custom amount
          var customParts = ex.split_participants ? JSON.parse(ex.split_participants) : [];
          var customAmts = ex.split_amounts ? JSON.parse(ex.split_amounts) : [];
          if(customParts.length){
            bal[ex.paid_by] += ex.amount;
            customParts.forEach(function(pid, i){
              var owed = customAmts[i] || 0;
              if(bal[pid] !== undefined) bal[pid] -= owed;
            });
          }
        } else {
          // Equal split among participants (default: all members)
          var participants = ex.split_participants ? JSON.parse(ex.split_participants) : allIds;
          var pn = participants.length || n;
          var share = ex.amount / pn;
          var payerInList = participants.indexOf(ex.paid_by) !== -1;
          if(payerInList){
            participants.forEach(function(pid){
              if(pid === ex.paid_by) bal[pid] += ex.amount - share;
              else if(bal[pid] !== undefined) bal[pid] -= share;
            });
          } else {
            bal[ex.paid_by] += ex.amount;
            participants.forEach(function(pid){
              if(bal[pid] !== undefined) bal[pid] -= share;
            });
          }
        }
      });
      // Build name/venmo map
      var names = {}, venmos = {}, cashapps = {};
      members.forEach(function(m){names[m.id]=m.name; venmos[m.id]=m.venmo_handle; cashapps[m.id]=m.cashapp_handle;});
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
            fromName:names[debtors[di].id],toName:names[creditors[ci].id],
            toVenmo:venmos[creditors[ci].id],toCashapp:cashapps[creditors[ci].id],
            fromVenmo:venmos[debtors[di].id],fromCashapp:cashapps[debtors[di].id]});
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
        + '<div class="add-member-icon" data-link="/groups/'+g.id+'/add-member" style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.125rem;line-height:1;color:var(--gray-500);background:var(--gray-100);flex-shrink:0;padding-bottom:1px;margin-left:0.625rem;transition:background 150ms,color 150ms;cursor:pointer;user-select:none;-webkit-user-select:none">+</div>'
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
              var tag = s.toCashapp.replace(/^\$/, '');
              cashappUrl = 'https://cash.app/$'+encodeURIComponent(tag)+'/'+encodeURIComponent(s.amt.toFixed(2));
            }
          } else if(s.to==D.user.id){
            if(s.fromVenmo){ var vh = s.fromVenmo.replace(/^@/, ''); venmoUrl = 'https://venmo.com/'+encodeURIComponent(vh)+'?txn=charge&note='+encodeURIComponent(note).replace(/%20/g,'%C2%A0')+'&amount='+encodeURIComponent(s.amt.toFixed(2)); }
            if(s.fromCashapp){
              var tag = s.fromCashapp.replace(/^\$/, '');
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

    function addExpenseView(gid){
      var members = groupCache[gid] ? groupCache[gid].members : [];
      var dispNames = buildDisplayNames(members);
      var others = members.filter(function(m){ return m.id !== D.user.id; });
      var h = '<h1>Add item</h1>'
        + '<form id="add-expense-form" data-group-id="'+gid+'">'
        + '<div class="form-group"><label>Name</label>'
        + '<input type="text" id="exp-desc" placeholder="Pizza, groceries, ride home, etc" data-1p-ignore autocomplete="off"></div>'
        + '<div class="form-group"><label>Amount</label>'
        + '<input type="number" id="exp-cost" inputmode="decimal" step="0.01" placeholder="0.00"></div>';
      if(members.length){
        h += '<div class="form-group"><label>Paid by</label>'
          + '<select id="exp-paid-by">';
        members.forEach(function(m){
          h += '<option value="'+m.id+'"'+(m.id === D.user.id ? ' selected' : '')+'>'+esc(m.id === D.user.id ? 'You' : (dispNames[m.id]||m.name))+'</option>';
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
        h += '<option value="uneven">Uneven split</option>';
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
            + ' style="display:none;width:72px;height:1.4rem;text-align:right;padding:0 0.375rem;border:1px solid var(--gray-300);border-radius:4px;font-size:0.9375rem">'
            + '</div>';
        });
        h += '</div>'
          + '</div>';
      }
      h += '</form>'
        + '<div class="add-expense-bottom-spacer"></div>'
        + '<div class="sticky-bottom"><button type="submit" form="add-expense-form" class="btn" disabled>Add item</button></div>';
      return h;
    }

    function itemDetailView(gid, ex, isOwner){
      var gInfo = groupCache[gid] ? groupCache[gid].group : D.groups.find(function(g){return g.id==gid});
      var gName = gInfo ? gInfo.name : 'Group';
      var detailMembers = groupCache[gid] ? groupCache[gid].members : [];
      var dispNames = buildDisplayNames(detailMembers);
      var canDelete = ex.paid_by === D.user.id || isOwner;
      var canEditName = !ex.settled_with && ex.paid_by === D.user.id;
      var detailNameHtml;
      if(ex.settled_with){
        var payer = ex.paid_by === D.user.id ? 'You' : (dispNames[ex.paid_by] || ex.paid_by_name);
        var payee = ex.settled_with === D.user.id ? 'You' : (dispNames[ex.settled_with] || ex.settled_with_name);
        detailNameHtml = '<span style="font-weight:600">'+esc(payer)+'</span> paid <span style="font-weight:600">'+esc(payee)+'</span>';
      } else {
        detailNameHtml = esc(ex.name) + (canEditName ? ' <i class="fa-solid fa-pen edit-expense-pen" data-action="rename-expense" data-group-id="'+gid+'" data-expense-id="'+ex.id+'"></i>' : '');
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
          h += '<div class="info-row" style="border-bottom:none; padding-bottom:10px"><span class="info-label">Split</span><span class="info-value">Uneven</span></div>';
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
              rowStyle += ' border-bottom:2px solid var(--gray-100); padding:10px 0 16px 0;';
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
            var mItem = path.match(/^\\/groups\\/\\d+\\/items\\/(\\d+)$/);
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
        if(path.match(/^\\/groups\\/\\d+\\/add-member/)){
          var gid = path.match(/^\\/groups\\/(\\d+)/)[1];
          brandEl.setAttribute('data-link', prevPath && prevPath.indexOf('/groups/'+gid) === 0 ? prevPath : '/groups/'+gid);
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
        document.title = 'Split \u2013 New group';
        app.innerHTML = groupCreateView();
        var nameInput = document.getElementById('grp-title');
        if(nameInput) nameInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/add-expense$/))){
        var gid = m[1];
        document.title = 'Split \u2013 Add item';
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
          // When total amount changes while in uneven mode, redistribute evenly as defaults
          var splitSelChk = document.getElementById('exp-split-type');
          if(splitSelChk && splitSelChk.value === 'uneven'){
            var newTotal = parseFloat(amtEl.value) || 0;
            var amtInputs = document.querySelectorAll('.exp-uneven-amt');
            distributeUnevenAmounts(newTotal, amtInputs);
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
                distributeUnevenAmounts(totalAmt, amtInputs);
                amtInputs.forEach(function(inp){
                  inp.style.display = '';
                  inp.addEventListener('input', syncAddBtn);
                });
                syncAddBtn();
              }
            }
          });
        }
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/items\\/(\\d+)$/))){
        var gid = m[1], eid = parseInt(m[2]);
        if(groupCache[gid]){
          var ex = (groupCache[gid].expenses||[]).find(function(e){return e.id===eid});
          if(ex){
            document.title = 'Split \u2013 ' + esc(ex.name);
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
            document.title = 'Split \u2013 ' + esc(ex.name);
            app.innerHTML = itemDetailView(gid, ex, d.isOwner);
            startIconPoll(gid, myVer, 0);
          } else { nav('/groups/'+gid); }
        }
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/add-member$/))){
        var gid = m[1];
        document.title = 'Split \u2013 Add person';
        app.innerHTML = addMemberView(gid);
        var emailInput = document.getElementById('invite-email');
        if(emailInput) emailInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)\\/members$/))){
        var gid = m[1];
        if(groupCache[gid]){
          document.title = 'Split \u2013 ' + groupCache[gid].group.name;
          app.innerHTML = groupMembersView(groupCache[gid], opts.alert);
        } else {
          var gInfo = D.groups.find(function(g){return g.id==gid});
          document.title = 'Split \u2013 ' + (gInfo?gInfo.name:'Group');
          app.innerHTML = '<div class="spinner"></div>';
        }
        try{
          var r = await fetch('/api/groups/'+gid);
          if(myVer !== routeVer) return;
          if(!r.ok) { nav('/'); return; }
          var detail = await r.json();
          if(myVer !== routeVer) return;
          groupCache[gid] = detail;
          document.title = 'Split \u2013 ' + detail.group.name;
          app.innerHTML = groupMembersView(detail, opts.alert);
        }catch(e){ if(myVer === routeVer && !groupCache[gid]) nav('/groups/'+gid); }
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)$/))){
        var gid = m[1];
        // Show cached or placeholder instantly
        if(groupCache[gid]){
          document.title = 'Split \u2013 ' + groupCache[gid].group.name;
          app.innerHTML = groupDetailView(groupCache[gid], opts.alert);
        } else {
          var gInfo = D.groups.find(function(g){return g.id==gid});
          document.title = 'Split \u2013 ' + (gInfo?gInfo.name:'Group');
          app.innerHTML = '<h1>'+(gInfo?esc(gInfo.name):'')+'</h1><div class="spinner"></div>';
        }
        try{
          var r = await fetch('/api/groups/'+gid);
          if(myVer !== routeVer) return;
          if(!r.ok) { nav('/'); return; }
          var detail = await r.json();
          if(myVer !== routeVer) return;
          groupCache[gid] = detail;
          document.title = 'Split \u2013 ' + detail.group.name;
          app.innerHTML = groupDetailView(detail, opts.alert);
          startIconPoll(gid, myVer, 0);
        }catch(e){ if(myVer === routeVer && !groupCache[gid]) nav('/'); }
      }
      else if(path === '/profile'){
        document.title = 'Split \u2013 Profile';
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
        alert('This is a demo — changes won\\'t be saved.');
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
        var emails = invEl.value.trim().split(/[\\s,]+/).filter(function(e){return e}).join('\\n');
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

  })();

  // Register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js');
  }
  </script>
</body>
</html>`;
}
