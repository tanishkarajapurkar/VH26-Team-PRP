import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, ExternalLink } from 'lucide-react';
import { Order } from '../types';
import { fetchOrders } from '../services/api';
import { useStore } from '../context/StoreContext';

export const OrdersPage: React.FC = () => {
  const { currentUser, navigateTo, addToCart } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOrders(currentUser.id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Orders</h1>
          <p className="text-xs text-slate-500">
            Showing order history for <span className="font-semibold text-slate-800">{currentUser.name}</span>
          </p>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-amazon-link hover:underline font-medium"
        >
          Back to Shopping
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-sm p-12 text-center shadow-sm">
          <Package size={48} className="text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800 mb-1">No orders placed yet</h2>
          <p className="text-xs text-slate-500 mb-6">
            Looking for an order? Orders placed by this simulated user will show up here.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-slate-900 px-6 py-2 rounded-full text-xs shadow"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden text-xs"
            >
              {/* Order Header bar */}
              <div className="bg-slate-100 p-4 border-b border-slate-300 flex flex-wrap items-center justify-between gap-4 text-slate-600">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="block text-[11px] uppercase text-slate-500 font-medium">Order Placed</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase text-slate-500 font-medium">Total</span>
                    <span className="font-semibold text-slate-800">${order.total_amount.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase text-slate-500 font-medium">Ship To</span>
                    <span className="text-amazon-link hover:underline cursor-pointer">
                      {order.shipping_address?.fullName || currentUser.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[11px] uppercase text-slate-500 font-medium">Order # {order.id}</span>
                  <span className="text-amazon-link hover:underline cursor-pointer">View invoice</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 divide-y divide-slate-100">
                <div className="text-sm font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <span>✓ Delivered Tomorrow by 8 PM</span>
                </div>

                {order.items?.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        onClick={() => navigateTo('product', { productId: item.product_id })}
                        className="w-20 h-20 bg-slate-50 border p-1 rounded shrink-0 cursor-pointer"
                      >
                        <img
                          src={item.product?.images[0]}
                          alt=""
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4
                          onClick={() => navigateTo('product', { productId: item.product_id })}
                          className="font-medium text-slate-900 hover:text-amazon-linkHover cursor-pointer leading-snug line-clamp-2"
                        >
                          {item.product?.title || `Product (${item.product_id})`}
                        </h4>
                        <div className="text-slate-500">Qty: {item.quantity}</div>
                        <div className="font-bold text-slate-900">${item.price.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0 sm:w-44">
                      <button
                        onClick={() => addToCart(item.product_id, 1)}
                        className="w-full py-1.5 px-3 bg-amazon-yellow hover:bg-amazon-yellowHover text-slate-900 font-bold rounded-full border border-[#fcd200] shadow-sm flex items-center justify-center gap-1"
                      >
                        <RefreshCw size={12} />
                        <span>Buy it again</span>
                      </button>

                      <button
                        onClick={() => navigateTo('product', { productId: item.product_id })}
                        className="w-full py-1.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-full"
                      >
                        View your item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
