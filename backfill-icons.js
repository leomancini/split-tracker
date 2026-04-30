import 'dotenv/config';
import { getNonSettlementExpenses, updateExpenseClassification, setSettlementIcons } from './db.js';
import { classifyExpense } from './icon-picker.js';

const CONCURRENCY = 2;
const PER_REQUEST_DELAY_MS = 800;

async function run() {
  const settlementChanges = setSettlementIcons();
  if (settlementChanges) console.log(`Set ${settlementChanges} settlement rows to fa-dollar-sign.`);

  const rows = getNonSettlementExpenses();
  console.log(`Re-classifying ${rows.length} expenses (icon + category)...`);
  if (!rows.length) return;

  let done = 0;
  let failed = 0;

  async function worker(queue) {
    while (queue.length) {
      const row = queue.shift();
      try {
        const { icon, category } = await classifyExpense({ name: row.name });
        updateExpenseClassification(row.id, icon, category);
        done++;
        console.log(`[${done + failed}/${rows.length}] #${row.id} "${row.name}" → ${icon} / ${category}`);
      } catch (err) {
        failed++;
        console.error(`[${done + failed}/${rows.length}] #${row.id} failed:`, err.message);
      }
      if (queue.length) await new Promise(r => setTimeout(r, PER_REQUEST_DELAY_MS));
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
