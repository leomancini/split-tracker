export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function layout(title, content, user) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Split Tracker</title>
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
      --radius: 8px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      color: var(--gray-900);
      line-height: 1.5;
    }

    nav {
      background: white;
      border-bottom: 1px solid var(--gray-200);
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    nav .brand {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--green-500);
      text-decoration: none;
    }

    nav .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: var(--gray-500);
    }

    nav .user-info img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }

    nav .user-info a {
      color: var(--gray-500);
      text-decoration: none;
    }

    nav .user-info a:hover {
      color: var(--gray-700);
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 1.5rem 1rem;
    }

    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
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
      padding: 0.875rem 1.5rem;
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

    .btn:hover { background: var(--green-600); }
    .btn:active { transform: scale(0.97); }

    .card-link:active { transform: scale(0.98); }

    .btn-sm { padding: 0.625rem 1.25rem; font-size: 1rem; }

    .btn-outline {
      background: white;
      color: var(--green-600);
      border: 2px solid var(--green-500);
    }

    .btn-outline:hover {
      background: var(--green-50);
    }

    .btn-danger {
      background: white;
      color: #dc2626;
      border: 2px solid #fca5a5;
    }

    .btn-danger:hover { background: #fef2f2; }

    .card {
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius);
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .card a {
      text-decoration: none;
      color: inherit;
    }

    .card-link {
      display: block;
      text-decoration: none;
      color: inherit;
      transition: transform 100ms;
      -webkit-touch-callout: none;
    }

    .card-link:hover {
      border-color: var(--green-500);
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.375rem;
      color: var(--gray-700);
    }

    input, textarea {
      width: 100%;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius);
      padding: 0.625rem 0.75rem;
      font-size: 16px;
      font-family: inherit;
      color: var(--gray-900);
      -webkit-appearance: none;
    }

    input[data-1p-ignore], textarea[data-1p-ignore] { /* specificity bump */ }

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

    .member-row + .member-row {
      border-top: 1px solid var(--gray-100);
    }

    .member-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--gray-200);
    }

    .member-info {
      flex: 1;
    }

    .member-name {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .member-email {
      font-size: 0.8125rem;
      color: var(--gray-500);
    }

    .empty {
      text-align: center;
      color: var(--gray-400);
      padding: 2rem 1rem;
      font-size: 0.875rem;
    }

    .section { margin-bottom: 1.5rem; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .inline-form {
      display: flex;
      gap: 0.5rem;
    }

    .inline-form input { flex: 1; }

    .invite-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
    }

    .invite-row + .invite-row {
      border-top: 1px solid var(--gray-100);
    }

    .invite-actions {
      display: flex;
      gap: 0.375rem;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: var(--radius);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .alert-success {
      background: var(--green-50);
      color: var(--green-700);
      border: 1px solid var(--green-100);
    }

    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fca5a5;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: var(--gray-500);
      text-decoration: none;
      font-size: 0.875rem;
    }

    .back-link:hover { color: var(--gray-700); }
  </style>
</head>
<body>
  ${user ? `
  <nav>
    <a href="/" class="brand">Split</a>
    <a href="/profile" class="user-info">
      ${user.avatar_url ? `<img src="${escapeHtml(user.avatar_url)}" alt="">` : ''}
      <span>${escapeHtml(user.name)}</span>
    </a>
  </nav>` : ''}
  <div class="container">
    ${content}
  </div>
  <script>
  document.addEventListener('touchstart',function(){},false);
  (function(){
    var cache={};
    var inflight={};
    function ok(url){
      try{ var u=new URL(url,location.origin); }catch(e){return false}
      if(u.origin!==location.origin)return false;
      if(u.pathname.startsWith('/auth/'))return false;
      if(u.pathname==='/logout')return false;
      if(u.pathname==='/login')return false;
      return true;
    }
    function parse(html){
      var d=new DOMParser().parseFromString(html,'text/html');
      var c=d.querySelector('.container');
      var t=d.querySelector('title');
      return c?{content:c.innerHTML,title:t?t.textContent:''}:null;
    }
    function swap(p,url,push){
      if(!p)return false;
      document.querySelector('.container').innerHTML=p.content;
      if(p.title)document.title=p.title;
      if(push!==false)history.pushState({},'',url);
      window.scrollTo(0,0);
      return true;
    }
    function prefetch(url){
      if(cache[url]||inflight[url])return;
      inflight[url]=fetch(url).then(function(r){return r.text()}).then(function(h){
        cache[url]=parse(h);
        delete inflight[url];
      }).catch(function(){delete inflight[url]});
    }
    async function go(url,push){
      try{
        if(cache[url]){
          if(swap(cache[url],url,push))return;
        }
        if(inflight[url])await inflight[url];
        if(cache[url]){
          if(swap(cache[url],url,push))return;
        }
        var r=await fetch(url);
        var p=parse(await r.text());
        if(!swap(p,url,push))location.href=url;
      }catch(e){location.href=url}
    }
    document.addEventListener('touchstart',function(e){
      var a=e.target.closest('a[href]');
      if(a&&ok(a.href))prefetch(a.href);
    });
    document.addEventListener('mousedown',function(e){
      var a=e.target.closest('a[href]');
      if(a&&ok(a.href))prefetch(a.href);
    });
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href]');
      if(!a)return;
      if(!ok(a.href))return;
      e.preventDefault();
      go(a.href);
    });
    document.addEventListener('submit',async function(e){
      var f=e.target;
      if(!f||f.tagName!=='FORM')return;
      var action=f.action||location.href;
      if(!ok(action))return;
      e.preventDefault();
      try{
        var r=await fetch(action,{
          method:f.method||'GET',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:new URLSearchParams(new FormData(f)).toString(),
          redirect:'follow'
        });
        cache={};
        var p=parse(await r.text());
        if(!swap(p,r.url,true))location.href=r.url;
      }catch(err){f.submit()}
    });
    window.addEventListener('popstate',function(){
      cache={};
      go(location.href,false);
    });
  })();
  </script>
</body>
</html>`;
}
