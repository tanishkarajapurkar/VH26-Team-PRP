import React from 'react';
import { Star, RotateCcw } from 'lucide-react';
import { Category } from '../types';

interface FilterPanelProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  onReset: () => void;
  availableBrands?: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
  selectedBrand,
  onBrandChange,
  onReset,
  availableBrands = [
    'APTS Acoustic',
    'APTS Compute',
    'APTS Display',
    'APTS Gaming',
    'APTS Atelier',
    'APTS Living',
    'APTS Culinary',
    'APTS Kinetic',
    'APTS Grooming'
  ]
}) => {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(p);
  };

  return (
    <div className="bg-apts-card border border-apts-border rounded-2xl p-5 text-sm text-slate-300 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-apts-border">
        <h3 className="font-bold text-white text-base">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs text-apts-primary hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
          Category
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-apts-primary/15 text-apts-primary font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedCategory === cat.id
                  ? 'bg-apts-primary/15 text-apts-primary font-bold'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Max Price
          </h4>
          <span className="text-xs font-bold text-white">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="500"
          max="100000"
          step="500"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(parseInt(e.target.value, 10))}
          className="w-full accent-cyan-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>₹500</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
          Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onMinRatingChange(minRating === stars ? 0 : stars)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                minRating === stars
                  ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center text-amber-400">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {availableBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => onBrandChange(selectedBrand === brand ? '' : brand)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                selectedBrand === brand
                  ? 'bg-apts-primary/15 text-apts-primary font-bold'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
