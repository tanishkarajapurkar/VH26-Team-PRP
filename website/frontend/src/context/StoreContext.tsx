import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Cart, Product, EventType } from '../types';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  trackUserEvent
} from '../services/api';

export const AVAILABLE_USERS: User[] = [
  { id: 'user_101', name: 'Alex Miller', email: 'alex.miller@example.com', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'user_102', name: 'Sarah Connor', email: 'sarah.connor@example.com', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'user_103', name: 'David Beck', email: 'david.beck@example.com', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'user_104', name: 'Emily Watson', email: 'emily.watson@example.com', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' }
];

export type ViewState = 'home' | 'search' | 'category' | 'product' | 'cart' | 'checkout' | 'orders' | 'wishlist';

interface StoreContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentView: ViewState;
  navigateTo: (view: ViewState, params?: { productId?: string; categoryId?: string; searchQuery?: string }) => void;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cart: Cart | null;
  cartItemCount: number;
  wishlist: Product[];
  isWishlisted: (productId: string) => boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  track: (eventType: EventType, payload?: { productId?: string; categoryId?: string; searchQuery?: string; metadata?: any }) => void;
  deliveryLocation: string;
  setDeliveryLocation: (loc: string) => void;
  refreshCart: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(AVAILABLE_USERS[0]);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Seattle 98101');

  // Track event bound to current user
  const track = (
    eventType: EventType,
    payload?: { productId?: string; categoryId?: string; searchQuery?: string; metadata?: any }
  ) => {
    trackUserEvent(currentUser.id, eventType, payload);
  };

  // Navigate helper
  const navigateTo = (
    view: ViewState,
    params?: { productId?: string; categoryId?: string; searchQuery?: string }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);
    if (params?.searchQuery !== undefined) setSearchQuery(params.searchQuery);

    setCurrentView(view);

    // Automatic behavioral event dispatching
    if (view === 'product' && params?.productId) {
      track('VIEW_PRODUCT', { productId: params.productId });
    } else if (view === 'category' && params?.categoryId) {
      track('CATEGORY_VIEW', { categoryId: params.categoryId });
    } else if (view === 'search' && params?.searchQuery) {
      track('SEARCH', { searchQuery: params.searchQuery });
    }
  };

  // Fetch cart & wishlist on user change
  const refreshCart = async () => {
    try {
      const data = await fetchCart(currentUser.id);
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const refreshWishlist = async () => {
    try {
      const data = await fetchWishlist(currentUser.id);
      setWishlist(data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [currentUser]);

  const addToCart = async (productId: string, quantity = 1) => {
    const updated = await apiAddToCart(currentUser.id, productId, quantity);
    setCart(updated);
    track('ADD_TO_CART', { productId, metadata: { quantity } });
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    const item = cart?.items.find(i => i.id === itemId);
    const updated = await apiUpdateCartItem(currentUser.id, itemId, quantity);
    setCart(updated);
    if (quantity <= 0 && item) {
      track('REMOVE_FROM_CART', { productId: item.product_id });
    }
  };

  const removeFromCart = async (itemId: string) => {
    const item = cart?.items.find(i => i.id === itemId);
    const updated = await apiRemoveFromCart(currentUser.id, itemId);
    setCart(updated);
    if (item) {
      track('REMOVE_FROM_CART', { productId: item.product_id });
    }
  };

  const toggleWishlist = async (product: Product) => {
    const alreadyIn = wishlist.some(p => p.id === product.id);
    if (alreadyIn) {
      const updated = await apiRemoveFromWishlist(currentUser.id, product.id);
      setWishlist(updated);
    } else {
      const updated = await apiAddToWishlist(currentUser.id, product.id);
      setWishlist(updated);
      track('WISHLIST', { productId: product.id });
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentView,
        navigateTo,
        selectedProductId,
        selectedCategoryId,
        searchQuery,
        setSearchQuery,
        cart,
        cartItemCount,
        wishlist,
        isWishlisted,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleWishlist,
        track,
        deliveryLocation,
        setDeliveryLocation,
        refreshCart
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
};
