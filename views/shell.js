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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Split Tracker</title>
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
      cursor: pointer;
    }

    nav .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: var(--gray-500);
      cursor: pointer;
    }

    nav .user-info:hover { color: var(--gray-700); }

    nav .user-info img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
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

    .btn-sm { padding: 0.625rem 1.25rem; font-size: 1rem; }

    .btn-outline {
      background: white;
      color: var(--green-600);
      border: 2px solid var(--green-500);
    }

    .btn-outline:hover { background: var(--green-50); }

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

    .card-link {
      display: block;
      text-decoration: none;
      color: inherit;
      transition: transform 100ms;
      -webkit-touch-callout: none;
      cursor: pointer;
    }

    .card-link:hover { border-color: var(--green-500); }
    .card-link:active { transform: scale(0.98); }

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

    .member-row + .member-row { border-top: 1px solid var(--gray-100); }

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

    .invite-row + .invite-row { border-top: 1px solid var(--gray-100); }

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
      cursor: pointer;
    }

    .back-link:hover { color: var(--gray-700); }
  </style>
</head>
<body>
  <nav>
    <span class="brand" data-link="/">Split</span>
    <span class="user-info" data-link="/profile">
      ${data.user.avatar_url ? `<img src="${esc(data.user.avatar_url)}" alt="">` : ''}
      <span>${esc(data.user.name)}</span>
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

    // --- Views ---
    function dashboardView(alert){
      var h = '';
      if(alert) h += '<div class="alert alert-success">'+esc(alert)+'</div>';

      if(D.pendingInvites.length){
        h += '<div class="section"><h2>Pending Invites</h2><div class="card">';
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

      h += '<div class="section"><h2>Your Groups</h2>';
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
      h += '<button class="btn" style="margin-top:0.5rem" data-link="/groups/new">New Group</button></div>';
      return h;
    }

    function groupCreateView(){
      return '<span class="back-link" data-link="/">&larr; Back to dashboard</span>'
        + '<h1>Create a Group</h1>'
        + '<form id="create-group-form">'
        + '<div class="form-group"><label for="name">Group Name</label>'
        + '<input type="text" id="name" name="name" required placeholder="e.g. Apartment, Trip to Paris" data-1p-ignore autocomplete="off"></div>'
        + '<div class="form-group"><label for="emails">Invite Members (optional)</label>'
        + '<textarea id="emails" name="emails" placeholder="Enter email addresses, one per line" data-1p-ignore autocomplete="off"></textarea>'
        + '<div class="form-hint">Enter the Google account emails of people you want to invite.</div></div>'
        + '<button type="submit" class="btn">Create Group</button></form>';
    }

    function groupDetailView(detail, alert){
      var g = detail.group, members = detail.members, invites = detail.invites, isOwner = detail.isOwner;
      var h = '<span class="back-link" data-link="/">&larr; Back to dashboard</span>';

      if(alert) h += '<div class="alert '+(alert.type==='error'?'alert-error':'alert-success')+'">'+esc(alert.text)+'</div>';

      h += '<h1>'+esc(g.name)+'</h1><div class="section"><h2>Members</h2><div class="card">';
      members.forEach(function(m){
        h += '<div class="member-row">'
          + (m.avatar_url ? '<img src="'+esc(m.avatar_url)+'" class="member-avatar" alt="">' : '<div class="member-avatar"></div>')
          + '<div class="member-info"><div class="member-name">'+esc(m.name)+'</div>'
          + '<div class="member-email">'+esc(m.email)+'</div></div>'
          + '<span class="badge'+(m.role==='owner'?'':' badge-gray')+'">'+esc(m.role)+'</span></div>';
      });
      h += '</div></div>';

      if(invites.length || isOwner){
        h += '<div class="section"><h2>Pending Invites</h2><div class="card">';
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
        h += '<div class="section"><h2>Invite Member</h2>'
          + '<form id="invite-form" data-group-id="'+g.id+'" class="inline-form">'
          + '<input type="email" name="email" required placeholder="Email address" data-1p-ignore autocomplete="off">'
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

    async function route(path, opts){
      opts = opts || {};
      var m;

      if(path === '/' || path === ''){
        document.title = 'Dashboard - Split Tracker';
        app.innerHTML = dashboardView(opts.alert);
      }
      else if(path === '/groups/new'){
        document.title = 'Create Group - Split Tracker';
        app.innerHTML = groupCreateView();
        var nameInput = document.getElementById('name');
        if(nameInput) nameInput.focus();
      }
      else if((m = path.match(/^\\/groups\\/(\\d+)$/))){
        var gid = m[1];
        document.title = 'Group - Split Tracker';
        // Show cached version instantly if available, then refresh
        if(groupCache[gid] && !opts.alert){
          app.innerHTML = groupDetailView(groupCache[gid], opts.alert);
        }
        try{
          var r = await fetch('/api/groups/'+gid);
          if(!r.ok) { nav('/'); return; }
          var detail = await r.json();
          groupCache[gid] = detail;
          document.title = detail.group.name + ' - Split Tracker';
          app.innerHTML = groupDetailView(detail, opts.alert);
        }catch(e){ if(!groupCache[gid]) nav('/'); }
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

    // Create group form
    document.addEventListener('submit', function(e){
      var form = e.target;

      if(form.id === 'create-group-form'){
        e.preventDefault();
        var name = form.name.value.trim();
        if(!name) return;
        var emails = form.emails.value.trim();
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
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
            btn.disabled = false;
          }).catch(function(){btn.disabled=false});
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
              route('/groups/'+gid2, {alert:{text:'Invite sent!',type:'success'}});
            } else if(d.error === 'Already a member'){
              route('/groups/'+gid2, {alert:{text:'That person is already a member.',type:'error'}});
            } else if(d.error === 'Already invited'){
              route('/groups/'+gid2, {alert:{text:'That email has already been invited.',type:'error'}});
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
  </script>
</body>
</html>`;
}
