import { layout } from './layout.js';

export function groupCreatePage(user) {
  const content = `
    <a href="/" class="back-link">&larr; Back to dashboard</a>
    <h1>Create a Group</h1>
    <form method="POST" action="/groups">
      <div class="form-group">
        <label for="name">Group Name</label>
        <input type="text" id="name" name="name" required placeholder="e.g. Apartment, Trip to Paris" data-1p-ignore autocomplete="off">
      </div>
      <div class="form-group">
        <label for="emails">Invite Members (optional)</label>
        <textarea id="emails" name="emails" placeholder="Enter email addresses, one per line" data-1p-ignore autocomplete="off"></textarea>
        <div class="form-hint">Enter the Google account emails of people you want to invite.</div>
      </div>
      <button type="submit" class="btn">Create Group</button>
    </form>
  `;
  return layout('Create Group', content, user);
}
