import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { StarRating } from '../components/StarRating';

export const WishlistPage: React.FC = () => {
  const { wishlist, currentUser, addToCart, toggleWishlist, navigateTo } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Wish List</h1>
          <p className="text-xs text-slate-500">
            Private list for <span className="font-semibold text-slate-800">{currentUser.name}</span>
          </p>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-amazon-link hover:underline font-medium"
        >
          Explore More Items
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-sm p-12 text-center shadow-sm">
          <Heart size={48} className="text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800 mb-1">Your List is empty</h2>
          <p className="text-xs text-slate-500 mb-6">
            Explore items and click the heart icon on any product to save it here for later.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-slate-900 px-6 py-2 rounded-full text-xs shadow"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-sm divide-y divide-slate-200 shadow-sm">
          {wishlist.map((prod) => (
            <div key={prod.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div
                onClick={() => navigateTo('product', { productId: prod.id })}
                className="w-28 h-28 bg-slate-50 border p-2 rounded shrink-0 cursor-pointer flex items-center justify-center"
              >
                <img
                  src={prod.images[0]}
                  alt=""
                  className="max-h-full max-w-full object-contain mix-blend-multiply hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <h3
                  onClick={() => navigateTo('product', { productId: prod.id })}
                  className="text-base font-medium text-slate-900 hover:text-amazon-linkHover cursor-pointer leading-snug"
                >
                  {prod.title}
                </h3>
                <StarRating rating={prod.rating} reviewCount={prod.review_count} />
                <div className="text-lg font-bold text-slate-900 mt-1">
                  ${prod.price.toFixed(2)}
                </div>
                <div className="text-emerald-700 font-semibold">In Stock</div>
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-44 text-xs">
                <button
                  onClick={() => addToCart(prod.id, 1)}
                  className="w-full py-2 px-4 bg-amazon-yellow hover:bg-amazon-yellowHover text-slate-900 font-bold rounded-full border border-[#fcd200] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(prod)}
                  className="w-full py-1.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-full flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
