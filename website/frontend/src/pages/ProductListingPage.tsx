import React, { useState, useEffect } from 'react';
import { Filter, Star, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { fetchProducts, searchProducts, fetchCategories } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

interface ProductListingPageProps {
  mode: 'category' | 'search';
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({ mode }) => {
  const { selectedCategoryId, searchQuery, navigateTo } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sortBy, setSortBy] = useState<string>('featured');
  const [primeOnly, setPrimeOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<string>('all');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (mode === 'search') {
      searchProducts(searchQuery)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      fetchProducts({
        categoryId: selectedCategoryId || undefined,
        sort: sortBy !== 'featured' ? sortBy : undefined,
        isPrime: primeOnly || undefined
      })
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [mode, selectedCategoryId, searchQuery, sortBy, primeOnly]);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  // Apply client-side filters
  const filteredProducts = products.filter((p) => {
    if (primeOnly && !p.is_prime) return false;
    if (minRating && p.rating < minRating) return false;
    if (priceRange === 'under100' && p.price >= 100) return false;
    if (priceRange === '100to500' && (p.price < 100 || p.price > 500)) return false;
    if (priceRange === 'over500' && p.price <= 500) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner / Results Bar */}
      <div className="bg-white border border-slate-200 p-3 rounded-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="text-sm text-slate-700">
          <span className="text-slate-500">
            {mode === 'search'
              ? `Results for "${searchQuery}"`
              : currentCategory
              ? `Department: ${currentCategory.name}`
              : 'All Products'}
          </span>
          <span className="font-semibold text-slate-900 ml-2">
            ({filteredProducts.length} items found)
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 text-slate-800 font-medium outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Filters Sidebar */}
        <div className="w-full md:w-60 shrink-0 space-y-6 text-xs text-slate-800">
          {/* Categories */}
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Departments</h4>
            <ul className="space-y-1.5">
              <li
                onClick={() => navigateTo('category', { categoryId: undefined })}
                className={`cursor-pointer hover:text-amber-700 ${
                  !selectedCategoryId ? 'font-bold text-amber-700' : ''
                }`}
              >
                All Departments
              </li>
              {categories.map((c) => (
                <li
                  key={c.id}
                  onClick={() => navigateTo('category', { categoryId: c.id })}
                  className={`cursor-pointer hover:text-amber-700 ${
                    selectedCategoryId === c.id ? 'font-bold text-amber-700' : ''
                  }`}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Prime Eligibility */}
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Shipping & Delivery</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={primeOnly}
                onChange={(e) => setPrimeOnly(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-amazon-prime font-black italic tracking-tighter text-sm">
                prime
              </span>
              <span className="text-slate-600">Free Next-Day</span>
            </label>
          </div>

          {/* Customer Reviews */}
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Customer Reviews</h4>
            <div className="space-y-1.5">
              {[4, 3, 2, 1].map((stars) => (
                <div
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? null : stars)}
                  className={`flex items-center gap-1.5 cursor-pointer p-1 rounded hover:bg-slate-100 ${
                    minRating === stars ? 'bg-amber-50 font-bold' : ''
                  }`}
                >
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= stars ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                  <span className="text-slate-700">& Up</span>
                </div>
              ))}
              {minRating && (
                <button
                  onClick={() => setMinRating(null)}
                  className="text-amazon-link hover:underline text-[11px] mt-1"
                >
                  Clear review filter
                </button>
              )}
            </div>
          </div>

          {/* Price Filters */}
          <div className="pb-4">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Price</h4>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under100', label: 'Under $100' },
                { id: '100to500', label: '$100 to $500' },
                { id: 'over500', label: '$500 & Above' }
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === p.id}
                    onChange={() => setPriceRange(p.id)}
                    className="text-amber-500 focus:ring-amber-400"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded border border-slate-200 animate-pulse p-4" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">No products found</h3>
              <p className="text-xs text-slate-500 mb-4">
                Try adjusting your search terms or clearing active filters.
              </p>
              <button
                onClick={() => {
                  setPrimeOnly(false);
                  setMinRating(null);
                  setPriceRange('all');
                  navigateTo('home');
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-4 py-2 rounded text-xs shadow"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
