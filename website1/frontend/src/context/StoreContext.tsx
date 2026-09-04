import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, WishlistItem, Product } from '../types';
import * as api from '../services/api';

export type ViewType =
  | 'home'
  | 'shop'
  | 'category'
  | 'search'
  | 'product'
  | 'deals'
  | 'flash_sale'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'order_confirmation'
  | 'wishlist';

interface ViewParams {
  productId?: string;
  categoryId?: string;
  searchQuery?: string;
  orderId?: string;
}

interface StoreContextType {
  currentView: ViewType;
  viewParams: ViewParams;
  navigateTo: (view: ViewType, params?: ViewParams) => void;
  cart: Cart | null;
  cartCount: number;
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toast: string | null;
  showToast: (msg: string) => void;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentlyViewed: Product[];
  addRecentlyViewed: (prod: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [viewParams, setViewParams] = useState<ViewParams>({});
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const navigateTo = (view: ViewType, params: ViewParams = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshCart = async () => {
    try {
      const data = await api.fetchCart();
      setCart(data);
    } catch {
      // Backend may be starting
    }
  };

  const refreshWishlist = async () => {
    try {
      const list = await api.fetchWishlist();
      setWishlist(list);
    } catch {
      // Backend may be starting
    }
  };

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, []);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const res = await api.addToCart(productId, quantity);
      setCart(res.cart);
      showToast('Added to Cart');
    } catch (err) {
      showToast('Could not add to cart');
    }
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    try {
      const updated = await api.updateCartItem(itemId, quantity);
      setCart(updated);
    } catch {
      showToast('Error updating cart');
    }
  };

  const removeCartItem = async (itemId: string) => {
    try {
      const updated = await api.removeFromCart(itemId);
      setCart(updated);
      showToast('Removed from Cart');
    } catch {
      showToast('Error removing item');
    }
  };

  const toggleWishlist = async (productId: string) => {
    const exists = wishlist.some(i => i.product_id === productId);
    try {
      if (exists) {
        const updated = await api.removeFromWishlist(productId);
        setWishlist(updated);
        showToast('Removed from Wishlist');
      } else {
        const updated = await api.addToWishlist(productId);
        setWishlist(updated);
        showToast('Saved to Wishlist');
      }
    } catch {
      showToast('Wishlist error');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(i => i.product_id === productId);
  };

  const addRecentlyViewed = (prod: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== prod.id);
      return [prod, ...filtered].slice(0, 6);
    });
  };

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist.length;

  return (
    <StoreContext.Provider
      value={{
        currentView,
        viewParams,
        navigateTo,
        cart,
        cartCount,
        wishlist,
        wishlistCount,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        toggleWishlist,
        isInWishlist,
        toast,
        showToast,
        refreshCart,
        refreshWishlist,
        searchQuery,
        setSearchQuery,
        recentlyViewed,
        addRecentlyViewed
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
