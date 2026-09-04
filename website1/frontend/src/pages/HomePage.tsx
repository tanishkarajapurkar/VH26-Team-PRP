import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchProducts, fetchCategories, fetchRecommendations } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { FlashSaleSection } from '../components/FlashSaleSection';

export const HomePage: React.FC = () => {
  const { navigateTo } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods, recs] = await Promise.all([
          fetchCategories(),
          fetchProducts({ limit: 16 }),
          fetchRecommendations()
        ]);

        setCategories(cats);
        // Distribute products into sections
        setTrendingProducts(prods.products.slice(0, 4));
        setBestSellers(prods.products.slice(4, 8));
        setRecommendations(recs.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* 1. HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1627] via-apts-card to-[#0e172a] border border-apts-border shadow-card-elevated p-8 sm:p-14 text-center flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-apts-primary/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-apts-accent/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apts-primary/10 text-apts-primary border border-apts-primary/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to APTS E-Commerce</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            EVERYTHING YOU NEED
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-normal max-w-xl mx-auto">
            Discover precision-crafted technology, personal audio, workstation gear, and lifestyle products made for everyday life.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="bg-apts-primary hover:bg-apts-primaryHover text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-glow-primary transition-all duration-200 flex items-center gap-2 group"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigateTo('flash_sale')}
              className="bg-apts-surface hover:bg-slate-800 text-slate-200 border border-apts-border hover:border-slate-700 font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>View Flash Sales</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse our complete catalog across tech, fashion, living, and gaming.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-apts-primary hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.slice(0, 7).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. AMAZON-STYLE FLASH SALE SECTION WITH LIVE COUNTDOWN */}
      <FlashSaleSection />

      {/* 4. TRENDING NOW */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Trending Now
              </h2>
              <p className="text-xs text-slate-400">
                Products seeing high real-time demand and customer interest.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('shop', { sort: 'popular' } as any)}
            className="text-xs font-bold text-apts-primary hover:text-cyan-300 flex items-center gap-1"
          >
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Best Sellers
              </h2>
              <p className="text-xs text-slate-400">
                Top rated customer favorites with verified 4.7+ star reviews.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('shop', { sort: 'rating' } as any)}
            className="text-xs font-bold text-apts-primary hover:text-cyan-300 flex items-center gap-1"
          >
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. RECOMMENDED FOR YOU */}
      {recommendations.length > 0 && (
        <section className="pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Recommended For You
              </h2>
              <p className="text-xs text-slate-400">
                Handpicked suggestions tailored to your shopping preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
