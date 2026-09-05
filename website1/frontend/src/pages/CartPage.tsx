import React, { useState } from 'react';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const { cart, updateCartItemQuantity, removeCartItem, navigateTo } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
    0
  );

  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = subtotal > 999 || items.length === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const freeShippingRemaining = Math.max(0, 999 - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-apts-card border border-apts-border flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Explore our curated catalog of electronics, computers, gaming gear, and lifestyle products.
          </p>
        </div>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-apts-primary hover:bg-apts-primaryHover text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-glow-primary inline-flex items-center gap-2 transition-all"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review your selected items before simulated checkout.
        </p>
      </div>

      {/* Free Shipping Notification Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-apts-card to-[#121c33] border border-apts-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
          <Truck className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          {freeShippingRemaining === 0 ? (
            <span className="text-emerald-400 font-bold">
              Congratulations! Your order qualifies for Free Express Delivery.
            </span>
          ) : (
            <span className="text-slate-300">
              Add <strong className="text-white">{formatPrice(freeShippingRemaining)}</strong> more
              worth of items to unlock <strong className="text-cyan-400">Free Delivery</strong>!
            </span>
          )}
        </div>
      </div>

      {/* Cart Layout: Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const prod = item.product;
            if (!prod) return null;

            return (
              <div
                key={item.id}
                className="bg-apts-card border border-apts-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div
                  onClick={() => navigateTo('product', { productId: prod.id })}
                  className="flex items-center gap-4 cursor-pointer group"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-apts-textMuted font-medium block">
                      {prod.brand}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-apts-primary transition-colors line-clamp-1 max-w-sm">
                      {prod.name}
                    </h3>
                    <div className="text-xs text-emerald-400 font-medium mt-1">In Stock</div>
                    <div className="text-sm font-black text-white mt-1 sm:hidden">
                      {formatPrice(prod.price * item.quantity)}
                    </div>
                  </div>
                </div>

                {/* Stepper + Price + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-apts-border/60 pt-3 sm:pt-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-apts-surface border border-apts-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-white min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="hidden sm:block text-right min-w-[5rem]">
                    <div className="text-base font-black text-white">
                      {formatPrice(prod.price * item.quantity)}
                    </div>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-slate-500">
                        {formatPrice(prod.price)} each
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeCartItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-apts-card border border-apts-border rounded-3xl p-6 space-y-6 sticky top-28">
          <h2 className="text-base font-bold text-white pb-3 border-b border-apts-border">
            Order Summary
          </h2>

          {/* Promo Code Input */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-medium">Coupon or Promo Code</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try APTS10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 bg-apts-surface border border-apts-border px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 outline-none uppercase font-mono focus:border-apts-primary"
              />
              <button
                onClick={() => {
                  if (promoCode === 'APTS10') {
                    setPromoApplied(true);
                  }
                }}
                className="bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 px-3 py-2 rounded-xl border border-white/5 transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <span className="text-[11px] text-emerald-400 font-medium block">
                ✓ 10% APTS Promotional Discount Applied!
              </span>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3 text-xs border-t border-apts-border pt-4">
            <div className="flex justify-between text-slate-300">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
            </div>

            {promoApplied && (
              <div className="flex justify-between text-emerald-400">
                <span>Promo Discount (10%):</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-300">
              <span>Delivery Fee:</span>
              <span className="font-semibold">
                {shippingFee === 0 ? (
                  <span className="text-emerald-400">FREE</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span>Estimated Tax:</span>
              <span className="text-slate-500">Included in price</span>
            </div>

            <div className="flex justify-between text-base font-black text-white border-t border-apts-border pt-3">
              <span>Total Amount:</span>
              <span className="text-apts-primary text-xl">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigateTo('checkout')}
            className="w-full bg-gradient-to-r from-apts-primary to-cyan-500 hover:from-cyan-400 hover:to-apts-primary text-slate-950 font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-glow-primary transition-all duration-200"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>256-Bit Encrypted Simulated Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
};
