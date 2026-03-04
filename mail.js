import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);

const DOMAIN = process.env.MAILGUN_DOMAIN;
const FROM = process.env.MAILGUN_FROM || `Split <split@${DOMAIN}>`;

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
    subject: `${inviterName} invited you to ${groupName} on Split`,
    text: [
      `${inviterName} invited you to the group ${groupName} on Split.`,
      '',
      `Sign in to view and accept your invite:`,
      appUrl,
    ].join('\n'),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
        <p style="margin: 0 0 24px; font-size: 18px; line-height: 1.5;"><strong>${inviterName}</strong> invited you to the group <strong>${groupName}</strong> on Split.</p>
        <a href="${appUrl}" style="display: block; padding: 14px 28px; background: #22c55e; color: #fff; text-decoration: none; border-radius: 999px; font-size: 16px; font-weight: 600; text-align: center;">
          Join group
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
