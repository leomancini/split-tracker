import { layout, escapeHtml } from './layout.js';

export function dashboardPage(user, groups, pendingInvites, query) {
  const msg = query?.msg;
  let alert = '';
  if (msg === 'group-created') alert = '<div class="alert alert-success">Group created!</div>';
  if (msg === 'invite-accepted') alert = '<div class="alert alert-success">Invite accepted!</div>';
  if (msg === 'invite-declined') alert = '<div class="alert alert-success">Invite declined.</div>';

  const invitesHtml = pendingInvites.length > 0 ? `
    <div class="section">
      <h2>Pending Invites</h2>
      <div class="card">
        ${pendingInvites.map(invite => `
          <div class="invite-row">
            <div>
              <div style="font-size: 0.875rem; font-weight: 500;">${escapeHtml(invite.group_name)}</div>
              <div style="font-size: 0.8125rem; color: var(--gray-500);">from ${escapeHtml(invite.invited_by_name)}</div>
            </div>
            <div class="invite-actions">
              <form method="POST" action="/invites/${invite.id}/accept" style="flex:1;">
                <button type="submit" class="btn btn-sm">Accept</button>
              </form>
              <form method="POST" action="/invites/${invite.id}/decline" style="flex:1;">
                <button type="submit" class="btn btn-sm btn-danger">Decline</button>
              </form>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const groupsHtml = groups.length > 0 ? groups.map(g => `
    <a href="/groups/${g.id}" class="card card-link" style="display:block;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 500;">${escapeHtml(g.name)}</div>
          <div style="font-size: 0.8125rem; color: var(--gray-500);">${g.member_count} member${g.member_count !== 1 ? 's' : ''}</div>
        </div>
        <span class="badge${g.role === 'owner' ? '' : ' badge-gray'}">${escapeHtml(g.role)}</span>
      </div>
    </a>
  `).join('') : '<div class="empty">No groups yet. Create one to get started!</div>';

  const content = `
    ${alert}
    ${invitesHtml}
    <div class="section">
      <h2>Your Groups</h2>
      ${groupsHtml}
      <a href="/groups/new" class="btn" style="margin-top: 0.5rem;">New Group</a>
    </div>
  `;

  return layout('Dashboard', content, user);
}
