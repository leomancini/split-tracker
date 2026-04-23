import 'dotenv/config';
import { getExpensesMissingIcon, updateExpenseIcon } from './db.js';
import { pickIcon } from './icon-picker.js';

const CONCURRENCY = 5;

async function run() {
  const rows = getExpensesMissingIcon();
  console.log(`Backfilling icons for ${rows.length} expenses...`);
  if (!rows.length) return;

  let done = 0;
  let failed = 0;

  async function worker(queue) {
    while (queue.length) {
      const row = queue.shift();
      try {
        const icon = await pickIcon({ name: row.name, category: row.category });
        updateExpenseIcon(row.id, icon);
        done++;
        console.log(`[${done + failed}/${rows.length}] #${row.id} "${row.name}" → ${icon}`);
      } catch (err) {
        failed++;
        console.error(`[${done + failed}/${rows.length}] #${row.id} failed:`, err.message);
      }
    }
  }

  const queue = [...rows];
  const workers = Array.from({ length: Math.min(CONCURRENCY, rows.length) }, () => worker(queue));
  await Promise.all(workers);

  console.log(`\nDone. ${done} updated, ${failed} failed.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
