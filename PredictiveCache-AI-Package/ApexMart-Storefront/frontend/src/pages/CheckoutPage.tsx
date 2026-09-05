import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { api } from '../services/api.js';
import { tracker } from '../services/tracker.js';

interface CheckoutPageProps {
  onOrderSuccess: (order: any) => void;
  onCancel: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onCancel }) => {
  const { cart, subtotal, clearCart, setCurrentOrder } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Apt 4B, New York, NY 10001');
  const [deliverySpeed, setDeliverySpeed] = useState('⚡ Tomorrow, by 10:00 AM (Prime)');
  const [paymentMethod, setPaymentMethod] = useState('Apex Prime Rewards Visa (ending in 8842)');

  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: 'user_101',
        customerName: 'Alex Chen',
        customerEmail: 'alex.chen@example.com',
        shippingAddress,
        deliverySpeed,
        items: cart,
        totalAmount: grandTotal,
        paymentStatus: 'PAID'
      };

      const createdOrder = await api.createOrder(orderPayload);
      
      // Dispatch telemetry event to Supabase
      tracker.trackPurchase(createdOrder.id, grandTotal, cart.length);

      setCurrentOrder(createdOrder);
      clearCart();
      onOrderSuccess(createdOrder);
    } catch (err) {
      console.error('Order creation failed:', err);
      alert('There was an issue processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-4 border-b border-obsidian-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-prime-gold flex items-center justify-center font-black text-black text-base">
            A
          </div>
          <h1 className="text-xl font-black text-white">
            ApexMart Checkout <span className="text-sm font-normal text-slate-400">({cart.length} items)</span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
          <Lock className="w-4 h-4" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Review (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Shipping Address */}
          <div className="bg-obsidian-900 border border-obsidian-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-prime-gold text-black font-bold text-xs flex items-center justify-center">1</span>
                <span>Shipping Address</span>
              </h2>
              <span className="text-xs text-prime-gold cursor-pointer hover:underline">Change</span>
            </div>
            <div className="bg-obsidian-950 p-3.5 rounded-lg border border-obsidian-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-slate-100">Alex Chen</p>
              <p>{shippingAddress}</p>
              <p className="text-slate-500">Phone: +1 (555) 234-5678</p>
            </div>
          </div>

          {/* Section 2: Delivery Speed */}
          <div className="bg-obsidian-900 border border-obsidian-border rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-prime-gold text-black font-bold text-xs flex items-center justify-center">2</span>
              <span>Choose Your Delivery Option</span>
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { title: '⚡ Tomorrow, by 10:00 AM (Prime)', subtitle: 'Guaranteed Prime Speed — FREE', val: '⚡ Tomorrow, by 10:00 AM (Prime)' },
                { title: 'Standard 2-Day Shipping', subtitle: 'Delivered in 48 hours — FREE', val: 'Standard 2-Day Shipping' },
                { title: 'Same-Day Priority Delivery', subtitle: 'Arrives tonight before 9:00 PM — $3.99', val: 'Same-Day Priority Delivery' },
              ].map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    deliverySpeed === opt.val
                      ? 'bg-prime-gold/15 border-prime-gold text-white'
                      : 'bg-obsidian-950 border-obsidian-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliverySpeed === opt.val}
                      onChange={() => setDeliverySpeed(opt.val)}
                      className="text-prime-gold focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-slate-100">{opt.title}</p>
                      <p className="text-slate-400 text-[11px]">{opt.subtitle}</p>
                    </div>
                  </div>
                  <Truck className="w-4 h-4 text-slate-400" />
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-obsidian-900 border border-obsidian-border rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-prime-gold text-black font-bold text-xs flex items-center justify-center">3</span>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { title: 'Apex Prime Rewards Visa', desc: 'Card ending in 8842 • Earn 5% back', val: 'Apex Prime Rewards Visa (ending in 8842)' },
                { title: 'Corporate Mastercard', desc: 'Card ending in 1092', val: 'Corporate Mastercard (ending in 1092)' },
                { title: 'Apex Store Credit / Gift Card', desc: 'Available balance: $500.00', val: 'Apex Store Credit' }
              ].map((m, idx) => (
                <label
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    paymentMethod === m.val
                      ? 'bg-prime-gold/15 border-prime-gold text-white'
                      : 'bg-obsidian-950 border-obsidian-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === m.val}
                      onChange={() => setPaymentMethod(m.val)}
                      className="text-prime-gold focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-slate-100">{m.title}</p>
                      <p className="text-slate-400 text-[11px]">{m.desc}</p>
                    </div>
                  </div>
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </label>
              ))}
            </div>
          </div>

          {/* Review Order Items */}
          <div className="bg-obsidian-900 border border-obsidian-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Review Order Items ({cart.length})</h3>
            <div className="divide-y divide-obsidian-800">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-obsidian-950 p-1 border border-obsidian-800 flex items-center justify-center shrink-0">
                      <img src={item.product.image_url} alt={item.product.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200 line-clamp-1">{item.product.title}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity} • Brand: {item.product.brand}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-obsidian-900 border border-obsidian-border rounded-2xl p-6 space-y-5 sticky top-24 shadow-2xl">
            
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-gradient-to-r from-prime-gold to-amber-500 hover:from-amber-400 hover:to-prime-gold text-obsidian-950 font-extrabold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authorizing & Placing Order...</span>
              ) : (
                <>
                  <span>Place Your Order</span>
                  <CheckCircle2 className="w-4 h-4 text-obsidian-950" />
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-tight">
              By placing your order, you agree to ApexMart's Conditions of Use and Privacy Notice.
            </p>

            <div className="pt-3 border-t border-obsidian-800 space-y-2 text-xs">
              <h3 className="font-bold text-slate-200">Order Summary</h3>
              <div className="flex justify-between text-slate-400">
                <span>Items ({cart.length}):</span>
                <span className="text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping & Handling:</span>
                <span className="text-emerald-400 font-semibold">$0.00 (Prime)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8%):</span>
                <span className="text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-obsidian-800">
                <span>Order Total:</span>
                <span className="text-prime-gold">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-obsidian-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <Truck className="w-4 h-4" />
                <span>Prime Benefits Applied</span>
              </div>
              <p>You qualified for free next-day delivery on all items.</p>
            </div>

            <button
              onClick={onCancel}
              className="w-full text-center text-xs text-slate-400 hover:text-white underline pt-2"
            >
              Back to Shopping Cart
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
