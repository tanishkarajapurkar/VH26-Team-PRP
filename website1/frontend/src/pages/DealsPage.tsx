import React, { useState, useEffect } from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { fetchDeals } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals()
      .then(setDeals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-amber-950/40 via-apts-card to-cyan-950/40 border border-amber-500/30 overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Today's Top Value Discounts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Clearance Deals & Special Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Save up to 50% on premium audio, mechanical keyboards, creator ultrabooks, and everyday essentials.
          </p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-apts-card rounded-2xl border border-apts-border"></div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 bg-apts-card rounded-2xl border border-apts-border">
          <p className="text-slate-400 text-sm">No special clearance deals found right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
