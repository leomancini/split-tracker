import webPush from 'web-push';

const keys = webPush.generateVAPIDKeys();
console.log('Add these to your .env:');
console.log('');
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log('VAPID_CONTACT_EMAIL=mailto:you@example.com');
