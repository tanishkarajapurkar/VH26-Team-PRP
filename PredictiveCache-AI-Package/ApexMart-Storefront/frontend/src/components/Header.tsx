import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, ChevronDown, User, Heart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { tracker } from '../services/tracker.js';

interface HeaderProps {
  onSearch: (query: string, category: string) => void;
  onNavigate: (page: string, params?: any) => void;
  selectedCategory: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onNavigate, selectedCategory }) => {
  const { itemCount, setIsCartOpen, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(selectedCategory || 'all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      tracker.trackSearch(searchQuery);
    }
    onSearch(searchQuery, category);
  };

  return (
    <header className="sticky top-0 z-40 bg-obsidian-900 border-b border-obsidian-border text-white shadow-xl">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 cursor-pointer select-none p-1.5 rounded hover:ring-1 hover:ring-slate-700 transition"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-prime-gold flex items-center justify-center font-black text-black text-lg shadow-md">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none text-white">
              apex<span className="text-prime-gold">mart</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">
              prime store
            </span>
          </div>
        </div>

        {/* Location Selector */}
        <div 
          onClick={() => alert('Delivery address: 742 Evergreen Terrace, New York, NY 10001')}
          className="hidden md:flex items-center gap-2 cursor-pointer p-1.5 rounded hover:ring-1 hover:ring-slate-700 transition text-xs"
        >
          <MapPin className="w-4 h-4 text-prime-gold shrink-0" />
          <div className="leading-tight">
            <span className="text-slate-400 text-[11px] block">Deliver to Alex</span>
            <span className="font-bold text-slate-100 text-xs">New York 10001</span>
          </div>
        </div>

        {/* Amazon-Style Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex items-center">
          <div className="relative flex w-full rounded-md shadow-inner">
            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-obsidian-800 text-slate-300 text-xs font-medium px-3 py-2.5 rounded-l-md border-r border-obsidian-700 focus:outline-none hover:bg-obsidian-700 cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="beauty">Beauty & Care</option>
              <option value="home_appliances">Home Appliances</option>
              <option value="tech">Electronics & Tech</option>
              <option value="kitchen">Kitchen & Dining</option>
              <option value="gaming">Gaming Gear</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search Amazon-style catalog, electronics, beauty, appliances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-obsidian-950 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-prime-gold border-y border-obsidian-700"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-prime-gold to-amber-500 hover:from-amber-400 hover:to-prime-gold text-obsidian-950 px-5 py-2 rounded-r-md transition flex items-center justify-center font-bold"
            >
              <Search className="w-5 h-5 text-obsidian-950" />
            </button>
          </div>
        </form>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Wishlist quick link */}
          <button
            onClick={() => onNavigate('products', { wishlistOnly: true })}
            className="hidden sm:flex items-center gap-1.5 p-1.5 rounded hover:ring-1 hover:ring-slate-700 text-xs transition"
          >
            <div className="relative">
              <Heart className="w-5 h-5 text-slate-300 hover:text-rose-400 transition" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-bold rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="hidden lg:inline text-slate-300 font-medium">Wishlist</span>
          </button>

          {/* Orders & Returns */}
          <div 
            onClick={() => onNavigate('orders')}
            className="cursor-pointer p-1.5 rounded hover:ring-1 hover:ring-slate-700 transition text-xs"
          >
            <span className="text-slate-400 text-[11px] block leading-tight">Returns</span>
            <span className="font-bold text-slate-100 text-xs flex items-center gap-0.5">
              & Orders
            </span>
          </div>

          {/* Account Profile */}
          <div 
            onClick={() => alert('Signed in as: Alex Chen (Prime Member since 2023)')}
            className="hidden sm:flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:ring-1 hover:ring-slate-700 transition text-xs"
          >
            <div className="w-7 h-7 rounded-full bg-obsidian-800 border border-slate-700 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div className="leading-tight">
              <span className="text-slate-400 text-[11px] block">Hello, Alex</span>
              <span className="font-bold text-slate-100 text-xs flex items-center">
                Account <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 p-1.5 px-2.5 rounded bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-xs font-bold transition group"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-prime-gold group-hover:scale-110 transition-transform" />
              <span className="absolute -top-2 -right-2.5 bg-prime-gold text-black font-extrabold rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow">
                {itemCount}
              </span>
            </div>
            <span className="text-slate-200 hidden md:inline">Cart</span>
          </button>

        </div>
      </div>
    </header>
  );
};
