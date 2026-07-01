import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';

mkdirSync('./data', { recursive: true });

const db = new Database('./data/split-tracker.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Schema ---
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    is_demo INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER NOT NULL REFERENCES groups(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    role TEXT NOT NULL DEFAULT 'member',
    joined_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (group_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS group_invites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES groups(id),
    email TEXT NOT NULL,
    invited_by INTEGER NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(group_id, email)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES groups(id),
    paid_by INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// --- Migrations ---
try {
  db.exec('ALTER TABLE groups ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE users ADD COLUMN venmo_handle TEXT');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE users ADD COLUMN cashapp_handle TEXT');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE expenses ADD COLUMN settled_with INTEGER REFERENCES users(id)');
} catch (e) {
  // Column already exists
}
try {
  db.exec("ALTER TABLE expenses ADD COLUMN split_type TEXT NOT NULL DEFAULT 'equal'");
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE expenses ADD COLUMN split_participants TEXT');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE expenses ADD COLUMN icon TEXT');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE users ADD COLUMN push_enabled INTEGER NOT NULL DEFAULT 0');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE users ADD COLUMN is_placeholder INTEGER NOT NULL DEFAULT 0');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE expenses ADD COLUMN split_amounts TEXT');
} catch (e) {
  // Column already exists
}

db.exec(`
  CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
`);

// One-time backfill: every pending invite should now correspond to a (pending)
// group member. For emails without a user yet, create a placeholder first.
const backfillInvites = db.transaction(() => {
  const orphanInvites = db.prepare(`
    SELECT DISTINCT gi.email
    FROM group_invites gi
    LEFT JOIN users u ON u.email = gi.email
    WHERE gi.status = 'pending' AND u.id IS NULL
  `).all();
  const insertPlaceholder = db.prepare(
    'INSERT INTO users (google_id, email, name, is_placeholder) VALUES (?, ?, ?, 1)'
  );
  for (const row of orphanInvites) {
    const localPart = row.email.split('@')[0];
    insertPlaceholder.run('placeholder:' + row.email, row.email, localPart);
  }
  db.exec(`
    INSERT OR IGNORE INTO group_members (group_id, user_id, role)
    SELECT gi.group_id, u.id, 'member'
    FROM group_invites gi
    JOIN users u ON u.email = gi.email
    WHERE gi.status = 'pending'
  `);
});
backfillInvites();

// --- Helpers ---

export function normalizeEmail(email) {
  const lower = email.toLowerCase().trim();
  const [local, domain] = lower.split('@');
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return local.replace(/\./g, '') + '@' + domain;
  }
  return lower;
}

// --- User helpers ---

export function findOrCreateUser({ googleId, email, name, avatarUrl }) {
  const normalizedEmail = normalizeEmail(email);
  // Claim an existing placeholder for this email, preserving group memberships and balances.
  const placeholder = db.prepare('SELECT * FROM users WHERE email = ? AND is_placeholder = 1').get(normalizedEmail);
  if (placeholder) {
    db.prepare('UPDATE users SET google_id = ?, name = ?, avatar_url = ?, is_placeholder = 0 WHERE id = ?')
      .run(googleId, name, avatarUrl, placeholder.id);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(placeholder.id);
  }
  db.prepare('INSERT OR IGNORE INTO users (google_id, email, name, avatar_url) VALUES (?, ?, ?, ?)').run(googleId, normalizedEmail, name, avatarUrl);
  db.prepare('UPDATE users SET email = ? WHERE google_id = ? AND email != ?').run(normalizedEmail, googleId, normalizedEmail);
  return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function updatePaymentHandles(userId, venmo, cashapp) {
  db.prepare('UPDATE users SET venmo_handle = ?, cashapp_handle = ? WHERE id = ?').run(venmo || null, cashapp || null, userId);
}

// --- Push notification helpers ---

export function setPushEnabled(userId, enabled) {
  db.prepare('UPDATE users SET push_enabled = ? WHERE id = ?').run(enabled ? 1 : 0, userId);
}

export function savePushSubscription(userId, endpoint, p256dh, auth) {
  db.prepare(`
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(endpoint) DO UPDATE SET user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth
  `).run(userId, endpoint, p256dh, auth);
}

export function deletePushSubscriptionByEndpoint(endpoint) {
  db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);
}

export function getPushSubscriptionsForGroupMembers(groupId, excludeUserId) {
  return db.prepare(`
    SELECT ps.user_id, ps.endpoint, ps.p256dh, ps.auth
    FROM push_subscriptions ps
    JOIN group_members gm ON gm.user_id = ps.user_id
    JOIN users u ON u.id = ps.user_id
    WHERE gm.group_id = ? AND u.push_enabled = 1 AND ps.user_id != ?
  `).all(groupId, excludeUserId);
}

// --- Group helpers ---

export function getUserGroups(userId, showDemo = false) {
  const groups = db.prepare(`
    SELECT g.*, COALESCE(gm.role, 'viewer') as role,
      (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
      COALESCE((SELECT MAX(created_at) FROM expenses WHERE group_id = g.id), g.created_at) as last_activity_at
    FROM groups g
    LEFT JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = ?
    WHERE ${showDemo ? "g.is_demo = 1" : "gm.user_id IS NOT NULL AND g.is_demo = 0"}
    ORDER BY last_activity_at DESC
  `).all(userId);

  const avatarStmt = db.prepare(`
    SELECT u.avatar_url, u.is_placeholder, u.email, u.name,
      EXISTS (SELECT 1 FROM group_invites gi WHERE gi.group_id = gm.group_id AND gi.email = u.email AND gi.status = 'pending') as is_pending
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY (CASE WHEN gm.role = 'owner' THEN 0 ELSE 1 END), gm.joined_at ASC
  `);

  for (const g of groups) {
    g.member_avatars = avatarStmt.all(g.id).map(r => ({
      url: r.avatar_url,
      is_pending: !!r.is_pending || !!r.is_placeholder,
      letter: ((r.name && r.name.trim().charAt(0)) || (r.email && r.email.charAt(0)) || '').toUpperCase(),
    }));
    const { balance, expenseCount } = getUserGroupBalance(g.id, userId);
    g.my_balance = balance;
    g.expense_count = expenseCount;
  }

  return groups;
}

export function getUserGroupBalance(groupId, userId) {
  const memberIds = db.prepare('SELECT user_id FROM group_members WHERE group_id = ?').all(groupId).map(r => r.user_id);
  const expenses = db.prepare(
    'SELECT paid_by, amount, settled_with, split_type, split_participants, split_amounts FROM expenses WHERE group_id = ?'
  ).all(groupId);
  let bal = 0;
  for (const ex of expenses) {
    if (ex.settled_with) {
      if (ex.paid_by === userId) bal += ex.amount;
      else if (ex.settled_with === userId) bal -= ex.amount;
    } else if (ex.split_type === 'full') {
      const owes = ex.split_participants ? JSON.parse(ex.split_participants) : [];
      if (!owes.length) continue;
      const per = ex.amount / owes.length;
      if (ex.paid_by === userId) bal += ex.amount;
      if (owes.includes(userId)) bal -= per;
    } else if (ex.split_type === 'custom') {
      const participants = ex.split_participants ? JSON.parse(ex.split_participants) : [];
      const amounts = ex.split_amounts ? JSON.parse(ex.split_amounts) : [];
      if (!participants.length) continue;
      if (ex.paid_by === userId) bal += ex.amount;
      const idx = participants.indexOf(userId);
      if (idx !== -1 && amounts[idx] != null) bal -= amounts[idx];
    } else {
      const participants = ex.split_participants ? JSON.parse(ex.split_participants) : memberIds;
      const pn = participants.length || memberIds.length;
      if (!pn) continue;
      const share = ex.amount / pn;
      const payerInList = participants.includes(ex.paid_by);
      if (payerInList) {
        if (ex.paid_by === userId) bal += ex.amount - share;
        else if (participants.includes(userId)) bal -= share;
      } else {
        if (ex.paid_by === userId) bal += ex.amount;
        if (participants.includes(userId)) bal -= share;
      }
    }
  }
  return { balance: bal, expenseCount: expenses.length };
}

export function createGroup(name, createdBy) {
  const insertGroup = db.prepare('INSERT INTO groups (name, created_by) VALUES (?, ?)');
  const insertMember = db.prepare('INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)');

  const create = db.transaction((name, userId) => {
    const result = insertGroup.run(name, userId);
    insertMember.run(result.lastInsertRowid, userId, 'owner');
    return result.lastInsertRowid;
  });

  return create(name, createdBy);
}

export function getGroup(groupId) {
  return db.prepare('SELECT * FROM groups WHERE id = ?').get(groupId);
}

export function renameGroup(groupId, name) {
  db.prepare('UPDATE groups SET name = ? WHERE id = ?').run(name, groupId);
}

export function getGroupMembers(groupId) {
  return db.prepare(`
    SELECT u.id, u.name, u.email, u.avatar_url, u.venmo_handle, u.cashapp_handle, u.is_placeholder,
      gm.role, gm.joined_at,
      (SELECT id FROM group_invites WHERE group_id = gm.group_id AND email = u.email AND status = 'pending' LIMIT 1) as pending_invite_id
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY (CASE WHEN gm.role = 'owner' THEN 0 ELSE 1 END), gm.joined_at ASC
  `).all(groupId);
}

export function isGroupMember(groupId, userId) {
  const row = db.prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?').get(groupId, userId);
  return !!row;
}

export function isGroupOwner(groupId, userId) {
  const row = db.prepare("SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ? AND role = 'owner'").get(groupId, userId);
  return !!row;
}

// --- Invite helpers ---

export function getGroupInvites(groupId) {
  // Only invites whose email isn't already a member of the group. Placeholders are
  // already in group_members, so this filter prevents duplicating them in the UI.
  return db.prepare(`
    SELECT gi.*, u.name as invited_by_name
    FROM group_invites gi
    JOIN users u ON u.id = gi.invited_by
    WHERE gi.group_id = ? AND gi.status = 'pending'
      AND NOT EXISTS (
        SELECT 1 FROM group_members gm
        JOIN users mu ON mu.id = gm.user_id
        WHERE gm.group_id = gi.group_id AND mu.email = gi.email
      )
    ORDER BY gi.created_at DESC
  `).all(groupId);
}

export function createInvite(groupId, email, invitedBy) {
  const normalized = normalizeEmail(email);
  const memberByEmail = db.prepare(`
    SELECT u.id FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ? AND u.email = ?
  `).get(groupId, normalized);
  if (memberByEmail) return { error: 'Already a member' };

  const invite = db.transaction(() => {
    let user = db.prepare('SELECT id, is_placeholder FROM users WHERE email = ?').get(normalized);
    if (!user) {
      // Brand new email — create a placeholder user so they can be split with right away.
      const localPart = normalized.split('@')[0];
      const result = db.prepare(
        'INSERT INTO users (google_id, email, name, is_placeholder) VALUES (?, ?, ?, 1)'
      ).run('placeholder:' + normalized, normalized, localPart);
      user = { id: result.lastInsertRowid, is_placeholder: 1 };
    }
    // Auto-add the invitee as a member regardless of whether they have an account yet,
    // so splits and avatar rows include them. Their pending status is tracked by the
    // group_invites row below.
    db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)').run(groupId, user.id, 'member');
    try {
      db.prepare('INSERT INTO group_invites (group_id, email, invited_by) VALUES (?, ?, ?)').run(groupId, normalized, invitedBy);
      return { success: true };
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return { error: 'Already invited' };
      throw err;
    }
  });
  return invite();
}

export function getPendingInvitesForUser(email) {
  return db.prepare(`
    SELECT gi.*, g.name as group_name, u.name as invited_by_name
    FROM group_invites gi
    JOIN groups g ON g.id = gi.group_id
    JOIN users u ON u.id = gi.invited_by
    WHERE gi.email = ? AND gi.status = 'pending'
    ORDER BY gi.created_at DESC
  `).all(normalizeEmail(email));
}

export function getInviteById(inviteId) {
  return db.prepare('SELECT * FROM group_invites WHERE id = ?').get(inviteId);
}

export function acceptInvite(inviteId, userId) {
  const invite = getInviteById(inviteId);
  if (!invite) return { error: 'Invite not found' };

  const accept = db.transaction(() => {
    db.prepare("UPDATE group_invites SET status = 'accepted' WHERE id = ?").run(inviteId);
    db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)').run(invite.group_id, userId, 'member');
  });

  accept();
  return { success: true, groupId: invite.group_id };
}

export function declineInvite(inviteId) {
  const decline = db.transaction(() => {
    const invite = db.prepare('SELECT * FROM group_invites WHERE id = ?').get(inviteId);
    if (!invite) return;
    db.prepare("UPDATE group_invites SET status = 'declined' WHERE id = ?").run(inviteId);
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(invite.email);
    if (user) {
      db.prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ?').run(invite.group_id, user.id);
    }
  });
  decline();
}

export function removeMember(groupId, userId) {
  const remove = db.transaction(() => {
    const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
    db.prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ?').run(groupId, userId);
    if (user) {
      db.prepare("DELETE FROM group_invites WHERE group_id = ? AND email = ? AND status = 'pending'").run(groupId, user.email);
    }
  });
  remove();
}

export function cancelInvite(inviteId) {
  const cancel = db.transaction(() => {
    const invite = db.prepare('SELECT * FROM group_invites WHERE id = ?').get(inviteId);
    if (!invite) return;
    db.prepare('DELETE FROM group_invites WHERE id = ?').run(inviteId);
    // The invite added them to group_members on creation; drop them since the invite is being canceled.
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(invite.email);
    if (user) {
      db.prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ?').run(invite.group_id, user.id);
    }
  });
  cancel();
}

// --- Expense helpers ---

export function getGroupExpenses(groupId) {
  return db.prepare(`
    SELECT e.*, u.name as paid_by_name, u.avatar_url as paid_by_avatar,
      sw.name as settled_with_name
    FROM expenses e
    JOIN users u ON u.id = e.paid_by
    LEFT JOIN users sw ON sw.id = e.settled_with
    WHERE e.group_id = ?
    ORDER BY e.created_at DESC
  `).all(groupId);
}

export function createExpense(groupId, paidBy, name, amount, category, settledWith = null, splitType = 'equal', splitParticipants = null, icon = null, splitAmounts = null) {
  const result = db.prepare(
    'INSERT INTO expenses (group_id, paid_by, name, amount, category, settled_with, split_type, split_participants, icon, split_amounts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(groupId, paidBy, name, amount, category, settledWith, splitType, splitParticipants, icon, splitAmounts);
  return result.lastInsertRowid;
}

export function updateExpenseIcon(id, icon) {
  db.prepare('UPDATE expenses SET icon = ? WHERE id = ?').run(icon, id);
}

export function updateExpenseName(id, name) {
  db.prepare('UPDATE expenses SET name = ? WHERE id = ?').run(name, id);
}

export function updateExpense(id, { name, amount, category, paidBy, splitType, splitParticipants, splitAmounts, icon }) {
  db.prepare(
    'UPDATE expenses SET name = ?, amount = ?, category = ?, paid_by = ?, split_type = ?, split_participants = ?, split_amounts = ?, icon = ? WHERE id = ?'
  ).run(name, amount, category, paidBy, splitType, splitParticipants, splitAmounts, icon, id);
}

export function updateExpenseClassification(id, icon, category) {
  db.prepare('UPDATE expenses SET icon = ?, category = ? WHERE id = ?').run(icon, category, id);
}

export function getExpensesMissingIcon() {
  return db.prepare(
    "SELECT id, name, category FROM expenses WHERE (icon IS NULL OR icon = '') AND settled_with IS NULL AND category != 'settlement'"
  ).all();
}

export function getNonSettlementExpenses() {
  return db.prepare(
    "SELECT id, name FROM expenses WHERE settled_with IS NULL AND category != 'settlement'"
  ).all();
}

export function setSettlementIcons() {
  const result = db.prepare(
    "UPDATE expenses SET icon = 'fa-dollar-sign' WHERE (settled_with IS NOT NULL OR category = 'settlement') AND (icon IS NULL OR icon != 'fa-dollar-sign')"
  ).run();
  return result.changes;
}

export function getExpenseById(id) {
  return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
}

export function deleteExpense(id) {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
}

export default db;
