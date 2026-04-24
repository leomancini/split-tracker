import webPush from 'web-push';
import {
  getPushSubscriptionsForGroupMembers,
  deletePushSubscriptionByEndpoint,
} from './db.js';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const contact = process.env.VAPID_CONTACT_EMAIL || 'mailto:admin@example.com';

let configured = false;
if (publicKey && privateKey) {
  webPush.setVapidDetails(contact, publicKey, privateKey);
  configured = true;
} else {
  console.warn('WARNING: VAPID keys not set. Push notifications disabled. Run `node generate-vapid.js`.');
}

export function getVapidPublicKey() {
  return publicKey || null;
}

export function isPushConfigured() {
  return configured;
}

export async function sendPushToSubscription(subscription, { title, body, url, tag }) {
  if (!configured) return;
  const payload = JSON.stringify({ title, body, url: url || '/', tag });
  try {
    await webPush.sendNotification(subscription, payload);
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      deletePushSubscriptionByEndpoint(subscription.endpoint);
    } else {
      console.error('push send failed:', err.statusCode, err.body || err.message);
    }
  }
}

export async function sendExpenseNotification({ group, expense, payerName, settledWithName }) {
  if (!configured) return;
  if (group.is_demo) return;

  const subs = getPushSubscriptionsForGroupMembers(group.id, expense.paid_by);
  if (!subs.length) return;

  const amount = formatAmount(expense.amount);
  const isSettlement = !!(expense.settled_with && settledWithName);
  const title = `New ${isSettlement ? 'payment' : 'expense'} in ${group.name}`;
  const body = isSettlement
    ? `${payerName} paid ${settledWithName} ${amount}`
    : `${payerName} added ${expense.name} · ${amount}`;

  const payload = JSON.stringify({
    title,
    body,
    url: `/groups/${group.id}/items/${expense.id}`,
    tag: `expense-${expense.id}`,
  });

  await Promise.all(subs.map(async sub => {
    const subscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    };
    try {
      await webPush.sendNotification(subscription, payload);
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        deletePushSubscriptionByEndpoint(sub.endpoint);
      } else {
        console.error('push send failed:', err.statusCode, err.body || err.message);
      }
    }
  }));
}

function formatAmount(v) {
  const n = parseFloat(v);
  if (n % 1 === 0) return '$' + n.toFixed(0);
  return '$' + n.toFixed(2);
}
