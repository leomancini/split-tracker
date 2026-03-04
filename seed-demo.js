// Seed demo groups with realistic data
// Run: node seed-demo.js
// Requires the database to exist (start the server first)

import Database from 'better-sqlite3';

const db = new Database('./data/split-tracker.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Ensure is_demo column exists
try {
  db.exec('ALTER TABLE groups ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0');
} catch (e) { /* already exists */ }

// Mark existing "Trip to Barcelona" as demo
db.prepare("UPDATE groups SET is_demo = 1 WHERE name = 'Trip to Barcelona'").run();

// Delete existing demo groups (except Trip to Barcelona) to re-seed cleanly
const existingDemoGroups = db.prepare("SELECT id FROM groups WHERE is_demo = 1 AND name != 'Trip to Barcelona'").all();
for (const g of existingDemoGroups) {
  db.prepare('DELETE FROM expenses WHERE group_id = ?').run(g.id);
  db.prepare('DELETE FROM group_members WHERE group_id = ?').run(g.id);
  db.prepare('DELETE FROM group_invites WHERE group_id = ?').run(g.id);
  db.prepare('DELETE FROM groups WHERE id = ?').run(g.id);
}

// Find the real logged-in user (first non-demo user)
const realUser = db.prepare("SELECT * FROM users WHERE google_id NOT LIKE 'demo_%' ORDER BY id ASC LIMIT 1").get();
if (!realUser) {
  console.error('No real user found in the database. Start the server and log in first.');
  process.exit(1);
}
console.log(`Using real user: ${realUser.name} (${realUser.email})`);

// --- Create demo users ---
const demoUsers = [
  { google_id: 'demo_alice',   email: 'alice.martin@demo.split',   name: 'Alice Martin',   avatar_url: 'https://i.pravatar.cc/150?u=alice' },
  { google_id: 'demo_bob',     email: 'bob.johnson@demo.split',    name: 'Bob Johnson',    avatar_url: 'https://i.pravatar.cc/150?u=bob' },
  { google_id: 'demo_carla',   email: 'carla.diaz@demo.split',     name: 'Carla Diaz',     avatar_url: 'https://i.pravatar.cc/150?u=carla' },
  { google_id: 'demo_dan',     email: 'dan.kim@demo.split',        name: 'Dan Kim',        avatar_url: 'https://i.pravatar.cc/150?u=dan' },
  { google_id: 'demo_emma',    email: 'emma.wilson@demo.split',    name: 'Emma Wilson',    avatar_url: 'https://i.pravatar.cc/150?u=emma' },
  { google_id: 'demo_frank',   email: 'frank.lee@demo.split',      name: 'Frank Lee',      avatar_url: 'https://i.pravatar.cc/150?u=frank' },
  { google_id: 'demo_grace',   email: 'grace.nguyen@demo.split',   name: 'Grace Nguyen',   avatar_url: 'https://i.pravatar.cc/150?u=grace' },
  { google_id: 'demo_hiro',    email: 'hiro.tanaka@demo.split',    name: 'Hiro Tanaka',    avatar_url: 'https://i.pravatar.cc/150?u=hiro' },
  { google_id: 'demo_isla',    email: 'isla.brown@demo.split',     name: 'Isla Brown',     avatar_url: 'https://i.pravatar.cc/150?u=isla' },
];

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (google_id, email, name, avatar_url) VALUES (?, ?, ?, ?)
`);
const selectUser = db.prepare('SELECT id FROM users WHERE google_id = ?');

const userIds = {};
for (const u of demoUsers) {
  insertUser.run(u.google_id, u.email, u.name, u.avatar_url);
  userIds[u.google_id] = selectUser.get(u.google_id).id;
}

// --- Helper to create a demo group ---
// realUserRole: 'owner' | 'member' — determines the real user's role in the group
function createDemoGroup(name, ownerKey, memberKeys, expenses, realUserRole) {
  const isRealOwner = realUserRole === 'owner';
  const ownerId = isRealOwner ? realUser.id : userIds[ownerKey];

  const groupId = db.prepare('INSERT INTO groups (name, created_by, is_demo) VALUES (?, ?, 1)').run(name, ownerId).lastInsertRowid;
  db.prepare('INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)').run(groupId, ownerId, 'owner');

  // Add the demo "owner" as a regular member if the real user is the actual owner
  if (isRealOwner) {
    db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)').run(groupId, userIds[ownerKey], 'member');
  }

  for (const mk of memberKeys) {
    db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)').run(groupId, userIds[mk], 'member');
  }

  // Add real user as member if not already the owner
  if (!isRealOwner) {
    db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)').run(groupId, realUser.id, 'member');
  }

  for (const exp of expenses) {
    const paidById = exp.paidBy === 'me' ? realUser.id : userIds[exp.paidBy];
    const daysAgo = exp.daysAgo || Math.floor(Math.random() * 30);
    db.prepare(`
      INSERT INTO expenses (group_id, paid_by, name, amount, category, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now', ?))
    `).run(groupId, paidById, exp.name, exp.amount, exp.category, `-${daysAgo} days`);
  }

  const totalMembers = memberKeys.length + 2; // demo members + demo owner/member + real user
  console.log(`  Created "${name}" with ${totalMembers} members (real user: ${realUserRole}) and ${expenses.length} expenses`);
}

// --- Seed demo groups ---
console.log('Seeding demo groups...');

// 2 people: me + Frank
createDemoGroup('Ski Trip', 'demo_frank', [], [
  { name: 'Cabin rental (3 nights)',  amount: 720,   category: 'housing',       paidBy: 'demo_frank', daysAgo: 14 },
  { name: 'Lift tickets (2x)',        amount: 300,   category: 'entertainment', paidBy: 'me',         daysAgo: 14 },
  { name: 'Gas (drive up)',           amount: 65.40, category: 'transport',     paidBy: 'me',         daysAgo: 14 },
  { name: 'Groceries for cabin',      amount: 93.15, category: 'food',          paidBy: 'demo_frank', daysAgo: 13 },
  { name: 'Ski rentals',              amount: 180,   category: 'entertainment', paidBy: 'me',         daysAgo: 13 },
  { name: 'Dinner at Lodge',          amount: 127.50, category: 'food',         paidBy: 'demo_frank', daysAgo: 12 },
  { name: 'Gas (drive back)',         amount: 58.90, category: 'transport',     paidBy: 'me',         daysAgo: 11 },
], 'member');

// 3 people: me, Grace, Hiro
createDemoGroup('Office Lunch Club', 'demo_grace', ['demo_hiro'], [
  { name: 'Sushi place',        amount: 62.00,  category: 'food', paidBy: 'demo_grace', daysAgo: 1 },
  { name: 'Thai takeout',       amount: 48.50,  category: 'food', paidBy: 'me',         daysAgo: 3 },
  { name: 'Pizza Friday',       amount: 38.00,  category: 'food', paidBy: 'demo_hiro',  daysAgo: 5 },
  { name: 'Burrito bowls',      amount: 52.80,  category: 'food', paidBy: 'demo_grace', daysAgo: 8 },
  { name: 'Pho place',          amount: 44.00,  category: 'food', paidBy: 'me',         daysAgo: 10 },
  { name: 'Sandwich shop',      amount: 36.75,  category: 'food', paidBy: 'demo_hiro',  daysAgo: 12 },
], 'member');

// 4 people: me, Alice, Bob, Isla
createDemoGroup('Weekend in Vegas', 'demo_alice', ['demo_bob', 'demo_isla'], [
  { name: 'Hotel (2 nights)',    amount: 389,    category: 'housing',       paidBy: 'me',         daysAgo: 21 },
  { name: 'Flights',             amount: 624,    category: 'transport',     paidBy: 'demo_alice', daysAgo: 45 },
  { name: 'Show tickets',        amount: 270,    category: 'entertainment', paidBy: 'demo_isla',  daysAgo: 21 },
  { name: 'Dinner at steakhouse', amount: 185.40, category: 'food',         paidBy: 'me',         daysAgo: 20 },
  { name: 'Uber rides',          amount: 47.80,  category: 'transport',     paidBy: 'demo_bob',   daysAgo: 20 },
  { name: 'Brunch',              amount: 78.60,  category: 'food',          paidBy: 'demo_isla',  daysAgo: 19 },
], 'owner');

// 6 people: me, Carla, Dan, Emma, Frank, Grace (Frank repeats from Ski Trip, Grace from Lunch Club)
createDemoGroup('Apartment 4B', 'demo_carla', ['demo_dan', 'demo_emma', 'demo_frank', 'demo_grace'], [
  { name: 'March rent',         amount: 2400,  category: 'housing',   paidBy: 'me',          daysAgo: 2 },
  { name: 'Electric bill',      amount: 142.50, category: 'utilities', paidBy: 'demo_dan',    daysAgo: 5 },
  { name: 'Internet',           amount: 59.99, category: 'utilities', paidBy: 'me',           daysAgo: 5 },
  { name: 'Groceries (Trader Joe\'s)', amount: 87.32, category: 'food', paidBy: 'demo_emma',  daysAgo: 3 },
  { name: 'Dish soap & sponges', amount: 12.49, category: 'general',  paidBy: 'demo_frank',   daysAgo: 7 },
  { name: 'February rent',      amount: 2400,  category: 'housing',   paidBy: 'me',           daysAgo: 32 },
  { name: 'Gas bill',           amount: 78.20, category: 'utilities', paidBy: 'demo_grace',   daysAgo: 35 },
  { name: 'Groceries (Costco)', amount: 156.80, category: 'food',     paidBy: 'demo_carla',   daysAgo: 10 },
], 'owner');

console.log('Done!');
db.close();
