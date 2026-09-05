import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.js';

interface CartDrawerProps {
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onExplore }) => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-900 border-l border-obsidian-border text-slate-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-obsidian-border flex items-center justify-between bg-obsidian-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-prime-gold" />
              <h2 className="text-base font-bold text-white">Your Shopping Cart ({itemCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-obsidian-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-obsidian-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Explore our vast catalog of electronics, beauty, appliances, and gaming deals.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExplore();
                  }}
                  className="bg-prime-gold hover:bg-amber-400 text-obsidian-950 font-bold text-xs px-5 py-2.5 rounded-lg transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 bg-obsidian-950 rounded-lg p-1.5 border border-obsidian-800 flex items-center justify-center">
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-tight mb-1">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span>Brand: {item.product.brand}</span>
                        {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                      </div>
                    </div>

                    {/* Pricing & Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity selector */}
                      <div className="flex items-center gap-1 bg-obsidian-950 border border-obsidian-700 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-400 hover:text-white transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold px-2 text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-400 hover:text-white transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal and Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 bg-obsidian-950 border-t border-obsidian-border space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal ({itemCount} items):</span>
                <span className="text-lg font-black text-white">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Eligible for FREE Prime Next-Day Delivery & Easy 30-Day Returns</span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full bg-gradient-to-r from-prime-gold to-amber-500 hover:from-amber-400 hover:to-prime-gold text-obsidian-950 font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-obsidian-950" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
