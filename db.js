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
  const insert = db.prepare(`
    INSERT OR IGNORE INTO users (google_id, email, name, avatar_url)
    VALUES (?, ?, ?, ?)
  `);
  const update = db.prepare('UPDATE users SET email = ? WHERE google_id = ? AND email != ?');
  const select = db.prepare('SELECT * FROM users WHERE google_id = ?');
  insert.run(googleId, normalizedEmail, name, avatarUrl);
  update.run(normalizedEmail, googleId, normalizedEmail);
  return select.get(googleId);
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

// --- Group helpers ---

export function getUserGroups(userId, showDemo = false) {
  const groups = db.prepare(`
    SELECT g.*, COALESCE(gm.role, 'viewer') as role,
      (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
    FROM groups g
    LEFT JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = ?
    WHERE ${showDemo ? "g.is_demo = 1" : "gm.user_id IS NOT NULL AND g.is_demo = 0"}
    ORDER BY g.created_at DESC
  `).all(userId);

  const avatarStmt = db.prepare(`
    SELECT u.avatar_url FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY (CASE WHEN gm.role = 'owner' THEN 0 ELSE 1 END), gm.joined_at ASC
  `);

  for (const g of groups) {
    g.member_avatars = avatarStmt.all(g.id).map(r => r.avatar_url);
  }

  return groups;
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
    SELECT u.id, u.name, u.email, u.avatar_url, gm.role, gm.joined_at
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
  return db.prepare(`
    SELECT gi.*, u.name as invited_by_name
    FROM group_invites gi
    JOIN users u ON u.id = gi.invited_by
    WHERE gi.group_id = ? AND gi.status = 'pending'
    ORDER BY gi.created_at DESC
  `).all(groupId);
}

export function createInvite(groupId, email, invitedBy) {
  const normalized = normalizeEmail(email);
  // Check if already a member
  const existing = db.prepare(`
    SELECT 1 FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ? AND u.email = ?
  `).get(groupId, normalized);
  if (existing) return { error: 'Already a member' };

  try {
    db.prepare('INSERT INTO group_invites (group_id, email, invited_by) VALUES (?, ?, ?)').run(groupId, normalized, invitedBy);
    return { success: true };
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { error: 'Already invited' };
    }
    throw err;
  }
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
  db.prepare("UPDATE group_invites SET status = 'declined' WHERE id = ?").run(inviteId);
}

export function removeMember(groupId, userId) {
  db.prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ?').run(groupId, userId);
}

export function cancelInvite(inviteId) {
  db.prepare('DELETE FROM group_invites WHERE id = ?').run(inviteId);
}

// --- Expense helpers ---

export function getGroupExpenses(groupId) {
  return db.prepare(`
    SELECT e.*, u.name as paid_by_name, u.avatar_url as paid_by_avatar
    FROM expenses e
    JOIN users u ON u.id = e.paid_by
    WHERE e.group_id = ?
    ORDER BY e.created_at DESC
  `).all(groupId);
}

export function createExpense(groupId, paidBy, name, amount, category) {
  const result = db.prepare(
    'INSERT INTO expenses (group_id, paid_by, name, amount, category) VALUES (?, ?, ?, ?, ?)'
  ).run(groupId, paidBy, name, amount, category);
  return result.lastInsertRowid;
}

export function getExpenseById(id) {
  return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
}

export function deleteExpense(id) {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
}

export default db;
