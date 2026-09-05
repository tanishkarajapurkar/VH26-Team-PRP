import React, { useState, useEffect } from 'react';
import { Package, Truck, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { Order, Product } from '../types/index.js';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.js';
import { InvoiceModal } from '../components/InvoiceModal.js';

interface MyOrdersPageProps {
  onSelectProduct: (p: Product) => void;
  onExplore: () => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ onSelectProduct, onExplore }) => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const list = await api.getOrders();
        setOrders(list);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="border-b border-obsidian-border pb-4">
        <h1 className="text-2xl font-black text-white">Your Orders & Returns</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review recent purchases, download invoices, track packages, or reorder products.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-obsidian-900 border border-obsidian-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-obsidian-900 border border-obsidian-border rounded-xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-obsidian-800 flex items-center justify-center text-slate-500 mx-auto">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">You haven't placed any orders yet</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Check out our Prime deals, audio gear, kitchen gadgets, and skincare collections.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="bg-prime-gold hover:bg-amber-400 text-obsidian-950 font-bold text-xs px-5 py-2.5 rounded-lg transition"
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-obsidian-900 border border-obsidian-border rounded-xl overflow-hidden shadow-lg"
            >
              {/* Order Card Header */}
              <div className="bg-obsidian-950 px-5 py-3 border-b border-obsidian-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Order Placed</span>
                    <span className="font-semibold text-slate-200">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Total</span>
                    <span className="font-extrabold text-prime-gold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Ship To</span>
                    <span className="font-semibold text-slate-200">{order.customerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">Order # {order.id}</span>
                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="flex items-center gap-1 text-slate-300 hover:text-prime-gold font-bold text-xs bg-obsidian-850 px-2.5 py-1 rounded border border-obsidian-750 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-prime-gold" />
                    <span>View Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <Truck className="w-4 h-4" />
                    <span>Arriving: {order.deliverySpeed}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified Purchase
                  </span>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-obsidian-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onSelectProduct(item.product)}
                          className="w-16 h-16 bg-obsidian-950 rounded-lg p-1.5 border border-obsidian-800 flex items-center justify-center cursor-pointer shrink-0 hover:border-prime-gold transition"
                        >
                          <img
                            src={item.product.image_url}
                            alt={item.product.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <h3
                            onClick={() => onSelectProduct(item.product)}
                            className="text-xs font-bold text-white hover:text-prime-gold cursor-pointer line-clamp-1"
                          >
                            {item.product.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Qty: {item.quantity} • Brand: {item.product.brand}
                          </p>
                          <p className="text-xs font-extrabold text-slate-200 mt-1">
                            ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => addToCart(item.product, 1)}
                          className="bg-prime-gold hover:bg-amber-400 text-obsidian-950 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                        >
                          <RefreshCw className="w-3 h-3 text-obsidian-950" />
                          <span>Buy it again</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

    </div>
  );
};
