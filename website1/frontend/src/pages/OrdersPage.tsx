import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, Truck } from 'lucide-react';
import { Order } from '../types';
import { fetchOrders } from '../services/api';
import { useStore } from '../context/StoreContext';

export const OrdersPage: React.FC = () => {
  const { navigateTo } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-apts-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Orders created in this browser session.
          </p>
        </div>

        <button
          onClick={() => navigateTo('shop')}
          className="text-xs text-apts-primary hover:text-cyan-300 font-bold"
        >
          Continue Shopping
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-apts-card border border-apts-border rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center mx-auto text-slate-500">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">No orders found yet</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Simulate a purchase through the checkout flow to record an order.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="bg-apts-primary hover:bg-apts-primaryHover text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-glow-primary transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-apts-card border border-apts-border rounded-2xl p-5 space-y-4 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-apts-border">
                <div>
                  <span className="text-slate-400 block text-[11px]">Order Number</span>
                  <span className="font-bold text-white font-mono">{order.order_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Placed On</span>
                  <span className="text-slate-300 font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total</span>
                  <span className="font-black text-apts-primary">{formatPrice(order.total)}</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                  <Truck className="w-3 h-3" />
                  <span>{order.status.toUpperCase()}</span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="space-y-2">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-slate-300">
                      <span>
                        {it.product_name} <span className="text-slate-500">× {it.quantity}</span>
                      </span>
                      <span className="font-bold text-white">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
