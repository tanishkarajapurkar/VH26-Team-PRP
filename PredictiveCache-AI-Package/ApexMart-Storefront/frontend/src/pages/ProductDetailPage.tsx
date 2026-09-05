import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingCart, Zap, Check, ChevronRight } from 'lucide-react';
import { Product, Review } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { api } from '../services/api.js';
import { tracker } from '../services/tracker.js';
import { ProductCard } from '../components/ProductCard.js';

interface ProductDetailPageProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (category: string) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onSelectProduct,
  onNavigateHome,
  onNavigateCategory,
  onProceedToCheckout,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>(product.image_url);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('Standard Black');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  const isWished = isInWishlist(product.id);

  // Gallery items (include main image + supplementary angles)
  const galleryImages = [
    product.image_url,
    ...(product.gallery || [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    ])
  ].slice(0, 4);

  useEffect(() => {
    setSelectedImage(product.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track user behavior event to Supabase
    tracker.trackViewProduct(product.id, product.title);

    // Fetch reviews & similar products
    api.getReviews(product.id).then(setReviews);
    api.getSimilar(product.id).then(setSimilar);
  }, [product.id]);

  const discountPercent = product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    onProceedToCheckout();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <button onClick={onNavigateHome} className="hover:text-prime-gold">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigateCategory(product.category)} className="hover:text-prime-gold capitalize">
          {product.category.replace('_', ' ')}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-medium truncate max-w-md">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-lg bg-obsidian-950 border p-1 shrink-0 overflow-hidden transition ${
                  selectedImage === img ? 'border-prime-gold ring-1 ring-prime-gold' : 'border-obsidian-800 hover:border-slate-600'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Selected Image */}
          <div className="flex-1 bg-obsidian-900 border border-obsidian-border rounded-2xl p-6 flex items-center justify-center min-h-[380px] relative">
            <img
              src={selectedImage}
              alt={product.title}
              className="max-h-96 max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black px-2 py-1 rounded-md">
                SAVE {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Center Column: Product Details & Features (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.brand} Store</span>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug mt-1">
              {product.title}
            </h1>
          </div>

          {/* Ratings & Badges */}
          <div className="flex items-center gap-2 pb-3 border-b border-obsidian-800">
            <div className="flex items-center text-prime-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-prime-gold' : 'text-slate-700'}`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-amber-400">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.rating_count.toLocaleString()} customer ratings)</span>
          </div>

          {/* Price Block */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price > product.price && (
                <span className="text-sm text-slate-500 line-through">
                  Typical: ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            {product.prime_eligible && (
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                <span className="text-prime-gold font-black">⚡prime</span>
                <span>FREE One-Day Delivery with Prime Membership</span>
              </div>
            )}
          </div>

          {/* Variant Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-300">Edition / Color:</label>
            <div className="flex flex-wrap gap-2">
              {['Midnight Obsidian', 'Space Silver', 'Apex Titanium'].map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    selectedVariant === variant
                      ? 'bg-prime-gold/20 border-prime-gold text-prime-gold'
                      : 'bg-obsidian-950 border-obsidian-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>

          {/* Key Bullet Features */}
          <div className="space-y-2 pt-3 border-t border-obsidian-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">About this item</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-prime-gold font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400">Flagship craftsmanship with high-grade components designed for longevity.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: Amazon Buy Box (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-obsidian-900 border border-obsidian-border rounded-2xl p-5 space-y-4 shadow-xl sticky top-24">
            
            <div className="text-xl font-black text-white">
              ${(product.price * quantity).toFixed(2)}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Check className="w-4 h-4" />
                <span>In Stock ({product.stock_count} units available)</span>
              </div>
              <p className="text-slate-400">
                Guaranteed delivery by <strong className="text-slate-200">Tomorrow, 10:00 AM</strong>
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-prime-gold cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-prime-gold to-amber-500 hover:from-amber-400 hover:to-prime-gold text-obsidian-950 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
              >
                <ShoppingCart className="w-4 h-4 text-obsidian-950" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (1-Click)</span>
              </button>
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-full bg-obsidian-950 hover:bg-obsidian-850 text-slate-300 border border-obsidian-800 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isWished ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {/* Trust Signals */}
            <div className="pt-3 border-t border-obsidian-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Ships from: <strong>Apex Fulfillment US</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sold by: <strong>{product.brand} Official</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Returns: <strong>30-day refund / replacement</strong></span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs Section: Specifications, Reviews, Overview */}
      <div className="bg-obsidian-900 border border-obsidian-border rounded-2xl overflow-hidden mt-8">
        
        {/* Tab Headers */}
        <div className="flex border-b border-obsidian-border bg-obsidian-950 text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3.5 border-b-2 transition ${
              activeTab === 'details' ? 'border-prime-gold text-prime-gold bg-obsidian-900' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 border-b-2 transition ${
              activeTab === 'specs' ? 'border-prime-gold text-prime-gold bg-obsidian-900' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3.5 border-b-2 transition ${
              activeTab === 'reviews' ? 'border-prime-gold text-prime-gold bg-obsidian-900' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Customer Reviews ({reviews.length > 0 ? reviews.length : 2})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-w-3xl">
              <p className="text-sm font-semibold text-white">Engineered for Daily Excellence</p>
              <p>
                Experience premium performance with the {product.title}. Developed with cutting-edge engineering and durable Obsidian-grade finishes, this unit delivers optimal ergonomics, low power consumption, and peak user satisfaction.
              </p>
              <p>
                Every purchase comes backed by our comprehensive warranty and dedicated customer service hotline.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-obsidian-800">
                  <tr className="py-2">
                    <td className="font-bold text-slate-400 py-2 w-1/3">Brand</td>
                    <td className="text-slate-200 py-2">{product.brand}</td>
                  </tr>
                  <tr className="py-2">
                    <td className="font-bold text-slate-400 py-2">Category</td>
                    <td className="text-slate-200 py-2 capitalize">{product.category.replace('_', ' ')}</td>
                  </tr>
                  <tr className="py-2">
                    <td className="font-bold text-slate-400 py-2">Item Weight</td>
                    <td className="text-slate-200 py-2">1.85 lbs / 840g</td>
                  </tr>
                  <tr className="py-2">
                    <td className="font-bold text-slate-400 py-2">Model Year</td>
                    <td className="text-slate-200 py-2">2026</td>
                  </tr>
                  <tr className="py-2">
                    <td className="font-bold text-slate-400 py-2">Country of Origin</td>
                    <td className="text-slate-200 py-2">Imported</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-obsidian-800">
                <div className="text-3xl font-black text-white">{product.rating}</div>
                <div>
                  <div className="flex text-prime-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-prime-gold" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{product.rating_count.toLocaleString()} Global Ratings</span>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-4 divide-y divide-obsidian-800">
                {(reviews.length > 0 ? reviews : [
                  { id: 1, user_name: "Michael Chang", rating: 5, title: "Best purchase in years!", comment: "The build quality is incredible. Exactly as advertised, fast shipping!", verified: true, created_at: "2026-08-20" },
                  { id: 2, user_name: "Emily Watson", rating: 5, title: "Unbeatable value", comment: "I compared this to three other premium brands and this one wins hands down.", verified: true, created_at: "2026-08-18" }
                ]).map((rev: any) => (
                  <div key={rev.id} className="pt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{rev.user_name}</span>
                      {rev.verified && (
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-prime-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-prime-gold' : 'text-slate-700'}`} />
                      ))}
                      <span className="font-bold text-white text-xs ml-1">{rev.title}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block">Reviewed on {rev.created_at}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Similar Products Section */}
      {similar.length > 0 && (
        <section className="space-y-4 pt-6">
          <h2 className="text-lg font-black text-white">Customers Who Viewed This Also Bought</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
