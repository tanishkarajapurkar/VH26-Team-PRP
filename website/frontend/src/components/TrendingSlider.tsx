import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, RefreshCw } from 'lucide-react';
import { fetchTrending } from '../services/api';
import { TrendingProduct } from '../types';
import { ProductCard } from './ProductCard';

export const TrendingSlider: React.FC = () => {
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadTrending = async () => {
    try {
      setLoading(true);
      const data = await fetchTrending(12);
      setTrending(data);
    } catch (err) {
      console.error('Error loading trending products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
    // Auto refresh every 30s to show traffic simulator activity
    const interval = setInterval(loadTrending, 30000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (trending.length === 0 && !loading) return null;

  return (
    <div className="bg-white p-5 rounded-sm border border-slate-200 mb-8 max-w-7xl mx-auto shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-1.5 rounded-full text-orange-600">
            <Flame size={22} className="fill-orange-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Trending Now
              <span className="text-xs font-normal text-slate-500 hidden sm:inline">
                (Calculated from real-time views, searches, carts & orders)
              </span>
            </h2>
          </div>
        </div>

        <button
          onClick={loadTrending}
          className="flex items-center gap-1.5 text-xs text-amazon-link hover:text-amazon-linkHover font-medium px-2 py-1 rounded hover:bg-slate-50 transition-colors"
          title="Refresh Trending"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="relative group">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-16 bg-white/90 hover:bg-white border border-slate-300 shadow-md rounded-r flex items-center justify-center text-slate-800 transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {trending.map((t, idx) => {
            if (!t.product) return null;
            return (
              <div key={t.id || t.product_id} className="min-w-[240px] max-w-[240px] shrink-0">
                <ProductCard
                  product={t.product}
                  badge={`#${idx + 1} Trending`}
                />
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-16 bg-white/90 hover:bg-white border border-slate-300 shadow-md rounded-l flex items-center justify-center text-slate-800 transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
