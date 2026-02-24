import { layout, escapeHtml } from './layout.js';

export function profilePage(user) {
  const content = `
    <a href="/" class="back-link">&larr; Back to dashboard</a>
    <h1>Profile</h1>
    <div class="card" style="display: flex; align-items: center; gap: 1rem;">
      ${user.avatar_url
        ? `<img src="${escapeHtml(user.avatar_url)}" style="width: 56px; height: 56px; border-radius: 50%;" alt="">`
        : `<div style="width: 56px; height: 56px; border-radius: 50%; background: var(--gray-200);"></div>`}
      <div>
        <div style="font-size: 1.125rem; font-weight: 600;">${escapeHtml(user.name)}</div>
        <div style="font-size: 0.875rem; color: var(--gray-500);">${escapeHtml(user.email)}</div>
      </div>
    </div>
    <div style="margin-top: 1.5rem;">
      <a href="/logout" class="btn btn-danger">Log out</a>
    </div>
  `;
  return layout('Profile', content, user);
}
