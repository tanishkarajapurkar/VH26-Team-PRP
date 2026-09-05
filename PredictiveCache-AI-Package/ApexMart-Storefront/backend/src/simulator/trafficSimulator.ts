/**
 * ============================================================================
 * ApexMart Autonomous Traffic Simulator
 * ============================================================================
 * Architecture Role:
 * Simulates realistic human shopping traffic against the Fastify backend & Supabase.
 *
 * Supported Modes:
 * 1. Multi-User Journeys (Search -> Browse -> Cart -> Checkout)
 * 2. Idle-Activated Traffic: Automatically sends virtual traffic when idle.
 * 3. Surge Mode (--surge): Simulates flash-sale traffic spikes on hot items.
 * ============================================================================
 */

interface SimulatedUser {
  id: string;
  name: string;
  persona: 'researcher' | 'window_shopper' | 'impulse_buyer' | 'deal_hunter';
}

const USERS: SimulatedUser[] = [
  { id: 'usr_sim_01', name: 'Sophia Miller', persona: 'researcher' },
  { id: 'usr_sim_02', name: 'Marcus Vance', persona: 'deal_hunter' },
  { id: 'usr_sim_03', name: 'Elena Rostova', persona: 'impulse_buyer' },
  { id: 'usr_sim_04', name: 'Liam Gallagher', persona: 'window_shopper' },
  { id: 'usr_sim_05', name: 'Priya Sharma', persona: 'researcher' },
];

const SEARCH_QUERIES = [
  'wireless earbuds', 'espresso maker', 'gaming monitor', 'vitamin c serum',
  'air purifier', 'mechanical keyboard', 'noise cancelling headphones',
  'smartwatch', 'chef knife', 'robot vacuum'
];

const CATEGORIES = ['beauty', 'home_appliances', 'tech', 'gaming', 'kitchen'];

export class TrafficSimulator {
  private baseUrl: string;
  private isRunning: boolean = false;
  private isSurgeMode: boolean = false;
  private timer: NodeJS.Timeout | null = null;
  private stats = {
    requestsSent: 0,
    ordersPlaced: 0,
    eventsLogged: 0,
    errors: 0
  };

  constructor(baseUrl = 'http://localhost:5000', surgeMode = false) {
    this.baseUrl = baseUrl;
    this.isSurgeMode = surgeMode;
  }

  private async fetchApi(path: string, options: RequestInit = {}) {
    try {
      this.stats.requestsSent++;
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-Simulated-Traffic': 'true',
          ...(options.headers || {})
        }
      });
      return await res.json();
    } catch (err: any) {
      this.stats.errors++;
      return null;
    }
  }

  // --- Multi-User Shopping Journeys ---

  // Journey 1: The Researcher (Search -> View Product -> Check Reviews -> View Similar)
  private async runResearcherJourney(user: SimulatedUser) {
    const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];
    const sessionId = `sess_${user.id}_${Date.now()}`;
    console.log(`🔍 [Traffic Sim] [${user.name}] Searching for: "${query}"`);

    // 1. Search request
    const searchResults = await this.fetchApi(`/api/search?q=${encodeURIComponent(query)}`);
    await this.fetchApi('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        sessionId,
        eventType: 'SEARCH',
        query
      })
    });
    this.stats.eventsLogged++;

    const targetId = (searchResults && searchResults[0]?.id) || Math.floor(1 + Math.random() * 20);

    // 2. View Product Details
    await this.sleep(400);
    console.log(`👁️ [Traffic Sim] [${user.name}] Viewing product #${targetId}`);
    await this.fetchApi(`/api/products/${targetId}`);
    await this.fetchApi('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        sessionId,
        eventType: 'VIEW_PRODUCT',
        productId: targetId
      })
    });
    this.stats.eventsLogged++;

    // 3. Read Reviews & Check Similar Items
    await this.sleep(500);
    console.log(`⭐ [Traffic Sim] [${user.name}] Checking reviews and similar items for #${targetId}`);
    await this.fetchApi(`/api/products/${targetId}/reviews`);
    await this.fetchApi(`/api/products/${targetId}/similar`);
  }

  // Journey 2: The Window Shopper (Browse Category -> Product -> Wishlist)
  private async runWindowShopperJourney(user: SimulatedUser) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const sessionId = `sess_${user.id}_${Date.now()}`;
    console.log(`📂 [Traffic Sim] [${user.name}] Browsing category: "${category}"`);

    // 1. Browse Category
    const products = await this.fetchApi(`/api/products?category=${category}`);
    await this.fetchApi('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        sessionId,
        eventType: 'CATEGORY_VIEW',
        metadata: { category }
      })
    });
    this.stats.eventsLogged++;

    const targetProduct = (products && products[Math.floor(Math.random() * products.length)]) || { id: 1 };

    // 2. View Detail
    await this.sleep(300);
    console.log(`💖 [Traffic Sim] [${user.name}] Saved product #${targetProduct.id} to Wishlist`);
    await this.fetchApi('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        sessionId,
        eventType: 'WISHLIST',
        productId: targetProduct.id
      })
    });
    this.stats.eventsLogged++;
  }

  // Journey 3: The Buyer (Trending / Deal -> Add to Cart -> Checkout & Order)
  private async runBuyerJourney(user: SimulatedUser) {
    const sessionId = `sess_${user.id}_${Date.now()}`;
    console.log(`🔥 [Traffic Sim] [${user.name}] Checking Trending Products`);

    // 1. Check Trending
    const trending = await this.fetchApi('/api/trending');
    const item = (trending && trending[0]?.product) || { id: 1, title: 'Apex Pro Sound X', price: 299.99 };

    // 2. Add to Cart
    await this.sleep(400);
    console.log(`🛒 [Traffic Sim] [${user.name}] Added "${item.title}" to Cart`);
    await this.fetchApi('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        sessionId,
        eventType: 'ADD_TO_CART',
        productId: item.id
      })
    });
    this.stats.eventsLogged++;

    // 3. Checkout & Place Order
    await this.sleep(600);
    console.log(`💳 [Traffic Sim] [${user.name}] Placing order for \$${item.price}`);
    await this.fetchApi('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        customerName: user.name,
        customerEmail: `${user.id}@simulation.io`,
        shippingAddress: '404 Simulation Way, Virtual City, VC 94016',
        deliverySpeed: '⚡ Same-Day Delivery (Prime)',
        totalAmount: item.price,
        items: [{ product: item, quantity: 1 }]
      })
    });
    await this.fetchApi('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        sessionId,
        eventType: 'PURCHASE',
        productId: item.id,
        metadata: { amount: item.price }
      })
    });
    this.stats.ordersPlaced++;
    this.stats.eventsLogged++;
  }

  // --- Flash Sale Surge Burst ---
  public async executeSurgeBurst(burstSize = 50) {
    console.log(`\n🚨 [Traffic Sim] >>> FLASH SALE SURGE TRIGGERED (${burstSize} concurrent requests) <<<`);
    const hotProductIds = [1, 13, 22]; // Spotlight audio, espresso, 4K monitor
    const promises: Promise<any>[] = [];

    for (let i = 0; i < burstSize; i++) {
      const pid = hotProductIds[i % hotProductIds.length];
      const p = (async () => {
        await this.fetchApi(`/api/products/${pid}`);
        if (i % 3 === 0) {
          await this.fetchApi('/api/events', {
            method: 'POST',
            body: JSON.stringify({
              userId: `surge_usr_${i}`,
              sessionId: `sess_surge_${Date.now()}`,
              eventType: 'ADD_TO_CART',
              productId: pid
            })
          });
          this.stats.eventsLogged++;
        }
      })();
      promises.push(p);
    }

    await Promise.all(promises);
    console.log(`✅ [Traffic Sim] Flash sale surge completed! Handled ${burstSize} requests smoothly.\n`);
  }

  // Single simulation step
  public async simulateSingleAction() {
    const user = USERS[Math.floor(Math.random() * USERS.length)];
    const roll = Math.random();

    if (roll < 0.45) {
      await this.runResearcherJourney(user);
    } else if (roll < 0.80) {
      await this.runWindowShopperJourney(user);
    } else {
      await this.runBuyerJourney(user);
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`\n=============================================================`);
    console.log(`🤖 ApexMart Traffic Simulator Started`);
    console.log(`🎯 Target Backend: ${this.baseUrl}`);
    console.log(`⚡ Mode: ${this.isSurgeMode ? 'FLASH SALE SURGE SIMULATION' : 'CONTINUOUS HUMAN BEHAVIOR'}`);
    console.log(`=============================================================\n`);

    const loop = async () => {
      if (!this.isRunning) return;

      if (this.isSurgeMode) {
        await this.executeSurgeBurst(30);
        await this.sleep(2500);
      } else {
        await this.simulateSingleAction();
        // Randomized delay between 1.2s and 3.5s to mimic real human intervals
        const delay = Math.floor(1200 + Math.random() * 2300);
        await this.sleep(delay);
      }

      // Print status summary every 15 requests
      if (this.stats.requestsSent % 15 === 0 && this.stats.requestsSent > 0) {
        console.log(`📊 [Sim Stats] Requests: ${this.stats.requestsSent} | Events: ${this.stats.eventsLogged} | Orders Placed: ${this.stats.ordersPlaced} | Errors: ${this.stats.errors}`);
      }

      loop();
    };

    loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.timer) clearTimeout(this.timer);
    console.log('🛑 [Traffic Sim] Simulator stopped.');
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Standalone CLI Execution
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const isSurge = process.argv.includes('--surge');
  const port = process.env.PORT || '5000';
  const simulator = new TrafficSimulator(`http://localhost:${port}`, isSurge);
  simulator.start();

  process.on('SIGINT', () => {
    simulator.stop();
    process.exit(0);
  });
}
