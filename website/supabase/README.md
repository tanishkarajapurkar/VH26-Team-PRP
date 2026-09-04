# Supabase Database Setup Guide

This folder contains the complete PostgreSQL database definitions for **Website 1 (Amazon-like Store)**.

## Database Tables Overview

| Table Name | Description |
|---|---|
| `users` | User accounts and simulation profiles |
| `categories` | Product taxonomy and navigation slugs |
| `products` | Full Amazon-style product catalog with pricing, stock, specs |
| `reviews` | Customer ratings, verified purchase tags, and comments |
| `carts` | User shopping cart sessions |
| `cart_items` | Products in cart with quantities |
| `wishlists` | User saved wishlist items |
| `orders` | Completed checkout orders with shipping address & payment info |
| `order_items` | Line items for completed orders |
| `user_events` | Behavioral tracking stream (`VIEW_PRODUCT`, `SEARCH`, `ADD_TO_CART`, `PURCHASE`, etc.) |
| `recommendations` | Future-proof recommendations table (consumable by AI Engine) |
| `trending_products` | Real-time trending scores calculated from activity (`Views + Searches + Cart additions + Purchases`) |

---

## How to Set Up in Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. In the left sidebar, click on **SQL Editor**.
3. Click **New query**, paste the contents of `supabase/schema.sql`, and click **Run**.
4. Once completed, create another query, paste the contents of `supabase/seed.sql`, and click **Run**.
5. Go to **Project Settings** -> **API**:
   - Copy **Project URL**
   - Copy **anon public key** (or `service_role` key)
6. Paste these into `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

> **Note**: The backend also includes an automatic fallback data repository. If `SUPABASE_URL` is not set or left blank in `.env`, the backend automatically initializes an in-memory/local database with the exact same seed data so you can test and run immediately offline without any setup!
