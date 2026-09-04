import { Category, Product, FlashSale, Review } from './types.js';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat_electronics',
    name: 'Electronics',
    slug: 'electronics',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'High-performance personal audio, smart devices, visuals, and premium accessories'
  },
  {
    id: 'cat_computers',
    name: 'Computers',
    slug: 'computers',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'Cutting-edge ultrabooks, custom workstations, monitors, and peripherals'
  },
  {
    id: 'cat_gaming',
    name: 'Gaming',
    slug: 'gaming',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
    description: 'Next-gen gaming consoles, esports mechanical keyboards, low-latency mice, and headsets'
  },
  {
    id: 'cat_fashion',
    name: 'Fashion',
    slug: 'fashion',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
    description: 'Modern minimalist apparel, luxury streetwear, performance sneakers, and leather bags'
  },
  {
    id: 'cat_home',
    name: 'Home & Living',
    slug: 'home',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    description: 'Architectural furniture, ambient lighting, ergonomic bedding, and contemporary decor'
  },
  {
    id: 'cat_kitchen',
    name: 'Kitchen & Dining',
    slug: 'kitchen',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    description: 'Smart espresso machines, chef knives, induction cookware, and food processors'
  },
  {
    id: 'cat_sports',
    name: 'Sports & Fitness',
    slug: 'sports',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    description: 'Pro gym equipment, marathon running shoes, cycling gear, and outdoor expedition kits'
  },
  {
    id: 'cat_beauty',
    name: 'Beauty & Grooming',
    slug: 'beauty',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    description: 'Dermatological skincare, sonic grooming tools, organic haircare, and fragrances'
  },
  {
    id: 'cat_books',
    name: 'Books & Knowledge',
    slug: 'books',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'System design, engineering classics, sci-fi epics, and business strategy'
  },
  {
    id: 'cat_toys',
    name: 'Toys & Hobbies',
    slug: 'toys',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80',
    description: 'Robotics kits, collectible building sets, drones, and tabletop strategy'
  },
  {
    id: 'cat_automotive',
    name: 'Automotive',
    slug: 'automotive',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    description: 'Smart dashcams, portable EV chargers, detailing gear, and tire inflators'
  },
  {
    id: 'cat_office',
    name: 'Office & Workspace',
    slug: 'office',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80',
    description: 'Motorized standing desks, ergonomic mesh chairs, and cable management suites'
  },
  {
    id: 'cat_musical',
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    description: 'Studio condenser microphones, MIDI controllers, synthesizers, and acoustic guitars'
  },
  {
    id: 'cat_travel',
    name: 'Travel & Luggage',
    slug: 'travel',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Polycarbonate carry-on suitcases, anti-theft backpacks, and universal travel adapters'
  }
];

export const SEED_PRODUCTS: Product[] = [
  // FLASH SALE / TOP ELECTRONICS
  {
    id: 'prod_apts_anc_headphones',
    name: 'APTS HyperQuiet X1 Wireless ANC Headphones',
    slug: 'apts-hyperquiet-x1-wireless-anc-headphones',
    description: 'Flagship hybrid active noise cancellation with 40mm beryllium drivers, LDAC high-res audio codec, 45-hour battery life, and plush memory foam earcups.',
    price: 4999,
    original_price: 8999,
    discount: 44,
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    category_slug: 'electronics',
    brand: 'APTS Acoustic',
    rating: 4.8,
    review_count: 842,
    stock: 24,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 4999,
    flash_sale_claimed_percent: 82,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Driver Size': '40mm Titanium-Coated Beryllium',
      'Frequency Response': '10 Hz - 40,000 Hz',
      'Bluetooth': 'v5.3 with Multipoint Audio',
      'Battery Life': '45 Hours (ANC On) / 60 Hours (ANC Off)',
      'Charging': 'USB-C Fast Charging (10 min for 5 hours)',
      'Weight': '248g'
    }
  },
  {
    id: 'prod_apts_earbuds_pro',
    name: 'APTS AirPulse Pro True Wireless Earbuds',
    slug: 'apts-airpulse-pro-true-wireless-earbuds',
    description: 'Compact in-ear wireless earbuds with adaptive transparency, 38dB deep noise reduction, IPX7 water resistance, and wireless charging case.',
    price: 2499,
    original_price: 4999,
    discount: 50,
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    category_slug: 'electronics',
    brand: 'APTS Acoustic',
    rating: 4.6,
    review_count: 512,
    stock: 45,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 2499,
    flash_sale_claimed_percent: 74,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Water Resistance': 'IPX7 Waterproof',
      'Playtime': '8 hours per charge (32 hours with case)',
      'Codecs': 'AAC, SBC, aptX Adaptive',
      'Microphones': '6-mic beamforming array with AI ENC'
    }
  },
  {
    id: 'prod_apts_oled_smartwatch',
    name: 'APTS Apex AMOLED Titanium Smartwatch',
    slug: 'apts-apex-amoled-titanium-smartwatch',
    description: 'Precision aerospace-grade titanium case with always-on sapphire crystal AMOLED display, dual-frequency GPS, SpO2 sensor, and 14-day battery.',
    price: 6499,
    original_price: 10999,
    discount: 41,
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    category_slug: 'electronics',
    brand: 'APTS Chrono',
    rating: 4.7,
    review_count: 318,
    stock: 18,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 6499,
    flash_sale_claimed_percent: 88,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Case Material': 'Grade 5 Aerospace Titanium',
      'Display': '1.43-inch Always-On AMOLED (1000 nits)',
      'Water Resistance': '5ATM + IP68',
      'Sensors': 'Optical Heart Rate, SpO2, Dual-Band GPS, Altimeter'
    }
  },
  {
    id: 'prod_apts_soundbar_dolby',
    name: 'APTS SonicWave 240W Dolby Atmos Soundbar',
    slug: 'apts-sonicwave-240w-dolby-atmos-soundbar',
    description: 'Cinematic 3.1.2 channel soundbar with dedicated wireless subwoofer, upward-firing height channels, eARC HDMI passthrough, and room calibration.',
    price: 11999,
    original_price: 18999,
    discount: 37,
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    category_slug: 'electronics',
    brand: 'APTS Audio',
    rating: 4.9,
    review_count: 189,
    stock: 12,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Total Output': '240W RMS',
      'Audio Formats': 'Dolby Atmos, Dolby TrueHD, DTS:X',
      'Connectivity': 'HDMI eARC, Optical, AUX, Bluetooth 5.2'
    }
  },

  // COMPUTERS & MONITORS
  {
    id: 'prod_apts_curved_monitor',
    name: 'APTS UltraView 34" WQHD Curved 165Hz Monitor',
    slug: 'apts-ultraview-34-wqhd-curved-165hz-monitor',
    description: 'Immersive 1500R curved ultra-wide gaming & productivity monitor with 3440x1440 resolution, 1ms response time, HDR400, and USB-C 90W power delivery.',
    price: 32999,
    original_price: 44999,
    discount: 27,
    category_id: 'cat_computers',
    category_name: 'Computers',
    category_slug: 'computers',
    brand: 'APTS Display',
    rating: 4.9,
    review_count: 246,
    stock: 15,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 32999,
    flash_sale_claimed_percent: 65,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Panel Size': '34-inch 21:9 UltraWide',
      'Resolution': '3440 x 1440 (UWQHD)',
      'Refresh Rate': '165Hz with AMD FreeSync Premium Pro',
      'Curvature': '1500R',
      'Color Gamut': '98% DCI-P3, 10-bit color'
    }
  },
  {
    id: 'prod_apts_zenith_laptop',
    name: 'APTS Zenith M16 Ultra Thin Creator Laptop',
    slug: 'apts-zenith-m16-ultra-thin-creator-laptop',
    description: 'Crafted from CNC unibody aluminum with a 3.2K 120Hz OLED screen, 14-core Intel Core i9 processor, 32GB LPDDR5X RAM, and 1TB PCIe 4.0 NVMe SSD.',
    price: 89999,
    original_price: 119999,
    discount: 25,
    category_id: 'cat_computers',
    category_name: 'Computers',
    category_slug: 'computers',
    brand: 'APTS Compute',
    rating: 4.8,
    review_count: 142,
    stock: 8,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Processor': '13th Gen Core i9-13900H (14 cores, up to 5.4 GHz)',
      'Memory': '32GB 6400MHz LPDDR5X',
      'Storage': '1TB NVMe PCIe Gen 4 SSD',
      'Display': '16.0" 3.2K OLED 120Hz 100% DCI-P3 HDR 500',
      'Weight': '1.62 kg'
    }
  },
  {
    id: 'prod_apts_nvme_2tb',
    name: 'APTS HyperDrive 2TB PCIe Gen4 NVMe SSD',
    slug: 'apts-hyperdrive-2tb-pcie-gen4-nvme-ssd',
    description: 'Blazing read speeds up to 7450 MB/s and write speeds up to 6900 MB/s with custom graphene heat spreader for gaming PCs, PS5, and workstations.',
    price: 8499,
    original_price: 13999,
    discount: 39,
    category_id: 'cat_computers',
    category_name: 'Computers',
    category_slug: 'computers',
    brand: 'APTS Memory',
    rating: 4.9,
    review_count: 673,
    stock: 50,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 8499,
    flash_sale_claimed_percent: 91,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Capacity': '2,000 GB (2TB)',
      'Sequential Read': 'Up to 7,450 MB/s',
      'Sequential Write': 'Up to 6,900 MB/s',
      'Form Factor': 'M.2 2280',
      'Endurance': '1200 TBW'
    }
  },

  // GAMING
  {
    id: 'prod_apts_phantom_keyboard',
    name: 'APTS Phantom RGB 75% Hot-Swappable Mechanical Keyboard',
    slug: 'apts-phantom-rgb-75-hot-swappable-mechanical-keyboard',
    description: 'Gasket-mounted acoustic dampening with pre-lubed linear switches, PBT double-shot keycaps, south-facing per-key RGB, and aluminum rotary knob.',
    price: 3499,
    original_price: 5999,
    discount: 42,
    category_id: 'cat_gaming',
    category_name: 'Gaming',
    category_slug: 'gaming',
    brand: 'APTS Gaming',
    rating: 4.8,
    review_count: 428,
    stock: 35,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 3499,
    flash_sale_claimed_percent: 79,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Layout': '75% Compact (82 Keys + Aluminum Knob)',
      'Switches': 'Custom Factory-Lubed Linear APTS Red (45g actuation)',
      'Keycaps': 'Double-Shot Cherry Profile PBT',
      'Connectivity': 'Tri-Mode (Bluetooth 5.1, 2.4GHz Wireless, USB-C)'
    }
  },
  {
    id: 'prod_apts_pro_wireless_mouse',
    name: 'APTS Stryke 49g Ultralight 4KHz Wireless Gaming Mouse',
    slug: 'apts-stryke-49g-ultralight-4khz-wireless-gaming-mouse',
    description: 'Featherweight 49g symmetrical design with PAW3395 26,000 DPI sensor, optical microswitches, and genuine 4,000Hz wireless polling rate.',
    price: 2999,
    original_price: 4999,
    discount: 40,
    category_id: 'cat_gaming',
    category_name: 'Gaming',
    category_slug: 'gaming',
    brand: 'APTS Gaming',
    rating: 4.7,
    review_count: 310,
    stock: 28,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Weight': '49 grams solid shell (no holes)',
      'Sensor': 'PixArt PAW3395 (26,000 DPI, 650 IPS)',
      'Polling Rate': '4,000 Hz True Wireless',
      'Battery Life': 'Up to 80 Hours'
    }
  },
  {
    id: 'prod_apts_wireless_gamepad',
    name: 'APTS Apex Elite Hall Effect Wireless Controller',
    slug: 'apts-apex-elite-hall-effect-wireless-controller',
    description: 'Drift-free Hall Effect electromagnetic analog sticks, mechanical tactile face buttons, remappable rear paddles, and multi-platform compatibility (PC, Switch, iOS, Android).',
    price: 3299,
    original_price: 4999,
    discount: 34,
    category_id: 'cat_gaming',
    category_name: 'Gaming',
    category_slug: 'gaming',
    brand: 'APTS Gaming',
    rating: 4.8,
    review_count: 219,
    stock: 22,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Stick Technology': 'Electromagnetic Hall Effect Sensors (Zero Drift)',
      'Triggers': 'Dual-Stage Trigger Locks with Hall Sensors',
      'Vibration': 'Dual Rotor Asymmetric Motors + Trigger Rumble'
    }
  },

  // FASHION
  {
    id: 'prod_apts_leather_backpack',
    name: 'APTS Urban Stealth Full-Grain Leather Backpack',
    slug: 'apts-urban-stealth-full-grain-leather-backpack',
    description: 'Handcrafted premium full-grain leather with dedicated 16" padded laptop sleeve, water-repellent zippers, luggage pass-through, and breathable mesh back panel.',
    price: 5499,
    original_price: 8999,
    discount: 39,
    category_id: 'cat_fashion',
    category_name: 'Fashion',
    category_slug: 'fashion',
    brand: 'APTS Atelier',
    rating: 4.9,
    review_count: 164,
    stock: 19,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Material': 'Full-Grain Vegetable-Tanned Cowhide Leather',
      'Dimensions': '44 x 31 x 15 cm (22 Liters)',
      'Laptop Compartment': 'Padded sleeve fits up to 16-inch MacBook Pro',
      'Hardware': 'Matte Black YKK Aquaguard Zippers'
    }
  },
  {
    id: 'prod_apts_minimalist_sneakers',
    name: 'APTS CloudKnit Zero-Drop Performance Sneakers',
    slug: 'apts-cloudknit-zero-drop-performance-sneakers',
    description: 'Ultralight engineered knit upper with responsive supercritical foam midsole, anatomical wide toe box, and slip-resistant Vibram rubber outsole.',
    price: 3999,
    original_price: 6499,
    discount: 38,
    category_id: 'cat_fashion',
    category_name: 'Fashion',
    category_slug: 'fashion',
    brand: 'APTS Atelier',
    rating: 4.7,
    review_count: 275,
    stock: 30,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 3999,
    flash_sale_claimed_percent: 69,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Upper': '100% Recycled Seamless Engineered Knit',
      'Drop': 'Zero-Drop (balanced cushioning)',
      'Outsole': 'Vibram Megagrip All-Terrain Rubber'
    }
  },

  // HOME & LIVING
  {
    id: 'prod_apts_ergonomic_chair',
    name: 'APTS Ergoflex Pro Mesh Executive Desk Chair',
    slug: 'apts-ergoflex-pro-mesh-executive-desk-chair',
    description: 'Dynamic lumbar support with breathable Korean elastomeric mesh, 4D adjustable armrests, seat slide depth adjustment, and heavy-duty aluminum base.',
    price: 18999,
    original_price: 25999,
    discount: 27,
    category_id: 'cat_home',
    category_name: 'Home & Living',
    category_slug: 'home',
    brand: 'APTS Living',
    rating: 4.8,
    review_count: 198,
    stock: 14,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1580481077194-4d8981f72a44?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Mesh Material': 'Self-Supporting Dupont Hybrid Knit Mesh',
      'Adjustability': '4D Armrests, Seat Slide, Recline Lock, Dynamic Lumbar',
      'Weight Capacity': '150 kg (BIFMA certified)'
    }
  },
  {
    id: 'prod_apts_ambient_lamp',
    name: 'APTS Halo Magnetic Levitating Ambient Lamp',
    slug: 'apts-halo-magnetic-levitating-ambient-lamp',
    description: 'A striking statement piece featuring a magnetic levitating light ring with touch dimming, warm 2700K to 6500K color temperatures, and fast wireless charging base.',
    price: 3799,
    original_price: 5999,
    discount: 37,
    category_id: 'cat_home',
    category_name: 'Home & Living',
    category_slug: 'home',
    brand: 'APTS Living',
    rating: 4.6,
    review_count: 88,
    stock: 20,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Base Material': 'Solid Walnut & Anodized Aluminum',
      'Color Temperature': '2700K - 6500K Tunable White',
      'Wireless Charging': '15W Qi Fast Charging Pad in base'
    }
  },

  // KITCHEN
  {
    id: 'prod_apts_espresso_maker',
    name: 'APTS BaristaMaster Precision Compact Espresso Machine',
    slug: 'apts-baristamaster-precision-compact-espresso-machine',
    description: 'Commercial 58mm portafilter with 15-bar Italian pump, dual thermo-block rapid heating in 25 seconds, precise PID temperature control, and micro-foam steam wand.',
    price: 14999,
    original_price: 21999,
    discount: 32,
    category_id: 'cat_kitchen',
    category_name: 'Kitchen & Dining',
    category_slug: 'kitchen',
    brand: 'APTS Culinary',
    rating: 4.9,
    review_count: 143,
    stock: 16,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Portafilter Size': '58mm Commercial Stainless Steel',
      'Pump Pressure': '15-Bar Italian ULKA Pump',
      'Pre-Infusion': 'Low-pressure gradual pre-infusion',
      'Water Tank': '1.8 Liters removable'
    }
  },
  {
    id: 'prod_apts_damascus_knife_set',
    name: 'APTS Shokunin 5-Piece VG10 Damascus Chef Knife Set',
    slug: 'apts-shokunin-5-piece-vg10-damascus-chef-knife-set',
    description: 'Authentic 67-layer Japanese VG-10 Damascus steel with 60±2 HRC core hardness, razor-sharp 15-degree edge bevel, and ergonomic G10 military-grade handles.',
    price: 6999,
    original_price: 11999,
    discount: 42,
    category_id: 'cat_kitchen',
    category_name: 'Kitchen & Dining',
    category_slug: 'kitchen',
    brand: 'APTS Culinary',
    rating: 4.9,
    review_count: 214,
    stock: 25,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 6999,
    flash_sale_claimed_percent: 71,
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Steel Type': '67-Layer VG-10 Damascus Stainless Steel',
      'Hardness': 'Rockwell 60±2 HRC',
      'Handle': 'Ergonomic Non-Slip G10 Garolite with Mosaic Pin'
    }
  },

  // SPORTS & FITNESS
  {
    id: 'prod_apts_smart_kettlebell',
    name: 'APTS FlexWeight Adjustable Smart Kettlebell (4-18kg)',
    slug: 'apts-flexweight-adjustable-smart-kettlebell',
    description: 'Instant dial weight adjustments from 4kg to 18kg with built-in rep tracking, Bluetooth app sync, and ergonomic powder-coated cast iron handle.',
    price: 7999,
    original_price: 12999,
    discount: 38,
    category_id: 'cat_sports',
    category_name: 'Sports & Fitness',
    category_slug: 'sports',
    brand: 'APTS Kinetic',
    rating: 4.7,
    review_count: 156,
    stock: 20,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Weight Range': '4kg, 8kg, 11kg, 14kg, 16kg, 18kg',
      'Adjustment Mechanism': 'Rapid Twist-Lock Safety System',
      'Battery': 'Rechargeable Lithium-ion (Rep Tracker 30 days)'
    }
  },

  // BEAUTY & GROOMING
  {
    id: 'prod_apts_sonic_trimmer',
    name: 'APTS PrecisionCraft Titanium Ceramic Beard Trimmer',
    slug: 'apts-precisioncraft-titanium-ceramic-beard-trimmer',
    description: 'Self-sharpening titanium-coated ceramic blades with 40 length settings (0.5mm to 20mm), 7000 RPM quiet motor, digital battery indicator, and 120-minute runtime.',
    price: 1899,
    original_price: 3499,
    discount: 46,
    category_id: 'cat_beauty',
    category_name: 'Beauty & Grooming',
    category_slug: 'beauty',
    brand: 'APTS Grooming',
    rating: 4.8,
    review_count: 392,
    stock: 40,
    status: 'active',
    is_flash_sale: true,
    flash_sale_price: 1899,
    flash_sale_claimed_percent: 86,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Blades': 'Hypoallergenic Self-Sharpening Titanium Ceramic',
      'Length Steps': '40 Precision Steps (0.5mm increments)',
      'Battery': 'Li-ion 120 min runtime with Type-C Quick Charge'
    }
  },

  // BOOKS & STRATEGY
  {
    id: 'prod_apts_system_design_handbook',
    name: 'High-Scale Distributed Systems & Caching Architecture',
    slug: 'high-scale-distributed-systems-and-caching-architecture',
    description: 'Master enterprise-scale caching architectures, consistent hashing, write-through vs read-through strategies, tiered invalidation, and real-time database bottlenecks.',
    price: 1299,
    original_price: 1999,
    discount: 35,
    category_id: 'cat_books',
    category_name: 'Books & Knowledge',
    category_slug: 'books',
    brand: 'APTS Press',
    rating: 4.9,
    review_count: 489,
    stock: 120,
    status: 'active',
    is_flash_sale: false,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Pages': '640 pages hardcover',
      'Language': 'English',
      'Edition': '3rd Revised & Expanded Edition'
    }
  }
];

export const SEED_FLASH_SALES: FlashSale[] = [
  {
    id: 'sale_midday_surge',
    name: 'APTS Prime Hour Flash Sale',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() + 7200000).toISOString(), // ~2 hours remaining
    status: 'active'
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_101',
    product_id: 'prod_apts_anc_headphones',
    rating: 5,
    title: 'Incredible audio depth and dead-silent ANC',
    content: 'The ANC on these easily outperforms my previous £300 headphones. The sub-bass response is tight without muddying the midrange. Battery life lasted an entire week of 8-hour workdays.',
    author_name: 'Karan M.',
    verified: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rev_102',
    product_id: 'prod_apts_anc_headphones',
    rating: 5,
    title: 'Absolute game changer for flights and deep focus',
    content: 'Cabin engine rumble disappeared completely. The ear cushions are buttery soft and do not press glasses frames into your temples. Highly recommended.',
    author_name: 'Sneha R.',
    verified: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'rev_103',
    product_id: 'prod_apts_curved_monitor',
    rating: 5,
    title: 'The 34-inch ultrawide is perfect for coding and gaming',
    content: 'Having three VS Code panes side-by-side without any monitor bezel is incredible. The 165Hz refresh rate is silky smooth.',
    author_name: 'Aditya S.',
    verified: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'rev_104',
    product_id: 'prod_apts_phantom_keyboard',
    rating: 5,
    title: 'The sound profile out of the box is pure ASMR',
    content: 'No hollow pinging, smooth linear switches, and the rotary volume knob has satisfying tactile clicks. Excellent build quality.',
    author_name: 'Rohan K.',
    verified: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'rev_105',
    product_id: 'prod_apts_airpulse_pro',
    rating: 4,
    title: 'Great fit and punchy sound',
    content: 'Stays securely in ear during running sessions. The transparency mode sounds very natural.',
    author_name: 'Pooja T.',
    verified: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];
