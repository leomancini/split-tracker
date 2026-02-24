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
`);

// --- User helpers ---

export function findOrCreateUser({ googleId, email, name, avatarUrl }) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO users (google_id, email, name, avatar_url)
    VALUES (?, ?, ?, ?)
  `);
  const select = db.prepare('SELECT * FROM users WHERE google_id = ?');
  insert.run(googleId, email, name, avatarUrl);
  return select.get(googleId);
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

// --- Group helpers ---

export function getUserGroups(userId) {
  return db.prepare(`
    SELECT g.*, gm.role,
      (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
    FROM groups g
    JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = ?
    ORDER BY g.created_at DESC
  `).all(userId);
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

export function getGroupMembers(groupId) {
  return db.prepare(`
    SELECT u.id, u.name, u.email, u.avatar_url, gm.role, gm.joined_at
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY gm.joined_at ASC
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
  // Check if already a member
  const existing = db.prepare(`
    SELECT 1 FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ? AND u.email = ?
  `).get(groupId, email);
  if (existing) return { error: 'Already a member' };

  try {
    db.prepare('INSERT INTO group_invites (group_id, email, invited_by) VALUES (?, ?, ?)').run(groupId, email, invitedBy);
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
  `).all(email);
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

export default db;
