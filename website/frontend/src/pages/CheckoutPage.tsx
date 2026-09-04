import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Lock, Package, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { placeOrder } from '../services/api';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, currentUser, refreshCart, navigateTo } = useStore();
  const [isPlacing, setIsPlacing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState({
    fullName: currentUser.name,
    street: '410 Terry Ave N',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98109',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('Amazon Prime Visa ending in 4242');

  const items = cart?.items || [];
  const itemsTotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = 0.0;
  const estimatedTax = itemsTotal * 0.085;
  const orderTotal = itemsTotal + shipping + estimatedTax;

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const order = await placeOrder(currentUser.id, address, paymentMethod);
      setCompletedOrder(order);
      await refreshCart();
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Error placing order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  // ORDER SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-sm p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Thank you, your order has been placed!</h1>
          <p className="text-sm text-slate-600 mb-6">
            An email confirmation has been sent to <span className="font-semibold text-slate-900">{currentUser.email}</span>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded p-4 max-w-md mx-auto text-left text-xs text-slate-700 mb-8 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number:</span>
              <span className="font-mono font-bold text-slate-900">{completedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Order Total:</span>
              <span className="font-bold text-slate-900">${orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guaranteed Delivery:</span>
              <span className="font-bold text-emerald-700">Tomorrow by 8 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping to:</span>
              <span className="font-medium text-slate-900">{address.fullName}, {address.city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigateTo('orders')}
              className="bg-amazon-yellow hover:bg-amazon-yellowHover text-slate-900 font-bold px-6 py-2.5 rounded-full text-xs shadow transition-colors"
            >
              View Your Orders
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-6 py-2.5 rounded-full text-xs transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">
          Checkout <span className="text-sm font-normal text-slate-500">({items.length} items)</span>
        </h1>
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <Lock size={14} />
          <span>256-Bit SSL Encryption</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: 3 Steps */}
        <div className="flex-1 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-bold text-base text-slate-900">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">ZIP Code</label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-bold text-base text-slate-900">Payment Method</h2>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { id: 'visa', label: 'Amazon Prime Visa ending in 4242' },
                { id: 'pay', label: 'Amazon Pay Balance ($150.00 available)' },
                { id: 'card', label: 'Mastercard ending in 9811' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                    paymentMethod.includes(opt.id)
                      ? 'border-amber-500 bg-amber-50/40'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod.includes(opt.id)}
                    onChange={() => setPaymentMethod(opt.label)}
                    className="text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-medium text-slate-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Review Items and Shipping */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="font-bold text-base text-slate-900">Review items and shipping</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <img
                    src={item.product?.images[0]}
                    alt=""
                    className="w-16 h-16 object-contain bg-slate-50 border p-1 rounded"
                  />
                  <div className="flex-1 text-xs">
                    <div className="font-medium text-slate-900 line-clamp-1">
                      {item.product?.title}
                    </div>
                    <div className="text-slate-500">Qty: {item.quantity}</div>
                    <div className="text-emerald-700 font-semibold mt-0.5">
                      Delivery: FREE Prime One-Day
                    </div>
                  </div>
                  <div className="font-bold text-xs text-slate-900">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm sticky top-24 space-y-4">
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing || items.length === 0}
              className="w-full py-3 bg-amazon-yellow hover:bg-amazon-yellowHover active:bg-amber-500 rounded-full font-bold text-xs text-slate-900 shadow border border-[#fcd200] transition-all disabled:opacity-50"
            >
              {isPlacing ? 'Placing Order...' : 'Place your order'}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-tight">
              By placing your order, you agree to Amazon's conditions of use and privacy notice.
            </p>

            <div className="pt-3 border-t border-slate-200 text-xs space-y-2">
              <h3 className="font-bold text-slate-900 text-sm mb-2">Order Summary</h3>
              <div className="flex justify-between text-slate-600">
                <span>Items ({items.length}):</span>
                <span>${itemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & handling:</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated tax:</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="font-bold text-base text-amazon-red">Order Total:</span>
                <span className="font-bold text-xl text-amazon-red">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
