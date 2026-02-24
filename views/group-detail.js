import { layout, escapeHtml } from './layout.js';

export function groupDetailPage(group, members, invites, currentUser, query) {
  const isOwner = members.some(m => m.id === currentUser.id && m.role === 'owner');

  const msg = query?.msg;
  let alert = '';
  if (msg === 'invite-sent') alert = '<div class="alert alert-success">Invite sent!</div>';
  if (msg === 'already-invited') alert = '<div class="alert alert-error">That email has already been invited.</div>';
  if (msg === 'already-member') alert = '<div class="alert alert-error">That person is already a member.</div>';

  const membersHtml = members.map(m => `
    <div class="member-row">
      ${m.avatar_url
        ? `<img src="${escapeHtml(m.avatar_url)}" class="member-avatar" alt="">`
        : `<div class="member-avatar"></div>`}
      <div class="member-info">
        <div class="member-name">${escapeHtml(m.name)}</div>
        <div class="member-email">${escapeHtml(m.email)}</div>
      </div>
      <span class="badge${m.role === 'owner' ? '' : ' badge-gray'}">${escapeHtml(m.role)}</span>
    </div>
  `).join('');

  const invitesHtml = invites.length > 0 ? invites.map(i => `
    <div class="invite-row">
      <span style="font-size: 0.875rem;">${escapeHtml(i.email)}</span>
      <span class="badge badge-gray">pending</span>
    </div>
  `).join('') : '<div style="font-size: 0.875rem; color: var(--gray-400); padding: 0.5rem 0;">No pending invites</div>';

  const inviteForm = isOwner ? `
    <div class="section">
      <h2>Invite Member</h2>
      <form method="POST" action="/groups/${group.id}/invite" class="inline-form">
        <input type="email" name="email" required placeholder="Email address">
        <button type="submit" class="btn btn-sm">Invite</button>
      </form>
    </div>
  ` : '';

  const content = `
    <a href="/" class="back-link">&larr; Back to dashboard</a>
    ${alert}
    <h1>${escapeHtml(group.name)}</h1>

    <div class="section">
      <h2>Members</h2>
      <div class="card">
        ${membersHtml}
      </div>
    </div>

    ${invites.length > 0 || isOwner ? `
    <div class="section">
      <h2>Pending Invites</h2>
      <div class="card">
        ${invitesHtml}
      </div>
    </div>
    ` : ''}

    ${inviteForm}
  `;

  return layout(group.name, content, currentUser);
}
