# Amazon-Style Store & Real-Time Traffic Simulator (Website 1)

A full-stack, Amazon-like e-commerce application built with **React + Vite**, a modular **Node.js + Fastify** API backend, a single **Supabase PostgreSQL** database, and an independent **Real-Time Traffic Simulator** capable of continuous idle traffic and flash sale bursts.

Designed from the ground up to support Phase 2 extension (Cache Engine & AI Engine) with **zero modifications** to the customer-facing website or API contracts.

---

## Architecture Overview

### Current Architecture (Implemented Now - Website 1)

```
                       WEBSITE 1
               ┌───────────────────────┐
               │ React 18 + Vite + TS  │
               │   Amazon Store UI     │
               └───────────┬───────────┘
                           │ HTTP
                           ▼
               ┌───────────────────────┐
               │  Node.js + Fastify    │
               │       Backend         │
               └───────────┬───────────┘
                           │
  ┌────────────────────────┼────────────────────────┐
  │                        │                        │
  ▼                        ▼                        ▼
ProductService        EventService        RecommendationService
  │                        │                        │
  └────────────────────────┼────────────────────────┘
                           ▼
               ┌───────────────────────┐
               │   SUPABASE DATABASE   │
               │   (PostgreSQL 15+)    │
               └───────────▲───────────┘
                           │ HTTP
               ┌───────────┴───────────┐
               │   TRAFFIC SIMULATOR   │
               │  (Continuous & Surge) │
               └───────────────────────┘
```

### Future Architecture (Phase 2 - Zero Website Rewrite)

```
                        WEBSITE 1
                            │
                            ▼
                      Backend / API
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
       CACHE ENGINE                     AI ENGINE
      (Redis/In-Memory)           (Personalized Model)
            │                               │
            └───────────────┬───────────────┘
                            ▼
                         SUPABASE
```

---

## Key Features

### 1. Amazon-Style Customer Website (`frontend/`)
- **Header**: Amazon dark header bar (`#131921`), Deliver-to location modal, Search bar with category dropdown, Account & Lists dropdown (with quick active user switcher), Returns & Orders, Cart badge count, Wishlist counter.
- **Subnav**: `#232f3e` secondary navigation bar with "All" drawer, Today's Deals, Best Sellers, and direct Category links.
- **Homepage**:
  - Hero Deals Banner carousel with Prime badges and bottom fade gradient.
  - 4-quadrant Deal & Category cards overlaid on the hero banner.
  - 🔥 **Trending Now**: Real-time horizontal slider displaying trending products calculated from user activity.
  - **Recommended for You**: Tailored product recommendations.
  - **Best Sellers**: Featured high-rated items.
- **Category & Search Results (`ProductListingPage`)**:
  - Left filter sidebar: Category filter, Prime eligibility toggle, Customer Review filter (4★ & up), Price range radio buttons.
  - Sort dropdown: Featured, Price Low to High, Price High to Low, Avg. Customer Review.
- **Product Details (`ProductDetailPage`)**:
  - Image gallery with thumbnails and main zoomable preview.
  - Amazon's Choice badge, star ratings, review count, list price, deal discount %.
  - Right **Buy Box**: In Stock indicator, Quantity selector, "Add to Cart", "Buy Now", "Add to List".
  - Feature bullet points and technical specifications.
  - Customer Reviews breakdown (star progress bars 5★ down to 1★) with verified purchase review cards.
  - "Customers who viewed this item also viewed" similar products carousel.
- **Cart (`CartPage`)**:
  - Free Shipping progress bar, item thumbnails, quantity adjustment, delete, save for later.
  - Subtotal box with "Proceed to checkout" button.
- **Checkout (`CheckoutPage`)**:
  - Multi-step checkout: Shipping Address, Payment Method (Amazon Prime Visa, Amazon Pay), Order Review.
  - "Place your order" action, generating real Order records in Supabase and firing `PURCHASE` telemetry events.
- **Orders (`OrdersPage`)**:
  - Order history with order ID, date, items, total, and "Buy it again" quick re-order buttons.
- **Wishlist (`WishlistPage`)**:
  - Saved items with "Add to Cart" and "Remove" actions.

### 2. Fastify Backend & Clean Service Layer (`backend/`)
- Encapsulated service interfaces with future Phase 2 hooks:
  - `ProductService`: Product queries, categories, search. *(Hook ready for Cache Engine)*
  - `RecommendationService`: Popular and personalized items. *(Hook ready for AI Engine)*
  - `TrendingService`: Computes `Trending Score = (Views * 1) + (Searches * 1) + (Carts * 2) + (Purchases * 5)`.
  - `EventService`: Captures raw user telemetry stream (`user_events`).
  - `CartService` & `OrderService`: Cart persistence and checkout processing.
  - `WishlistService`: Wishlist management.
- **Dual-Mode Database**:
  - Connects to **live Supabase** if `SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided in `.env`.
  - Automatically activates **built-in local in-memory store** with the exact same seed data if run offline, guaranteeing zero friction when unzipped!

### 3. Real-Time Traffic Simulator (`traffic-simulator/`)
- Independent standalone process that runs separately from the browser.
- **Idle Continuous Mode**: Keeps running even when no human is on the site, sending steady realistic requests (Homepage -> Search -> Product -> Reviews -> Cart -> Events).
- **Traffic Surge / Burst Mode**: Simulates flash sales with bursts (100 -> 150 -> 300 -> 700 -> 1500 -> 3000 req/s) hammering hot products.
- Live ANSI terminal dashboard displaying RPS, total requests, events dispatched, latency, and success/error rates.
- *Strictly complies with the prompt: No cache dashboard or AI panels on Website 1.*

---

## Project Structure

```
amazon-store-system/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── client.ts         # Supabase & In-memory dual-mode adapter
│   │   │   ├── seed-data.ts      # Seed catalog, reviews, users, categories
│   │   │   └── types.ts          # TypeScript database models
│   │   ├── routes/
│   │   │   ├── cart.ts           # /api/cart
│   │   │   ├── categories.ts     # /api/categories
│   │   │   ├── events.ts         # /api/events (Behavioral tracking)
│   │   │   ├── orders.ts         # /api/orders
│   │   │   ├── products.ts       # /api/products, /api/products/:id, /reviews, /similar
│   │   │   ├── recommendations.ts# /api/recommendations
│   │   │   ├── search.ts         # /api/search?q=...
│   │   │   ├── trending.ts       # /api/trending, /api/trending/recalculate
│   │   │   └── wishlist.ts       # /api/wishlist
│   │   ├── services/
│   │   │   ├── cart.service.ts
│   │   │   ├── event.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── product.service.ts        # Phase 2 Cache Engine Hook
│   │   │   ├── recommendation.service.ts # Phase 2 AI Engine Hook
│   │   │   ├── trending.service.ts
│   │   │   └── wishlist.service.ts
│   │   └── server.ts             # Fastify server bootstrap & trending background cron
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DealsGrid.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx        # Search, categories, cart badge, user profile switcher
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── RecommendationsSection.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── TrendingSlider.tsx# 🔥 Trending Now slider
│   │   ├── context/
│   │   │   └── StoreContext.tsx  # User state, cart, wishlist, event tracking
│   │   ├── pages/
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── ProductListingPage.tsx
│   │   │   └── WishlistPage.tsx
│   │   ├── services/
│   │   │   └── api.ts            # Client API & trackUserEvent()
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── traffic-simulator/
│   ├── src/
│   │   └── simulator.ts          # Continuous & burst traffic generator
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/
│   ├── README.md                 # Supabase setup guide
│   ├── schema.sql                # 12 PostgreSQL tables and indexes
│   └── seed.sql                  # Initial catalog, users, categories, reviews, trending
│
├── scripts/
│   └── package-zip.js            # Bundler to generate amazon-store-system.zip
├── package.json                  # Root npm scripts
└── README.md
```

---

## Quickstart Guide (Run on Your Laptop)

### 1. Extract the Archive
Extract `amazon-store-system.zip` into any folder on your laptop.

### 2. Install Dependencies
Open a terminal in the project folder and run:
```bash
# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# Install traffic simulator
cd ../traffic-simulator
npm install
```

### 3. Start the Backend & Frontend
In one terminal, start the backend:
```bash
cd backend
npm run dev
```
The Fastify API will start on **`http://localhost:5000`**.

In a second terminal, start the React frontend:
```bash
cd frontend
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the Amazon-style store!

---

## Connecting to Supabase (Optional, Ready Anytime)

The project includes an embedded seed store so it works offline out of the box. To connect your live Supabase project:

1. Create a free project at [https://supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Paste and run `supabase/schema.sql`.
4. Paste and run `supabase/seed.sql`.
5. In **Project Settings** -> **API**, copy your **Project URL** and **anon key**.
6. Put them in `backend/.env`:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
7. Restart the backend (`npm run dev`). It will output:
   `[DB] Connected to Live Supabase PostgreSQL database.`

---

## Running the Traffic Simulator

Open a third terminal to run the simulator independently:

### Continuous Background Traffic (Idle System)
Simulates continuous user journeys (browsing, searching, reading reviews, adding to cart):
```bash
cd traffic-simulator
npm run continuous
```

### Flash Sale Traffic Surge (Burst Mode)
Simulates high-velocity concurrent bursts hammering hot products:
```bash
cd traffic-simulator
npm run surge
```

### Custom Simulator Options
You can configure requests-per-second, target URL, and duration:
```bash
npx tsx src/simulator.ts --mode=surge --rps=500 --duration=60
npx tsx src/simulator.ts --mode=continuous --rps=30
```

Watch the terminal dashboard display real-time RPS, requests sent, user events persisted, and response latencies!

---

## User Behavior Tracking (`POST /api/events`)

Every user action on the frontend and in the simulator automatically records a structured event in `user_events`:

| Event Type | Trigger |
|---|---|
| `VIEW_PRODUCT` | User opens a product details page |
| `SEARCH` | User searches a keyword (e.g. `laptop`, `headphones`) |
| `CLICK_PRODUCT` | User clicks any product card |
| `ADD_TO_CART` | User adds an item to their shopping cart |
| `REMOVE_FROM_CART` | User removes an item from their cart |
| `WISHLIST` | User toggles an item in their wishlist |
| `PURCHASE` | User completes checkout order |
| `CATEGORY_VIEW` | User browses a category page |

---

## Trending Score Formula

The Fastify server periodically calculates trending product scores based on activity:
$$\text{Trending Score} = (\text{Views} \times 1) + (\text{Searches} \times 1) + (\text{Cart Additions} \times 2) + (\text{Purchases} \times 5)$$

Results are stored in `trending_products` and displayed in the **🔥 Trending Now** section on the homepage.
You can also manually trigger a recalculation at any time:
```bash
curl -X POST http://localhost:5000/api/trending/recalculate
```
