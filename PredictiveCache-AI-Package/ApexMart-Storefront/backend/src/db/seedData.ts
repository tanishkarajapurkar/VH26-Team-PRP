export interface ProductEntity {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  msrp: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isPrime: boolean;
  image: string;
  tag?: string;
  description: string;
}

export const SEED_PRODUCTS: ProductEntity[] = [
  // Electronics
  {
    id: 1,
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "Electronics",
    price: 319.99,
    msrp: 399.99,
    rating: 4.9,
    reviewsCount: 12480,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    tag: "Best Seller",
    description: "Dual processors and 8 microphones for world-class noise cancellation, ultra-comfortable design, and 30-hour battery life."
  },
  {
    id: 2,
    title: "Apple MacBook Pro 16\" (M3 Pro, 18GB RAM, 512GB SSD)",
    brand: "Apple",
    category: "Electronics",
    price: 1999.00,
    msrp: 2299.00,
    rating: 4.95,
    reviewsCount: 4890,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
    tag: "Amazon Choice",
    description: "The M3 Pro chip powers breathtaking speed for heavy development, 8K video rendering, and multi-tasking with 22h battery life."
  },
  {
    id: 3,
    title: "Bose QuietComfort Ultra Spatial Audio Earbuds",
    brand: "Bose",
    category: "Electronics",
    price: 249.00,
    msrp: 299.00,
    rating: 4.75,
    reviewsCount: 3120,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    tag: "Top Rated",
    description: "Spatial audio places sound directly in front of you. CustomTune technology personalizes sound to the shape of your ears."
  },
  {
    id: 4,
    title: "Samsung Odyssey OLED G9 49\" Curved Gaming Monitor",
    brand: "Samsung",
    category: "Electronics",
    price: 1199.99,
    msrp: 1799.99,
    rating: 4.88,
    reviewsCount: 1420,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80",
    tag: "Deal of Day",
    description: "Dual QHD 240Hz 0.03ms response time with Neo Quantum Processor Pro for stunning cinematic color accuracy."
  },
  {
    id: 5,
    title: "Sony Alpha A7 IV Full-Frame Mirrorless Camera",
    brand: "Sony",
    category: "Electronics",
    price: 2298.00,
    msrp: 2498.00,
    rating: 4.92,
    reviewsCount: 1450,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
    tag: "Pro Creator",
    description: "33MP Exmor R back-illuminated sensor with AI real-time autofocus, 4K 60p 10-bit recording, and 5-axis optical stabilization."
  },
  {
    id: 6,
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    brand: "Logitech",
    category: "Electronics",
    price: 99.99,
    msrp: 119.99,
    rating: 4.85,
    reviewsCount: 22400,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
    tag: "Editor's Pick",
    description: "8K DPI optical track-on-glass sensor, whisper-quiet clicks, and MagSpeed electromagnetic scroll wheel."
  },

  // Home Appliances
  {
    id: 7,
    title: "Dyson V15 Detect Cordless Vacuum Cleaner",
    brand: "Dyson",
    category: "Home Appliances",
    price: 649.99,
    msrp: 749.99,
    rating: 4.86,
    reviewsCount: 5280,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=80",
    tag: "Best Seller",
    description: "Laser reveals microscopic dust. Piezo sensor counts and measures dust particles in real-time, automatically increasing suction."
  },
  {
    id: 8,
    title: "iRobot Roomba Combo j9+ Robot Vacuum & Mop",
    brand: "iRobot",
    category: "Home Appliances",
    price: 899.00,
    msrp: 1399.00,
    rating: 4.7,
    reviewsCount: 2310,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=80",
    tag: "Save $500",
    description: "Cleans carpets and hard floors seamlessly with auto-retract mopping pad, self-emptying base, and smart hazard avoidance."
  },
  {
    id: 9,
    title: "Breville Barista Touch Espresso Machine",
    brand: "Breville",
    category: "Home Appliances",
    price: 999.95,
    msrp: 1099.95,
    rating: 4.9,
    reviewsCount: 3840,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80",
    tag: "Barista Choice",
    description: "Automated touchscreen with pre-programmed cafe drinks, ThermoJet 3-second heat up, and micro-foam automatic milk texturing."
  },
  {
    id: 10,
    title: "Philips Hue Smart LED Starter Kit (4 Bulbs + Bridge)",
    brand: "Philips",
    category: "Home Appliances",
    price: 159.99,
    msrp: 199.99,
    rating: 4.8,
    reviewsCount: 8450,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80",
    tag: "Smart Home",
    description: "16 million colors and shades of white light, fully compatible with Alexa, Apple HomeKit, and Google Home."
  },
  {
    id: 11,
    title: "Levoit Core 400S Smart True HEPA Air Purifier",
    brand: "Levoit",
    category: "Home Appliances",
    price: 189.99,
    msrp: 219.99,
    rating: 4.85,
    reviewsCount: 16900,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&auto=format&fit=crop&q=80",
    tag: "Amazon Choice",
    description: "Cleans spaces up to 1,980 sq ft in one hour. Smart laser dust sensor and H13 True HEPA filtration captures 99.97% of airborne particles."
  },
  {
    id: 12,
    title: "Ninja Foodi 10-in-1 XL Pro Air Fryer & Convection Oven",
    brand: "Ninja",
    category: "Home Appliances",
    price: 229.99,
    msrp: 299.99,
    rating: 4.82,
    reviewsCount: 11200,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80",
    tag: "Hot Deal",
    description: "True Surround Convection cooks up to 10X faster than a traditional oven. Air fry, roast, bake, toast, broil, and dehydrate."
  },

  // Beauty & Luxury Skincare
  {
    id: 13,
    title: "Dyson Airwrap Multi-Styler Complete Long",
    brand: "Dyson",
    category: "Beauty",
    price: 499.99,
    msrp: 599.99,
    rating: 4.9,
    reviewsCount: 8920,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    tag: "Luxury Pick",
    description: "Styles and dries hair simultaneously using the Coanda airflow effect with zero extreme heat damage. Includes 6 re-engineered attachments."
  },
  {
    id: 14,
    title: "La Mer Crème de la Mer Moisturizing Cream (60ml)",
    brand: "La Mer",
    category: "Beauty",
    price: 380.00,
    msrp: 420.00,
    rating: 4.88,
    reviewsCount: 2650,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    tag: "Prestige Beauty",
    description: "Infused with cell-renewing Miracle Broth™, this ultra-rich cream immerses skin in deep soothing moisture, healing dryness."
  },
  {
    id: 15,
    title: "Estée Lauder Advanced Night Repair Synchronized Multi-Recovery",
    brand: "Estee Lauder",
    category: "Beauty",
    price: 115.00,
    msrp: 135.00,
    rating: 4.85,
    reviewsCount: 14800,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
    tag: "Best Seller",
    description: "The #1 serum in the US. Deep-penetrating serum reduces the look of multiple signs of aging caused by modern environmental stressors."
  },
  {
    id: 16,
    title: "Maison Francis Kurkdjian Baccarat Rouge 540 Eau de Parfum",
    brand: "MFK",
    category: "Beauty",
    price: 325.00,
    msrp: 350.00,
    rating: 4.94,
    reviewsCount: 1890,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80",
    tag: "Iconic Fragrance",
    description: "Luminous and sophisticated, lays on skin like an amber, floral and woody breeze with notes of jasmine, saffron, cedarwood and ambergris."
  },
  {
    id: 17,
    title: "Oral-B iO Series 9 Electric Toothbrush with Magnetic Technology",
    brand: "Oral-B",
    category: "Beauty",
    price: 249.99,
    msrp: 329.99,
    rating: 4.78,
    reviewsCount: 6400,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1559591937-e1032397e556?w=500&auto=format&fit=crop&q=80",
    tag: "Dental Pro",
    description: "Revolutionary magnetic iO technology for a professional clean feeling. 3D teeth tracking with AI to monitor your brushing over 16 zones."
  },
  {
    id: 18,
    title: "Olaplex No. 3 Hair Perfector Repairing Treatment (250ml)",
    brand: "Olaplex",
    category: "Beauty",
    price: 30.00,
    msrp: 35.00,
    rating: 4.79,
    reviewsCount: 38900,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1608248597359-5561b369c762?w=500&auto=format&fit=crop&q=80",
    tag: "Hair Cult",
    description: "Repairs damaged and compromised hair, improves hair health, texture, and strength with patented bond-building chemistry."
  },

  // Kitchen & Dining
  {
    id: 19,
    title: "Le Creuset Enameled Cast Iron Round Dutch Oven 5.5 Qt",
    brand: "Le Creuset",
    category: "Kitchen",
    price: 379.95,
    msrp: 419.95,
    rating: 4.95,
    reviewsCount: 7800,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80",
    tag: "French Classic",
    description: "The gold standard in cookware. Exceptional heat retention and distribution with sand-colored interior enamel that prevents burning."
  },
  {
    id: 20,
    title: "Vitamix A3500 Ascent Series Smart Professional Blender",
    brand: "Vitamix",
    category: "Kitchen",
    price: 649.95,
    msrp: 699.95,
    rating: 4.91,
    reviewsCount: 4200,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=80",
    tag: "Chef Grade",
    description: "Five program settings for smoothies, hot soups, dips & spreads, and frozen desserts with built-in wireless connectivity."
  },
  {
    id: 21,
    title: "Shun Classic 8-Inch Japanese VG-MAX Steel Chef's Knife",
    brand: "Shun",
    category: "Kitchen",
    price: 169.95,
    msrp: 209.95,
    rating: 4.88,
    reviewsCount: 3100,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=80",
    tag: "Japanese Craft",
    description: "Handcrafted in Seki City, Japan. 68 micro-layers of Damascus cladding protect a high-carbon VG-MAX cutting core with 16-degree double bevel."
  },

  // Gaming & VR
  {
    id: 22,
    title: "Sony PlayStation 5 Slim Console (1TB SSD)",
    brand: "Sony",
    category: "Gaming",
    price: 449.99,
    msrp: 499.99,
    rating: 4.88,
    reviewsCount: 19800,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80",
    tag: "Hot Deal",
    description: "Harness the power of a custom CPU, GPU, and SSD with Integrated I/O that rewrite the rules of what a PlayStation console can do."
  },
  {
    id: 23,
    title: "Meta Quest 3 512GB Breakthrough Mixed Reality Headset",
    brand: "Meta",
    category: "Gaming",
    price: 499.99,
    msrp: 649.99,
    rating: 4.82,
    reviewsCount: 5600,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=80",
    tag: "Top VR",
    description: "Transform your home into an exciting new playground where virtual elements blend seamlessly with your physical surroundings."
  },

  // Wearables
  {
    id: 24,
    title: "Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)",
    brand: "Apple",
    category: "Wearables",
    price: 749.00,
    msrp: 799.00,
    rating: 4.9,
    reviewsCount: 1680,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80",
    tag: "Flagship",
    description: "Rugged aerospace-grade titanium case with 3000-nit Always-On Retina display, dual-frequency precision GPS, and 72-hour battery life."
  },
  {
    id: 25,
    title: "Garmin epix Pro (Gen 2) Sapphire Edition Smartwatch 47mm",
    brand: "Garmin",
    category: "Wearables",
    price: 899.99,
    msrp: 999.99,
    rating: 4.91,
    reviewsCount: 890,
    inStock: true,
    isPrime: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    tag: "Endurance Pro",
    description: "Stunning AMOLED display, built-in LED flashlight, Hill Score, Endurance Score, and weeks of battery life in smartwatch mode."
  }
];
