import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, Zap, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { api } from '../services/api.js';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, onNavigateCategory }) => {
  const [trending, setTrending] = useState<{ product: Product; score: number }[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [beautyItems, setBeautyItems] = useState<Product[]>([]);
  const [homeItems, setHomeItems] = useState<Product[]>([]);
  const [techItems, setTechItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [trendData, recData, allProducts] = await Promise.all([
          api.getTrending(),
          api.getRecommendations(),
          api.getProducts()
        ]);

        setTrending(trendData);
        setRecommendations(recData);

        // Filter departmental categories
        setBeautyItems(allProducts.filter(p => p.category === 'beauty').slice(0, 4));
        setHomeItems(allProducts.filter(p => p.category === 'home_appliances' || p.category === 'kitchen').slice(0, 4));
        setTechItems(allProducts.filter(p => p.category === 'tech' || p.category === 'gaming').slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage feeds:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      
      {/* Prime Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-slate-900 border border-obsidian-border p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-prime-gold/20 text-prime-gold border border-prime-gold/40 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-prime-gold" />
            <span>Prime Mega Deals • Limited Time</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Next-Gen Lifestyle & Electronics. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime-gold via-amber-400 to-sky-400">
              Delivered Tomorrow.
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-lg">
            Explore 25+ curated flagships across Beauty & Skincare, Smart Appliances, Pro Audio, and Gaming. Fast guaranteed shipping for Prime members.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigateCategory('all')}
              className="bg-gradient-to-r from-prime-gold to-amber-500 hover:from-amber-400 hover:to-prime-gold text-obsidian-950 font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95"
            >
              <span>Shop All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateCategory('tech')}
              className="bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-obsidian-700 font-bold text-sm px-6 py-3 rounded-xl transition"
            >
              Explore Tech & Audio
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid in Hero */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-obsidian-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-prime-gold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Free Prime Delivery</p>
              <p className="text-[11px] text-slate-400">On all eligible orders over $35</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Authentic Guarantee</p>
              <p className="text-[11px] text-slate-400">Directly from certified brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Hassle-Free 30-Day Returns</p>
              <p className="text-[11px] text-slate-400">Instant refund or replacement</p>
            </div>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-prime-gold/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Category Quick Selector Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-white tracking-tight">Shop by Department</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { id: 'beauty', name: 'Beauty & Skincare', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80', count: '5 items' },
            { id: 'home_appliances', name: 'Home Appliances', img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&q=80', count: '5 items' },
            { id: 'kitchen', name: 'Kitchen & Dining', img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=300&q=80', count: '5 items' },
            { id: 'tech', name: 'Audio & Tech', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', count: '5 items' },
            { id: 'gaming', name: 'Gaming & Setup', img: 'https://images.unsplash.com/photo-1527814050087-1798df55d533?w=300&q=80', count: '5 items' },
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateCategory(cat.id)}
              className="group bg-obsidian-900 border border-obsidian-border hover:border-prime-gold/50 rounded-xl p-3 cursor-pointer transition flex flex-col items-center text-center hover:bg-obsidian-850"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-obsidian-950 mb-2 border border-obsidian-800 flex items-center justify-center">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-xs font-bold text-slate-200 group-hover:text-prime-gold transition">{cat.name}</h3>
              <span className="text-[10px] text-slate-500 mt-0.5">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 1: 🔥 Trending Now (Ranked dynamically by user behavior events) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Trending Products Right Now</h2>
              <p className="text-xs text-slate-400">High shopper demand calculated from live Supabase events</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateCategory('all')}
            className="text-xs font-bold text-prime-gold hover:underline flex items-center gap-1"
          >
            <span>See all trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(trending.length > 0 ? trending.map(t => t.product) : recommendations.slice(0, 4)).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Section 2: ✨ Recommended for You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-prime-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Recommended For Your Home & Style</h2>
              <p className="text-xs text-slate-400">Top-rated items with 4.8+ verified stars</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateCategory('all')}
            className="text-xs font-bold text-prime-gold hover:underline flex items-center gap-1"
          >
            <span>View more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Beauty & Skincare Spotlight */}
      <section className="space-y-4 bg-obsidian-900/60 p-6 rounded-2xl border border-obsidian-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white">Spotlight: Beauty, Care & Wellness</h2>
            <p className="text-xs text-slate-400">Dermatologist-tested skincare, serums & luxury haircare</p>
          </div>
          <button
            onClick={() => onNavigateCategory('beauty')}
            className="text-xs font-bold text-prime-gold hover:underline flex items-center gap-1"
          >
            <span>Shop Beauty</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {beautyItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Section 4: Home & Kitchen Appliances */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white">Smart Home & Kitchen Appliances</h2>
            <p className="text-xs text-slate-400">Robot vacuums, air fryers, HEPA purifiers & espresso makers</p>
          </div>
          <button
            onClick={() => onNavigateCategory('home_appliances')}
            className="text-xs font-bold text-prime-gold hover:underline flex items-center gap-1"
          >
            <span>Shop Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {homeItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
