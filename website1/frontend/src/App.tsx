import React from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { FlashSalePage } from './pages/FlashSalePage';
import { DealsPage } from './pages/DealsPage';

export const App: React.FC = () => {
  const { currentView, toast } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-apts-bg text-slate-100 selection:bg-apts-primary selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ProductListingPage mode="catalog" />}
        {currentView === 'category' && <ProductListingPage mode="category" />}
        {currentView === 'search' && <ProductListingPage mode="search" />}
        {currentView === 'product' && <ProductDetailPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order_confirmation' && <OrderConfirmationPage />}
        {currentView === 'flash_sale' && <FlashSalePage />}
        {currentView === 'deals' && <DealsPage />}
      </main>

      <Footer />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white border border-apts-primary/40 px-4 py-3 rounded-2xl shadow-glow-primary text-xs font-bold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-apts-primary"></span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
