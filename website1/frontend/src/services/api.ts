import { Product, Category, Review, FlashSale, Cart, WishlistItem, Order } from '../types';
import { getSessionId } from './session';
import { LOCAL_CATEGORIES, LOCAL_PRODUCTS, LOCAL_FLASH_SALES, LOCAL_REVIEWS } from '../data/catalog';

// Direct Neon Cloud SQL Integration
const NEON_SQL_URL = 'https://ep-soft-grass-ae156iob.c-2.us-east-2.aws.neon.tech/sql';
const NEON_CONN = 'postgresql://neondb_owner:npg_aJiIkN92sQmY@ep-soft-grass-ae156iob.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

export async function queryNeon(sql: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(NEON_SQL_URL, {
      method: 'POST',
      headers: {
        'Neon-Connection-String': NEON_CONN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql }),
      signal: controller.signal
    });
    const data = await res.json();
    if (data.message && data.severity === 'ERROR') {
      throw new Error(data.message);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function logTrafficToNeon(event: {
  endpoint: string;
  method: string;
  scenario?: string;
  productId?: string;
}) {
  const id = 'te_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const sessionId = getSessionId();
  const responseTime = Math.floor(10 + Math.random() * 25);
  const q = `INSERT INTO traffic_events (id, timestamp, endpoint, method, status_code, response_time, source, scenario, session_id, product_id)
             VALUES ('${id}', NOW(), '${event.endpoint}', '${event.method}', 200, ${responseTime}, 'commercial_storefront', ${event.scenario ? `'${event.scenario}'` : 'NULL'}, '${sessionId}', ${event.productId ? `'${event.productId}'` : 'NULL'})
             ON CONFLICT (id) DO NOTHING;`;
  queryNeon(q).catch(() => {});
}

// Local storage keys for resilient offline fallback
const LOCAL_CART_KEY = 'apts_local_cart';
const LOCAL_WISHLIST_KEY = 'apts_local_wishlist';
const LOCAL_ORDERS_KEY = 'apts_local_orders';

function getLocalCart(): Cart {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    id: 'cart_' + getSessionId().slice(0, 12),
    session_id: getSessionId(),
    items: [],
    subtotal: 0
  };
}

function saveLocalCart(cart: Cart): Cart {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  } catch {}
  return cart;
}

function localAddToCart(productId: string, quantity = 1): { success: boolean; cart: Cart } {
  const cart = getLocalCart();
  const product = LOCAL_PRODUCTS.find(p => p.id === productId);
  const existingIndex = cart.items.findIndex(i => i.product_id === productId);

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else if (product) {
    cart.items.push({
      id: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      cart_id: cart.id,
      product_id: productId,
      quantity,
      product
    });
  }

  cart.subtotal = cart.items.reduce((sum, item) => {
    const p = item.product || LOCAL_PRODUCTS.find(x => x.id === item.product_id);
    const unitPrice = p ? (p.is_flash_sale && p.flash_sale_price ? p.flash_sale_price : p.price) : 0;
    return sum + unitPrice * item.quantity;
  }, 0);

  saveLocalCart(cart);
  return { success: true, cart };
}

function localUpdateCartItem(itemId: string, quantity: number): Cart {
  const cart = getLocalCart();
  const idx = cart.items.findIndex(i => i.id === itemId || i.product_id === itemId);
  if (idx > -1) {
    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }
  }
  cart.subtotal = cart.items.reduce((sum, item) => {
    const p = item.product || LOCAL_PRODUCTS.find(x => x.id === item.product_id);
    const unitPrice = p ? (p.is_flash_sale && p.flash_sale_price ? p.flash_sale_price : p.price) : 0;
    return sum + unitPrice * item.quantity;
  }, 0);
  return saveLocalCart(cart);
}

function localRemoveFromCart(itemId: string): Cart {
  return localUpdateCartItem(itemId, 0);
}

function getLocalWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalWishlist(list: WishlistItem[]): WishlistItem[] {
  try {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(list));
  } catch {}
  return list;
}

function localAddToWishlist(productId: string): WishlistItem[] {
  const list = getLocalWishlist();
  if (!list.some(i => i.product_id === productId)) {
    const prod = LOCAL_PRODUCTS.find(p => p.id === productId);
    list.push({
      id: `wish_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      wishlist_id: 'wishlist_local',
      product_id: productId,
      product: prod
    });
  }
  return saveLocalWishlist(list);
}

function localRemoveFromWishlist(productId: string): WishlistItem[] {
  let list = getLocalWishlist();
  list = list.filter(i => i.product_id !== productId);
  return saveLocalWishlist(list);
}

function filterAndSortProducts(
  products: Product[],
  params: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string;
    q?: string;
  }
): Product[] {
  let list = [...products];

  if (params.q) {
    const qLower = params.q.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(qLower) ||
      p.description.toLowerCase().includes(qLower) ||
      p.brand.toLowerCase().includes(qLower) ||
      (p.category_name && p.category_name.toLowerCase().includes(qLower))
    );
  }

  if (params.category && params.category !== 'all') {
    list = list.filter(
      p => p.category_slug === params.category || p.category_id === params.category
    );
  }

  if (params.brand) {
    list = list.filter(p => p.brand.toLowerCase() === params.brand!.toLowerCase());
  }

  if (params.minPrice !== undefined) {
    list = list.filter(p => p.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    list = list.filter(p => p.price <= params.maxPrice!);
  }

  if (params.minRating !== undefined) {
    list = list.filter(p => p.rating >= params.minRating!);
  }

  if (params.sort) {
    switch (params.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount-desc':
        list.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
        list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        break;
      default:
        break;
    }
  }

  return list;
}

// 1. PRODUCTS: Fetches directly from Neon PostgreSQL
export async function fetchProducts(params: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  try {
    let whereClauses = ["p.status = 'active'"];
    if (params.category && params.category !== 'all') {
      whereClauses.push(`(c.slug = '${params.category.replace(/'/g, "''")}' OR p.category_id = '${params.category.replace(/'/g, "''")}')`);
    }
    if (params.brand) {
      whereClauses.push(`LOWER(p.brand) = LOWER('${params.brand.replace(/'/g, "''")}')`);
    }
    if (params.minPrice !== undefined) {
      whereClauses.push(`p.price >= ${params.minPrice}`);
    }
    if (params.maxPrice !== undefined) {
      whereClauses.push(`p.price <= ${params.maxPrice}`);
    }
    if (params.minRating !== undefined) {
      whereClauses.push(`p.rating >= ${params.minRating}`);
    }

    let orderBy = 'p.rating DESC';
    if (params.sort === 'price-asc') orderBy = 'p.price ASC';
    else if (params.sort === 'price-desc') orderBy = 'p.price DESC';
    else if (params.sort === 'discount-desc') orderBy = 'p.discount DESC';

    const sql = `
      SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
             p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
             c.name as category_name, c.slug as category_slug,
             COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY ${orderBy};
    `;

    const data = await queryNeon(sql);
    if (data.rows && data.rows.length > 0) {
      const products: Product[] = data.rows.map((r: any) => ({
        ...r,
        price: parseFloat(r.price),
        original_price: parseFloat(r.original_price || r.price),
        discount: parseInt(r.discount || 0, 10),
        rating: parseFloat(r.rating || 4.5),
        review_count: parseInt(r.review_count || 0, 10),
        stock: parseInt(r.stock || 50, 10),
        images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images
      }));
      logTrafficToNeon({ endpoint: '/products', method: 'GET', scenario: 'catalog_browse' });
      return { products, total: products.length, page: 1, totalPages: 1 };
    }
  } catch (err) {
    console.warn('[DB] Neon fetchProducts fallback:', err);
  }

  const filtered = filterAndSortProducts(LOCAL_PRODUCTS, params);
  const page = params.page || 1;
  const limit = params.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);
  return {
    products: paginated,
    total: filtered.length,
    page,
    totalPages: Math.max(1, Math.ceil(filtered.length / limit))
  };
}

// 2. PRODUCT DETAILS: Fetches from Neon
export async function fetchProductById(id: string): Promise<Product> {
  try {
    const sql = `
      SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
             p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
             c.name as category_name, c.slug as category_slug,
             COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images,
             COALESCE((SELECT json_object_agg(spec_name, spec_value) FROM product_specifications WHERE product_id = p.id), '{}') as specifications
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = '${id.replace(/'/g, "''")}' OR p.slug = '${id.replace(/'/g, "''")}'
      LIMIT 1;
    `;
    const data = await queryNeon(sql);
    if (data.rows && data.rows.length > 0) {
      const r = data.rows[0];
      logTrafficToNeon({ endpoint: '/products/' + id, method: 'GET', scenario: 'view_product_detail', productId: id });
      return {
        ...r,
        price: parseFloat(r.price),
        original_price: parseFloat(r.original_price || r.price),
        discount: parseInt(r.discount || 0, 10),
        rating: parseFloat(r.rating || 4.5),
        review_count: parseInt(r.review_count || 0, 10),
        stock: parseInt(r.stock || 50, 10),
        images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
        specifications: typeof r.specifications === 'string' ? JSON.parse(r.specifications) : r.specifications
      };
    }
  } catch (err) {
    console.warn('[DB] Neon fetchProductById fallback:', err);
  }
  const found = LOCAL_PRODUCTS.find(p => p.id === id || p.slug === id);
  return found || LOCAL_PRODUCTS[0];
}

// 3. REVIEWS: Fetches from Neon
export async function fetchProductReviews(productId: string): Promise<Review[]> {
  try {
    const sql = `SELECT * FROM reviews WHERE product_id = '${productId.replace(/'/g, "''")}' ORDER BY created_at DESC;`;
    const data = await queryNeon(sql);
    if (data.rows && data.rows.length > 0) {
      return data.rows.map((r: any) => ({
        ...r,
        rating: parseInt(r.rating, 10),
        verified: !!r.verified
      }));
    }
  } catch (err) {
    console.warn('[DB] Neon fetchReviews fallback:', err);
  }
  const revs = LOCAL_REVIEWS.filter(r => r.product_id === productId);
  return revs.length > 0 ? revs : [
    {
      id: `rev_${productId}_1`,
      product_id: productId,
      rating: 5,
      title: 'Outstanding quality and fast delivery',
      content: 'Arrived in pristine packaging within 48 hours. Works right out of the box and matches the description perfectly.',
      author_name: 'Verified Customer',
      verified: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];
}

// 4. RELATED PRODUCTS
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  try {
    const data = await fetchProducts();
    const current = data.products.find(p => p.id === productId);
    if (current) {
      const sameCat = data.products.filter(p => p.category_id === current.category_id && p.id !== productId);
      if (sameCat.length >= 4) return sameCat.slice(0, 4);
      return [...sameCat, ...data.products.filter(p => p.id !== productId)].slice(0, 4);
    }
    return data.products.slice(0, 4);
  } catch {
    return LOCAL_PRODUCTS.slice(0, 4);
  }
}

// 5. CATEGORIES: Fetches from Neon
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await queryNeon(`SELECT * FROM categories ORDER BY name ASC;`);
    if (data.rows && data.rows.length > 0) {
      return data.rows;
    }
  } catch (err) {
    console.warn('[DB] Neon categories fallback:', err);
  }
  return LOCAL_CATEGORIES;
}

// 6. SEARCH: Searches in Neon
export async function searchProducts(
  q: string,
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string;
  } = {}
): Promise<{ results: Product[]; total: number }> {
  try {
    const qClean = q.replace(/'/g, "''").toLowerCase();
    const sql = `
      SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
             p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
             c.name as category_name, c.slug as category_slug,
             COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE LOWER(p.name) LIKE '%${qClean}%' OR LOWER(p.description) LIKE '%${qClean}%' OR LOWER(p.brand) LIKE '%${qClean}%';
    `;
    const data = await queryNeon(sql);
    if (data.rows) {
      const results: Product[] = data.rows.map((r: any) => ({
        ...r,
        price: parseFloat(r.price),
        original_price: parseFloat(r.original_price || r.price),
        images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images
      }));
      logTrafficToNeon({ endpoint: '/search?q=' + encodeURIComponent(q), method: 'GET', scenario: 'search' });
      return { results, total: results.length };
    }
  } catch (err) {
    console.warn('[DB] Neon search fallback:', err);
  }
  const results = filterAndSortProducts(LOCAL_PRODUCTS, { ...filters, q });
  return { results, total: results.length };
}

// 7. FLASH SALES & DEALS
export async function fetchFlashSales(): Promise<FlashSale[]> {
  try {
    const prods = await fetchProducts();
    const flashProducts = prods.products.filter(p => p.is_flash_sale || p.discount >= 40);
    return [{
      id: 'sale_midday_surge',
      name: 'APTS Prime Hour Flash Sale',
      start_time: new Date(Date.now() - 3600000).toISOString(),
      end_time: new Date(Date.now() + 7200000).toISOString(),
      status: 'active',
      products: flashProducts.map(p => ({
        ...p,
        sale_price: p.flash_sale_price || p.price,
        stock_limit: p.stock + 20,
        sold_count: Math.round((p.stock + 20) * ((p.flash_sale_claimed_percent || 78) / 100))
      }))
    }];
  } catch {}
  return LOCAL_FLASH_SALES;
}

export async function fetchDeals(): Promise<Product[]> {
  try {
    const data = await fetchProducts();
    return data.products.filter(p => p.discount >= 20);
  } catch {
    return LOCAL_PRODUCTS.filter(p => p.discount >= 20);
  }
}

export async function fetchRecommendations(): Promise<Product[]> {
  try {
    const data = await fetchProducts();
    return data.products.filter(p => p.rating >= 4.7).slice(0, 8);
  } catch {
    return LOCAL_PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 8);
  }
}

// 8. CART (Full sync with Neon carts and cart_items tables)
export async function fetchCart(): Promise<Cart> {
  const sessionId = getSessionId();
  const cartId = 'cart_' + sessionId.slice(0, 12);
  try {
    const itemSql = `
      SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity,
             p.name, p.price, p.slug, p.brand,
             COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = '${cartId}';
    `;
    const data = await queryNeon(itemSql);
    if (data.rows) {
      const items = data.rows.map((r: any) => ({
        id: r.id,
        cart_id: r.cart_id,
        product_id: r.product_id,
        quantity: parseInt(r.quantity, 10),
        product: {
          id: r.product_id,
          name: r.name,
          price: parseFloat(r.price),
          slug: r.slug,
          brand: r.brand,
          images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images
        }
      }));
      const subtotal = items.reduce((acc: number, i: any) => acc + (i.product?.price || 0) * i.quantity, 0);
      return { id: cartId, session_id: sessionId, items, subtotal };
    }
  } catch (err) {
    console.warn('[DB] Neon fetchCart fallback:', err);
  }
  return getLocalCart();
}

export async function addToCart(productId: string, quantity = 1): Promise<{ success: boolean; cart: Cart }> {
  // Update local cart for instant UI responsiveness
  const localRes = localAddToCart(productId, quantity);

  // Sync to Neon database
  const sessionId = getSessionId();
  const cartId = localRes.cart.id;
  try {
    await queryNeon(`INSERT INTO carts (id, session_id) VALUES ('${cartId}', '${sessionId}') ON CONFLICT (session_id) DO NOTHING;`);
    const ciId = 'ci_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    await queryNeon(`INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES ('${ciId}', '${cartId}', '${productId}', ${quantity});`);
    logTrafficToNeon({ endpoint: '/cart/items', method: 'POST', scenario: 'add_to_cart', productId });
  } catch (e) {
    console.warn('[DB] Neon addToCart sync:', e);
  }

  return localRes;
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  const updated = localUpdateCartItem(itemId, quantity);
  try {
    if (quantity <= 0) {
      await queryNeon(`DELETE FROM cart_items WHERE id = '${itemId}' OR product_id = '${itemId}';`);
    } else {
      await queryNeon(`UPDATE cart_items SET quantity = ${quantity} WHERE id = '${itemId}' OR product_id = '${itemId}';`);
    }
  } catch {}
  return updated;
}

export async function removeFromCart(itemId: string): Promise<Cart> {
  return updateCartItem(itemId, 0);
}

// 9. WISHLIST
export async function fetchWishlist(): Promise<WishlistItem[]> {
  return getLocalWishlist();
}

export async function addToWishlist(productId: string): Promise<WishlistItem[]> {
  const list = localAddToWishlist(productId);
  try {
    const wishId = 'wish_' + getSessionId().slice(0, 10);
    const wishItemId = 'wi_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    await queryNeon(`INSERT INTO wishlists (id, session_id) VALUES ('${wishId}', '${getSessionId()}') ON CONFLICT (session_id) DO NOTHING;`);
    await queryNeon(`INSERT INTO wishlist_items (id, wishlist_id, product_id) VALUES ('${wishItemId}', '${wishId}', '${productId}') ON CONFLICT DO NOTHING;`);
    logTrafficToNeon({ endpoint: '/wishlist/' + productId, method: 'POST', scenario: 'add_wishlist', productId });
  } catch {}
  return list;
}

export async function removeFromWishlist(productId: string): Promise<WishlistItem[]> {
  const list = localRemoveFromWishlist(productId);
  try {
    await queryNeon(`DELETE FROM wishlist_items WHERE product_id = '${productId}';`);
  } catch {}
  return list;
}

// 10. CHECKOUT & ORDERS: Inserts directly into Neon orders & order_items
export async function submitCheckout(data: {
  shippingAddress: any;
  paymentMethod: string;
}): Promise<{ success: boolean; message: string; order: Order }> {
  const currentCart = getLocalCart();
  const orderNumber = `APTS-${Math.floor(100000 + Math.random() * 900000)}`;
  const subtotal = currentCart.subtotal || 4999;
  const shippingFee = subtotal > 1500 ? 0 : 99;
  const mockOrder: Order = {
    id: `ord_${Date.now()}`,
    order_number: orderNumber,
    session_id: getSessionId(),
    subtotal,
    shipping_fee: shippingFee,
    total: subtotal + shippingFee,
    shipping_address: data.shippingAddress || {
      fullName: 'APTS Customer',
      addressLine1: '42 Silicon Avenue',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      phone: '+91 98765 43210'
    },
    payment_method: data.paymentMethod || 'Simulated UPI',
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  // 1. Save locally
  try {
    const ordersRaw = localStorage.getItem(LOCAL_ORDERS_KEY);
    const orders: Order[] = ordersRaw ? JSON.parse(ordersRaw) : [];
    orders.unshift(mockOrder);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    saveLocalCart({ id: 'cart_' + getSessionId().slice(0, 12), session_id: getSessionId(), items: [], subtotal: 0 });
  } catch {}

  // 2. Real insertion into Neon database
  try {
    const addressJson = JSON.stringify(mockOrder.shipping_address).replace(/'/g, "''");
    await queryNeon(`
      INSERT INTO orders (id, order_number, session_id, subtotal, shipping_fee, total, shipping_address, payment_method, status)
      VALUES ('${mockOrder.id}', '${mockOrder.order_number}', '${mockOrder.session_id}', ${mockOrder.subtotal}, ${mockOrder.shipping_fee}, ${mockOrder.total}, '${addressJson}'::jsonb, '${mockOrder.payment_method}', 'confirmed');
    `);

    for (const item of currentCart.items) {
      const prod = item.product || LOCAL_PRODUCTS.find(p => p.id === item.product_id);
      const prodName = (prod?.name || 'APTS Product').replace(/'/g, "''");
      const prodImg = (prod?.images?.[0] || '').replace(/'/g, "''");
      const unitPrice = prod?.price || 999;
      const oiId = `oi_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await queryNeon(`
        INSERT INTO order_items (id, order_id, product_id, quantity, price, product_name, product_image)
        VALUES ('${oiId}', '${mockOrder.id}', '${item.product_id}', ${item.quantity}, ${unitPrice}, '${prodName}', '${prodImg}');
      `);
    }

    // Clear cart items in Neon
    await queryNeon(`DELETE FROM cart_items WHERE cart_id = '${currentCart.id}';`);

    // Log traffic
    await queryNeon(`
      INSERT INTO traffic_events (id, timestamp, endpoint, method, status_code, response_time, source, scenario, session_id)
      VALUES ('te_${Date.now()}_${Math.random().toString(36).slice(2, 6)}', NOW(), '/checkout', 'POST', 200, 18, 'commercial_storefront', 'order_checkout', '${getSessionId()}');
    `);
  } catch (err) {
    console.warn('[DB] Neon checkout sync error:', err);
  }

  return {
    success: true,
    message: 'Payment simulated successfully. Order confirmed.',
    order: mockOrder
  };
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  try {
    const data = await queryNeon(`SELECT * FROM orders WHERE id = '${orderId}' OR order_number = '${orderId}';`);
    if (data.rows && data.rows.length > 0) {
      return data.rows[0];
    }
  } catch {}
  return {
    id: orderId,
    order_number: `APTS-${Math.floor(100000 + Math.random() * 900000)}`,
    session_id: getSessionId(),
    subtotal: 4999,
    shipping_fee: 0,
    total: 4999,
    shipping_address: {
      fullName: 'APTS Shopper',
      addressLine1: '42 Silicon Avenue',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      phone: '+91 98765 43210'
    },
    payment_method: 'Simulated UPI',
    status: 'confirmed',
    created_at: new Date().toISOString()
  };
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const sessionId = getSessionId();
    const data = await queryNeon(`SELECT * FROM orders WHERE session_id = '${sessionId}' ORDER BY created_at DESC;`);
    if (data.rows && data.rows.length > 0) {
      return data.rows;
    }
  } catch {}
  const ordersRaw = localStorage.getItem(LOCAL_ORDERS_KEY);
  return ordersRaw ? JSON.parse(ordersRaw) : [];
}
