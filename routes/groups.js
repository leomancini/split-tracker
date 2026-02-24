import {
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
import { groupCreatePage } from '../views/group-create.js';
import { groupDetailPage } from '../views/group-detail.js';

export function registerGroupRoutes(app, ensureAuth) {
  app.get('/groups/new', ensureAuth, (req, res) => {
    res.send(groupCreatePage(req.user));
  });

  app.post('/groups', ensureAuth, (req, res) => {
    const name = req.body.name?.trim();
    if (!name) return res.redirect('/groups/new');

    const groupId = createGroup(name, req.user.id);

    // Process optional invite emails
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

    res.redirect(`/groups/${groupId}?msg=group-created`);
  });

  app.get('/groups/:id', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);
    const group = getGroup(groupId);
    if (!group) return res.status(404).send('Group not found');

    if (!isGroupMember(groupId, req.user.id)) {
      return res.status(403).send('Not a member of this group');
    }

    const members = getGroupMembers(groupId);
    const invites = getGroupInvites(groupId);

    res.send(groupDetailPage(group, members, invites, req.user, req.query));
  });

  app.post('/groups/:id/invite', ensureAuth, (req, res) => {
    const groupId = parseInt(req.params.id);

    if (!isGroupOwner(groupId, req.user.id)) {
      return res.status(403).send('Only the group owner can invite members');
    }

    const email = req.body.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return res.redirect(`/groups/${groupId}`);
    }

    const result = createInvite(groupId, email, req.user.id);

    if (result.error === 'Already a member') {
      return res.redirect(`/groups/${groupId}?msg=already-member`);
    }
    if (result.error === 'Already invited') {
      return res.redirect(`/groups/${groupId}?msg=already-invited`);
    }

    res.redirect(`/groups/${groupId}?msg=invite-sent`);
  });

  app.post('/invites/:id/accept', ensureAuth, (req, res) => {
    const inviteId = parseInt(req.params.id);
    const invite = getInviteById(inviteId);

    if (!invite || invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).send('Invalid invite');
    }

    if (invite.status !== 'pending') {
      return res.redirect('/');
    }

    const result = acceptInvite(inviteId, req.user.id);
    res.redirect(result.groupId ? `/groups/${result.groupId}?msg=invite-accepted` : '/?msg=invite-accepted');
  });

  app.post('/invites/:id/decline', ensureAuth, (req, res) => {
    const inviteId = parseInt(req.params.id);
    const invite = getInviteById(inviteId);

    if (!invite || invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).send('Invalid invite');
    }

    if (invite.status !== 'pending') {
      return res.redirect('/');
    }

    declineInvite(inviteId);
    res.redirect('/?msg=invite-declined');
  });
}
