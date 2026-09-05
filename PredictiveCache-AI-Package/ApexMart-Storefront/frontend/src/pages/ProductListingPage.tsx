import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Star, Check } from 'lucide-react';
import { Product } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.js';

interface ProductListingPageProps {
  initialCategory?: string;
  searchQuery?: string;
  wishlistOnly?: boolean;
  onSelectProduct: (product: Product) => void;
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  initialCategory = 'all',
  searchQuery = '',
  wishlistOnly = false,
  onSelectProduct,
}) => {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [category, setCategory] = useState(initialCategory);
  const [primeOnly, setPrimeOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      try {
        let list: Product[] = [];
        if (searchQuery.trim()) {
          list = await api.search(searchQuery, category);
        } else {
          list = await api.getProducts({ category: category !== 'all' ? category : undefined });
        }
        setProducts(list);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, [category, searchQuery]);

  // Apply in-memory client filters
  let filtered = products.filter((p) => {
    if (wishlistOnly && !wishlist.includes(p.id)) return false;
    if (primeOnly && !p.prime_eligible) return false;
    if (p.rating < minRating) return false;
    if (p.price < priceRange.min || p.price > priceRange.max) return false;
    return true;
  });

  // Apply sorting
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-obsidian-900 border border-obsidian-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">
            {wishlistOnly
              ? `Saved in Your Wishlist (${filtered.length})`
              : searchQuery
              ? `Results for "${searchQuery}" (${filtered.length} products)`
              : category === 'all'
              ? `All Departments (${filtered.length} products)`
              : `${category.replace('_', ' ').toUpperCase()} (${filtered.length} products)`}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Prices and availability are subject to change. Free delivery with Prime.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-obsidian-950 border border-obsidian-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-prime-gold cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <aside className="space-y-6 bg-obsidian-900/80 border border-obsidian-border p-4 rounded-xl h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-obsidian-800 text-slate-200 font-bold text-sm">
            <SlidersHorizontal className="w-4 h-4 text-prime-gold" />
            <span>Filter Results</span>
          </div>

          {/* Department Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Department</h3>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Catalog' },
                { id: 'beauty', label: 'Beauty & Skincare' },
                { id: 'home_appliances', label: 'Home Appliances' },
                { id: 'kitchen', label: 'Kitchen & Dining' },
                { id: 'tech', label: 'Audio & Electronics' },
                { id: 'gaming', label: 'Gaming & Setup' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`block w-full text-left px-2 py-1 rounded transition ${
                    category === c.id
                      ? 'bg-prime-gold/20 text-prime-gold font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prime Delivery Filter */}
          <div className="space-y-2 pt-3 border-t border-obsidian-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Delivery</h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={primeOnly}
                onChange={(e) => setPrimeOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-obsidian-950 border-obsidian-700 text-prime-gold focus:ring-0 cursor-pointer"
              />
              <span className="font-extrabold text-prime-gold">⚡prime</span>
              <span className="text-slate-400 text-[11px]">Free Next-Day</span>
            </label>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-obsidian-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Customer Rating</h3>
            <div className="space-y-1.5 text-xs">
              {[4.8, 4.5, 4.0].map((starThreshold) => (
                <button
                  key={starThreshold}
                  onClick={() => setMinRating(minRating === starThreshold ? 0 : starThreshold)}
                  className={`flex items-center gap-1.5 w-full px-2 py-1 rounded transition ${
                    minRating === starThreshold ? 'bg-amber-500/20 text-prime-gold font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex text-prime-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(starThreshold) ? 'fill-prime-gold' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                  <span>{starThreshold} & Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-3 border-t border-obsidian-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Price</h3>
            <div className="space-y-1 text-xs text-slate-400">
              {[
                { label: 'Under $50', min: 0, max: 50 },
                { label: '$50 to $150', min: 50, max: 150 },
                { label: '$150 to $400', min: 150, max: 400 },
                { label: '$400 & Above', min: 400, max: 2000 },
              ].map((range, idx) => (
                <button
                  key={idx}
                  onClick={() => setPriceRange({ min: range.min, max: range.max })}
                  className={`block w-full text-left px-2 py-1 rounded transition ${
                    priceRange.min === range.min && priceRange.max === range.max
                      ? 'bg-prime-gold/20 text-prime-gold font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setPrimeOnly(false);
              setMinRating(0);
              setPriceRange({ min: 0, max: 2000 });
              setCategory('all');
            }}
            className="w-full text-center text-xs text-slate-400 hover:text-rose-400 underline pt-2"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Product Cards Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-obsidian-900/60 rounded-xl border border-obsidian-border animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-obsidian-900 border border-obsidian-border rounded-xl p-12 text-center space-y-3">
              <p className="text-base font-bold text-white">No products found matching your filters</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening your price range, clearing the department filter, or searching for other items.
              </p>
              <button
                onClick={() => {
                  setPrimeOnly(false);
                  setMinRating(0);
                  setPriceRange({ min: 0, max: 2000 });
                  setCategory('all');
                }}
                className="bg-prime-gold text-obsidian-950 font-bold text-xs px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
