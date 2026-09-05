import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, Flame } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { ProductCard } from './ProductCard';
import { FlashSale } from '../types';
import { fetchFlashSales } from '../services/api';
import { useStore } from '../context/StoreContext';

export const FlashSaleSection: React.FC = () => {
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigateTo } = useStore();

  useEffect(() => {
    fetchFlashSales()
      .then(setSales)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeSale = sales[0];
  const flashProducts = activeSale?.products || [];

  if (loading || flashProducts.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-rose-950/20 via-apts-card to-apts-card border border-rose-500/20 shadow-glow-flash overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header with Title and Countdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Flame className="w-5 h-5 fill-rose-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              FLASH SALE
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-sm">
                Live Now
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Limited-time promotional inventory with up to 50% discount. Prices reset when stock reaches 100%.
          </p>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-rose-500/30 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Ends in:</span>
          </div>
          <CountdownTimer initialSeconds={9677} />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {flashProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer link to view all flash deals */}
      <div className="mt-6 pt-4 text-center border-t border-white/5">
        <button
          onClick={() => navigateTo('flash_sale')}
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors group"
        >
          <span>Explore All Flash Deals & Lightning Specials</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
