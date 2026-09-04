import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Heart,
  Star,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Product, Review } from '../types';
import { fetchProductById, fetchProductReviews, fetchSimilarProducts } from '../services/api';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export const ProductDetailPage: React.FC = () => {
  const { selectedProductId, addToCart, navigateTo, toggleWishlist, isWishlisted, deliveryLocation } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!selectedProductId) return;
    setLoading(true);

    Promise.all([
      fetchProductById(selectedProductId),
      fetchProductReviews(selectedProductId),
      fetchSimilarProducts(selectedProductId, 4)
    ])
      .then(([prod, revs, sim]) => {
        setProduct(prod);
        setReviews(revs);
        setSimilar(sim);
        if (prod && prod.images.length > 0) {
          setSelectedImage(prod.images[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedProductId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-slate-500 text-sm">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center bg-white rounded border border-slate-200 mt-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded text-xs font-bold"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const priceDollars = Math.floor(product.price);
  const priceCents = Math.round((product.price - priceDollars) * 100)
    .toString()
    .padStart(2, '0');

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity);
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
        <span onClick={() => navigateTo('home')} className="hover:underline cursor-pointer">
          Home
        </span>
        <span>›</span>
        <span
          onClick={() => navigateTo('category', { categoryId: product.category_id })}
          className="hover:underline cursor-pointer capitalize"
        >
          {product.category_id.replace('cat_', '')}
        </span>
        <span>›</span>
        <span className="text-slate-700 truncate max-w-sm">{product.title}</span>
      </div>

      {/* Main 3-Column Layout */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Col 1: Images (5 cols) */}
          <div className="md:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded border p-1 bg-slate-50 flex items-center justify-center transition-all ${
                    selectedImage === img
                      ? 'border-amber-600 ring-1 ring-amber-600 shadow-sm'
                      : 'border-slate-300 hover:border-slate-500'
                  }`}
                >
                  <img src={img} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>

            {/* Main Preview */}
            <div className="flex-1 h-80 sm:h-[420px] bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-4 overflow-hidden relative group">
              <img
                src={selectedImage || product.images[0]}
                alt={product.title}
                className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Col 2: Product Info & Specs (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <span className="text-xs text-amazon-link hover:underline font-medium cursor-pointer">
                Visit the Official Brand Store
              </span>
              <h1 className="text-xl sm:text-2xl font-normal text-slate-900 leading-snug mt-1">
                {product.title}
              </h1>
            </div>

            {/* Rating & Amazon's Choice */}
            <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-slate-200">
              <StarRating rating={product.rating} reviewCount={product.review_count} />
              {product.is_best_seller && (
                <span className="bg-[#232f3e] text-white text-[11px] px-2 py-0.5 rounded-sm font-semibold">
                  Amazon's <span className="text-amber-400">Choice</span>
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="pb-3 border-b border-slate-200 space-y-1">
              <div className="flex items-baseline gap-2">
                {discountPercent > 0 && (
                  <span className="text-amazon-badgeRed text-2xl font-light">
                    -{discountPercent}%
                  </span>
                )}
                <div className="flex items-baseline">
                  <span className="text-xs font-normal text-slate-900 relative -top-2">$</span>
                  <span className="text-3xl font-semibold text-slate-900 leading-none">
                    {priceDollars}
                  </span>
                  <span className="text-xs font-normal text-slate-900 relative -top-2">
                    {priceCents}
                  </span>
                </div>
              </div>

              {product.original_price && (
                <div className="text-xs text-slate-500">
                  Typical price: <span className="line-through">${product.original_price.toFixed(2)}</span>
                </div>
              )}

              {product.is_prime && (
                <div className="flex items-center gap-1 text-xs pt-1">
                  <span className="text-amazon-prime font-black italic tracking-tighter">prime</span>
                  <span className="text-slate-600 font-medium">One-Day & FREE Returns</span>
                </div>
              )}
            </div>

            {/* Features Bullet Points */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">About this item</h3>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 leading-relaxed">
                {product.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 pt-2 border-t border-slate-100 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Col 3: Buy Box (3 cols) */}
          <div className="md:col-span-3">
            <div className="border border-slate-300 rounded p-4 bg-white space-y-4 shadow-sm">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-normal relative -top-1.5">$</span>
                <span className="text-2xl font-semibold text-slate-900">{priceDollars}</span>
                <span className="text-xs font-normal relative -top-1.5">{priceCents}</span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  FREE delivery <span className="font-bold text-slate-900">Tomorrow, Sep 5</span>
                </div>
                <div className="text-[11px] text-amazon-link flex items-center gap-1 cursor-pointer">
                  <span>Deliver to {deliveryLocation}</span>
                </div>
              </div>

              {/* Stock status */}
              <div className="text-emerald-700 font-bold text-base">In Stock</div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600">Qty:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-slate-50 focus:border-amber-500 outline-none"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full py-2 px-4 rounded-full text-xs font-bold bg-amazon-yellow hover:bg-amazon-yellowHover active:bg-amber-500 text-slate-900 border border-[#fcd200] shadow-sm transition-all"
                >
                  {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-2 px-4 rounded-full text-xs font-bold bg-amazon-orange hover:bg-amazon-orangeHover text-slate-900 border border-[#e47911] shadow-sm transition-all"
                >
                  Buy Now
                </button>
              </div>

              {/* Metadata details */}
              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="font-medium text-slate-700">Amazon.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="font-medium text-slate-700">Amazon.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Returns</span>
                  <span className="font-medium text-slate-700">30-day refund/replacement</span>
                </div>
              </div>

              {/* Add to Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className="w-full py-1.5 px-3 border border-slate-300 rounded text-xs text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Heart
                  size={14}
                  className={isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}
                />
                <span>{isWishlisted(product.id) ? 'Remove from List' : 'Add to List'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
          Customer Reviews ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Review Summary */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} size={20} showCount={false} />
              <span className="text-xl font-bold text-slate-900">{product.rating} out of 5</span>
            </div>
            <p className="text-xs text-slate-500">{product.review_count.toLocaleString()} global ratings</p>

            {/* Rating breakdown bars */}
            <div className="space-y-2 text-xs">
              {[
                { stars: '5 star', percent: 78 },
                { stars: '4 star', percent: 14 },
                { stars: '3 star', percent: 5 },
                { stars: '2 star', percent: 2 },
                { stars: '1 star', percent: 1 }
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-2">
                  <span className="w-12 text-amazon-link hover:underline cursor-pointer">{row.stars}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-amber-400 rounded-sm"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-500">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Reviews List */}
          <div className="md:col-span-8 space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b border-slate-100 pb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                    {rev.user_name[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{rev.user_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <StarRating rating={rev.rating} size={14} showCount={false} />
                  <span className="font-bold text-xs text-slate-900">{rev.title}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Reviewed in the United States on {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                </div>

                {rev.verified_purchase && (
                  <div className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Purchase
                  </div>
                )}

                <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Customers who viewed this item also viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((simProd) => (
              <ProductCard key={simProd.id} product={simProd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
