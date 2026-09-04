import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { Product } from '../types';
import { StarRating } from './StarRating';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badge }) => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, track } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const priceDollars = Math.floor(product.price);
  const priceCents = Math.round((product.price - priceDollars) * 100)
    .toString()
    .padStart(2, '0');

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleCardClick = () => {
    track('CLICK_PRODUCT', { productId: product.id });
    navigateTo('product', { productId: product.id });
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product.id, 1);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white border border-slate-200 rounded-sm p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer text-left h-full"
    >
      {/* Top badges & Wishlist Button */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          {badge ? (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
              {badge}
            </span>
          ) : product.is_best_seller ? (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
              #1 Best Seller
            </span>
          ) : discountPercent > 15 ? (
            <span className="bg-amazon-badgeRed text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
              Limited time deal
            </span>
          ) : null}
        </div>

        <button
          onClick={handleWishlist}
          title={isWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
        >
          <Heart
            size={18}
            className={isWishlisted(product.id) ? 'fill-red-500 text-red-500' : ''}
          />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-48 mb-3 flex items-center justify-center overflow-hidden bg-slate-50 rounded">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
          alt={product.title}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <h3 className="text-sm font-normal text-slate-900 line-clamp-2 hover:text-amazon-linkHover mb-1.5 flex-grow leading-snug">
        {product.title}
      </h3>

      {/* Rating */}
      <div className="mb-2">
        <StarRating rating={product.rating} reviewCount={product.review_count} />
      </div>

      {/* Price Section */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          {discountPercent > 0 && (
            <span className="text-amazon-badgeRed text-lg font-light leading-none">
              -{discountPercent}%
            </span>
          )}
          <span className="text-xs font-normal text-slate-900 relative -top-1.5">$</span>
          <span className="text-2xl font-semibold text-slate-900 leading-none">{priceDollars}</span>
          <span className="text-xs font-normal text-slate-900 relative -top-1.5">{priceCents}</span>
        </div>

        {product.original_price && (
          <div className="text-xs text-slate-500 line-through mt-0.5">
            Typical: ${product.original_price.toFixed(2)}
          </div>
        )}
      </div>

      {/* Prime & Delivery */}
      {product.is_prime && (
        <div className="flex items-center gap-1 mb-2 text-xs">
          <span className="text-amazon-prime font-black italic tracking-tighter">prime</span>
          <span className="text-slate-600">One-Day</span>
        </div>
      )}

      <div className="text-xs text-slate-600 mb-3">
        FREE delivery <span className="font-semibold text-slate-900">Tomorrow, Sep 5</span>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-auto pt-2">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-1.5 px-4 rounded-full text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 ${
            justAdded
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-amazon-yellow hover:bg-amazon-yellowHover active:bg-amber-500 text-slate-900 border border-[#fcd200]'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={14} className="stroke-[3]" /> Added to Cart
            </>
          ) : isAdding ? (
            'Adding...'
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};
