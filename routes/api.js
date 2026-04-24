import {
  normalizeEmail,
  getUserGroups,
  getPendingInvitesForUser,
  createGroup,
  getGroup,
  renameGroup,
  getGroupMembers,
  getGroupInvites,
  isGroupMember,
  isGroupOwner,
  createInvite,
  getInviteById,
  acceptInvite,
  declineInvite,
  removeMember,
  cancelInvite,
  getGroupExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  updatePaymentHandles,
  updateExpenseIcon,
  setPushEnabled,
  savePushSubscription,
  deletePushSubscriptionByEndpoint,
  getUserById,
} from '../db.js';
import { sendInviteEmail } from '../mail.js';
import { pickIcon } from '../icon-picker.js';
import { getVapidPublicKey, sendExpenseNotification } from '../push.js';

export function registerApiRoutes(app, ensureAuth) {
  // Middleware: all /api routes require auth and return JSON
  app.use('/api', ensureAuth, (req, res, next) => {
    // Override redirect for API calls — return 401 instead
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
    next();
  });

  // Toggle demo mode
  app.post('/api/demo-mode', ensureAuth, (req, res) => {
    req.session.demoMode = !req.session.demoMode;
    res.json({ ok: true, demoMode: req.session.demoMode });
  });

  // Update payment handles
  app.put('/api/profile/payment', ensureAuth, (req, res) => {
    const venmo = (req.body.venmo_handle || '').trim().replace(/^@/, '');
    const cashapp = (req.body.cashapp_handle || '').trim().replace(/^\$/, '');
    updatePaymentHandles(req.user.id, venmo, cashapp);
    req.user.venmo_handle = venmo || null;
    req.user.cashapp_handle = cashapp || null;
    res.json({ ok: true });
  });

  // Push notification: VAPID public key
  app.get('/api/push/vapid-public-key', ensureAuth, (req, res) => {
    const key = getVapidPublicKey();
    if (!key) return res.status(503).json({ error: 'Push not configured on server' });
    res.json({ key });
  });

  // Push notification: subscribe current browser
  app.post('/api/push/subscribe', ensureAuth, (req, res) => {
    const endpoint = req.body.endpoint;
    const p256dh = req.body.keys?.p256dh;
    const auth = req.body.keys?.auth;
    if (!endpoint || !p256dh || !auth) return res.status(400).json({ error: 'Invalid subscription' });
    savePushSubscription(req.user.id, endpoint, p256dh, auth);
    setPushEnabled(req.user.id, true);
    req.user.push_enabled = 1;
    res.json({ ok: true });
  });

  // Push notification: unsubscribe current browser
  app.post('/api/push/unsubscribe', ensureAuth, (req, res) => {
    const endpoint = req.body.endpoint;
    if (endpoint) deletePushSubscriptionByEndpoint(endpoint);
    res.json({ ok: true });
  });

  // Push notification: toggle push_enabled flag
  app.put('/api/profile/push-enabled', ensureAuth, (req, res) => {
    const enabled = !!req.body.enabled;
    setPushEnabled(req.user.id, enabled);
    req.user.push_enabled = enabled ? 1 : 0;
    res.json({ ok: true });
  });

  // Get all data for the current user in one payload
  app.get('/api/data', ensureAuth, (req, res) => {
    res.json(getAllData(req.user, !!req.session.demoMode));
  });

  // Get group detail
  app.get('/api/groups/:id', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);
    const group = getGroup(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!isGroupMember(groupId, req.user.id) && !(group.is_demo && req.session.demoMode)) return res.status(403).json({ error: 'Not a member' });

    const members = getGroupMembers(groupId);
    const invites = getGroupInvites(groupId);
    const isOwner = isGroupOwner(groupId, req.user.id);
    const expenses = getGroupExpenses(groupId);

    res.json({ group, members, invites, isOwner, expenses });
  });

  // Rename group
  app.put('/api/groups/:id', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);
    if (!isGroupOwner(groupId, req.user.id)) return res.status(403).json({ error: 'Only owner can rename' });

    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ error: 'Name is required' });

    renameGroup(groupId, name);
    res.json({ ok: true });
  });

  // Create group
  app.post('/api/groups', ensureAuth, (req, res) => {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const groupId = createGroup(name, req.user.id);

    const emailsRaw = req.body.emails?.trim();
    if (emailsRaw) {
      const groupName = name;
      const emails = emailsRaw
        .split(/[\n,]+/)
        .map(e => e.trim().toLowerCase())
        .filter(e => e && e.includes('@') && e !== req.user.email.toLowerCase());
      for (const email of emails) {
        const result = createInvite(groupId, email, req.user.id);
        if (result.success) {
          sendInviteEmail({ to: email, inviterName: req.user.name, groupName });
        }
      }
    }

    res.json({ ok: true, groupId });
  });

  // Invite to group
  app.post('/api/groups/:id/invite', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);
    if (!isGroupMember(groupId, req.user.id)) return res.status(403).json({ error: 'Not a member' });

    const email = req.body.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

    const result = createInvite(groupId, email, req.user.id);
    if (result.error) return res.status(409).json({ error: result.error });

    const group = getGroup(groupId);
    sendInviteEmail({ to: email, inviterName: req.user.name, groupName: group.name });

    res.json({ ok: true });
  });

  // Add expense
  app.post('/api/groups/:id/expenses', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);
    if (!isGroupMember(groupId, req.user.id)) return res.status(403).json({ error: 'Not a member' });

    const name = req.body.name?.trim();
    const amount = parseFloat(req.body.amount);
    const category = req.body.category?.trim() || 'general';
    const paidBy = req.body.paid_by ? parseInt(req.body.paid_by) : req.user.id;
    const settledWith = req.body.settled_with ? parseInt(req.body.settled_with) : null;
    const splitType = req.body.split_type || 'equal';
    const splitParticipants = req.body.split_participants ? JSON.stringify(req.body.split_participants.map(Number)) : null;

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'Valid amount is required' });
    if (paidBy !== req.user.id && !isGroupMember(groupId, paidBy)) return res.status(400).json({ error: 'Invalid member' });
    if (settledWith && !isGroupMember(groupId, settledWith)) return res.status(400).json({ error: 'Invalid member' });

    const isSettlement = !!settledWith || category === 'settlement';
    const id = createExpense(groupId, paidBy, name, amount, category, settledWith, splitType, splitParticipants, isSettlement ? 'fa-dollar-sign' : null);
    res.json({ ok: true, id });

    // Pick icon asynchronously for regular expenses. Settlements already have their fixed icon.
    if (!isSettlement) {
      pickIcon({ name, category })
        .then(icon => { if (icon) updateExpenseIcon(id, icon); })
        .catch(err => console.error('pickIcon failed:', err.message));
    }

    // Fire push notifications to other members (not for demo groups).
    const group = getGroup(groupId);
    if (group && !group.is_demo) {
      const payer = getUserById(paidBy);
      const settledUser = settledWith ? getUserById(settledWith) : null;
      sendExpenseNotification({
        group,
        expense: { id, paid_by: paidBy, name, amount, settled_with: settledWith },
        payerName: payer?.name?.split(' ')[0] || payer?.name || 'Someone',
        settledWithName: settledUser ? (settledUser.name.split(' ')[0] || settledUser.name) : null,
      }).catch(err => console.error('sendExpenseNotification failed:', err.message));
    }
  });

  // Delete expense
  app.delete('/api/groups/:gid/expenses/:eid', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.gid);
    const expenseId = parseInt(req.params.eid);

    if (!isGroupMember(groupId, req.user.id)) return res.status(403).json({ error: 'Not a member' });

    const expense = getExpenseById(expenseId);
    if (!expense || expense.group_id !== groupId) return res.status(404).json({ error: 'Expense not found' });

    if (expense.paid_by !== req.user.id && !isGroupOwner(groupId, req.user.id)) {
      return res.status(403).json({ error: 'Only the payer or group owner can delete' });
    }

    deleteExpense(expenseId);
    res.json({ ok: true });
  });

  // Remove member from group
  app.delete('/api/groups/:gid/members/:uid', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.gid);
    const userId = parseInt(req.params.uid);
    if (!isGroupOwner(groupId, req.user.id)) return res.status(403).json({ error: 'Only owner can remove members' });
    if (userId === req.user.id) return res.status(400).json({ error: 'Cannot remove yourself' });

    removeMember(groupId, userId);
    res.json({ ok: true });
  });

  // Cancel pending invite
  app.delete('/api/groups/:gid/invites/:iid', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.gid);
    const inviteId = parseInt(req.params.iid);
    if (!isGroupMember(groupId, req.user.id)) return res.status(403).json({ error: 'Not a member' });

    const invite = getInviteById(inviteId);
    if (!invite || invite.group_id !== groupId) return res.status(404).json({ error: 'Invite not found' });
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite no longer pending' });

    cancelInvite(inviteId);
    res.json({ ok: true });
  });

  // Accept invite
  app.post('/api/invites/:id/accept', ensureAuth, (req, res) => {
    const inviteId = parseInt(req.params.id);
    const invite = getInviteById(inviteId);
    if (!invite || normalizeEmail(invite.email) !== normalizeEmail(req.user.email)) {
      return res.status(403).json({ error: 'Invalid invite' });
    }
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite no longer pending' });

    const result = acceptInvite(inviteId, req.user.id);
    res.json({ ok: true, groupId: result.groupId });
  });

  // Decline invite
  app.post('/api/invites/:id/decline', ensureAuth, (req, res) => {
    const inviteId = parseInt(req.params.id);
    const invite = getInviteById(inviteId);
    if (!invite || normalizeEmail(invite.email) !== normalizeEmail(req.user.email)) {
      return res.status(403).json({ error: 'Invalid invite' });
    }
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite no longer pending' });

    declineInvite(inviteId);
    res.json({ ok: true });
  });
}

export function getAllData(user, demoMode = false) {
  // Auto-accept any pending invites
  const pendingInvites = getPendingInvitesForUser(user.email);
  for (const invite of pendingInvites) {
    acceptInvite(invite.id, user.id);
  }
  const groups = getUserGroups(user.id, demoMode);
  return { user, groups, pendingInvites: [], demoMode };
}
