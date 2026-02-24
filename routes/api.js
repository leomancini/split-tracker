import {
  getUserGroups,
  getPendingInvitesForUser,
  createGroup,
  getGroup,
  getGroupMembers,
  getGroupInvites,
  isGroupMember,
  isGroupOwner,
  createInvite,
  getInviteById,
  acceptInvite,
  declineInvite,
} from '../db.js';

export function registerApiRoutes(app, ensureAuth) {
  // Middleware: all /api routes require auth and return JSON
  app.use('/api', ensureAuth, (req, res, next) => {
    // Override redirect for API calls — return 401 instead
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
    next();
  });

  // Get all data for the current user in one payload
  app.get('/api/data', ensureAuth, (req, res) => {
    res.json(getAllData(req.user));
  });

  // Get group detail
  app.get('/api/groups/:id', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);
    const group = getGroup(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!isGroupMember(groupId, req.user.id)) return res.status(403).json({ error: 'Not a member' });

    const members = getGroupMembers(groupId);
    const invites = getGroupInvites(groupId);
    const isOwner = isGroupOwner(groupId, req.user.id);

    res.json({ group, members, invites, isOwner });
  });

  // Create group
  app.post('/api/groups', ensureAuth, (req, res) => {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const groupId = createGroup(name, req.user.id);

    const emailsRaw = req.body.emails?.trim();
    if (emailsRaw) {
      const emails = emailsRaw
        .split(/[\n,]+/)
        .map(e => e.trim().toLowerCase())
        .filter(e => e && e.includes('@') && e !== req.user.email.toLowerCase());
      for (const email of emails) {
        createInvite(groupId, email, req.user.id);
      }
    }

    res.json({ ok: true, groupId });
  });

  // Invite to group
  app.post('/api/groups/:id/invite', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);
    if (!isGroupOwner(groupId, req.user.id)) return res.status(403).json({ error: 'Only owner can invite' });

    const email = req.body.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

    const result = createInvite(groupId, email, req.user.id);
    if (result.error) return res.status(409).json({ error: result.error });

    res.json({ ok: true });
  });

  // Accept invite
  app.post('/api/invites/:id/accept', ensureAuth, (req, res) => {
    const inviteId = parseInt(req.params.id);
    const invite = getInviteById(inviteId);
    if (!invite || invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
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
    if (!invite || invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ error: 'Invalid invite' });
    }
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite no longer pending' });

    declineInvite(inviteId);
    res.json({ ok: true });
  });
}

export function getAllData(user) {
  const groups = getUserGroups(user.id);
  const pendingInvites = getPendingInvitesForUser(user.email);
  return { user, groups, pendingInvites };
}
