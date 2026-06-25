// Remote MCP server for Split Tracker, mounted on the existing Express app at
// /mcp over Streamable HTTP. Each request is authenticated by an OAuth bearer
// token (see oauth-provider.js); the token carries the acting user's id, which
// every tool uses — user identity is NEVER taken from tool arguments.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { mcpAuthRouter, getOAuthProtectedResourceMetadataUrl } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { z } from 'zod';

import {
  normalizeEmail,
  getUserById,
  getUserGroups,
  createGroup,
  getGroup,
  renameGroup,
  getGroupMembers,
  getGroupInvites,
  isGroupMember,
  isGroupOwner,
  createInvite,
  getInviteById,
  getPendingInvitesForUser,
  acceptInvite,
  declineInvite,
  removeMember,
  getGroupExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  updatePaymentHandles,
  updateExpenseClassification,
} from './db.js';
import { sendInviteEmail } from './mail.js';
import { classifyExpense } from './icon-picker.js';
import { SplitTrackerOAuthProvider, googleBridgeCallback } from './oauth-provider.js';

function baseUrl() {
  return (process.env.BASE_URL || 'http://localhost:3124').replace(/\/$/, '');
}

// --- Tool result helpers ---

function ok(text, structuredContent) {
  const result = { content: [{ type: 'text', text }] };
  if (structuredContent !== undefined) result.structuredContent = structuredContent;
  return result;
}

function fail(text) {
  return { isError: true, content: [{ type: 'text', text }] };
}

// Resolve a member reference — a numeric id, a name, or an email — against the
// group's roster. Lets MCP callers name people the way a human would instead of
// having to look up numeric ids first. Returns { id } or { error } (the error
// lists the roster so the model can self-correct on the next call).
function makeMemberResolver(members) {
  const roster = () => members.map(m => `${m.id}=${m.name}`).join(', ');
  return (value) => {
    const raw = String(value).trim();
    if (/^\d+$/.test(raw)) {
      const id = Number(raw);
      return members.some(m => m.id === id) ? { id } : { error: `No member with id ${id} in this group. Members: ${roster()}.` };
    }
    const q = raw.toLowerCase();
    const byEmail = members.filter(m => (m.email || '').toLowerCase() === q);
    const byExactName = members.filter(m => (m.name || '').toLowerCase() === q);
    const byPartialName = members.filter(m => (m.name || '').toLowerCase().includes(q));
    const matches = byEmail.length ? byEmail : byExactName.length ? byExactName : byPartialName;
    if (matches.length === 1) return { id: matches[0].id };
    if (matches.length > 1) return { error: `"${raw}" matches multiple members; use a member id. Members: ${roster()}.` };
    return { error: `Couldn't match "${raw}" to a member. Members: ${roster()}.` };
  };
}

// Build an MCP server whose tools all act as `userId` (from the bearer token).
function buildMcpServer(userId) {
  const server = new McpServer({ name: 'split-tracker', version: '1.0.0' });
  const me = getUserById(userId);

  server.registerTool('whoami', {
    description: "Get the signed-in user's Split Tracker profile (id, name, email, payment handles).",
    inputSchema: {},
  }, async () => {
    const user = getUserById(userId);
    if (!user) return fail('User not found.');
    const profile = {
      id: user.id, name: user.name, email: user.email,
      venmo_handle: user.venmo_handle || null, cashapp_handle: user.cashapp_handle || null,
    };
    return ok(`You are ${user.name} <${user.email}> (id ${user.id}).`, profile);
  });

  server.registerTool('list_groups', {
    description: 'List the groups you belong to, with member counts.',
    inputSchema: { include_demo: z.boolean().optional() },
  }, async ({ include_demo }) => {
    const groups = getUserGroups(userId, !!include_demo);
    const summary = groups.map(g => ({ id: g.id, name: g.name, role: g.role, member_count: g.member_count }));
    return ok(summary.length ? summary.map(g => `#${g.id} ${g.name} (${g.member_count} members, ${g.role})`).join('\n') : 'No groups yet.', { groups: summary });
  });

  server.registerTool('get_group', {
    description: 'Get a group you belong to: members, pending invites, and expenses.',
    inputSchema: { group_id: z.number().int() },
  }, async ({ group_id }) => {
    const group = getGroup(group_id);
    if (!group) return fail('Group not found.');
    if (!isGroupMember(group_id, userId)) return fail('You are not a member of this group.');
    const members = getGroupMembers(group_id);
    const invites = getGroupInvites(group_id);
    const expenses = getGroupExpenses(group_id);
    const isOwner = isGroupOwner(group_id, userId);
    return ok(
      `${group.name} (#${group.id}) — ${members.length} members, ${invites.length} pending invites, ${expenses.length} expenses.`,
      { group, members, invites, expenses, isOwner }
    );
  });

  server.registerTool('create_group', {
    description: 'Create a new group (you become the owner). Optionally invite people by email.',
    inputSchema: { name: z.string().min(1), invite_emails: z.array(z.string().email()).optional() },
  }, async ({ name, invite_emails }) => {
    const trimmed = name.trim();
    if (!trimmed) return fail('Name is required.');
    const groupId = createGroup(trimmed, userId);

    const invited = [];
    for (const raw of invite_emails || []) {
      const email = raw.trim().toLowerCase();
      if (!email || !email.includes('@') || email === me.email.toLowerCase()) continue;
      const result = createInvite(groupId, email, userId);
      if (result.success) {
        sendInviteEmail({ to: email, inviterName: me.name, groupName: trimmed });
        invited.push(email);
      }
    }
    return ok(`Created group "${trimmed}" (#${groupId})${invited.length ? `, invited ${invited.join(', ')}` : ''}.`, { groupId, invited });
  });

  server.registerTool('rename_group', {
    description: 'Rename a group you own.',
    inputSchema: { group_id: z.number().int(), name: z.string().min(1) },
  }, async ({ group_id, name }) => {
    if (!isGroupOwner(group_id, userId)) return fail('Only the group owner can rename it.');
    const trimmed = name.trim();
    if (!trimmed) return fail('Name is required.');
    renameGroup(group_id, trimmed);
    return ok(`Renamed group #${group_id} to "${trimmed}".`, { groupId: group_id, name: trimmed });
  });

  server.registerTool('invite_member', {
    description: 'Invite someone to a group you belong to, by email.',
    inputSchema: { group_id: z.number().int(), email: z.string().email() },
  }, async ({ group_id, email }) => {
    if (!isGroupMember(group_id, userId)) return fail('You are not a member of this group.');
    const addr = email.trim().toLowerCase();
    if (!addr.includes('@')) return fail('Invalid email.');
    const result = createInvite(group_id, addr, userId);
    if (result.error) return fail(result.error);
    const group = getGroup(group_id);
    sendInviteEmail({ to: addr, inviterName: me.name, groupName: group.name });
    return ok(`Invited ${addr} to ${group.name}.`, { groupId: group_id, email: addr });
  });

  server.registerTool('list_invites', {
    description: 'List pending group invites addressed to you.',
    inputSchema: {},
  }, async () => {
    const invites = getPendingInvitesForUser(me.email);
    const summary = invites.map(i => ({ id: i.id, group_id: i.group_id, group_name: i.group_name, invited_by: i.invited_by_name }));
    return ok(summary.length ? summary.map(i => `#${i.id} ${i.group_name} (invited by ${i.invited_by})`).join('\n') : 'No pending invites.', { invites: summary });
  });

  server.registerTool('accept_invite', {
    description: 'Accept a pending group invite addressed to you.',
    inputSchema: { invite_id: z.number().int() },
  }, async ({ invite_id }) => {
    const invite = getInviteById(invite_id);
    if (!invite || normalizeEmail(invite.email) !== normalizeEmail(me.email)) return fail('Invite not found.');
    if (invite.status !== 'pending') return fail('Invite is no longer pending.');
    const result = acceptInvite(invite_id, userId);
    return ok(`Joined group #${result.groupId}.`, { groupId: result.groupId });
  });

  server.registerTool('decline_invite', {
    description: 'Decline a pending group invite addressed to you.',
    inputSchema: { invite_id: z.number().int() },
  }, async ({ invite_id }) => {
    const invite = getInviteById(invite_id);
    if (!invite || normalizeEmail(invite.email) !== normalizeEmail(me.email)) return fail('Invite not found.');
    if (invite.status !== 'pending') return fail('Invite is no longer pending.');
    declineInvite(invite_id);
    return ok('Invite declined.', { inviteId: invite_id });
  });

  server.registerTool('remove_member', {
    description: 'Remove a member from a group you own.',
    inputSchema: { group_id: z.number().int(), user_id: z.number().int() },
  }, async ({ group_id, user_id }) => {
    if (!isGroupOwner(group_id, userId)) return fail('Only the group owner can remove members.');
    if (user_id === userId) return fail('You cannot remove yourself.');
    removeMember(group_id, user_id);
    return ok(`Removed member ${user_id} from group #${group_id}.`, { groupId: group_id, userId: user_id });
  });

  server.registerTool('add_expense', {
    description: [
      'Add an expense to a group you belong to. You are the payer unless paid_by names another member. The category and icon are auto-classified.',
      'paid_by, settled_with, and split_participants accept a member id, name, or email — you do NOT need to look up ids first.',
      '',
      'Choose split_type:',
      '• "equal" (default) — split evenly. Optionally pass split_participants to split among a subset; omit it to include everyone.',
      '• "custom" — an uneven split where each person owes a specific amount. Pass split_participants AND split_amounts as parallel arrays (same length): split_amounts[i] is what split_participants[i] owes. Include EVERYONE who owes a share, INCLUDING the payer if the payer consumed part of it, and the amounts must sum to the total. Example: you pay $100, you owe $40 and Alice owes $60 → split_participants: ["me", "Alice"], split_amounts: [40, 60].',
      '• "full" — one or more people owe the WHOLE amount to the payer (the payer owes nothing). List them in split_participants; the amount is divided equally among them. For "you owe someone the whole thing", set paid_by to that person and split_participants to ["me"].',
      '',
      'For a settlement/payment between two people, set settled_with to the other member and omit split_type.',
    ].join('\n'),
    inputSchema: {
      group_id: z.number().int(),
      name: z.string().min(1),
      amount: z.number().positive(),
      category: z.string().optional(),
      paid_by: z.union([z.number().int(), z.string()]).optional(),
      settled_with: z.union([z.number().int(), z.string()]).optional(),
      split_type: z.enum(['equal', 'custom', 'full']).optional(),
      split_participants: z.array(z.union([z.number().int(), z.string()])).optional(),
      split_amounts: z.array(z.number()).optional(),
    },
  }, async (args) => {
    const { group_id } = args;
    if (!isGroupMember(group_id, userId)) return fail('You are not a member of this group.');
    const name = args.name.trim();
    if (!name) return fail('Name is required.');

    // "me"/"myself" is a convenient self-reference; otherwise resolve against the roster.
    const members = getGroupMembers(group_id);
    const nameOf = (id) => members.find(m => m.id === id)?.name || `#${id}`;
    const resolve = makeMemberResolver(members);
    const resolveRef = (value) => /^(me|myself)$/i.test(String(value).trim()) ? { id: userId } : resolve(value);

    let paidBy = userId;
    if (args.paid_by != null) {
      const r = resolveRef(args.paid_by);
      if (r.error) return fail(`paid_by: ${r.error}`);
      paidBy = r.id;
    }
    let settledWith = null;
    if (args.settled_with != null) {
      const r = resolveRef(args.settled_with);
      if (r.error) return fail(`settled_with: ${r.error}`);
      settledWith = r.id;
    }

    const category = (args.category && args.category.trim()) || 'general';
    const splitType = args.split_type || 'equal';
    const amounts = args.split_amounts?.map(Number) ?? null;

    let participants = null;
    if (args.split_participants) {
      participants = [];
      for (const ref of args.split_participants) {
        const r = resolveRef(ref);
        if (r.error) return fail(`split_participants: ${r.error}`);
        participants.push(r.id);
      }
    }

    if (splitType === 'custom') {
      if (!participants || !amounts) {
        return fail('A custom split needs both split_participants and split_amounts (parallel arrays).');
      }
      if (participants.length !== amounts.length) {
        return fail(`split_participants (${participants.length}) and split_amounts (${amounts.length}) must have the same length — one amount per participant.`);
      }
      if (!participants.length) return fail('A custom split needs at least one participant.');
      const sum = amounts.reduce((a, b) => a + b, 0);
      if (Math.round(sum * 100) !== Math.round(args.amount * 100)) {
        return fail(`split_amounts add up to ${sum.toFixed(2)} but the total is ${args.amount.toFixed(2)}. They must match — include the payer's own share if the payer owes part of it.`);
      }
    } else if (splitType === 'full') {
      if (!participants || !participants.length) {
        return fail('A "full" split needs split_participants: the member(s) who owe the whole amount to the payer.');
      }
    }

    const splitParticipants = participants ? JSON.stringify(participants) : null;
    const splitAmounts = splitType === 'custom' && amounts ? JSON.stringify(amounts) : null;

    const isSettlement = !!settledWith || category === 'settlement';
    const id = createExpense(group_id, paidBy, name, args.amount, category, settledWith, splitType, splitParticipants, isSettlement ? 'fa-dollar-sign' : null, splitAmounts);

    // Classify (icon + category) asynchronously for regular expenses.
    // Settlements already have their fixed icon and 'settlement' category.
    if (!isSettlement) {
      classifyExpense({ name })
        .then(({ icon, category: cat }) => updateExpenseClassification(id, icon, cat))
        .catch(err => console.error('classifyExpense failed:', err.message));
    }
    let splitNote = '';
    if (splitType === 'custom') splitNote = ` Custom split: ${participants.map((p, i) => `${nameOf(p)} $${amounts[i]}`).join(', ')}.`;
    else if (splitType === 'full') splitNote = ` Owed in full by ${participants.map(nameOf).join(', ')}.`;
    else if (participants) splitNote = ` Split equally among ${participants.map(nameOf).join(', ')}.`;
    return ok(`Added expense "${name}" ($${args.amount}) to group #${group_id}.${splitNote}`, { id, split_type: splitType });
  });

  server.registerTool('list_expenses', {
    description: 'List the expenses in a group you belong to.',
    inputSchema: { group_id: z.number().int() },
  }, async ({ group_id }) => {
    if (!isGroupMember(group_id, userId)) return fail('You are not a member of this group.');
    const expenses = getGroupExpenses(group_id);
    return ok(
      expenses.length ? expenses.map(e => `#${e.id} ${e.name} — $${e.amount} (paid by ${e.paid_by_name})`).join('\n') : 'No expenses yet.',
      { expenses }
    );
  });

  server.registerTool('delete_expense', {
    description: 'Delete an expense. Allowed if you paid it or you own the group.',
    inputSchema: { group_id: z.number().int(), expense_id: z.number().int() },
  }, async ({ group_id, expense_id }) => {
    if (!isGroupMember(group_id, userId)) return fail('You are not a member of this group.');
    const expense = getExpenseById(expense_id);
    if (!expense || expense.group_id !== group_id) return fail('Expense not found.');
    if (expense.paid_by !== userId && !isGroupOwner(group_id, userId)) {
      return fail('Only the payer or the group owner can delete this expense.');
    }
    deleteExpense(expense_id);
    return ok(`Deleted expense #${expense_id}.`, { expenseId: expense_id });
  });

  server.registerTool('update_payment_handles', {
    description: 'Update your Venmo and/or Cash App handles used for settlements.',
    inputSchema: { venmo_handle: z.string().optional(), cashapp_handle: z.string().optional() },
  }, async ({ venmo_handle, cashapp_handle }) => {
    const venmo = (venmo_handle || '').trim().replace(/^@/, '');
    const cashapp = (cashapp_handle || '').trim().replace(/^\$/, '');
    updatePaymentHandles(userId, venmo, cashapp);
    return ok('Updated your payment handles.', { venmo_handle: venmo || null, cashapp_handle: cashapp || null });
  });

  return server;
}

// Stateless Streamable HTTP: a fresh server + transport per request, bound to
// the token's user. Body was already parsed by the global express.json().
async function handleMcpPost(req, res) {
  const userId = req.auth?.extra?.userId;
  if (!userId) {
    return res.status(401).json({ jsonrpc: '2.0', error: { code: -32001, message: 'Unauthorized' }, id: null });
  }
  const server = buildMcpServer(userId);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  res.on('close', () => { transport.close(); server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error('MCP request error:', err);
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null });
    }
  }
}

export function registerMcp(app) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('WARNING: GOOGLE_CLIENT_ID/SECRET not set — MCP OAuth will not work.');
  }
  const provider = new SplitTrackerOAuthProvider();
  const resourceServerUrl = new URL(`${baseUrl()}/mcp`);

  // OAuth AS endpoints: /.well-known/*, /authorize, /token, /register, /revoke.
  // Must be mounted at the app root.
  app.use(mcpAuthRouter({
    provider,
    issuerUrl: new URL(baseUrl()),
    baseUrl: new URL(baseUrl()),
    resourceServerUrl,
    scopesSupported: ['split:read', 'split:write'],
    resourceName: 'Split Tracker',
  }));

  // Upstream Google leg of the authorization flow.
  app.get('/mcp-oauth/google/callback', googleBridgeCallback());

  // The MCP endpoint itself, gated by bearer token.
  const bearer = requireBearerAuth({
    verifier: provider,
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resourceServerUrl),
  });
  app.post('/mcp', bearer, handleMcpPost);
  app.get('/mcp', (_req, res) => res.status(405).json({ error: 'Method not allowed' }));
  app.delete('/mcp', (_req, res) => res.status(405).json({ error: 'Method not allowed' }));
}
