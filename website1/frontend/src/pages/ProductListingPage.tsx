import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchProducts, fetchCategories, searchProducts } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FilterPanel } from '../components/FilterPanel';

interface ProductListingPageProps {
  mode?: 'catalog' | 'category' | 'search';
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({ mode = 'catalog' }) => {
  const { viewParams, navigateTo } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    viewParams.categoryId || 'all'
  );
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync category from viewParams
  useEffect(() => {
    if (viewParams.categoryId) {
      setSelectedCategory(viewParams.categoryId);
    }
  }, [viewParams.categoryId]);

  // Load categories
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch filtered products
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadProducts() {
      try {
        if (mode === 'search' && viewParams.searchQuery) {
          const res = await searchProducts(viewParams.searchQuery, {
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            brand: selectedBrand || undefined,
            maxPrice: maxPrice < 100000 ? maxPrice : undefined,
            minRating: minRating > 0 ? minRating : undefined,
            sort: sortOption
          });
          if (!isCancelled) {
            setProducts(res.results);
            setTotalCount(res.total);
          }
        } else {
          const res = await fetchProducts({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            brand: selectedBrand || undefined,
            maxPrice: maxPrice < 100000 ? maxPrice : undefined,
            minRating: minRating > 0 ? minRating : undefined,
            sort: sortOption,
            limit: 30
          });
          if (!isCancelled) {
            setProducts(res.products);
            setTotalCount(res.total);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, maxPrice, minRating, selectedBrand, sortOption, mode, viewParams.searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(100000);
    setMinRating(0);
    setSelectedBrand('');
    setSortOption('popular');
  };

  const currentCatObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apts-border">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-slate-300">
              Home
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300 font-medium">
              {mode === 'search'
                ? `Search: "${viewParams.searchQuery}"`
                : currentCatObj
                ? currentCatObj.name
                : 'All Products'}
            </span>
          </nav>

          <h1 className="text-2xl font-black text-white tracking-tight">
            {mode === 'search'
              ? `Search Results for "${viewParams.searchQuery}"`
              : currentCatObj
              ? currentCatObj.name
              : 'Shop All Products'}
          </h1>
          <span className="text-xs text-slate-400">
            {totalCount} products available
          </span>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 bg-apts-card border border-apts-border px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort products"
              className="bg-apts-card border border-apts-border text-xs text-slate-200 px-3 py-2 rounded-xl outline-none cursor-pointer hover:border-slate-600 focus:border-apts-primary"
            >
              <option value="popular">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block md:col-span-1 sticky top-28">
          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            onReset={resetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="md:hidden col-span-1">
            <FilterPanel
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setIsMobileFilterOpen(false);
              }}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              onReset={resetFilters}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-apts-card border border-apts-border rounded-2xl h-80"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-apts-card border border-apts-border rounded-2xl p-12 text-center">
              <h3 className="text-lg font-bold text-white mb-2">No matching products found</h3>
              <p className="text-xs text-slate-400 mb-4">
                Try clearing your filters or searching with a different term.
              </p>
              <button
                onClick={resetFilters}
                className="bg-apts-primary text-slate-950 text-xs font-bold px-4 py-2 rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
