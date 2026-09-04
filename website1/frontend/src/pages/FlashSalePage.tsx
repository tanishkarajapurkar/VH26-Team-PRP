import React, { useState, useEffect } from 'react';
import { Zap, Flame, Clock } from 'lucide-react';
import { fetchFlashSales } from '../services/api';
import { FlashSale } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CountdownTimer } from '../components/CountdownTimer';

export const FlashSalePage: React.FC = () => {
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashSales()
      .then(setSales)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeSale = sales[0];
  const products = activeSale?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-rose-950/50 via-apts-card to-amber-950/50 border border-rose-500/30 overflow-hidden shadow-glow-flash">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
              <span>Limited Stock Lightning Deals</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              APTS Prime Hour Flash Sales
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              High-velocity promotional pricing. When the countdown expires or stock is claimed, prices return to standard rates.
            </p>
          </div>

          <div className="bg-slate-950/90 border border-rose-500/40 p-4 rounded-2xl flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" /> Event Ends In:
            </span>
            <CountdownTimer initialSeconds={9677} />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-apts-card rounded-2xl border border-apts-border"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-apts-card rounded-2xl border border-apts-border">
          <p className="text-slate-400 text-sm">No active flash sales at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
