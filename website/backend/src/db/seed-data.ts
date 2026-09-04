import { Category, Product, Review, User, TrendingProduct, Recommendation } from './types.js';

export const initialUsers: User[] = [
  {
    id: 'user_101',
    email: 'alex.miller@example.com',
    name: 'Alex Miller',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: new Date().toISOString()
  },
  {
    id: 'user_102',
    email: 'sarah.connor@example.com',
    name: 'Sarah Connor',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    created_at: new Date().toISOString()
  },
  {
    id: 'user_103',
    email: 'david.beck@example.com',
    name: 'David Beck',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: new Date().toISOString()
  },
  {
    id: 'user_104',
    email: 'emily.watson@example.com',
    name: 'Emily Watson',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    created_at: new Date().toISOString()
  }
];

export const initialCategories: Category[] = [
  {
    id: 'cat_electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Cutting-edge consumer tech, cameras, displays and accessories',
    image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
  },
  {
    id: 'cat_computers',
    name: 'Computers & Laptops',
    slug: 'computers',
    description: 'High performance laptops, ultra-wide monitors, and accessories',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
  },
  {
    id: 'cat_audio',
    name: 'Headphones & Audio',
    slug: 'audio',
    description: 'Noise cancelling headphones, wireless earbuds and studio speakers',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
  },
  {
    id: 'cat_smart_home',
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Smart security, intelligent lighting, thermostats and assistants',
    image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400'
  },
  {
    id: 'cat_gaming',
    name: 'Gaming & Consoles',
    slug: 'gaming',
    description: 'Next-gen gaming consoles, mechanical keyboards and wireless mice',
    image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'
  },
  {
    id: 'cat_wearables',
    name: 'Smart Wearables',
    slug: 'wearables',
    description: 'Fitness trackers, luxury smartwatches and health monitors',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod_laptop_pro',
    title: 'ZenithPro 16" Ultra-Thin Laptop (M3 Max, 32GB RAM, 1TB SSD)',
    description: 'Experience unprecedented processing power and all-day battery life with the revolutionary ZenithPro 16-inch. Engineered with Liquid Retina XDR display, studio-quality 6-speaker sound system, and advanced thermal management.',
    price: 1999.99,
    original_price: 2299.99,
    rating: 4.9,
    review_count: 2840,
    category_id: 'cat_computers',
    stock: 85,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
    ],
    features: [
      '16.2-inch Liquid Retina XDR display with ProMotion',
      '16-core CPU and 40-core GPU powerhouse',
      'Up to 22 hours battery life on single charge',
      '3x Thunderbolt 4 ports, HDMI, SDXC card slot'
    ],
    is_prime: true,
    is_best_seller: true
  },
  {
    id: 'prod_laptop_air',
    title: 'AuraBook 14" Lightweight Laptop (Core Ultra 7, 16GB RAM, 512GB SSD)',
    description: 'Ultra-portable elegance meeting incredible efficiency. Weighs only 2.7 lbs with an all-aluminum unibody chassis, whisper-quiet fanless cooling, and high-clarity 1080p web camera.',
    price: 1099.00,
    original_price: 1249.00,
    rating: 4.7,
    review_count: 1420,
    category_id: 'cat_computers',
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
    ],
    features: [
      'Ultra-slim 11.3mm profile',
      'Anti-reflective IPS display with 100% sRGB',
      'Fast-charge to 50% in 30 minutes',
      'Backlit ergonomic keyboard with fingerprint ID'
    ],
    is_prime: true,
    is_best_seller: false
  },
  {
    id: 'prod_headphones_anc',
    title: 'AuraSound X-1000 Noise-Cancelling Wireless Headphones',
    description: 'Industry-leading active noise cancellation with 8 microphones and dual processors. Premium Hi-Res LDAC audio codec support and luxurious memory foam earcups for marathon listening.',
    price: 348.00,
    original_price: 399.99,
    rating: 4.8,
    review_count: 6250,
    category_id: 'cat_audio',
    stock: 210,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
    ],
    features: [
      'Adaptive Dual Noise Cancellation engine',
      '40 hours battery life with ANC enabled',
      'Speak-to-chat auto pausing technology',
      'Multipoint connection pairing 2 devices seamlessly'
    ],
    is_prime: true,
    is_best_seller: true
  },
  {
    id: 'prod_earbuds_pro',
    title: 'SonicPulse True Wireless ANC Earbuds with MagSafe Case',
    description: 'Crystal-clear spatial audio with dynamic head tracking. Sweat and water-resistant with comfortable silicone ear tips in 4 sizes.',
    price: 199.50,
    original_price: 249.00,
    rating: 4.6,
    review_count: 3890,
    category_id: 'cat_audio',
    stock: 340,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800'
    ],
    features: [
      'Immersive 3D Spatial Audio',
      'Transparency mode with natural voice passthrough',
      '30-hour total playtime with USB-C/Qi case',
      'Active wind noise reduction'
    ],
    is_prime: true,
    is_best_seller: false
  },
  {
    id: 'prod_monitor_4k',
    title: 'UltraView 34" Curved WQHD USB-C Ergonomic Hub Monitor',
    description: 'Expansive 1500R curved display with 144Hz refresh rate, 99% DCI-P3 color reproduction, and 90W USB-C Power Delivery single-cable setup for laptops.',
    price: 479.99,
    original_price: 599.99,
    rating: 4.7,
    review_count: 870,
    category_id: 'cat_computers',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800'
    ],
    features: [
      '34-inch 3440 x 1440 Ultrawide resolution',
      'Built-in KVM switch for multiple PCs',
      '90W USB-C PD charging cable included',
      'Height, tilt and swivel adjustable stand'
    ],
    is_prime: true,
    is_best_seller: false
  },
  {
    id: 'prod_smart_speaker',
    title: 'EchoSphere Max Smart Speaker with High-Fidelity Room-Filling Sound',
    description: 'Transform your home with vibrant acoustics and smart assistant automation. Features 3-way speaker array, Zigbee smart home hub built-in, and privacy shutter.',
    price: 129.99,
    original_price: 159.99,
    rating: 4.5,
    review_count: 5420,
    category_id: 'cat_smart_home',
    stock: 500,
    images: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800'
    ],
    features: [
      'Room adaptive tuning for pristine acoustic balance',
      'Built-in Zigbee & Matter smart hub',
      'Voice control lights, temperature, and locks',
      'Mic off privacy physical button'
    ],
    is_prime: true,
    is_best_seller: true
  },
  {
    id: 'prod_smart_thermostat',
    title: 'NovaClim Smart Learning Thermostat with Touch Glass Display',
    description: 'Save energy effortlessly. Learns your home temperature schedule and programs itself. Compatible with 95% of 24V heating and cooling systems.',
    price: 189.00,
    original_price: 229.00,
    rating: 4.7,
    review_count: 1920,
    category_id: 'cat_smart_home',
    stock: 110,
    images: [
      'https://images.unsplash.com/photo-1567928815104-b7980ee5032e?w=800'
    ],
    features: [
      'Saves up to 23% on energy bills annually',
      'Remote control via iOS and Android apps',
      'Auto-Away eco mode when house is empty',
      'High-res round OLED display with metal bezel'
    ],
    is_prime: true,
    is_best_seller: false
  },
  {
    id: 'prod_smart_cam',
    title: 'GuardCam 2K Outdoor Solar-Powered Security Camera (2-Pack)',
    description: 'Continuous solar charging, 2K color night vision, AI person and vehicle detection with zero monthly subscription fees.',
    price: 169.99,
    original_price: 219.99,
    rating: 4.6,
    review_count: 2150,
    category_id: 'cat_smart_home',
    stock: 95,
    images: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800'
    ],
    features: [
      'Integrated solar panel delivers perpetual power',
      'Crisp 2K HDR resolution with spotlight color night vision',
      'Encrypted local storage with no cloud fees',
      'IP67 all-weather waterproof rating'
    ],
    is_prime: true,
    is_best_seller: false
  },
  {
    id: 'prod_keyboard_mech',
    title: 'VortexStrike RGB Wireless Mechanical Gaming Keyboard',
    description: 'Custom hot-swappable linear red switches, PBT double-shot keycaps, aluminum top plate, and ultra-low latency 2.4GHz wireless connection.',
    price: 119.99,
    original_price: 149.99,
    rating: 4.8,
    review_count: 3110,
    category_id: 'cat_gaming',
    stock: 180,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800'
    ],
    features: [
      'Hot-swappable linear mechanical switches',
      'Tri-mode connectivity: Bluetooth 5.2, 2.4GHz, USB-C',
      'Per-key programmable RGB illumination',
      'Sound-dampening silicon acoustic pad'
    ],
    is_prime: true,
    is_best_seller: true
  },
  {
    id: 'prod_mouse_gaming',
    title: 'HyperGlide Superlight 49g Wireless Esports Gaming Mouse',
    description: 'Featherlight 49-gram chassis engineered for lightning flicks. Equipped with 32,000 DPI optical sensor and 4000Hz polling rate capability.',
    price: 89.99,
    original_price: 109.99,
    rating: 4.9,
    review_count: 1840,
    category_id: 'cat_gaming',
    stock: 230,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'
    ],
    features: [
      'Ultra-lightweight 49 grams honeycomb-free shell',
      '32K DPI optical sensor with 99.8% resolution accuracy',
      'Pure PTFE skates for zero-friction glide',
      '80-hour battery life with rapid USB-C charging'
    ],
    is_prime: true,
    is_best_seller: false
  },
  {
    id: 'prod_smartwatch_ultra',
    title: 'TitanApex Rugged GPS Adventure Smartwatch (Titanium Case)',
    description: 'Precision dual-frequency GPS, 100m water resistance, ECG heart sensor, body temperature monitoring, and up to 14 days expedition battery life.',
    price: 399.00,
    original_price: 499.00,
    rating: 4.8,
    review_count: 4190,
    category_id: 'cat_wearables',
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
    ],
    features: [
      'Grade 5 aerospace titanium case with sapphire crystal',
      'Dual-band multi-constellation GNSS tracking',
      'Comprehensive sleep, HRV, and blood oxygen insights',
      'Custom action button for instant workout recording'
    ],
    is_prime: true,
    is_best_seller: true
  },
  {
    id: 'prod_tablet_air',
    title: 'PadView 11" 120Hz Tablet with Magnetic Stylus Support',
    description: 'Vibrant 2.5K Liquid Crystal panel, quad stereo speakers, all-day 8,000mAh battery, and seamless split-screen multitasking for work and creativity.',
    price: 429.00,
    original_price: 499.00,
    rating: 4.6,
    review_count: 1730,
    category_id: 'cat_electronics',
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
    ],
    features: [
      '11-inch 2.5K 120Hz smooth scrolling display',
      'Octa-core processor with 8GB RAM',
      'Supports 4096 pressure-level wireless stylus',
      'Weighs only 480g in sleek metal finish'
    ],
    is_prime: true,
    is_best_seller: false
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev_1',
    product_id: 'prod_laptop_pro',
    user_id: 'user_101',
    user_name: 'Alex Miller',
    rating: 5,
    title: 'Unbelievable performance for heavy workloads',
    comment: 'I render 4K video all day and the fan barely even kicks on. Battery easily lasts 15 hours. The display is mind-blowing.',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'rev_2',
    product_id: 'prod_laptop_pro',
    user_id: 'user_102',
    user_name: 'Sarah Connor',
    rating: 5,
    title: 'Best laptop I have ever owned',
    comment: 'Worth every penny. The keyboard feel is tactile, trackpad is massive, and speakers sound like external studio monitors.',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 'rev_3',
    product_id: 'prod_headphones_anc',
    user_id: 'user_103',
    user_name: 'David Beck',
    rating: 5,
    title: 'Airplane noise completely disappeared',
    comment: 'Took this on a 10-hour flight and forgot I was on a plane. The soundstage is rich with deep punchy bass.',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rev_4',
    product_id: 'prod_headphones_anc',
    user_id: 'user_104',
    user_name: 'Emily Watson',
    rating: 4,
    title: 'Exceptional ANC and battery life',
    comment: 'Very comfortable for 6+ hours of remote meetings. Wish the travel case was slightly more compact, but overall 9.5/10.',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: 'rev_5',
    product_id: 'prod_smartwatch_ultra',
    user_id: 'user_101',
    user_name: 'Alex Miller',
    rating: 5,
    title: 'Indestructible and accurate',
    comment: 'Completed a 50k mountain trail race. GPS tracked every corner and battery only dropped 18%. Highly recommend!',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'rev_6',
    product_id: 'prod_keyboard_mech',
    user_id: 'user_102',
    user_name: 'Sarah Connor',
    rating: 5,
    title: 'Crisp keystrokes and gorgeous RGB',
    comment: 'The red switches are smooth as butter. Seamless switching between my work MacBook and gaming PC via 2.4G.',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

export const initialTrending: TrendingProduct[] = [
  {
    id: 'trend_1',
    product_id: 'prod_laptop_pro',
    score: 1250.0,
    views_count: 520,
    searches_count: 310,
    cart_count: 240,
    purchase_count: 180,
    updated_at: new Date().toISOString()
  },
  {
    id: 'trend_2',
    product_id: 'prod_headphones_anc',
    score: 980.0,
    views_count: 430,
    searches_count: 260,
    cart_count: 190,
    purchase_count: 100,
    updated_at: new Date().toISOString()
  },
  {
    id: 'trend_3',
    product_id: 'prod_smartwatch_ultra',
    score: 820.0,
    views_count: 380,
    searches_count: 210,
    cart_count: 140,
    purchase_count: 90,
    updated_at: new Date().toISOString()
  },
  {
    id: 'trend_4',
    product_id: 'prod_keyboard_mech',
    score: 650.0,
    views_count: 290,
    searches_count: 180,
    cart_count: 110,
    purchase_count: 70,
    updated_at: new Date().toISOString()
  },
  {
    id: 'trend_5',
    product_id: 'prod_smart_speaker',
    score: 540.0,
    views_count: 240,
    searches_count: 150,
    cart_count: 90,
    purchase_count: 60,
    updated_at: new Date().toISOString()
  },
  {
    id: 'trend_6',
    product_id: 'prod_earbuds_pro',
    score: 490.0,
    views_count: 210,
    searches_count: 130,
    cart_count: 90,
    purchase_count: 60,
    updated_at: new Date().toISOString()
  }
];

export const initialRecommendations: Recommendation[] = [
  {
    id: 'rec_1',
    user_id: 'user_101',
    product_id: 'prod_monitor_4k',
    score: 95.0,
    reason: 'Frequently bought with ZenithPro Laptop',
    updated_at: new Date().toISOString()
  },
  {
    id: 'rec_2',
    user_id: 'user_101',
    product_id: 'prod_keyboard_mech',
    score: 89.0,
    reason: 'Popular among tech enthusiasts',
    updated_at: new Date().toISOString()
  },
  {
    id: 'rec_3',
    user_id: 'user_102',
    product_id: 'prod_earbuds_pro',
    score: 92.0,
    reason: 'Top rated in Headphones & Audio',
    updated_at: new Date().toISOString()
  },
  {
    id: 'rec_4',
    user_id: 'user_102',
    product_id: 'prod_smartwatch_ultra',
    score: 88.0,
    reason: 'Trending in Wearables',
    updated_at: new Date().toISOString()
  }
];
