# APTS E-Commerce Website & Real-Time Workload Generator

> **APTS** = A realistic commercial e-commerce storefront designed to generate high-fidelity production workloads for the **CacheX** caching layer.

---

## 🏛️ System Architecture

```
                         ┌──────────────────────────┐
                         │      APTS E-COMMERCE     │
                         │      Customer Website    │
                         │  (Sleek Dark Theme UI)   │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │       React Frontend     │
                         │    TypeScript + Vite     │
                         │       Tailwind CSS       │
                         └────────────┬─────────────┘
                                      │
                              HTTP REST Requests (x-session-id)
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │       APTS Backend       │
                         │     Node.js + Express    │
                         └────────────┬─────────────┘
                                      │
                          ┌───────────┴───────────┐
                          │                       │
                          ▼                       ▼
                 ┌─────────────────┐      ┌─────────────────┐
                 │   FUTURE CACHE  │      │   PostgreSQL    │
                 │      CacheX     │      │    Database     │
                 │                 │      │                 │
                 │  [Intercepts    │      │ Products (18+)  │
                 │   & benchmarks] │      │ Categories      │
                 └────────┬────────┘      │ Reviews         │
                          │               │ Flash Sales     │
                          └──────────────►│ Traffic Events  │
                                          └─────────────────┘

              ┌────────────────────────────────────┐
              │       TRAFFIC SIMULATOR            │
              │       (Headless Worker)            │
              │                                    │
              │ Virtual Customers (1..N)           │
              │ Real-World Browsing Personas       │
              │ Live Idle Detection Monitor        │
              │ Dynamic Modes (LOW/NORMAL/SURGE)   │
              └────────────────┬───────────────────┘
                               │
                               ▼
                         APTS Backend
```

---

## ✨ Features

### 🛍️ Commercial Storefront (No Admin/Auth Clutter)
- **Zero Login Friction**: Anonymous browser session IDs (`x-session-id`) manage Cart, Wishlist, and Orders automatically.
- **Color-Coordinated Dark Theme**: Sleek obsidian/slate backgrounds (`#090d16` & `#131c31`), crisp cyan accents (`#06b6d4`), and ruby flash sale badges (`#f43f5e`).
- **Amazon-Style Flash Sales**: Live ticking countdown timer (`02:41:17`), discount percentages (`44% OFF`), and claimed inventory progress bars (`82% Claimed`).
- **Product Catalog**: 18+ categories (Electronics, Computers, Gaming, Fashion, Home, Kitchen, Beauty, Sports, Books, Automotive, etc.) with HD photography, technical specs, and verified customer reviews.
- **Multi-Facet Filtering**: Live search, price range slider (₹500 - ₹1,00,000), brand selector, rating filters, and sorting.
- **Simulated Checkout**: 2-step checkout with address validation, simulated payment methods (UPI / Cards / NetBanking / COD), and order receipts (`#APTS-XXXXXX`).

### ⚡ Headless Traffic Simulator
- **Realistic Virtual Customers**:
  - **Customer 1 (Browser)**: Homepage → Category → Subcategory → Product Details → Reviews → Related.
  - **Customer 2 (Searcher)**: Search query → Filter → Product → Add to Cart.
  - **Customer 3 (Flash Hunter)**: Flash Sale → High-demand deal → Add to Cart → Simulated Checkout.
  - **Customer 4 (Wishlist Shopper)**: Search → View → Save to Wishlist → Related compare.
- **Dynamic Modes**:
  - `LOW`: ~20 requests/min (runs when real users are active).
  - `NORMAL`: ~200 requests/min (baseline workload).
  - `HIGH`: ~1,000 requests/min (stress test).
  - `SURGE`: ~5,000 requests/min (flash sale burst).
- **Idle Website Detection**:
  - Automatically monitors visitor activity via `/api/v1/traffic/activity`.
  - When real users browse, simulator scales down to `LOW`.
  - When inactive for > 2 min, automatically scales up to `NORMAL` / `HIGH`.
  - Guarantees CacheX always has a live workload to intercept!
- **Telemetry Logging**:
  - Records every request into PostgreSQL `traffic_events` table for downstream analytics and cache hit/miss evaluation.

---

## 🚀 Quickstart Guide (Run on Your Laptop)

### 1. Prerequisites
- **Node.js** v18.0 or higher
- **npm** (comes with Node.js)

---

### 2. Install Dependencies
In the extracted `apts-ecommerce` folder:

```bash
# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend

# Install traffic simulator dependencies
npm install --prefix traffic-simulator
```

---

### 3. Start Backend Server
In your first terminal window:

```bash
npm run dev:backend
```
> **Backend runs on**: `http://localhost:5000`
> 
> *Note on Database*: If `DATABASE_URL` is set, it connects to PostgreSQL and applies `src/database/schema.sql`. If unset, it automatically starts a zero-config local engine seeded with 18+ categories and products out of the box!

---

### 4. Start Customer Storefront
In your second terminal window:

```bash
npm run dev:frontend
```
> **Storefront runs on**: `http://localhost:3000` (or `http://localhost:5173`)
> 
> Open `http://localhost:3000` in your web browser to experience the dark-themed shopping experience!

---

### 5. Start Background Traffic Simulator
In your third terminal window:

```bash
# Default auto-adaptive workload (with idle detection)
npm run simulator

# Or run specific test workload modes:
npm run simulator:normal   # 200 req/min
npm run simulator:high     # 1,000 req/min
npm run simulator:surge    # 5,000 req/min burst
```
> The simulator displays a real-time terminal dashboard with RPS, latencies, active mode, and visitor idle timer!

---

## 📡 API Endpoint Reference (`/api/v1`)

| Endpoint | Method | Caching Characteristic | Description |
| :--- | :--- | :--- | :--- |
| `/products` | `GET` | Highly Cacheable (L1) | Filtered & paginated product catalog |
| `/products/:id` | `GET` | Highly Cacheable (L1) | Product specifications & details |
| `/products/:id/reviews`| `GET` | Medium Cacheable (L2) | Customer reviews |
| `/products/:id/related`| `GET` | Medium Cacheable (L2) | Related product recommendations |
| `/categories` | `GET` | Highly Cacheable (L1) | Categories tree |
| `/flash-sales` | `GET` | Dynamic Cache (L2) | Active flash sales with countdowns |
| `/deals` | `GET` | Highly Cacheable (L1) | Clearance discounts >= 35% |
| `/search?q=...` | `GET` | Medium Cacheable | Instant multi-faceted search |
| `/cart` | `GET` | Non-cacheable (private) | Session shopping cart |
| `/cart/items` | `POST` | Non-cacheable | Add item to cart |
| `/wishlist` | `GET` | Non-cacheable (private) | Saved items |
| `/checkout` | `POST` | Non-cacheable | Simulated order placement |
| `/traffic/activity` | `GET` | Dynamic monitor | Idle time & recommended mode |
| `/traffic/stats` | `GET` | Diagnostic | Telemetry events logged in DB |

---

## 📦 Project Directory Structure

```
apts-ecommerce/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── schema.sql         # PostgreSQL DDL
│   │   │   ├── db.ts              # PostgreSQL client + local fallback
│   │   │   ├── seed-data.ts       # 18+ categories & realistic products
│   │   │   └── types.ts           # TypeScript models
│   │   ├── routes/
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── search.ts
│   │   │   ├── flash-sales.ts
│   │   │   ├── cart.ts
│   │   │   ├── wishlist.ts
│   │   │   ├── orders.ts
│   │   │   └── traffic.ts
│   │   └── server.ts              # Express API & Activity Tracker
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Dark theme header & search
│   │   │   ├── FlashSaleSection.tsx # Countdown & claimed bar
│   │   │   ├── CountdownTimer.tsx # Ticking clock
│   │   │   ├── ProductCard.tsx    # Sleek dark product card
│   │   │   ├── FilterPanel.tsx    # Faceted sidebar
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductListingPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── WishlistPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrderConfirmationPage.tsx
│   │   │   └── FlashSalePage.tsx
│   │   ├── services/
│   │   │   ├── api.ts             # API client
│   │   │   └── session.ts         # Anonymous UUID manager
│   │   ├── context/
│   │   │   └── StoreContext.tsx   # Global store
│   │   ├── App.tsx
│   │   └── index.css              # Custom scrollbars & styles
│   ├── tailwind.config.js         # Color-coordinated dark palette
│   └── package.json
│
├── traffic-simulator/
│   ├── src/
│   │   └── simulator.ts           # Virtual customer personas & engine
│   └── package.json
│
├── scripts/
│   └── package-zip.js             # ZIP packaging tool
└── package.json                   # Root orchestrator
```

---

## 🎯 CacheX Demonstration Workflow

1. Start **APTS Backend** and **APTS Frontend**.
2. Run the **Traffic Simulator**:
   - The simulator creates steady baseline traffic mimicking 8 concurrent customer personas.
   - When you browse the website, the simulator auto-detects your presence and eases traffic to `LOW`.
   - When you stop clicking, the simulator automatically ramps back up to `NORMAL` and `HIGH`.
3. Connect **CacheX** between the Express Backend and PostgreSQL:
   - CacheX will intercept `/products`, `/categories`, and `/flash-sales`, achieving 95%+ cache hit ratios.
   - Cache hit/miss metrics and response time reductions can be proven using the `traffic_events` table data!
