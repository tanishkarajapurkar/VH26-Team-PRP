import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.js';
import { Header } from './components/Header.js';
import { SubNav } from './components/SubNav.js';
import { CartDrawer } from './components/CartDrawer.js';
import { Footer } from './components/Footer.js';

import { HomePage } from './pages/HomePage.js';
import { ProductListingPage } from './pages/ProductListingPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.js';
import { MyOrdersPage } from './pages/MyOrdersPage.js';
import { Product, Order } from './types/index.js';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { toastMessage, currentOrder } = useCart();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wishlistOnly, setWishlistOnly] = useState<boolean>(false);

  // Navigation handlers
  const handleNavigate = (page: string, params?: any) => {
    if (params?.wishlistOnly) {
      setWishlistOnly(true);
      setCurrentPage('products');
    } else {
      setWishlistOnly(false);
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setWishlistOnly(false);
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setWishlistOnly(false);
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 selection:bg-prime-gold selection:text-black font-sans">
      
      {/* Top Header */}
      <Header
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
        onNavigate={handleNavigate}
      />

      {/* Secondary Department SubNav */}
      <SubNav
        activeCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onNavigateCategory={handleSelectCategory}
          />
        )}

        {currentPage === 'products' && (
          <ProductListingPage
            initialCategory={selectedCategory}
            searchQuery={searchQuery}
            wishlistOnly={wishlistOnly}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product_detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onSelectProduct={handleSelectProduct}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCategory={handleSelectCategory}
            onProceedToCheckout={() => setCurrentPage('checkout')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={(order) => {
              setCurrentPage('confirmation');
            }}
            onCancel={() => setCurrentPage('products')}
          />
        )}

        {currentPage === 'confirmation' && (
          <OrderConfirmationPage
            order={currentOrder}
            onContinueShopping={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'orders' && (
          <MyOrdersPage
            onSelectProduct={handleSelectProduct}
            onExplore={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer
        onCheckout={() => setCurrentPage('checkout')}
        onExplore={() => handleNavigate('products')}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-obsidian-900 border border-prime-gold/40 text-slate-100 text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-prime-gold shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
