// Split Tracker as its own OAuth 2.1 Authorization Server for the MCP endpoint.
//
// Claude's remote connector needs metadata discovery + Dynamic Client
// Registration + PKCE, none of which Google supports. So we run our own AS and
// delegate the *human login* step to the existing Google OAuth (the "bridge"
// callback below), then issue our own opaque tokens bound to a users.id.

import { InvalidGrantError, InvalidTokenError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { findOrCreateUser } from './db.js';
import {
  randomToken,
  sha256,
  getClient,
  saveClient,
  savePendingAuth,
  consumePendingAuth,
  insertAuthCode,
  getAuthCode,
  consumeAuthCode,
  insertToken,
  getTokenByAccessHash,
  getTokenByRefreshHash,
  deleteTokenByAccessHash,
  deleteTokenByRefreshHash,
  rotateRefreshToken,
} from './mcp-db.js';

const ACCESS_TTL = parseInt(process.env.MCP_TOKEN_TTL, 10) || 60 * 60;            // 1 hour
const REFRESH_TTL = parseInt(process.env.MCP_REFRESH_TTL, 10) || 30 * 24 * 60 * 60; // 30 days
const AUTH_CODE_TTL = 120;   // seconds — single-use, exchanged immediately
const PENDING_TTL = 10 * 60; // seconds — time the user has to finish Google login

function baseUrl() {
  return (process.env.BASE_URL || 'http://localhost:3124').replace(/\/$/, '');
}

function googleRedirectUri() {
  return `${baseUrl()}/mcp-oauth/google/callback`;
}

function issueTokens(userId, clientId, scope, resource) {
  const access = randomToken(32);
  const refresh = randomToken(32);
  const now = Date.now();
  insertToken({
    accessTokenHash: sha256(access),
    refreshTokenHash: sha256(refresh),
    clientId,
    userId,
    scope: scope ?? null,
    resource: resource ?? null,
    accessExpiresAt: now + ACCESS_TTL * 1000,
    refreshExpiresAt: now + REFRESH_TTL * 1000,
  });
  return {
    access_token: access,
    token_type: 'bearer',
    expires_in: ACCESS_TTL,
    refresh_token: refresh,
    scope: scope ?? undefined,
  };
}

export class SplitTrackerOAuthProvider {
  get clientsStore() {
    return {
      getClient: (clientId) => getClient(clientId),
      registerClient: (client) => saveClient(client),
    };
  }

  // Begin authorization: stash the request, then send the browser to Google to
  // authenticate the actual human. The router has already validated redirect_uri
  // against the client's registered URIs and that PKCE method is S256.
  async authorize(client, params, res) {
    const txn = randomToken(24);
    savePendingAuth({
      txn,
      clientId: client.client_id,
      redirectUri: params.redirectUri,
      state: params.state ?? null,
      codeChallenge: params.codeChallenge,
      codeChallengeMethod: 'S256',
      scope: (params.scopes ?? []).join(' ') || null,
      resource: params.resource ? params.resource.href : null,
      expiresAt: Date.now() + PENDING_TTL * 1000,
    });

    const g = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    g.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
    g.searchParams.set('redirect_uri', googleRedirectUri());
    g.searchParams.set('response_type', 'code');
    g.searchParams.set('scope', 'openid email profile');
    g.searchParams.set('state', txn);
    g.searchParams.set('access_type', 'online');
    g.searchParams.set('prompt', 'select_account');
    res.redirect(g.toString());
  }

  // The router calls this before exchange to run the PKCE check itself; it must
  // return the challenge verbatim and must NOT consume the code.
  async challengeForAuthorizationCode(client, authorizationCode) {
    const row = getAuthCode(authorizationCode);
    if (!row || row.client_id !== client.client_id) {
      throw new InvalidGrantError('Invalid authorization code');
    }
    return row.code_challenge;
  }

  async exchangeAuthorizationCode(client, authorizationCode, _codeVerifier, redirectUri) {
    const row = consumeAuthCode(authorizationCode);
    if (!row || row.client_id !== client.client_id) {
      throw new InvalidGrantError('Invalid authorization code');
    }
    if (row.expires_at < Date.now()) {
      throw new InvalidGrantError('Authorization code expired');
    }
    if (redirectUri !== undefined && redirectUri !== row.redirect_uri) {
      throw new InvalidGrantError('redirect_uri does not match');
    }
    return issueTokens(row.user_id, row.client_id, row.scope, row.resource);
  }

  async exchangeRefreshToken(client, refreshToken, scopes, resource) {
    const now = Date.now();
    const oldHash = sha256(refreshToken);
    const current = getTokenByRefreshHash(oldHash);
    if (!current) throw new InvalidGrantError('Invalid refresh token');
    if (current.refresh_expires_at && current.refresh_expires_at < now) {
      deleteTokenByRefreshHash(oldHash);
      throw new InvalidGrantError('Refresh token expired');
    }

    const access = randomToken(32);
    const refresh = randomToken(32);
    const scope = scopes && scopes.length ? scopes.join(' ') : null;
    const existing = rotateRefreshToken(oldHash, {
      accessTokenHash: sha256(access),
      refreshTokenHash: sha256(refresh),
      scope, // null falls back to existing scope inside the transaction
      resource: resource ? resource.href : null,
      accessExpiresAt: now + ACCESS_TTL * 1000,
      refreshExpiresAt: now + REFRESH_TTL * 1000,
    });
    if (!existing) throw new InvalidGrantError('Invalid refresh token');

    return {
      access_token: access,
      token_type: 'bearer',
      expires_in: ACCESS_TTL,
      refresh_token: refresh,
      scope: scope || existing.scope || undefined,
    };
  }

  async verifyAccessToken(token) {
    const hash = sha256(token);
    const row = getTokenByAccessHash(hash);
    if (!row) throw new InvalidTokenError('Invalid access token');
    if (row.access_expires_at < Date.now()) {
      deleteTokenByAccessHash(hash);
      throw new InvalidTokenError('Access token expired');
    }
    return {
      token,
      clientId: row.client_id,
      scopes: (row.scope || '').split(' ').filter(Boolean),
      expiresAt: Math.floor(row.access_expires_at / 1000),
      resource: row.resource ? new URL(row.resource) : undefined,
      extra: { userId: row.user_id },
    };
  }

  async revokeToken(client, request) {
    const hash = sha256(request.token);
    deleteTokenByAccessHash(hash);
    deleteTokenByRefreshHash(hash);
  }
}

// Express handler for GET /mcp-oauth/google/callback — the upstream Google leg
// of the flow. Authenticates the human, then mints our authorization code bound
// to that user and the originally-stored PKCE challenge, and bounces back to the
// MCP client's redirect_uri. No app session/cookie is used here.
export function googleBridgeCallback() {
  return async (req, res) => {
    try {
      const { code, state, error } = req.query;
      if (error) return res.status(400).send(`Google sign-in failed: ${error}`);
      if (!code || !state) return res.status(400).send('Missing code or state.');

      const pending = consumePendingAuth(state);
      if (!pending) return res.status(400).send('Authorization request not found. Please start over.');
      if (pending.expires_at < Date.now()) return res.status(400).send('Authorization request expired. Please start over.');

      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: googleRedirectUri(),
          grant_type: 'authorization_code',
        }),
      });
      if (!tokenResp.ok) {
        console.error('MCP Google token exchange failed:', await tokenResp.text());
        return res.status(502).send('Google sign-in failed.');
      }
      const googleTokens = await tokenResp.json();

      const userinfoResp = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${googleTokens.access_token}` },
      });
      if (!userinfoResp.ok) {
        console.error('MCP Google userinfo failed:', await userinfoResp.text());
        return res.status(502).send('Google sign-in failed.');
      }
      const profile = await userinfoResp.json();
      if (!profile.email) return res.status(400).send('Google account did not return an email.');

      const user = findOrCreateUser({
        googleId: profile.sub,
        email: profile.email,
        name: profile.name || profile.email,
        avatarUrl: profile.picture || null,
      });

      const authCode = randomToken(32);
      insertAuthCode({
        code: authCode,
        clientId: pending.client_id,
        userId: user.id,
        redirectUri: pending.redirect_uri,
        codeChallenge: pending.code_challenge,
        codeChallengeMethod: pending.code_challenge_method,
        scope: pending.scope,
        resource: pending.resource,
        expiresAt: Date.now() + AUTH_CODE_TTL * 1000,
      });

      const back = new URL(pending.redirect_uri);
      back.searchParams.set('code', authCode);
      if (pending.state) back.searchParams.set('state', pending.state);
      res.redirect(back.toString());
    } catch (err) {
      console.error('MCP Google bridge error:', err);
      res.status(500).send('Internal error during sign-in.');
    }
  };
}
