import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { DealsGrid } from '../components/DealsGrid';
import { TrendingSlider } from '../components/TrendingSlider';
import { RecommendationsSection } from '../components/RecommendationsSection';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

export const HomePage: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const { navigateTo } = useStore();

  useEffect(() => {
    fetchProducts({ limit: 4, sort: 'rating' })
      .then(setBestSellers)
      .catch(console.error);
  }, []);

  return (
    <div className="pb-12">
      {/* 1. Hero Carousel */}
      <HeroBanner />

      {/* 2. Overlaid Deals Grid */}
      <DealsGrid />

      {/* 3. 🔥 Trending Products Slider (Real-Time from user activity) */}
      <TrendingSlider />

      {/* 4. Recommended for You (Future AI Engine Hook) */}
      <RecommendationsSection />

      {/* 5. Best Sellers Section */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 mb-8 max-w-7xl mx-auto shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Best Sellers in Computers & Tech
            </h2>
            <p className="text-xs text-slate-500">Our most popular products based on sales</p>
          </div>
          <button
            onClick={() => navigateTo('category', { categoryId: 'cat_computers' })}
            className="text-xs text-amazon-link hover:text-amazon-linkHover font-medium hover:underline"
          >
            See more
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};
