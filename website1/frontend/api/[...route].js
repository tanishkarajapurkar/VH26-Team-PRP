const NEON_SQL_URL = 'https://ep-soft-grass-ae156iob.c-2.us-east-2.aws.neon.tech/sql';
const NEON_CONN = 'postgresql://neondb_owner:npg_aJiIkN92sQmY@ep-soft-grass-ae156iob.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function queryNeon(sql) {
  const r = await fetch(NEON_SQL_URL, {
    method: 'POST',
    headers: {
      'Neon-Connection-String': NEON_CONN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  const data = await r.json();
  if (data.message && data.severity === 'ERROR') {
    throw new Error(data.message);
  }
  return data;
}

function logTraffic(endpoint, method, status, duration, source, scenario, sessionId, productId) {
  const id = 'te_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const q = `INSERT INTO traffic_events (id, timestamp, endpoint, method, status_code, response_time, source, scenario, session_id, product_id)
             VALUES ('${id}', NOW(), '${endpoint}', '${method}', ${status}, ${duration}, '${source}', ${scenario ? `'${scenario}'` : 'NULL'}, ${sessionId ? `'${sessionId}'` : 'NULL'}, ${productId ? `'${productId}'` : 'NULL'})
             ON CONFLICT (id) DO NOTHING;`;
  queryNeon(q).catch(() => {});
}

export default async function handler(req, res) {
  const start = Date.now();
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sessionId = req.headers['x-session-id'] || 'sess_anon';
  const rawRoute = req.query.route || [];
  const routeArr = Array.isArray(rawRoute) ? rawRoute : [rawRoute];
  // Remove 'v1' prefix if present
  const segments = routeArr[0] === 'v1' ? routeArr.slice(1) : routeArr;
  const endpoint = segments.join('/');

  try {
    // 1. PRODUCTS: /api/v1/products
    if (segments[0] === 'products' && segments.length === 1) {
      if (req.method === 'GET') {
        const cat = req.query.category;
        const brand = req.query.brand;
        const sort = req.query.sort;

        let whereClauses = ["p.status = 'active'"];
        if (cat && cat !== 'all') {
          whereClauses.push(`(c.slug = '${cat.replace(/'/g, "''")}' OR p.category_id = '${cat.replace(/'/g, "''")}')`);
        }
        if (brand) {
          whereClauses.push(`LOWER(p.brand) = LOWER('${brand.replace(/'/g, "''")}')`);
        }

        let orderBy = 'p.rating DESC';
        if (sort === 'price-asc') orderBy = 'p.price ASC';
        else if (sort === 'price-desc') orderBy = 'p.price DESC';
        else if (sort === 'discount-desc') orderBy = 'p.discount DESC';

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

        const result = await queryNeon(sql);
        const products = result.rows || [];
        logTraffic('/api/v1/products', 'GET', 200, Date.now() - start, 'commercial_storefront', 'catalog_browse', sessionId);
        return res.status(200).json({ products, total: products.length, page: 1, totalPages: 1 });
      }
    }

    // 2. SINGLE PRODUCT: /api/v1/products/:id
    if (segments[0] === 'products' && segments.length === 2) {
      const prodId = segments[1];
      const sql = `
        SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
               p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
               c.name as category_name, c.slug as category_slug,
               COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images,
               COALESCE((SELECT json_object_agg(spec_name, spec_value) FROM product_specifications WHERE product_id = p.id), '{}') as specifications
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = '${prodId.replace(/'/g, "''")}' OR p.slug = '${prodId.replace(/'/g, "''")}'
        LIMIT 1;
      `;
      const result = await queryNeon(sql);
      if (result.rows && result.rows.length > 0) {
        logTraffic('/api/v1/products/' + prodId, 'GET', 200, Date.now() - start, 'commercial_storefront', 'product_detail', sessionId, prodId);
        return res.status(200).json(result.rows[0]);
      }
      return res.status(404).json({ error: 'Product not found' });
    }

    // 3. PRODUCT REVIEWS: /api/v1/products/:id/reviews
    if (segments[0] === 'products' && segments.length === 3 && segments[2] === 'reviews') {
      const prodId = segments[1];
      const sql = `SELECT * FROM reviews WHERE product_id = '${prodId.replace(/'/g, "''")}' ORDER BY created_at DESC;`;
      const result = await queryNeon(sql);
      return res.status(200).json(result.rows || []);
    }

    // 4. RELATED PRODUCTS: /api/v1/products/:id/related
    if (segments[0] === 'products' && segments.length === 3 && segments[2] === 'related') {
      const prodId = segments[1];
      const sql = `
        SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
               p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
               c.name as category_name, c.slug as category_slug,
               COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id != '${prodId.replace(/'/g, "''")}'
        LIMIT 4;
      `;
      const result = await queryNeon(sql);
      return res.status(200).json(result.rows || []);
    }

    // 5. CATEGORIES: /api/v1/categories
    if (segments[0] === 'categories') {
      const sql = `SELECT * FROM categories ORDER BY name ASC;`;
      const result = await queryNeon(sql);
      logTraffic('/api/v1/categories', 'GET', 200, Date.now() - start, 'commercial_storefront', 'categories_list', sessionId);
      return res.status(200).json(result.rows || []);
    }

    // 6. FLASH SALES: /api/v1/flash-sales
    if (segments[0] === 'flash-sales') {
      const sql = `
        SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
               p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
               COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
        FROM products p
        WHERE p.discount >= 40
        LIMIT 8;
      `;
      const result = await queryNeon(sql);
      const flashSale = [{
        id: 'sale_live',
        name: 'Prime Hour Flash Sale',
        start_time: new Date(Date.now() - 3600000).toISOString(),
        end_time: new Date(Date.now() + 7200000).toISOString(),
        status: 'active',
        products: (result.rows || []).map(p => ({
          ...p,
          sale_price: p.price,
          stock_limit: p.stock + 20,
          sold_count: Math.round((p.stock + 20) * 0.78),
          flash_sale_claimed_percent: 78
        }))
      }];
      logTraffic('/api/v1/flash-sales', 'GET', 200, Date.now() - start, 'commercial_storefront', 'flash_sales', sessionId);
      return res.status(200).json(flashSale);
    }

    // 7. DEALS & RECOMMENDATIONS: /api/v1/deals, /api/v1/recommendations
    if (segments[0] === 'deals' || segments[0] === 'recommendations') {
      const sql = `
        SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
               p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
               COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
        FROM products p
        ORDER BY p.rating DESC
        LIMIT 8;
      `;
      const result = await queryNeon(sql);
      return res.status(200).json(result.rows || []);
    }

    // 8. SEARCH: /api/v1/search
    if (segments[0] === 'search') {
      const q = (req.query.q || '').toLowerCase();
      const sql = `
        SELECT p.id, p.name, p.slug, p.description, p.price, p.original_price, p.discount,
               p.category_id, p.brand, p.rating, p.review_count, p.stock, p.status,
               c.name as category_name, c.slug as category_slug,
               COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE LOWER(p.name) LIKE '%${q.replace(/'/g, "''")}%' OR LOWER(p.description) LIKE '%${q.replace(/'/g, "''")}%' OR LOWER(p.brand) LIKE '%${q.replace(/'/g, "''")}%';
      `;
      const result = await queryNeon(sql);
      logTraffic('/api/v1/search?q=' + q, 'GET', 200, Date.now() - start, 'commercial_storefront', 'search', sessionId);
      return res.status(200).json({ results: result.rows || [], total: (result.rows || []).length });
    }

    // 9. CART: /api/v1/cart
    if (segments[0] === 'cart') {
      const cartId = 'cart_' + sessionId.slice(0, 12);
      await queryNeon(`INSERT INTO carts (id, session_id) VALUES ('${cartId}', '${sessionId}') ON CONFLICT (session_id) DO NOTHING;`);

      if (segments.length === 1 && req.method === 'GET') {
        const itemSql = `
          SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity,
                 p.name, p.price, p.slug, p.brand,
                 COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
          FROM cart_items ci
          JOIN products p ON ci.product_id = p.id
          WHERE ci.cart_id = '${cartId}';
        `;
        const itemRes = await queryNeon(itemSql);
        const items = (itemRes.rows || []).map(r => ({
          id: r.id,
          cart_id: r.cart_id,
          product_id: r.product_id,
          quantity: r.quantity,
          product: {
            id: r.product_id,
            name: r.name,
            price: parseFloat(r.price),
            slug: r.slug,
            brand: r.brand,
            images: r.images
          }
        }));
        const subtotal = items.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0);
        return res.status(200).json({ id: cartId, session_id: sessionId, items, subtotal });
      }

      // ADD TO CART: POST /api/v1/cart/items
      if (segments.length === 2 && segments[1] === 'items' && req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const prodId = body.productId;
        const qty = parseInt(body.quantity || 1, 10);
        const itemId = 'ci_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

        await queryNeon(`
          INSERT INTO cart_items (id, cart_id, product_id, quantity)
          VALUES ('${itemId}', '${cartId}', '${prodId}', ${qty})
          ON CONFLICT (id) DO UPDATE SET quantity = cart_items.quantity + ${qty};
        `);

        logTraffic('/api/v1/cart/items', 'POST', 200, Date.now() - start, 'commercial_storefront', 'add_to_cart', sessionId, prodId);

        // Return updated cart
        const itemSql = `
          SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity,
                 p.name, p.price, p.slug, p.brand,
                 COALESCE((SELECT json_agg(image_url ORDER BY sort_order) FROM product_images WHERE product_id = p.id), '[]') as images
          FROM cart_items ci
          JOIN products p ON ci.product_id = p.id
          WHERE ci.cart_id = '${cartId}';
        `;
        const itemRes = await queryNeon(itemSql);
        const items = (itemRes.rows || []).map(r => ({
          id: r.id,
          cart_id: r.cart_id,
          product_id: r.product_id,
          quantity: r.quantity,
          product: {
            id: r.product_id,
            name: r.name,
            price: parseFloat(r.price),
            slug: r.slug,
            brand: r.brand,
            images: r.images
          }
        }));
        const subtotal = items.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0);
        return res.status(200).json({ success: true, cart: { id: cartId, session_id: sessionId, items, subtotal } });
      }

      // UPDATE/DELETE ITEM: PATCH or DELETE /api/v1/cart/items/:id
      if (segments.length === 3 && segments[1] === 'items') {
        const itemId = segments[2];
        if (req.method === 'DELETE') {
          await queryNeon(`DELETE FROM cart_items WHERE id = '${itemId}' OR product_id = '${itemId}';`);
        } else if (req.method === 'PATCH') {
          const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
          const qty = parseInt(body.quantity || 1, 10);
          if (qty <= 0) {
            await queryNeon(`DELETE FROM cart_items WHERE id = '${itemId}' OR product_id = '${itemId}';`);
          } else {
            await queryNeon(`UPDATE cart_items SET quantity = ${qty} WHERE id = '${itemId}' OR product_id = '${itemId}';`);
          }
        }
        return res.status(200).json({ success: true });
      }
    }

    // 10. CHECKOUT: POST /api/v1/checkout
    if (segments[0] === 'checkout' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const cartId = 'cart_' + sessionId.slice(0, 12);

      // Fetch cart items
      const itemSql = `
        SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price,
               COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1), '') as image
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = '${cartId}';
      `;
      const itemRes = await queryNeon(itemSql);
      const rawItems = itemRes.rows || [];

      const subtotal = rawItems.reduce((acc, i) => acc + parseFloat(i.price) * i.quantity, 0) || 4999;
      const shippingFee = subtotal > 1500 ? 0 : 99;
      const total = subtotal + shippingFee;

      const orderId = 'ord_' + Date.now();
      const orderNumber = 'APTS-' + Math.floor(100000 + Math.random() * 900000);
      const addressJson = JSON.stringify(body.shippingAddress || {
        fullName: 'APTS Customer',
        addressLine1: '42 Silicon Avenue',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        phone: '+91 98765 43210'
      }).replace(/'/g, "''");

      // Insert Order into Neon
      await queryNeon(`
        INSERT INTO orders (id, order_number, session_id, subtotal, shipping_fee, total, shipping_address, payment_method, status)
        VALUES ('${orderId}', '${orderNumber}', '${sessionId}', ${subtotal}, ${shippingFee}, ${total}, '${addressJson}'::jsonb, '${(body.paymentMethod || 'UPI').replace(/'/g, "''")}', 'confirmed');
      `);

      // Insert Order Items into Neon
      for (const item of rawItems) {
        const oiId = 'oi_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        await queryNeon(`
          INSERT INTO order_items (id, order_id, product_id, quantity, price, product_name, product_image)
          VALUES ('${oiId}', '${orderId}', '${item.product_id}', ${item.quantity}, ${parseFloat(item.price)}, '${item.name.replace(/'/g, "''")}', '${item.image}');
        `);
      }

      // Clear cart
      await queryNeon(`DELETE FROM cart_items WHERE cart_id = '${cartId}';`);

      logTraffic('/api/v1/checkout', 'POST', 200, Date.now() - start, 'commercial_storefront', 'order_checkout', sessionId);

      return res.status(200).json({
        success: true,
        message: 'Order placed successfully',
        order: {
          id: orderId,
          order_number: orderNumber,
          session_id: sessionId,
          subtotal,
          shipping_fee: shippingFee,
          total,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }
      });
    }

    // 11. ORDERS: GET /api/v1/orders
    if (segments[0] === 'orders') {
      const sql = `SELECT * FROM orders WHERE session_id = '${sessionId}' ORDER BY created_at DESC;`;
      const result = await queryNeon(sql);
      return res.status(200).json(result.rows || []);
    }

    // 12. TRAFFIC EVENTS: GET /api/v1/traffic/events
    if (segments[0] === 'traffic' && segments[1] === 'events') {
      const sql = `SELECT * FROM traffic_events ORDER BY timestamp DESC LIMIT 50;`;
      const result = await queryNeon(sql);
      return res.status(200).json(result.rows || []);
    }

    // 13. TRAFFIC STATS: GET /api/v1/traffic/stats
    if (segments[0] === 'traffic' && segments[1] === 'stats') {
      const sql = `SELECT COUNT(*) as total FROM traffic_events;`;
      const result = await queryNeon(sql);
      return res.status(200).json({ totalLogged: parseInt(result.rows[0].total, 10), recentEvents: [] });
    }

    return res.status(404).json({ error: 'Endpoint not found: ' + endpoint });
  } catch (err) {
    console.error('Serverless route error:', err);
    return res.status(500).json({ error: err.message });
  }
}
