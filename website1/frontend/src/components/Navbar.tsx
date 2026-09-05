import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Zap, Tag, Grid, Home } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchCategories } from '../services/api';
import { Category } from '../types';

export const Navbar: React.FC = () => {
  const {
    navigateTo,
    cartCount,
    wishlistCount,
    searchQuery,
    setSearchQuery,
    currentView
  } = useStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('search', {
        searchQuery: searchQuery.trim(),
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-apts-border shadow-lg select-none">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-apts-accent/20 via-apts-primary/20 to-apts-flash/20 text-xs py-1 px-4 text-center text-slate-300 border-b border-white/5 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-medium text-slate-200">APTS Storefront & Caching Infrastructure</span>
        <span className="text-slate-500">•</span>
        <a
          href="http://localhost:5001/dashboard"
          target="_blank"
          rel="noreferrer"
          className="text-apts-primary hover:underline font-semibold flex items-center gap-1"
        >
          <span>🧠 Open Live PredictiveCache AI Dashboard</span>
          <span>→</span>
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          
          {/* Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-apts-primary to-apts-accent flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform duration-200">
              <span className="font-black text-xl text-white tracking-wider">A</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-apts-primary transition-colors">
                  APTS
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-apts-primary/10 text-apts-primary border border-apts-primary/20">
                  STORE
                </span>
              </div>
              <span className="text-[10px] text-apts-textMuted tracking-wider font-medium uppercase">
                E-Commerce Website
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl flex items-center bg-apts-card border border-apts-border hover:border-apts-borderHover focus-within:border-apts-primary focus-within:shadow-glow-primary rounded-xl overflow-hidden transition-all"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter search by category"
              className="hidden sm:block bg-apts-surface text-xs text-slate-300 px-3 py-2.5 border-r border-apts-border outline-none cursor-pointer hover:bg-slate-800"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headphones, keyboards, laptops, fashion..."
                className="w-full bg-transparent px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <button
              type="submit"
              aria-label="Search"
              className="bg-apts-primary hover:bg-apts-primaryHover text-slate-950 px-4 py-2.5 font-semibold text-sm flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Actions: AI Dashboard, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Live AI Dashboard Quick Link */}
            <a
              href="http://localhost:5001/dashboard"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-teal-500/40 bg-teal-950/40 text-teal-300 hover:bg-teal-900/50 hover:text-white transition shadow-[0_0_12px_rgba(45,212,191,0.2)] text-xs font-semibold"
              title="Open Live PredictiveCache AI Dashboard"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>AI Dashboard</span>
            </a>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo('wishlist')}
              className={`relative p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                currentView === 'wishlist'
                  ? 'bg-apts-card border-apts-primary text-apts-primary'
                  : 'border-apts-border hover:border-slate-700 bg-apts-card/60 text-slate-300 hover:text-white'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span className="hidden md:inline text-xs font-medium">Saved</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-apts-bg">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => navigateTo('cart')}
              className={`relative p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                currentView === 'cart'
                  ? 'bg-apts-primary text-slate-950 border-apts-primary font-semibold'
                  : 'bg-gradient-to-r from-apts-primary to-cyan-500 hover:from-cyan-400 hover:to-apts-primary text-slate-950 border-transparent font-semibold shadow-glow-primary'
              }`}
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-apts-primary text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Sub-Navigation: Clean Categories and Highlights */}
        <div className="flex items-center justify-between overflow-x-auto py-2.5 text-xs text-slate-300 border-t border-apts-border/60 gap-4 no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigateTo('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                currentView === 'home'
                  ? 'bg-apts-card text-apts-primary border border-apts-primary/30'
                  : 'hover:bg-apts-card hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                currentView === 'shop'
                  ? 'bg-apts-card text-apts-primary border border-apts-primary/30'
                  : 'hover:bg-apts-card hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => navigateTo('flash_sale')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                currentView === 'flash_sale'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Flash Sales</span>
            </button>

            <button
              onClick={() => navigateTo('deals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                currentView === 'deals'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Hot Deals</span>
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            {categories.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => navigateTo('category', { categoryId: c.id })}
                className="px-2.5 py-1 rounded-md hover:bg-apts-card hover:text-white text-slate-400 transition-colors"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </nav>
  );
};
