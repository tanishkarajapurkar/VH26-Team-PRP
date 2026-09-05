# ApexMart | Amazon-like Storefront (Website 1) & Traffic Simulation Engine

An Obsidian Dark, high-performance Amazon-style e-commerce platform backed by **Node.js/Fastify** and **Supabase (PostgreSQL)**, featuring a modular architecture designed to seamlessly integrate Cache and AI engines in the future, plus an **Autonomous Traffic Simulator** that generates virtual user activity during idle periods.

---

## Architecture Overview

Today, Website 1 and its Traffic Simulator communicate directly with Supabase:

```
                 WEBSITE 1
             Amazon-like Store
              (React + Vite)
                     │
                     ▼
               Backend / API
                 (Fastify)
                     │
                     ▼
                 SUPABASE
              (PostgreSQL DB)
                     ▲
                     │
            Traffic Simulator
       (Idle + Multi-User Journeys)
```

### Future-Proof Plug-and-Play Design
Later, Cache and AI engines will be inserted into the backend service layer **without rebuilding or modifying any frontend code**:

```
                 WEBSITE 1
                     │
                     ▼
               Backend / API
                     │
              ┌──────┴──────┐
              ▼             ▼
         CACHE ENGINE    AI ENGINE
              │             │
              └──────┬──────┘
                     ▼
                  SUPABASE
```

---

## Directory & File Structure

```
apexmart-v1/
├── start-all.bat                <-- One-click Windows runner (Starts backend & frontend)
├── run-traffic-simulator.bat    <-- One-click Traffic Simulator runner
├── run-surge-simulator.bat      <-- One-click Flash-Sale Traffic Spike simulator
├── package.json                 <-- Root workspace configuration
├── README.md                    <-- Complete system documentation
│
├── backend/                     <-- Node.js / Fastify API Server
│   ├── .env.example             <-- Supabase credentials template
│   ├── .env                     <-- Local environment config
│   ├── package.json             <-- Fastify, @supabase/supabase-js dependencies
│   ├── tsconfig.json            <-- NodeNext TypeScript config
│   └── src/
│       ├── server.ts            <-- Fastify server, CORS, and Auto-Idle detector
│       ├── db/
│       │   ├── schema.sql       <-- Complete DDL for 12 Supabase tables + seed SQL
│       │   ├── seedData.ts      <-- 25+ real products across 5 Amazon departments
│       │   └── supabase.ts      <-- Supabase client with seamless in-memory fallback
│       ├── services/
│       │   ├── productService.ts        <-- [FUTURE CACHE ENGINE INSERTION POINT]
│       │   ├── recommendationService.ts <-- [FUTURE AI ENGINE INSERTION POINT]
│       │   ├── trendingService.ts       <-- Dynamic scoring from user_events stream
│       │   ├── eventService.ts          <-- Behavioral event telemetry collector
│       │   └── cartService.ts           <-- Cart & order management
│       ├── routes/
│       │   ├── products.ts      <-- GET /api/products, /api/products/:id, /api/categories
│       │   ├── recommendations.ts<-- GET /api/recommendations
│       │   ├── trending.ts      <-- GET /api/trending
│       │   ├── search.ts        <-- GET /api/search?q=...
│       │   ├── cart.ts          <-- GET/POST /api/cart
│       │   ├── orders.ts        <-- GET/POST /api/orders
│       │   └── events.ts        <-- POST /api/events (raw user telemetry)
│       └── simulator/
│           └── trafficSimulator.ts <-- Multi-user journeys, idle traffic & surge bursts
│
└── frontend/                    <-- Obsidian Dark React + Vite Storefront
    ├── index.html               <-- App entry point with Inter typography
    ├── package.json             <-- React, Lucide Icons, Vite, Tailwind
    ├── tailwind.config.js       <-- Obsidian Dark & Prime Gold color palette
    ├── vite.config.ts           <-- Vite configuration with /api backend proxy
    └── src/
        ├── App.tsx              <-- Navigation, layout & toast notifications
        ├── main.tsx             <-- React DOM bootstrap
        ├── index.css            <-- Custom dark scrollbars & card hover animations
        ├── types/index.ts       <-- TypeScript models (Product, Order, Review, etc.)
        ├── context/
        │   └── CartContext.tsx  <-- Global cart, wishlist, and notification state
        ├── services/
        │   ├── api.ts           <-- Backend REST API client
        │   └── tracker.ts       <-- Live event tracking (dispatches to user_events)
        ├── components/
        │   ├── Header.tsx       <-- Amazon-style search, location, wishlist & cart
        │   ├── SubNav.tsx       <-- Department menu & Prime delivery promo banner
        │   ├── ProductCard.tsx  <-- Card with prime tag, ratings, discount, quick-add
        │   ├── CartDrawer.tsx   <-- Slide-over cart drawer with quantity controls
        │   ├── InvoiceModal.tsx <-- Amazon-style printable PDF / tax receipt
        │   └── Footer.tsx       <-- Multi-column footer with back-to-top
        └── pages/
            ├── HomePage.tsx            <-- Hero banner, category grid, trending, deals
            ├── ProductListingPage.tsx  <-- Sidebar filters (rating, price, prime)
            ├── ProductDetailPage.tsx   <-- Buy box, image gallery, specs & reviews
            ├── CheckoutPage.tsx        <-- Delivery speeds, payment options, order placement
            ├── OrderConfirmationPage.tsx<-- Live visual package delivery tracker
            └── MyOrdersPage.tsx        <-- Order history, reordering & invoice viewer
```

---

## The 12 Supabase Tables

All table structures and seed statements are defined in `backend/src/db/schema.sql`:

1. `users`: Customer accounts and prime memberships.
2. `categories`: Departments (Beauty, Home Appliances, Tech, Kitchen, Gaming).
3. `products`: Comprehensive catalog with prices, stock, ratings, prime eligibility.
4. `reviews`: Verified buyer reviews with star ratings.
5. `carts`: Active shopping carts.
6. `cart_items`: Cart line items with selected variants.
7. `wishlists`: Customer saved item IDs.
8. `orders`: Placed orders with status and totals.
9. `order_items`: Snapshot of purchased products per order.
10. `user_events`: Raw behavioral telemetry stream (`VIEW_PRODUCT`, `SEARCH`, `ADD_TO_CART`, `WISHLIST`, `PURCHASE`).
11. `recommendations`: Recommendation associations (AI engine training dataset).
12. `trending_products`: Dynamic engagement scores.

---

## Connecting Your Remote Supabase Project

1. Open your Supabase Dashboard: [https://supabase.com](https://supabase.com)
2. Create a new project.
3. Open the **SQL Editor** in Supabase and paste the contents of `backend/src/db/schema.sql`, then click **Run**.
4. Copy your **Project URL** and **anon public key** from Project Settings > API.
5. Paste them into `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-public-key
   PORT=5000
   ```
> **Zero-Friction Fallback**: If `.env` is not configured, the backend runs seamlessly using its built-in in-memory mirror of all 12 tables. It never crashes!

---

## Autonomous Traffic Simulator & Idle Trigger

### 1. Built-in Auto-Idle Traffic Detector
When the Fastify backend is running, it continuously checks user activity. If no customer traffic arrives for **> 6 seconds**, the backend automatically triggers virtual shoppers in the background:
- **Sophia (Researcher)**: Searches catalog, views product details, checks reviews and similar items.
- **Elena (Window Shopper)**: Browses department categories and saves items to wishlist.
- **Marcus (Buyer)**: Scans trending items, adds to cart, and places completed orders.

### 2. Standalone Traffic Simulator
Run the simulator in a dedicated terminal window:
```bash
# Windows one-click:
run-traffic-simulator.bat

# Or via npm:
npm run simulate
```

### 3. Flash-Sale Surge Mode
Simulates flash-sale traffic spikes with dozens of concurrent requests hitting spotlight products:
```bash
# Windows one-click:
run-surge-simulator.bat

# Or via npm:
npm run surge
```

---

## Quick Start Guide

### Option 1: One-Click Windows Runner
Double-click `start-all.bat`. It will automatically install dependencies and launch both the backend and storefront!

### Option 2: Manual Terminal Commands
1. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
