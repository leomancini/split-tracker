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

const SYSTEM_PROMPT = `You pick a single Font Awesome 6 Free Solid icon that best visually represents a transaction name. Return only one of the allowed icon class names.`;

const ICON_LIST_TEXT = ICON_CHOICES.join(', ');

const client = new Anthropic();

export async function pickIcon({ name, category }) {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 64,
    system: [
      {
        type: 'text',
        text: `${SYSTEM_PROMPT}\n\nAllowed icons: ${ICON_LIST_TEXT}`,
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
          },
          required: ['icon'],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: 'user',
        content: `Transaction name: "${name}"${category && category !== 'general' ? `\nCategory hint: ${category}` : ''}\n\nPick the best matching icon.`,
      },
    ],
  });

  for (const block of response.content) {
    if (block.type === 'text') {
      try {
        const parsed = JSON.parse(block.text);
        if (parsed.icon && ICON_CHOICES.includes(parsed.icon)) return parsed.icon;
      } catch {
        // fall through
      }
    }
  }
  return 'fa-receipt';
}
