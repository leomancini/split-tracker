// OAuth storage for the MCP server's authorization-server role.
// Reuses the app's better-sqlite3 instance (default export of db.js) so the
// OAuth state lives alongside the app data. Access/refresh tokens are stored as
// SHA-256 hashes — a DB leak never exposes a usable bearer token.

import crypto from 'node:crypto';
import db from './db.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS oauth_clients (
    client_id TEXT PRIMARY KEY,
    client_json TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS oauth_pending_auth (
    txn TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    redirect_uri TEXT NOT NULL,
    state TEXT,
    code_challenge TEXT NOT NULL,
    code_challenge_method TEXT NOT NULL,
    scope TEXT,
    resource TEXT,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
    code TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    redirect_uri TEXT NOT NULL,
    code_challenge TEXT NOT NULL,
    code_challenge_method TEXT NOT NULL,
    scope TEXT,
    resource TEXT,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS oauth_tokens (
    access_token_hash TEXT PRIMARY KEY,
    refresh_token_hash TEXT UNIQUE,
    client_id TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    scope TEXT,
    resource TEXT,
    access_expires_at INTEGER NOT NULL,
    refresh_expires_at INTEGER
  );
`);

// --- Crypto helpers ---

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// --- Client store (Dynamic Client Registration) ---

export function getClient(clientId) {
  const row = db.prepare('SELECT client_json FROM oauth_clients WHERE client_id = ?').get(clientId);
  return row ? JSON.parse(row.client_json) : undefined;
}

export function saveClient(clientInfo) {
  db.prepare('INSERT OR REPLACE INTO oauth_clients (client_id, client_json, created_at) VALUES (?, ?, ?)')
    .run(clientInfo.client_id, JSON.stringify(clientInfo), Date.now());
  return clientInfo;
}

// --- Pending authorizations (one per in-flight /authorize, keyed by txn) ---

export function savePendingAuth(p) {
  db.prepare(`
    INSERT INTO oauth_pending_auth
      (txn, client_id, redirect_uri, state, code_challenge, code_challenge_method, scope, resource, expires_at)
    VALUES (@txn, @clientId, @redirectUri, @state, @codeChallenge, @codeChallengeMethod, @scope, @resource, @expiresAt)
  `).run(p);
}

export const consumePendingAuth = db.transaction((txn) => {
  const row = db.prepare('SELECT * FROM oauth_pending_auth WHERE txn = ?').get(txn);
  if (row) db.prepare('DELETE FROM oauth_pending_auth WHERE txn = ?').run(txn);
  return row;
});

// --- Authorization codes (single-use, short-lived) ---

export function insertAuthCode(c) {
  db.prepare(`
    INSERT INTO oauth_authorization_codes
      (code, client_id, user_id, redirect_uri, code_challenge, code_challenge_method, scope, resource, expires_at)
    VALUES (@code, @clientId, @userId, @redirectUri, @codeChallenge, @codeChallengeMethod, @scope, @resource, @expiresAt)
  `).run(c);
}

export function getAuthCode(code) {
  return db.prepare('SELECT * FROM oauth_authorization_codes WHERE code = ?').get(code);
}

export const consumeAuthCode = db.transaction((code) => {
  const row = db.prepare('SELECT * FROM oauth_authorization_codes WHERE code = ?').get(code);
  if (row) db.prepare('DELETE FROM oauth_authorization_codes WHERE code = ?').run(code);
  return row;
});

// --- Access / refresh tokens (stored as SHA-256 hashes) ---

export function insertToken(t) {
  db.prepare(`
    INSERT INTO oauth_tokens
      (access_token_hash, refresh_token_hash, client_id, user_id, scope, resource, access_expires_at, refresh_expires_at)
    VALUES (@accessTokenHash, @refreshTokenHash, @clientId, @userId, @scope, @resource, @accessExpiresAt, @refreshExpiresAt)
  `).run(t);
}

export function getTokenByAccessHash(hash) {
  return db.prepare('SELECT * FROM oauth_tokens WHERE access_token_hash = ?').get(hash);
}

export function getTokenByRefreshHash(hash) {
  return db.prepare('SELECT * FROM oauth_tokens WHERE refresh_token_hash = ?').get(hash);
}

export function deleteTokenByAccessHash(hash) {
  db.prepare('DELETE FROM oauth_tokens WHERE access_token_hash = ?').run(hash);
}

export function deleteTokenByRefreshHash(hash) {
  db.prepare('DELETE FROM oauth_tokens WHERE refresh_token_hash = ?').run(hash);
}

// Atomically swap an old refresh token for a freshly issued token pair, carrying
// over the user/client binding from the existing row. Returns the old row, or
// null if the refresh token was unknown.
export const rotateRefreshToken = db.transaction((oldRefreshHash, fresh) => {
  const existing = db.prepare('SELECT * FROM oauth_tokens WHERE refresh_token_hash = ?').get(oldRefreshHash);
  if (!existing) return null;
  db.prepare('DELETE FROM oauth_tokens WHERE refresh_token_hash = ?').run(oldRefreshHash);
  insertToken({
    accessTokenHash: fresh.accessTokenHash,
    refreshTokenHash: fresh.refreshTokenHash,
    clientId: existing.client_id,
    userId: existing.user_id,
    scope: fresh.scope ?? existing.scope,
    resource: fresh.resource ?? existing.resource,
    accessExpiresAt: fresh.accessExpiresAt,
    refreshExpiresAt: fresh.refreshExpiresAt,
  });
  return existing;
});
