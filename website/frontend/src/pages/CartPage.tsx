import React from 'react';
import { CheckCircle, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, navigateTo, toggleWishlist } = useStore();

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Cart Items */}
        <div className="flex-1 bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex justify-between items-baseline pb-3 border-b border-slate-200">
            <h1 className="text-2xl font-semibold text-slate-900">Shopping Cart</h1>
            <span className="text-xs text-slate-500 hidden sm:inline">Price</span>
          </div>

          {items.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Your Amazon Cart is empty</h2>
              <p className="text-xs text-slate-500 mb-6">
                Your shopping cart is waiting. Give it purpose – fill it with electronics, tech, and more.
              </p>
              <button
                onClick={() => navigateTo('home')}
                className="bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-slate-900 px-6 py-2 rounded-full text-xs shadow"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {items.map((item) => {
                const prod = item.product;
                if (!prod) return null;

                return (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <div
                      onClick={() => navigateTo('product', { productId: prod.id })}
                      className="w-32 h-32 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-2 shrink-0 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="max-h-full max-w-full object-contain mix-blend-multiply hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1.5">
                      <h3
                        onClick={() => navigateTo('product', { productId: prod.id })}
                        className="text-base font-medium text-slate-900 hover:text-amazon-linkHover cursor-pointer leading-snug"
                      >
                        {prod.title}
                      </h3>
                      <div className="text-xs text-emerald-700 font-semibold">In Stock</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span>Eligible for FREE Shipping</span>
                        {prod.is_prime && (
                          <span className="text-amazon-prime font-black italic tracking-tighter text-xs">
                            prime
                          </span>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-4 pt-3 text-xs">
                        {/* Qty Dropdown */}
                        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded px-2 py-1">
                          <label className="text-slate-600 text-[11px]">Qty:</label>
                          <select
                            value={item.quantity}
                            onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value, 10))}
                            className="bg-transparent font-bold outline-none cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="h-3 w-[1px] bg-slate-300" />

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-amazon-link hover:underline text-xs"
                        >
                          Delete
                        </button>

                        <div className="h-3 w-[1px] bg-slate-300" />

                        {/* Save for later / Wishlist */}
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className="text-amazon-link hover:underline text-xs"
                        >
                          Save for later
                        </button>
                      </div>
                    </div>

                    {/* Item Price */}
                    <div className="text-right sm:w-28">
                      <span className="text-lg font-bold text-slate-900">
                        ${(prod.price * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <div className="text-[11px] text-slate-500">
                          (${prod.price.toFixed(2)} each)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Bottom Subtotal */}
              <div className="pt-4 text-right">
                <span className="text-base text-slate-800">
                  Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}):{' '}
                  <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Summary Box */}
        {items.length > 0 && (
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
              {/* Free delivery badge */}
              <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded border border-emerald-200">
                <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Your order qualifies for <span className="font-bold">FREE Shipping</span>. Choose this option at checkout.
                </span>
              </div>

              {/* Subtotal */}
              <div>
                <div className="text-base text-slate-800">
                  Subtotal ({totalQuantity} items):{' '}
                  <span className="font-bold text-lg text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-2.5 px-4 bg-amazon-yellow hover:bg-amazon-yellowHover active:bg-amber-500 rounded-full font-bold text-xs text-slate-900 shadow-sm transition-all border border-[#fcd200] flex items-center justify-center gap-2"
              >
                <span>Proceed to checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-[11px] text-slate-500 text-center">
                Secure 256-Bit SSL Checkout with Amazon Pay
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
