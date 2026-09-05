import React from 'react';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types/index.js';
import { useCart } from '../context/CartContext.js';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWished = isInWishlist(product.id);

  const discountPercent = product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="product-card-hover group relative flex flex-col justify-between bg-obsidian-900/90 border border-obsidian-border rounded-xl overflow-hidden cursor-pointer p-4 backdrop-blur-sm"
    >
      {/* Top badges and Wishlist button */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex flex-wrap gap-1">
          {product.badges && product.badges.length > 0 && (
            <span className="bg-amber-500/20 text-prime-gold border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {product.badges[0]}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          aria-label="Save to Wishlist"
          className="p-1.5 rounded-full bg-obsidian-950/80 border border-obsidian-700 hover:border-rose-500/50 transition text-slate-400 hover:text-rose-400"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Image container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-obsidian-950/60 mb-3 flex items-center justify-center p-2">
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback image if unsplash link fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
          }}
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        {/* Brand */}
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mb-0.5">
          {product.brand}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-prime-gold transition-colors mb-2">
          {product.title}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-prime-gold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-prime-gold text-prime-gold'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-amber-400">{product.rating}</span>
          <span className="text-[11px] text-slate-400">({product.rating_count.toLocaleString()})</span>
        </div>

        {/* Pricing Block */}
        <div className="mt-auto pt-2 border-t border-obsidian-800">
          <div className="flex items-baseline gap-2 mb-1">
            <div className="flex items-start text-white">
              <span className="text-xs font-semibold mr-0.5">$</span>
              <span className="text-xl font-extrabold tracking-tight">
                {Math.floor(product.price)}
              </span>
              <span className="text-xs font-semibold">
                {(product.price % 1).toFixed(2).substring(1)}
              </span>
            </div>

            {product.original_price > product.price && (
              <span className="text-xs text-slate-500 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Prime delivery tag */}
          {product.prime_eligible && (
            <div className="flex items-center gap-1 text-[11px] text-sky-400 font-medium mb-3">
              <span className="font-extrabold tracking-tighter text-prime-gold">⚡prime</span>
              <span className="text-slate-300">Next-Day Delivery</span>
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-prime-gold to-amber-500 hover:from-amber-400 hover:to-prime-gold text-obsidian-950 font-bold text-xs py-2 px-3 rounded-lg shadow transition active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-obsidian-950" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
