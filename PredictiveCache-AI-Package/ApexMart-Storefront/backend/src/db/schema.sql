-- =========================================================================
-- APEXMART SUPABASE DATABASE SCHEMA — 12 CORE TABLES
-- Paste into Supabase Dashboard -> SQL Editor to build all tables & seed data!
-- =========================================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(20) DEFAULT '📦'
);

-- 3. PRODUCTS (25+ Flagship Items across Beauty, Tech, Home, Kitchen, Gaming)
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    msrp NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    reviews_count INT DEFAULT 100,
    in_stock BOOLEAN DEFAULT TRUE,
    is_prime BOOLEAN DEFAULT TRUE,
    image TEXT NOT NULL,
    tag VARCHAR(50),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. CARTS
CREATE TABLE IF NOT EXISTS public.carts (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) DEFAULT 'user_101',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. CART_ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
    id SERIAL PRIMARY KEY,
    cart_id VARCHAR(50) REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1
);

-- 7. WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) DEFAULT 'user_101',
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id)
);

-- 8. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) DEFAULT 'user_101',
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    shipping_address TEXT NOT NULL,
    delivery_speed VARCHAR(100) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PAID',
    tracking_step INT DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. ORDER_ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES public.products(id),
    title VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
);

-- 10. USER_EVENTS (Raw event stream for future AI model consumption)
CREATE TABLE IF NOT EXISTS public.user_events (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- VIEW_PRODUCT, SEARCH, CLICK_PRODUCT, ADD_TO_CART, REMOVE_FROM_CART, WISHLIST, PURCHASE, CATEGORY_VIEW
    product_id INT,
    query TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. RECOMMENDATIONS (Future-proof table populated by database popularity now, AI later)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) DEFAULT 1.0,
    reason VARCHAR(100) DEFAULT 'Popular in your area',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. TRENDING_PRODUCTS (Calculated from user_events score: Views + Searches + AddToCart*3 + Purchases*5)
CREATE TABLE IF NOT EXISTS public.trending_products (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,
    trending_score NUMERIC(10, 2) DEFAULT 0,
    rank INT DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_products ENABLE ROW LEVEL SECURITY;

-- Allow public access policies for seamless client interaction
CREATE POLICY "Public Read All" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Events Insert" ON public.user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Orders All" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public OrderItems All" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Public Recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Public Trending" ON public.trending_products FOR SELECT USING (true);

-- =========================================================================
-- SEED DATA: CATEGORIES, USERS & 25+ PRODUCTS
-- =========================================================================

INSERT INTO public.users (id, name, email) VALUES ('user_101', 'Alex Chen', 'alex.chen@example.com') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (name, slug, icon) VALUES
('Electronics', 'electronics', '🎧'),
('Home Appliances', 'home-appliances', '🧹'),
('Beauty & Care', 'beauty', '✨'),
('Kitchen & Dining', 'kitchen', '☕'),
('Gaming & VR', 'gaming', '🎮'),
('Smart Wearables', 'wearables', '⌚')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.products (id, title, brand, category, price, msrp, rating, reviews_count, in_stock, is_prime, image, tag, description) VALUES
(1, 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'Sony', 'Electronics', 319.99, 399.99, 4.90, 12480, true, true, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', 'Best Seller', 'Dual processors and 8 microphones for world-class noise cancellation, ultra-comfortable design, and 30-hour battery life.'),
(2, 'Apple MacBook Pro 16" (M3 Pro, 18GB RAM, 512GB SSD)', 'Apple', 'Electronics', 1999.00, 2299.00, 4.95, 4890, true, true, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80', 'Amazon Choice', 'The M3 Pro chip powers breathtaking speed for heavy development, 8K video rendering, and multi-tasking with 22h battery life.'),
(3, 'Bose QuietComfort Ultra Spatial Audio Earbuds', 'Bose', 'Electronics', 249.00, 299.00, 4.75, 3120, true, true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80', 'Top Rated', 'Spatial audio places sound directly in front of you. CustomTune technology personalizes sound to the shape of your ears.'),
(4, 'Samsung Odyssey OLED G9 49" Curved Gaming Monitor', 'Samsung', 'Electronics', 1199.99, 1799.99, 4.88, 1420, true, true, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80', 'Deal of Day', 'Dual QHD 240Hz 0.03ms response time with Neo Quantum Processor Pro for stunning cinematic color accuracy.'),
(5, 'Sony Alpha A7 IV Full-Frame Mirrorless Camera', 'Sony', 'Electronics', 2298.00, 2498.00, 4.92, 1450, true, true, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80', 'Pro Creator', '33MP Exmor R back-illuminated sensor with AI real-time autofocus, 4K 60p 10-bit recording, and 5-axis optical stabilization.'),
(6, 'Logitech MX Master 3S Wireless Performance Mouse', 'Logitech', 'Electronics', 99.99, 119.99, 4.85, 22400, true, true, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80', 'Editor''s Pick', '8K DPI optical track-on-glass sensor, whisper-quiet clicks, and MagSpeed electromagnetic scroll wheel.'),
(7, 'Dyson V15 Detect Cordless Vacuum Cleaner', 'Dyson', 'Home Appliances', 649.99, 749.99, 4.86, 5280, true, true, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=80', 'Best Seller', 'Laser reveals microscopic dust. Piezo sensor counts and measures dust particles in real-time, automatically increasing suction.'),
(8, 'iRobot Roomba Combo j9+ Robot Vacuum & Mop', 'iRobot', 'Home Appliances', 899.00, 1399.00, 4.70, 2310, true, true, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=80', 'Save $500', 'Cleans carpets and hard floors seamlessly with auto-retract mopping pad, self-emptying base, and smart hazard avoidance.'),
(9, 'Breville Barista Touch Espresso Machine', 'Breville', 'Home Appliances', 999.95, 1099.95, 4.90, 3840, true, true, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80', 'Barista Choice', 'Automated touchscreen with pre-programmed cafe drinks, ThermoJet 3-second heat up, and micro-foam automatic milk texturing.'),
(10, 'Philips Hue Smart LED Starter Kit (4 Bulbs + Bridge)', 'Philips', 'Home Appliances', 159.99, 199.99, 4.80, 8450, true, true, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80', 'Smart Home', '16 million colors and shades of white light, fully compatible with Alexa, Apple HomeKit, and Google Home.'),
(11, 'Levoit Core 400S Smart True HEPA Air Purifier', 'Levoit', 'Home Appliances', 189.99, 219.99, 4.85, 16900, true, true, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&auto=format&fit=crop&q=80', 'Amazon Choice', 'Cleans spaces up to 1,980 sq ft in one hour. Smart laser dust sensor and H13 True HEPA filtration captures 99.97% of airborne particles.'),
(12, 'Ninja Foodi 10-in-1 XL Pro Air Fryer & Convection Oven', 'Ninja', 'Home Appliances', 229.99, 299.99, 4.82, 11200, true, true, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80', 'Hot Deal', 'True Surround Convection cooks up to 10X faster than a traditional oven. Air fry, roast, bake, toast, broil, and dehydrate.'),
(13, 'Dyson Airwrap Multi-Styler Complete Long', 'Dyson', 'Beauty & Care', 499.99, 599.99, 4.90, 8920, true, true, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80', 'Luxury Pick', 'Styles and dries hair simultaneously using the Coanda airflow effect with zero extreme heat damage. Includes 6 attachments.'),
(14, 'La Mer Crème de la Mer Moisturizing Cream (60ml)', 'La Mer', 'Beauty & Care', 380.00, 420.00, 4.88, 2650, true, true, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80', 'Prestige Beauty', 'Infused with cell-renewing Miracle Broth™, this ultra-rich cream immerses skin in deep soothing moisture, healing dryness.'),
(15, 'Estée Lauder Advanced Night Repair Serum', 'Estee Lauder', 'Beauty & Care', 115.00, 135.00, 4.85, 14800, true, true, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80', 'Best Seller', 'Deep-penetrating serum reduces the look of multiple signs of aging caused by environmental stressors.'),
(16, 'Maison Francis Kurkdjian Baccarat Rouge 540 Eau de Parfum', 'MFK', 'Beauty & Care', 325.00, 350.00, 4.94, 1890, true, true, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80', 'Iconic Fragrance', 'Luminous and sophisticated, lays on skin like an amber, floral and woody breeze with jasmine, saffron, and cedarwood.'),
(17, 'Oral-B iO Series 9 Electric Toothbrush', 'Oral-B', 'Beauty & Care', 249.99, 329.99, 4.78, 6400, true, true, 'https://images.unsplash.com/photo-1559591937-e1032397e556?w=500&auto=format&fit=crop&q=80', 'Dental Pro', 'Revolutionary magnetic iO technology for professional clean feeling. 3D teeth tracking with AI.'),
(18, 'Olaplex No. 3 Hair Perfector Treatment (250ml)', 'Olaplex', 'Beauty & Care', 30.00, 35.00, 4.79, 38900, true, true, 'https://images.unsplash.com/photo-1608248597359-5561b369c762?w=500&auto=format&fit=crop&q=80', 'Hair Cult', 'Repairs damaged and compromised hair, improves hair health, texture, and strength with patented bond chemistry.'),
(19, 'Le Creuset Enameled Cast Iron Round Dutch Oven 5.5 Qt', 'Le Creuset', 'Kitchen & Dining', 379.95, 419.95, 4.95, 7800, true, true, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80', 'French Classic', 'The gold standard in cookware. Exceptional heat retention and distribution with sand interior enamel.'),
(20, 'Vitamix A3500 Ascent Series Smart Professional Blender', 'Vitamix', 'Kitchen & Dining', 649.95, 699.95, 4.91, 4200, true, true, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=80', 'Chef Grade', 'Five program settings for smoothies, hot soups, dips, and frozen desserts with wireless connectivity.'),
(21, 'Shun Classic 8-Inch Japanese Chef''s Knife', 'Shun', 'Kitchen & Dining', 169.95, 209.95, 4.88, 3100, true, true, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=80', 'Japanese Craft', '68 micro-layers of Damascus cladding protect high-carbon VG-MAX core with 16-degree double bevel.'),
(22, 'Sony PlayStation 5 Slim Console (1TB SSD)', 'Sony', 'Gaming & VR', 449.99, 499.99, 4.88, 19800, true, true, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80', 'Hot Deal', 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback.'),
(23, 'Meta Quest 3 512GB Breakthrough Mixed Reality Headset', 'Meta', 'Gaming & VR', 499.99, 649.99, 4.82, 5600, true, true, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=80', 'Top VR', 'Transform your home into an exciting new playground where virtual elements blend seamlessly with reality.'),
(24, 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)', 'Apple', 'Smart Wearables', 749.00, 799.00, 4.90, 1680, true, true, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 'Flagship', 'Rugged aerospace-grade titanium case with 3000-nit Always-On display, precision GPS, and 72-hour battery life.'),
(25, 'Garmin epix Pro (Gen 2) Sapphire Smartwatch 47mm', 'Garmin', 'Smart Wearables', 899.99, 999.99, 4.91, 890, true, true, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 'Endurance Pro', 'Stunning AMOLED display, built-in LED flashlight, Hill Score, Endurance Score, and weeks of battery life.')
ON CONFLICT (id) DO NOTHING;

-- Initial Trending Data Seed
INSERT INTO public.trending_products (product_id, trending_score, rank) VALUES
(1, 98.5, 1), (13, 94.2, 2), (22, 91.0, 3), (7, 88.6, 4), (2, 85.0, 5), (14, 82.3, 6)
ON CONFLICT DO NOTHING;

-- Initial Recommendations Seed
INSERT INTO public.recommendations (user_id, product_id, score, reason) VALUES
('user_101', 1, 9.8, 'Based on your browsing in Audio'),
('user_101', 3, 9.5, 'Frequently viewed with Sony WH-1000XM5'),
('user_101', 7, 9.2, 'Top rated in Home Appliances'),
('user_101', 13, 9.1, 'Trending in Luxury Beauty'),
('user_101', 2, 8.9, 'Flagship Creator Laptop')
ON CONFLICT DO NOTHING;
