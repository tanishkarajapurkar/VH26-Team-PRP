import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Smartphone, Banknote, Building2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { submitCheckout } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { cart, navigateTo, refreshCart } = useStore();
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: 'Rahul Sharma',
    addressLine1: '42 Silicon Avenue, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    phone: '+91 98765 43210'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
    0
  );
  const shippingFee = subtotal > 999 || items.length === 0 ? 0 : 99;
  const total = subtotal + shippingFee;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitCheckout({
        shippingAddress: formData,
        paymentMethod:
          paymentMethod === 'upi'
            ? 'Simulated UPI Instant Pay'
            : paymentMethod === 'card'
            ? 'Simulated Credit/Debit Card'
            : paymentMethod === 'netbanking'
            ? 'Simulated NetBanking'
            : 'Cash on Delivery'
      });

      await refreshCart();
      navigateTo('order_confirmation', { orderId: res.order.order_number });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Simulated Checkout
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Complete your order with simulated payments (Zero actual funds charged).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-apts-card border border-apts-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-apts-border">
              <div className="w-6 h-6 rounded-full bg-apts-primary text-slate-950 font-black text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="text-base font-bold text-white">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-apts-surface border border-apts-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-apts-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full bg-apts-surface border border-apts-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-apts-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-apts-surface border border-apts-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-apts-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-apts-surface border border-apts-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-apts-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">PIN / Postal Code</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-apts-surface border border-apts-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-apts-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-apts-surface border border-apts-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-apts-primary"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-apts-card border border-apts-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-apts-border">
              <div className="w-6 h-6 rounded-full bg-apts-primary text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="text-base font-bold text-white">Payment Selection</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-cyan-500/10 border-apts-primary text-white shadow-glow-primary'
                    : 'bg-apts-surface border-apts-border text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="hidden"
                />
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Instant UPI / QR</div>
                  <div className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm</div>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-500/10 border-apts-primary text-white shadow-glow-primary'
                    : 'bg-apts-surface border-apts-border text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="hidden"
                />
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Credit / Debit Card</div>
                  <div className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</div>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-cyan-500/10 border-apts-primary text-white shadow-glow-primary'
                    : 'bg-apts-surface border-apts-border text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="hidden"
                />
                <Building2 className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">NetBanking</div>
                  <div className="text-[10px] text-slate-500">All major retail banks</div>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-cyan-500/10 border-apts-primary text-white shadow-glow-primary'
                    : 'bg-apts-surface border-apts-border text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="hidden"
                />
                <Banknote className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Cash on Delivery</div>
                  <div className="text-[10px] text-slate-500">Pay at doorstep</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review (5 cols) */}
        <div className="lg:col-span-5 bg-apts-card border border-apts-border rounded-3xl p-6 space-y-6 sticky top-28">
          <h2 className="text-base font-bold text-white pb-3 border-b border-apts-border">
            Order Review ({items.length} items)
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 text-xs">
                <img
                  src={it.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/5"
                />
                <div className="flex-1 truncate">
                  <div className="font-bold text-white truncate">{it.product?.name}</div>
                  <span className="text-slate-500 text-[11px]">Qty: {it.quantity}</span>
                </div>
                <span className="font-bold text-slate-200">
                  {formatPrice((it.product?.price || 0) * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-apts-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-emerald-400">
                {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-apts-border">
              <span>Grand Total:</span>
              <span className="text-apts-primary text-xl">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full bg-gradient-to-r from-apts-primary to-cyan-500 hover:from-cyan-400 hover:to-apts-primary text-slate-950 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-glow-primary transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span>PROCESSING PAYMENT...</span>
            ) : (
              <>
                <span>PLACE SIMULATED ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulated transaction generates workload events for CacheX</span>
          </div>
        </div>

      </form>
    </div>
  );
};
