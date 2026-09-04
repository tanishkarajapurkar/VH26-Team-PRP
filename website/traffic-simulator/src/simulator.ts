/**
 * ============================================================================
 * REAL-TIME TRAFFIC SIMULATOR (WEBSITE 1)
 * ============================================================================
 * Generates continuous realistic user traffic and traffic surges
 * directly hitting the Fastify backend and Supabase database.
 *
 * Usage:
 *   npm run continuous
 *   npm run surge
 *   node dist/simulator.js --mode=surge --rps=500 --duration=30
 * ============================================================================
 */

interface SimStats {
  startTime: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  eventsDispatched: number;
  lastSecondRequests: number;
  currentRps: number;
  latencies: number[];
  activeUsers: number;
}

const stats: SimStats = {
  startTime: Date.now(),
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  eventsDispatched: 0,
  lastSecondRequests: 0,
  currentRps: 0,
  latencies: [],
  activeUsers: 0
};

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc: Record<string, string>, arg) => {
  const [key, val] = arg.replace(/^--/, '').split('=');
  acc[key] = val !== undefined ? val : 'true';
  return acc;
}, {});

const BASE_URL = args.url || process.env.API_URL || 'http://localhost:5000';
const MODE = args.mode || 'continuous'; // 'continuous' | 'surge'
let TARGET_RPS = parseInt(args.rps || (MODE === 'surge' ? '150' : '15'), 10);
const DURATION_SEC = parseInt(args.duration || '0', 10); // 0 = infinite
const SURGE_RAMP = args['surge-ramp'] === 'true' || (MODE === 'surge' && !args.rps);

const VIRTUAL_USERS = [
  'user_101',
  'user_102',
  'user_103',
  'user_104',
  'sim_user_201',
  'sim_user_202',
  'sim_user_203',
  'sim_user_204',
  'sim_user_205',
  'sim_user_206'
];

const SEARCH_TERMS = ['laptop', 'headphones', 'keyboard', 'smartwatch', 'speaker', 'monitor', '4k', 'anc', 'gaming'];
const FLASH_SALE_PRODUCTS = ['prod_laptop_pro', 'prod_headphones_anc', 'prod_keyboard_mech', 'prod_smartwatch_ultra'];

async function sendRequest(method: string, path: string, body?: any): Promise<boolean> {
  const start = Date.now();
  stats.totalRequests++;
  stats.lastSecondRequests++;

  try {
    const url = `${BASE_URL}${path}`;
    const opts: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AmazonStore-TrafficSimulator/1.0'
      }
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(url, opts);
    const latency = Date.now() - start;
    stats.latencies.push(latency);
    if (stats.latencies.length > 500) stats.latencies.shift();

    if (res.ok) {
      stats.successfulRequests++;
      if (path.includes('/events')) {
        stats.eventsDispatched++;
      }
      return true;
    } else {
      stats.failedRequests++;
      return false;
    }
  } catch (err) {
    stats.failedRequests++;
    return false;
  }
}

// ----------------------------------------------------------------------------
// REALISTIC USER JOURNEYS
// ----------------------------------------------------------------------------

// Journey 1: Search Laptop -> View Details -> Read Reviews -> Add to Cart
async function runJourney1(userId: string) {
  stats.activeUsers++;
  try {
    await sendRequest('GET', '/api/products');
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'CATEGORY_VIEW',
      categoryId: 'cat_computers'
    });

    await sendRequest('GET', '/api/search?q=laptop');
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'SEARCH',
      searchQuery: 'laptop'
    });

    await sendRequest('GET', '/api/products/prod_laptop_pro');
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'VIEW_PRODUCT',
      productId: 'prod_laptop_pro'
    });

    await sendRequest('GET', '/api/products/prod_laptop_pro/reviews');

    await sendRequest('POST', '/api/cart', {
      userId,
      productId: 'prod_laptop_pro',
      quantity: 1
    });
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'ADD_TO_CART',
      productId: 'prod_laptop_pro'
    });
  } finally {
    stats.activeUsers--;
  }
}

// Journey 2: Homepage -> Category -> Product -> Wishlist
async function runJourney2(userId: string) {
  stats.activeUsers++;
  try {
    await sendRequest('GET', '/api/categories');
    await sendRequest('GET', '/api/products?categoryId=cat_audio');
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'CATEGORY_VIEW',
      categoryId: 'cat_audio'
    });

    await sendRequest('GET', '/api/products/prod_headphones_anc');
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'VIEW_PRODUCT',
      productId: 'prod_headphones_anc'
    });

    await sendRequest('POST', '/api/wishlist', {
      userId,
      productId: 'prod_headphones_anc'
    });
  } finally {
    stats.activeUsers--;
  }
}

// Journey 3: Search Headphones -> Cart -> Checkout -> Purchase
async function runJourney3(userId: string) {
  stats.activeUsers++;
  try {
    const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
    await sendRequest('GET', `/api/search?q=${term}`);
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'SEARCH',
      searchQuery: term
    });

    const targetProduct = 'prod_headphones_anc';
    await sendRequest('GET', `/api/products/${targetProduct}`);
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'VIEW_PRODUCT',
      productId: targetProduct
    });

    await sendRequest('POST', '/api/cart', {
      userId,
      productId: targetProduct,
      quantity: 1
    });

    await sendRequest('GET', `/api/cart?userId=${userId}`);

    await sendRequest('POST', '/api/orders', {
      userId,
      shippingAddress: {
        fullName: 'Virtual Shopper',
        street: '456 Traffic Simulator Blvd',
        city: 'Cloud City',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      paymentMethod: 'One-Click Prime Checkout'
    });
  } finally {
    stats.activeUsers--;
  }
}

// Journey 4: Browse Trending & Recommendations
async function runJourney4(userId: string) {
  stats.activeUsers++;
  try {
    await sendRequest('GET', '/api/trending');
    await sendRequest('GET', `/api/recommendations?userId=${userId}`);
    await sendRequest('GET', '/api/products/prod_smartwatch_ultra/similar');
    await sendRequest('POST', '/api/events', {
      userId,
      eventType: 'CLICK_PRODUCT',
      productId: 'prod_smartwatch_ultra'
    });
  } finally {
    stats.activeUsers--;
  }
}

// Flash Sale Surge: High-speed burst on hot deal products
async function runSurgeBurst(userId: string) {
  stats.activeUsers++;
  try {
    const hotProduct = FLASH_SALE_PRODUCTS[Math.floor(Math.random() * FLASH_SALE_PRODUCTS.length)];
    await Promise.all([
      sendRequest('GET', `/api/products/${hotProduct}`),
      sendRequest('POST', '/api/events', {
        userId,
        eventType: 'VIEW_PRODUCT',
        productId: hotProduct,
        metadata: { campaign: 'FLASH_SALE_BURST' }
      }),
      sendRequest('POST', '/api/cart', {
        userId,
        productId: hotProduct,
        quantity: 1
      })
    ]);
  } finally {
    stats.activeUsers--;
  }
}

// ----------------------------------------------------------------------------
// SIMULATOR SCHEDULER & CLI DISPLAY
// ----------------------------------------------------------------------------
let running = true;
const rampSteps = [100, 150, 300, 700, 1500, 3000, 5000];
let currentStepIdx = 0;
let rampTimer: NodeJS.Timeout | null = null;

if (SURGE_RAMP) {
  TARGET_RPS = rampSteps[0];
  rampTimer = setInterval(() => {
    currentStepIdx = (currentStepIdx + 1) % rampSteps.length;
    TARGET_RPS = rampSteps[currentStepIdx];
  }, 5000); // Step up every 5s
}

// RPS Counter loop
setInterval(() => {
  stats.currentRps = stats.lastSecondRequests;
  stats.lastSecondRequests = 0;
}, 1000);

// CLI Status Print
setInterval(() => {
  const avgLatency =
    stats.latencies.length > 0
      ? (stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length).toFixed(1)
      : '0.0';

  const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);

  // Clear console or format line
  process.stdout.write(
    `\r⏱️  ${elapsed}s | Mode: [${MODE.toUpperCase()}] | Target: ${TARGET_RPS} RPS | Actual: ${stats.currentRps} req/s | Total: ${stats.totalRequests} | Events: ${stats.eventsDispatched} | Latency: ${avgLatency}ms | Success: ${stats.successfulRequests} | Err: ${stats.failedRequests} `
  );
}, 1000);

// Main generation loop
async function trafficLoop() {
  console.log(`\n===============================================================`);
  console.log(`🚀 TRAFFIC SIMULATOR INITIALIZED`);
  console.log(`   Target Backend : ${BASE_URL}`);
  console.log(`   Mode           : ${MODE.toUpperCase()} ${SURGE_RAMP ? '(Automated Surge Ramp: 100 -> 150 -> 300 -> 700 -> 1500 -> 3000 req/s)' : ''}`);
  console.log(`   Target Rate    : ${TARGET_RPS} requests/sec`);
  if (DURATION_SEC > 0) {
    console.log(`   Duration       : ${DURATION_SEC} seconds`);
  } else {
    console.log(`   Duration       : Continuous (Idle Background Traffic)`);
  }
  console.log(`===============================================================\n`);

  const startTime = Date.now();

  while (running) {
    if (DURATION_SEC > 0 && (Date.now() - startTime) / 1000 >= DURATION_SEC) {
      console.log(`\n\n✅ Simulator completed planned duration (${DURATION_SEC}s). Exiting.`);
      process.exit(0);
    }

    const batchSize = Math.max(1, Math.floor(TARGET_RPS / 10));
    const promises: Promise<any>[] = [];

    for (let i = 0; i < batchSize; i++) {
      const user = VIRTUAL_USERS[Math.floor(Math.random() * VIRTUAL_USERS.length)];

      if (MODE === 'surge') {
        promises.push(runSurgeBurst(user));
      } else {
        const roll = Math.random();
        if (roll < 0.35) promises.push(runJourney1(user));
        else if (roll < 0.6) promises.push(runJourney2(user));
        else if (roll < 0.8) promises.push(runJourney3(user));
        else promises.push(runJourney4(user));
      }
    }

    await Promise.all(promises);
    // Sleep roughly 100ms between batches
    await new Promise(r => setTimeout(r, 100));
  }
}

// Graceful exit handler
process.on('SIGINT', () => {
  console.log('\n\n🛑 Simulator stopping...');
  running = false;
  if (rampTimer) clearInterval(rampTimer);
  setTimeout(() => process.exit(0), 500);
});

trafficLoop().catch(err => {
  console.error('\nSimulator error:', err);
  process.exit(1);
});
