import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <footer className="bg-[#060910] border-t border-apts-border text-slate-400 text-xs">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-apts-border/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-apts-card border border-white/5 flex items-center justify-center text-apts-primary mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Express Shipping</h4>
            <p className="text-slate-500 text-xs mt-1">Free delivery on orders over ₹999</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-apts-card border border-white/5 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">100% Genuine</h4>
            <p className="text-slate-500 text-xs mt-1">Direct from certified manufacturers</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-apts-card border border-white/5 flex items-center justify-center text-amber-400 mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">7-Day Easy Returns</h4>
            <p className="text-slate-500 text-xs mt-1">Hassle-free replacement policy</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-apts-card border border-white/5 flex items-center justify-center text-rose-400 mb-3">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">24/7 Dedicated Support</h4>
            <p className="text-slate-500 text-xs mt-1">Instant assistance anytime</p>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-slate-200 font-bold mb-3 text-sm">Catalog</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">
                All Products
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('category', { categoryId: 'cat_electronics' })} className="hover:text-white transition-colors">
                Electronics & Audio
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('category', { categoryId: 'cat_computers' })} className="hover:text-white transition-colors">
                Computers & Laptops
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('category', { categoryId: 'cat_gaming' })} className="hover:text-white transition-colors">
                Gaming Peripherals
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-3 text-sm">Special Deals</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigateTo('flash_sale')} className="hover:text-white transition-colors">
                Prime Flash Sales
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('deals')} className="hover:text-white transition-colors">
                Today's Clearance Deals
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('wishlist')} className="hover:text-white transition-colors">
                My Saved Wishlist
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('cart')} className="hover:text-white transition-colors">
                View Shopping Cart
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-3 text-sm">Customer Care</h4>
          <ul className="space-y-2 text-slate-400">
            <li>Order Tracking</li>
            <li>Return & Refund Policy</li>
            <li>Shipping Rates & Times</li>
            <li>Warranty Guidelines</li>
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-apts-primary to-apts-accent flex items-center justify-center text-white font-black text-sm">
              A
            </div>
            <span className="font-bold text-white text-sm">APTS E-COMMERCE</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Commercial storefront & realistic high-throughput workload engine for caching research and real-time distributed benchmarking.
          </p>
          <span className="inline-block px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
            Workload Node: active
          </span>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-apts-border/60 py-6 text-center text-slate-600 text-[11px]">
        &copy; {new Date().getFullYear()} APTS E-Commerce. All rights reserved. Precision digital shopping.
      </div>
    </footer>
  );
};
