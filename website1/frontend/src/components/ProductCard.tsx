import React from 'react';
import { Star, Heart, ShoppingCart, Zap, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist } = useStore();
  const saved = isInWishlist(product.id);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const imageSrc =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';

  const handleCardClick = () => {
    navigateTo('product', { productId: product.id });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-apts-card border border-apts-border hover:border-slate-600 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-card-elevated hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Media & Badges */}
      <div className="relative w-full pt-[75%] bg-slate-900/60 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title={saved ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? 'text-rose-500 fill-rose-500' : 'hover:text-rose-400'
            }`}
          />
        </button>

        {/* Badges: Discount or Flash Sale */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_flash_sale ? (
            <span className="flex items-center gap-1 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-glow-flash uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-white" />
              Flash Deal
            </span>
          ) : product.discount > 0 ? (
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {product.discount}% OFF
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-apts-textMuted mb-1 font-medium">
            <span>{product.brand}</span>
            <span className="text-slate-500">{product.category_name}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 group-hover:text-apts-primary transition-colors leading-snug mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold ml-1 text-slate-200">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              ({product.review_count.toLocaleString()})
            </span>
          </div>

          {/* Flash Sale Claimed Progress Bar */}
          {product.is_flash_sale && (
            <div className="mb-3">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Claimed</span>
                <span className="text-rose-400 font-semibold">{product.flash_sale_claimed_percent || 75}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                  style={{ width: `${product.flash_sale_claimed_percent || 75}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-apts-border/60">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.original_price > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock <= 5 ? (
              <span className="text-[10px] text-amber-400 font-medium">
                Only {product.stock} left!
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                <CheckCircle className="w-2.5 h-2.5" /> In Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id, 1);
            }}
            className="w-full bg-apts-surface hover:bg-apts-primary hover:text-slate-950 text-slate-200 border border-apts-border hover:border-transparent py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
