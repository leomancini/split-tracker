import Anthropic from '@anthropic-ai/sdk';

// Curated list of Font Awesome 6 Free Solid icon class names.
// Haiku picks one of these to visually represent a transaction.
export const ICON_CHOICES = [
  // Food & drink
  'fa-utensils', 'fa-pizza-slice', 'fa-burger', 'fa-hotdog', 'fa-bowl-food',
  'fa-bowl-rice', 'fa-mug-saucer', 'fa-mug-hot', 'fa-wine-glass', 'fa-martini-glass',
  'fa-beer-mug-empty', 'fa-ice-cream', 'fa-cookie-bite', 'fa-cake-candles',
  'fa-apple-whole', 'fa-bread-slice', 'fa-cheese', 'fa-fish', 'fa-drumstick-bite',
  'fa-carrot', 'fa-egg',
  // Groceries & shopping
  'fa-cart-shopping', 'fa-basket-shopping', 'fa-bag-shopping', 'fa-store',
  'fa-gift', 'fa-shirt', 'fa-socks', 'fa-hat-cowboy',
  // Transport
  'fa-car', 'fa-taxi', 'fa-bus', 'fa-train', 'fa-train-subway', 'fa-plane',
  'fa-ship', 'fa-bicycle', 'fa-motorcycle', 'fa-gas-pump', 'fa-square-parking',
  'fa-road', 'fa-truck',
  // Travel & lodging
  'fa-hotel', 'fa-bed', 'fa-suitcase', 'fa-suitcase-rolling', 'fa-umbrella-beach',
  'fa-passport', 'fa-map-location-dot',
  // Entertainment
  'fa-film', 'fa-ticket', 'fa-masks-theater', 'fa-music', 'fa-headphones',
  'fa-gamepad', 'fa-dice', 'fa-bowling-ball', 'fa-futbol', 'fa-basketball',
  'fa-baseball', 'fa-golf-ball-tee', 'fa-person-skiing', 'fa-camera',
  // Home & utilities
  'fa-house', 'fa-bolt', 'fa-droplet', 'fa-fire', 'fa-wifi', 'fa-plug',
  'fa-temperature-half', 'fa-lightbulb', 'fa-trash', 'fa-broom', 'fa-couch',
  'fa-toilet-paper', 'fa-soap',
  // Health
  'fa-heart-pulse', 'fa-briefcase-medical', 'fa-pills', 'fa-tooth',
  'fa-dumbbell', 'fa-spa', 'fa-stethoscope',
  // Education & work
  'fa-graduation-cap', 'fa-book', 'fa-pen', 'fa-laptop', 'fa-desktop',
  'fa-briefcase', 'fa-print',
  // Pets, kids, misc
  'fa-dog', 'fa-cat', 'fa-paw', 'fa-baby', 'fa-child', 'fa-seedling', 'fa-tree',
  // Money / settlement
  'fa-dollar-sign', 'fa-money-bill', 'fa-credit-card', 'fa-piggy-bank',
  'fa-hand-holding-dollar',
  // Fallback
  'fa-receipt', 'fa-tag',
];

export const CATEGORY_CHOICES = [
  'food', 'transport', 'housing', 'entertainment', 'shopping', 'utilities', 'health', 'education', 'subscriptions', 'gifts', 'pets', 'general',
];

const SYSTEM_PROMPT = `For a transaction name, pick:
1. A single Font Awesome 6 Free Solid icon class that best visually represents it.
2. A single category that best classifies the transaction.

Return both as JSON. Use only values from the allowed lists.`;

const ICON_LIST_TEXT = ICON_CHOICES.join(', ');
const CATEGORY_LIST_TEXT = CATEGORY_CHOICES.join(', ');

const client = new Anthropic();

function isTransientError(err) {
  if (!err) return false;
  const status = err.status || err.statusCode;
  if (status === 429) return true;
  if (status >= 500 && status < 600) return true;
  if (status === 408) return true;
  // No HTTP status → likely a network error.
  if (!status) return true;
  return false;
}

const RETRY_DELAYS_MS = [1000, 3000];

export async function classifyExpense({ name }) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 96,
        system: [
          {
            type: 'text',
            text: `${SYSTEM_PROMPT}\n\nAllowed icons: ${ICON_LIST_TEXT}\n\nAllowed categories: ${CATEGORY_LIST_TEXT}`,
            cache_control: { type: 'ephemeral' },
          },
        ],
        output_config: {
          format: {
            type: 'json_schema',
            schema: {
              type: 'object',
              properties: {
                icon: { type: 'string', enum: ICON_CHOICES },
                category: { type: 'string', enum: CATEGORY_CHOICES },
              },
              required: ['icon', 'category'],
              additionalProperties: false,
            },
          },
        },
        messages: [
          {
            role: 'user',
            content: `Transaction name: "${name}"\n\nPick the best matching icon and category.`,
          },
        ],
      });

      for (const block of response.content) {
        if (block.type === 'text') {
          try {
            const parsed = JSON.parse(block.text);
            const icon = ICON_CHOICES.includes(parsed.icon) ? parsed.icon : 'fa-receipt';
            const category = CATEGORY_CHOICES.includes(parsed.category) ? parsed.category : 'general';
            return { icon, category };
          } catch {
            // fall through
          }
        }
      }
      return { icon: 'fa-receipt', category: 'general' };
    } catch (err) {
      lastErr = err;
      if (!isTransientError(err) || attempt === RETRY_DELAYS_MS.length) break;
      const delay = RETRY_DELAYS_MS[attempt];
      console.warn(`classifyExpense transient error (status=${err.status || err.statusCode || 'none'}), retrying in ${delay}ms:`, err.message);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
