import React from 'react';
import { useStore } from '../context/StoreContext';

export const DealsGrid: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 -mt-24 sm:-mt-36 md:-mt-48 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Shop by Category 4-box */}
        <div className="bg-white p-4 rounded-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-3">Shop by Category</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div
                onClick={() => navigateTo('category', { categoryId: 'cat_computers' })}
                className="cursor-pointer group"
              >
                <div className="h-24 bg-slate-100 rounded overflow-hidden mb-1 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300"
                    alt="Laptops"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] text-slate-700 group-hover:text-amazon-link font-medium leading-tight">
                  Laptops & PCs
                </span>
              </div>

              <div
                onClick={() => navigateTo('category', { categoryId: 'cat_audio' })}
                className="cursor-pointer group"
              >
                <div className="h-24 bg-slate-100 rounded overflow-hidden mb-1 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
                    alt="Audio"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] text-slate-700 group-hover:text-amazon-link font-medium leading-tight">
                  Audio & ANC
                </span>
              </div>

              <div
                onClick={() => navigateTo('category', { categoryId: 'cat_gaming' })}
                className="cursor-pointer group"
              >
                <div className="h-24 bg-slate-100 rounded overflow-hidden mb-1 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300"
                    alt="Gaming"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] text-slate-700 group-hover:text-amazon-link font-medium leading-tight">
                  Gaming Gear
                </span>
              </div>

              <div
                onClick={() => navigateTo('category', { categoryId: 'cat_smart_home' })}
                className="cursor-pointer group"
              >
                <div className="h-24 bg-slate-100 rounded overflow-hidden mb-1 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1558002038-1055907df827?w=300"
                    alt="Smart Home"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] text-slate-700 group-hover:text-amazon-link font-medium leading-tight">
                  Smart Home
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-amazon-link hover:text-amazon-linkHover hover:underline text-left font-medium"
          >
            Explore all categories
          </button>
        </div>

        {/* Card 2: Deal of the Day (ZenithPro) */}
        <div className="bg-white p-4 rounded-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Deal of the Day</h3>
            <div
              onClick={() => navigateTo('product', { productId: 'prod_laptop_pro' })}
              className="cursor-pointer group"
            >
              <div className="h-44 bg-slate-50 rounded overflow-hidden mb-3 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"
                  alt="ZenithPro Laptop"
                  className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amazon-badgeRed text-white text-xs font-bold px-2 py-0.5 rounded">
                  15% off
                </span>
                <span className="text-xs text-amazon-badgeRed font-bold">Limited time deal</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-amazon-linkHover">
                ZenithPro 16" Ultra-Thin Laptop (M3 Max)
              </div>
            </div>
          </div>
          <button
            onClick={() => navigateTo('product', { productId: 'prod_laptop_pro' })}
            className="text-xs text-amazon-link hover:text-amazon-linkHover hover:underline text-left font-medium mt-2"
          >
            See details
          </button>
        </div>

        {/* Card 3: Noise Cancelling & Audio */}
        <div className="bg-white p-4 rounded-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Wireless & ANC Audio</h3>
            <div
              onClick={() => navigateTo('product', { productId: 'prod_headphones_anc' })}
              className="cursor-pointer group"
            >
              <div className="h-44 bg-slate-50 rounded overflow-hidden mb-3 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
                  alt="AuraSound Headphones"
                  className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-amazon-linkHover">
                AuraSound X-1000 Noise-Cancelling
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Premium LDAC Codec & 40-hour battery
              </div>
            </div>
          </div>
          <button
            onClick={() => navigateTo('category', { categoryId: 'cat_audio' })}
            className="text-xs text-amazon-link hover:text-amazon-linkHover hover:underline text-left font-medium mt-2"
          >
            Shop premium audio
          </button>
        </div>

        {/* Card 4: Adventure Smartwatches & Health */}
        <div className="bg-white p-4 rounded-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Smart Wearables & GPS</h3>
            <div
              onClick={() => navigateTo('product', { productId: 'prod_smartwatch_ultra' })}
              className="cursor-pointer group"
            >
              <div className="h-44 bg-slate-50 rounded overflow-hidden mb-3 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
                  alt="Smartwatch"
                  className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-amazon-linkHover">
                TitanApex Rugged GPS Adventure
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Grade 5 Titanium & 14-day battery life
              </div>
            </div>
          </div>
          <button
            onClick={() => navigateTo('category', { categoryId: 'cat_wearables' })}
            className="text-xs text-amazon-link hover:text-amazon-linkHover hover:underline text-left font-medium mt-2"
          >
            Explore wearables
          </button>
        </div>
      </div>
    </div>
  );
};
