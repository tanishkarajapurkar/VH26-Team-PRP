import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, navigateTo } = useStore();

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-apts-card border border-apts-border flex items-center justify-center mx-auto text-slate-500">
          <Heart className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Save items you love by clicking the heart icon on any product card.
          </p>
        </div>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-apts-primary hover:bg-apts-primaryHover text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-glow-primary inline-flex items-center gap-2 transition-all"
        >
          <span>EXPLORE PRODUCTS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          My Saved Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Items saved in your anonymous browser session.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const prod = item.product;
          if (!prod) return null;

          return (
            <div
              key={item.id}
              className="bg-apts-card border border-apts-border hover:border-slate-600 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
            >
              <div
                onClick={() => navigateTo('product', { productId: prod.id })}
                className="cursor-pointer group"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 border border-white/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-1.5">
                  <span className="text-[11px] text-apts-textMuted">{prod.brand}</span>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-apts-primary transition-colors line-clamp-2">
                    {prod.name}
                  </h3>
                  <div className="text-base font-black text-white pt-1">
                    {formatPrice(prod.price)}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    addToCart(prod.id, 1);
                    toggleWishlist(prod.id);
                  }}
                  className="w-full bg-apts-surface hover:bg-apts-primary hover:text-slate-950 text-slate-200 border border-apts-border py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
