import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  Heart,
  Menu,
  ChevronDown,
  User as UserIcon,
  PackageCheck
} from 'lucide-react';
import { useStore, AVAILABLE_USERS } from '../context/StoreContext';
import { fetchCategories } from '../services/api';
import { Category } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    navigateTo,
    cartItemCount,
    wishlist,
    deliveryLocation,
    setDeliveryLocation,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [newZip, setNewZip] = useState('98101');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('search', {
        searchQuery: searchQuery.trim(),
        categoryId: selectedCat !== 'all' ? selectedCat : undefined
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 select-none shadow-md">
      {/* 1. MAIN AMAZON HEADER BAR */}
      <div className="bg-[#131921] text-white px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Amazon Logo */}
        <div
          onClick={() => navigateTo('home')}
          className="flex items-center cursor-pointer p-1.5 border border-transparent hover:border-white rounded-sm transition-colors"
        >
          <div className="flex flex-col items-start leading-none">
            <span className="text-2xl font-black tracking-tight text-white flex items-center">
              amazon<span className="text-amber-400 text-sm font-semibold ml-0.5">.com</span>
            </span>
            <span className="text-[10px] text-amber-400 font-medium tracking-wider -mt-1 ml-1">prime</span>
          </div>
        </div>

        {/* Deliver to Location */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="hidden md:flex items-center gap-1 cursor-pointer p-1.5 border border-transparent hover:border-white rounded-sm text-xs transition-colors"
        >
          <MapPin size={16} className="text-white mt-1" />
          <div className="flex flex-col leading-tight">
            <span className="text-slate-400 text-[11px]">Deliver to {currentUser.name.split(' ')[0]}</span>
            <span className="font-bold text-white text-xs">{deliveryLocation}</span>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-3xl flex items-center h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-amber-500"
        >
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="h-full bg-slate-100 text-slate-800 text-xs px-3 border-r border-slate-300 outline-none hover:bg-slate-200 cursor-pointer hidden sm:block"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search Amazon (e.g. laptop, headphones, keyboard...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-full px-3 text-slate-900 text-sm outline-none placeholder:text-slate-500 bg-white"
          />

          <button
            type="submit"
            className="h-full px-4 bg-[#febd69] hover:bg-[#f3a847] text-slate-900 flex items-center justify-center transition-colors"
          >
            <Search size={20} className="stroke-[2.5]" />
          </button>
        </form>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1 sm:gap-3 text-xs">
          {/* User Profile / Switcher */}
          <div className="relative">
            <div
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex flex-col cursor-pointer p-1.5 border border-transparent hover:border-white rounded-sm leading-tight transition-colors"
            >
              <span className="text-slate-300 text-[11px] flex items-center gap-0.5">
                Hello, {currentUser.name.split(' ')[0]}
                <ChevronDown size={12} />
              </span>
              <span className="font-bold text-white text-xs">Account & Lists</span>
            </div>

            {/* Dropdown Menu for Simulated Users */}
            {isUserDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white text-slate-800 shadow-2xl rounded border border-slate-200 p-3 z-50 text-xs"
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Switch Active User</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                    {currentUser.id}
                  </span>
                </div>
                <div className="py-2 space-y-1">
                  {AVAILABLE_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                        currentUser.id === user.id
                          ? 'bg-amber-50 font-bold text-slate-900'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                      </div>
                      {currentUser.id === user.id && (
                        <span className="text-amber-600 font-bold text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  Switching users tests multi-user behavioral event tracking and individual carts/orders.
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <div
            onClick={() => navigateTo('orders')}
            className="flex flex-col cursor-pointer p-1.5 border border-transparent hover:border-white rounded-sm leading-tight transition-colors"
          >
            <span className="text-slate-300 text-[11px]">Returns</span>
            <span className="font-bold text-white text-xs">& Orders</span>
          </div>

          {/* Wishlist */}
          <div
            onClick={() => navigateTo('wishlist')}
            className="hidden sm:flex items-center gap-1 cursor-pointer p-1.5 border border-transparent hover:border-white rounded-sm text-xs transition-colors"
            title="Your Wishlist"
          >
            <Heart
              size={18}
              className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-slate-300'}
            />
            <span className="font-bold text-white hidden md:inline">Saved ({wishlist.length})</span>
          </div>

          {/* Cart with dynamic badge */}
          <div
            onClick={() => navigateTo('cart')}
            className="flex items-center cursor-pointer p-1.5 border border-transparent hover:border-white rounded-sm transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart size={28} className="text-white" />
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 font-bold text-amber-400 text-xs min-w-[18px] text-center">
                {cartItemCount}
              </span>
            </div>
            <span className="font-bold text-white text-xs mt-2 ml-1 hidden sm:inline">Cart</span>
          </div>
        </div>
      </div>

      {/* 2. SUBNAV BAR (Categories & Shortcuts) */}
      <nav className="bg-[#232f3e] text-white px-4 py-1.5 flex items-center gap-4 text-xs font-medium overflow-x-auto no-scrollbar">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 p-1 border border-transparent hover:border-white rounded-sm shrink-0"
        >
          <Menu size={16} />
          <span className="font-bold">All</span>
        </button>

        <button
          onClick={() => navigateTo('home')}
          className="p-1 border border-transparent hover:border-white rounded-sm shrink-0"
        >
          Today's Deals
        </button>

        <button
          onClick={() => navigateTo('orders')}
          className="p-1 border border-transparent hover:border-white rounded-sm shrink-0"
        >
          Buy Again
        </button>

        <button
          onClick={() => navigateTo('wishlist')}
          className="p-1 border border-transparent hover:border-white rounded-sm shrink-0"
        >
          Your Lists
        </button>

        <div className="h-4 w-[1px] bg-slate-600 shrink-0" />

        {/* Dynamic Category Buttons */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigateTo('category', { categoryId: cat.id })}
            className="p-1 border border-transparent hover:border-white rounded-sm shrink-0 text-slate-200 hover:text-white"
          >
            {cat.name}
          </button>
        ))}

        <div className="ml-auto hidden lg:flex items-center text-amber-400 font-bold p-1 cursor-pointer hover:underline shrink-0">
          🔥 Flash Deals Active
        </div>
      </nav>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-lg p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Choose your location</h3>
            <p className="text-xs text-slate-600 mb-4">
              Delivery options and speeds may vary for different locations.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
                placeholder="Enter ZIP code"
                className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-amber-500"
              />
              <button
                onClick={() => {
                  setDeliveryLocation(`Seattle ${newZip}`);
                  setIsLocationModalOpen(false);
                }}
                className="bg-amber-400 hover:bg-amber-500 font-medium px-4 py-1.5 rounded text-sm text-slate-900"
              >
                Apply
              </button>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="w-full text-center text-xs text-slate-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
