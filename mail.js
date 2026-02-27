import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);

const DOMAIN = process.env.MAILGUN_DOMAIN;
const FROM = process.env.MAILGUN_FROM || `Split Tracker <split@${DOMAIN}>`;

let mg;
if (process.env.MAILGUN_API_KEY && DOMAIN) {
  mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
} else {
  console.warn('MAILGUN_API_KEY or MAILGUN_DOMAIN not set — email notifications disabled');
}

export function sendInviteEmail({ to, inviterName, groupName }) {
  if (!mg) return;

  const appUrl = process.env.BASE_URL || 'http://localhost:3000';

  mg.messages.create(DOMAIN, {
    from: FROM,
    to,
    subject: `${inviterName} invited you to "${groupName}" on Split Tracker`,
    text: [
      `${inviterName} invited you to the group "${groupName}" on Split Tracker.`,
      '',
      `Sign in to view and accept your invite:`,
      appUrl,
    ].join('\n'),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h2 style="margin: 0 0 16px;">You're invited!</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          <strong>${inviterName}</strong> invited you to the group <strong>"${groupName}"</strong> on Split Tracker.
        </p>
        <a href="${appUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px;">
          View Invite
        </a>
        <p style="margin-top: 32px; color: #888; font-size: 13px;">
          If you don't have an account yet, you'll be able to sign up and the invite will be waiting for you.
        </p>
      </div>
    `,
  }).catch(err => {
    console.error('Failed to send invite email:', err.message);
  });
}
