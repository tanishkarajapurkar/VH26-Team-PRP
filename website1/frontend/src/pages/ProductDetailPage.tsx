import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  ChevronRight,
  Share2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchProductById, fetchProductReviews, fetchRelatedProducts } from '../services/api';
import { Product, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ReviewCard } from '../components/ReviewCard';
import { CountdownTimer } from '../components/CountdownTimer';

export const ProductDetailPage: React.FC = () => {
  const { viewParams, navigateTo, addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useStore();
  const productId = viewParams.productId || 'prod_apts_anc_headphones';

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadDetails() {
      try {
        const [prod, revs, rel] = await Promise.all([
          fetchProductById(productId),
          fetchProductReviews(productId),
          fetchRelatedProducts(productId)
        ]);

        if (!isCancelled && prod) {
          setProduct(prod);
          setSelectedImage(prod.images?.[0] || '');
          setReviews(revs);
          setRelated(rel);
          addRecentlyViewed(prod);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      isCancelled = true;
    };
  }, [productId]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-pulse">
        <div className="h-96 bg-apts-card rounded-3xl max-w-2xl mx-auto border border-apts-border"></div>
      </div>
    );
  }

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const saved = isInWishlist(product.id);
  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity);
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigateTo('home')} className="hover:text-slate-300">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <button
          onClick={() => navigateTo('category', { categoryId: product.category_id })}
          className="hover:text-slate-300"
        >
          {product.category_name || 'Category'}
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-900/80 border border-apts-border shadow-card-elevated group">
            <img
              src={selectedImage || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.is_flash_sale && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-glow-flash uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Prime Flash Sale</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-apts-primary shadow-glow-primary'
                      : 'border-apts-border hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-apts-textMuted font-bold uppercase tracking-wider mb-2">
              <span>{product.brand}</span>
              <span className="text-slate-500">SKU: {product.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & Reviews counter */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-black ml-1.5 text-amber-300">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {product.review_count.toLocaleString()} customer ratings
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> High Satisfaction
              </span>
            </div>
          </div>

          {/* Flash Sale Banner if active */}
          {product.is_flash_sale && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-apts-card to-amber-950/40 border border-rose-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-rose-400 tracking-wider uppercase block">
                  FLASH SALE DEAL
                </span>
                <span className="text-xs text-slate-300">
                  Claim before inventory expires
                </span>
              </div>
              <CountdownTimer initialSeconds={9677} />
            </div>
          )}

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-apts-card border border-apts-border space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.original_price > product.price && (
                <>
                  <span className="text-base text-slate-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold px-2 py-0.5 rounded-full">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Inclusive of all taxes & warranty coverage.</p>
          </div>

          {/* Stock status & Quantity selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Availability:</span>
                {product.stock <= 5 ? (
                  <span className="text-xs font-bold text-amber-400">
                    Only {product.stock} units remaining in stock!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                  </span>
                )}
              </div>

              {/* Quantity Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Qty:</span>
                <div className="flex items-center bg-apts-surface border border-apts-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-white min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => addToCart(product.id, quantity)}
                className="w-full bg-apts-surface hover:bg-slate-800 text-white border border-apts-border hover:border-slate-600 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md"
              >
                <ShoppingCart className="w-4 h-4 text-apts-primary" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-apts-primary to-cyan-500 hover:from-cyan-400 hover:to-apts-primary text-slate-950 font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-glow-primary"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Save to Wishlist Toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-full py-2.5 rounded-xl border border-apts-border hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className={`w-4 h-4 ${saved ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>{saved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-apts-border/60 text-center">
            <div className="p-3 rounded-xl bg-apts-card/60 border border-white/5 flex flex-col items-center">
              <Truck className="w-4 h-4 text-apts-primary mb-1.5" />
              <span className="text-[11px] font-bold text-slate-200">Express Delivery</span>
              <span className="text-[9px] text-slate-500">2-4 business days</span>
            </div>
            <div className="p-3 rounded-xl bg-apts-card/60 border border-white/5 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
              <span className="text-[11px] font-bold text-slate-200">1-Year Warranty</span>
              <span className="text-[9px] text-slate-500">Full replacement</span>
            </div>
            <div className="p-3 rounded-xl bg-apts-card/60 border border-white/5 flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-amber-400 mb-1.5" />
              <span className="text-[11px] font-bold text-slate-200">7-Day Returns</span>
              <span className="text-[9px] text-slate-500">No questions asked</span>
            </div>
          </div>
        </div>

      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-apts-card border border-apts-border rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex border-b border-apts-border gap-6">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'desc'
                ? 'border-apts-primary text-apts-primary'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-apts-primary text-apts-primary'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Specifications
          </button>
        </div>

        {activeTab === 'desc' ? (
          <div className="text-sm text-slate-300 leading-relaxed max-w-3xl space-y-4">
            <p>{product.description}</p>
            <p className="text-slate-400 text-xs">
              Every APTS product undergoes rigorous testing for thermal resilience, component endurance, and signal integrity to ensure optimal long-term commercial reliability.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                >
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-slate-100 font-bold">{val}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Standard specifications apply.</p>
            )}
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Customer Reviews
            </h2>
            <p className="text-xs text-slate-400">
              Verified feedback from genuine commercial customers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">{product.rating.toFixed(1)}</span>
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-apts-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Related Products
            </h2>
            <button
              onClick={() => navigateTo('category', { categoryId: product.category_id })}
              className="text-xs font-bold text-apts-primary hover:text-cyan-300"
            >
              Explore Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
