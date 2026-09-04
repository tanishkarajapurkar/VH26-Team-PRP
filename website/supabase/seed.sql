-- ============================================================================
-- SEED DATA FOR WEBSITE 1 (AMAZON-LIKE STORE)
-- ============================================================================

-- Clean existing data
TRUNCATE TABLE trending_products, recommendations, user_events, order_items, orders, wishlists, cart_items, carts, reviews, products, categories, users CASCADE;

-- 1. USERS
INSERT INTO users (id, email, name, avatar_url) VALUES
('user_101', 'alex.miller@example.com', 'Alex Miller', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('user_102', 'sarah.connor@example.com', 'Sarah Connor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('user_103', 'david.beck@example.com', 'David Beck', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('user_104', 'emily.watson@example.com', 'Emily Watson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150');

-- 2. CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url) VALUES
('cat_electronics', 'Electronics', 'electronics', 'Cutting-edge consumer tech, cameras, displays and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('cat_computers', 'Computers & Laptops', 'computers', 'High performance laptops, ultra-wide monitors, and accessories', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
('cat_audio', 'Headphones & Audio', 'audio', 'Noise cancelling headphones, wireless earbuds and studio speakers', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
('cat_smart_home', 'Smart Home', 'smart-home', 'Smart security, intelligent lighting, thermostats and assistants', 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400'),
('cat_gaming', 'Gaming & Consoles', 'gaming', 'Next-gen gaming consoles, mechanical keyboards and wireless mice', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'),
('cat_wearables', 'Smart Wearables', 'wearables', 'Fitness trackers, luxury smartwatches and health monitors', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400');

-- 3. PRODUCTS
INSERT INTO products (id, title, description, price, original_price, rating, review_count, category_id, stock, images, features, is_prime, is_best_seller) VALUES
(
    'prod_laptop_pro',
    'ZenithPro 16" Ultra-Thin Laptop (M3 Max, 32GB RAM, 1TB SSD)',
    'Experience unprecedented processing power and all-day battery life with the revolutionary ZenithPro 16-inch. Engineered with Liquid Retina XDR display, studio-quality 6-speaker sound system, and advanced thermal management.',
    1999.99,
    2299.99,
    4.9,
    2840,
    'cat_computers',
    85,
    '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"]'::jsonb,
    '["16.2-inch Liquid Retina XDR display with ProMotion", "16-core CPU and 40-core GPU powerhouse", "Up to 22 hours battery life on single charge", "3x Thunderbolt 4 ports, HDMI, SDXC card slot"]'::jsonb,
    true,
    true
),
(
    'prod_laptop_air',
    'AuraBook 14" Lightweight Laptop (Core Ultra 7, 16GB RAM, 512GB SSD)',
    'Ultra-portable elegance meeting incredible efficiency. Weighs only 2.7 lbs with an all-aluminum unibody chassis, whisper-quiet fanless cooling, and high-clarity 1080p web camera.',
    1099.00,
    1249.00,
    4.7,
    1420,
    'cat_computers',
    120,
    '["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"]'::jsonb,
    '["Ultra-slim 11.3mm profile", "Anti-reflective IPS display with 100% sRGB", "Fast-charge to 50% in 30 minutes", "Backlit ergonomic keyboard with fingerprint ID"]'::jsonb,
    true,
    false
),
(
    'prod_headphones_anc',
    'AuraSound X-1000 Noise-Cancelling Wireless Headphones',
    'Industry-leading active noise cancellation with 8 microphones and dual processors. Premium Hi-Res LDAC audio codec support and luxurious memory foam earcups for marathon listening.',
    348.00,
    399.99,
    4.8,
    6250,
    'cat_audio',
    210,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"]'::jsonb,
    '["Adaptive Dual Noise Cancellation engine", "40 hours battery life with ANC enabled", "Speak-to-chat auto pausing technology", "Multipoint connection pairing 2 devices seamlessly"]'::jsonb,
    true,
    true
),
(
    'prod_earbuds_pro',
    'SonicPulse True Wireless ANC Earbuds with MagSafe Case',
    'Crystal-clear spatial audio with dynamic head tracking. Sweat and water-resistant with comfortable silicone ear tips in 4 sizes.',
    199.50,
    249.00,
    4.6,
    3890,
    'cat_audio',
    340,
    '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800", "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800"]'::jsonb,
    '["Immersive 3D Spatial Audio", "Transparency mode with natural voice passthrough", "30-hour total playtime with USB-C/Qi case", "Active wind noise reduction"]'::jsonb,
    true,
    false
),
(
    'prod_monitor_4k',
    'UltraView 34" Curved WQHD USB-C Ergonomic Hub Monitor',
    'Expansive 1500R curved display with 144Hz refresh rate, 99% DCI-P3 color reproduction, and 90W USB-C Power Delivery single-cable setup for laptops.',
    479.99,
    599.99,
    4.7,
    870,
    'cat_computers',
    45,
    '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800", "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800"]'::jsonb,
    '["34-inch 3440 x 1440 Ultrawide resolution", "Built-in KVM switch for multiple PCs", "90W USB-C PD charging cable included", "Height, tilt and swivel adjustable stand"]'::jsonb,
    true,
    false
),
(
    'prod_smart_speaker',
    'EchoSphere Max Smart Speaker with High-Fidelity Room-Filling Sound',
    'Transform your home with vibrant acoustics and smart assistant automation. Features 3-way speaker array, Zigbee smart home hub built-in, and privacy shutter.',
    129.99,
    159.99,
    4.5,
    5420,
    'cat_smart_home',
    500,
    '["https://images.unsplash.com/photo-1543512214-318c7553f230?w=800", "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800"]'::jsonb,
    '["Room adaptive tuning for pristine acoustic balance", "Built-in Zigbee & Matter smart hub", "Voice control lights, temperature, and locks", "Mic off privacy physical button"]'::jsonb,
    true,
    true
),
(
    'prod_smart_thermostat',
    'NovaClim Smart Learning Thermostat with Touch Glass Display',
    'Save energy effortlessly. Learns your home temperature schedule and programs itself. Compatible with 95% of 24V heating and cooling systems.',
    189.00,
    229.00,
    4.7,
    1920,
    'cat_smart_home',
    110,
    '["https://images.unsplash.com/photo-1567928815104-b7980ee5032e?w=800"]'::jsonb,
    '["Saves up to 23% on energy bills annually", "Remote control via iOS and Android apps", "Auto-Away eco mode when house is empty", "High-res round OLED display with metal bezel"]'::jsonb,
    true,
    false
),
(
    'prod_smart_cam',
    'GuardCam 2K Outdoor Solar-Powered Security Camera (2-Pack)',
    'Continuous solar charging, 2K color night vision, AI person and vehicle detection with zero monthly subscription fees.',
    169.99,
    219.99,
    4.6,
    2150,
    'cat_smart_home',
    95,
    '["https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800"]'::jsonb,
    '["Integrated solar panel delivers perpetual power", "Crisp 2K HDR resolution with spotlight color night vision", "Encrypted local storage with no cloud fees", "IP67 all-weather waterproof rating"]'::jsonb,
    true,
    false
),
(
    'prod_keyboard_mech',
    'VortexStrike RGB Wireless Mechanical Gaming Keyboard',
    'Custom hot-swappable linear red switches, PBT double-shot keycaps, aluminum top plate, and ultra-low latency 2.4GHz wireless connection.',
    119.99,
    149.99,
    4.8,
    3110,
    'cat_gaming',
    180,
    '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800", "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800"]'::jsonb,
    '["Hot-swappable linear mechanical switches", "Tri-mode connectivity: Bluetooth 5.2, 2.4GHz, USB-C", "Per-key programmable RGB illumination", "Sound-dampening silicon acoustic pad"]'::jsonb,
    true,
    true
),
(
    'prod_mouse_gaming',
    'HyperGlide Superlight 49g Wireless Esports Gaming Mouse',
    'Featherlight 49-gram chassis engineered for lightning flicks. Equipped with 32,000 DPI optical sensor and 4000Hz polling rate capability.',
    89.99,
    109.99,
    4.9,
    1840,
    'cat_gaming',
    230,
    '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800"]'::jsonb,
    '["Ultra-lightweight 49 grams honeycomb-free shell", "32K DPI optical sensor with 99.8% resolution accuracy", "Pure PTFE skates for zero-friction glide", "80-hour battery life with rapid USB-C charging"]'::jsonb,
    true,
    false
),
(
    'prod_smartwatch_ultra',
    'TitanApex Rugged GPS Adventure Smartwatch (Titanium Case)',
    'Precision dual-frequency GPS, 100m water resistance, ECG heart sensor, body temperature monitoring, and up to 14 days expedition battery life.',
    399.00,
    499.00,
    4.8,
    4190,
    'cat_wearables',
    150,
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"]'::jsonb,
    '["Grade 5 aerospace titanium case with sapphire crystal", "Dual-band multi-constellation GNSS tracking", "Comprehensive sleep, HRV, and blood oxygen insights", "Custom action button for instant workout recording"]'::jsonb,
    true,
    true
),
(
    'prod_tablet_air',
    'PadView 11" 120Hz Tablet with Magnetic Stylus Support',
    'Vibrant 2.5K Liquid Crystal panel, quad stereo speakers, all-day 8,000mAh battery, and seamless split-screen multitasking for work and creativity.',
    429.00,
    499.00,
    4.6,
    1730,
    'cat_electronics',
    75,
    '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"]'::jsonb,
    '["11-inch 2.5K 120Hz smooth scrolling display", "Octa-core processor with 8GB RAM", "Supports 4096 pressure-level wireless stylus", "Weighs only 480g in sleek metal finish"]'::jsonb,
    true,
    false
);

-- 4. REVIEWS
INSERT INTO reviews (id, product_id, user_id, user_name, rating, title, comment, verified_purchase) VALUES
('rev_1', 'prod_laptop_pro', 'user_101', 'Alex Miller', 5, 'Unbelievable performance for heavy workloads', 'I render 4K video all day and the fan barely even kicks on. Battery easily lasts 15 hours. The display is mind-blowing.', true),
('rev_2', 'prod_laptop_pro', 'user_102', 'Sarah Connor', 5, 'Best laptop I have ever owned', 'Worth every penny. The keyboard feel is tactile, trackpad is massive, and speakers sound like external monitors.', true),
('rev_3', 'prod_headphones_anc', 'user_103', 'David Beck', 5, 'Airplane noise completely disappeared', 'Took this on a 10-hour flight and forgot I was on a plane. The soundstage is rich with deep punchy bass.', true),
('rev_4', 'prod_headphones_anc', 'user_104', 'Emily Watson', 4, 'Exceptional ANC and battery life', 'Very comfortable for 6+ hours of remote meetings. Wish the travel case was slightly more compact, but overall 9.5/10.', true),
('rev_5', 'prod_smartwatch_ultra', 'user_101', 'Alex Miller', 5, 'Indestructible and accurate', 'Completed a 50k mountain trail race. GPS tracked every corner and battery only dropped 18%. Highly recommend!', true),
('rev_6', 'prod_keyboard_mech', 'user_102', 'Sarah Connor', 5, 'Crisp keystrokes and gorgeous RGB', 'The red switches are smooth as butter. Seamless switching between my work MacBook and gaming PC via 2.4G.', true);

-- 5. INITIAL TRENDING PRODUCTS (formula: Views + Searches + Cart additions + Purchases)
INSERT INTO trending_products (id, product_id, score, views_count, searches_count, cart_count, purchase_count) VALUES
('trend_1', 'prod_laptop_pro', 1250.00, 520, 310, 240, 180),
('trend_2', 'prod_headphones_anc', 980.00, 430, 260, 190, 100),
('trend_3', 'prod_smartwatch_ultra', 820.00, 380, 210, 140, 90),
('trend_4', 'prod_keyboard_mech', 650.00, 290, 180, 110, 70),
('trend_5', 'prod_smart_speaker', 540.00, 240, 150, 90, 60),
('trend_6', 'prod_earbuds_pro', 490.00, 210, 130, 90, 60);

-- 6. INITIAL RECOMMENDATIONS
INSERT INTO recommendations (id, user_id, product_id, score, reason) VALUES
('rec_1', 'user_101', 'prod_monitor_4k', 95.0, 'Frequently bought with ZenithPro Laptop'),
('rec_2', 'user_101', 'prod_keyboard_mech', 89.0, 'Popular among tech enthusiasts'),
('rec_3', 'user_102', 'prod_earbuds_pro', 92.0, 'Top rated in Headphones & Audio'),
('rec_4', 'user_102', 'prod_smartwatch_ultra', 88.0, 'Trending in Wearables');
