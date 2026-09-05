import React from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, Home, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationPage: React.FC = () => {
  const { viewParams, navigateTo } = useStore();
  const orderNumber = viewParams.orderId || `APTS-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Animated Glowing Success Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-12 h-12" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Payment Successful & Verified
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Thank you for ordering with APTS E-Commerce. Your simulated order has been registered in the backend database.
        </p>
      </div>

      {/* Order Card */}
      <div className="bg-apts-card border border-apts-border rounded-3xl p-6 sm:p-8 text-left space-y-6 max-w-xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-apts-border">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Order Number</span>
            <span className="text-lg font-black text-apts-primary font-mono">{orderNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Order Date</span>
            <span className="text-xs font-semibold text-slate-300">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-apts-primary">
            <Truck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-white mb-0.5">Estimated Express Delivery</h4>
            <p className="text-slate-400">
              Dispatching from Bengaluru fulfillment center. Expected delivery in 2-3 days.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-white mb-0.5">Workload Event Recorded</h4>
            <p className="text-slate-400">
              This simulated order has produced a transaction event in PostgreSQL <code className="text-cyan-400">traffic_events</code> table for CacheX analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => navigateTo('home')}
          className="bg-apts-primary hover:bg-apts-primaryHover text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-glow-primary inline-flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>RETURN HOME</span>
        </button>

        <button
          onClick={() => navigateTo('shop')}
          className="bg-apts-surface hover:bg-slate-800 text-slate-200 border border-apts-border font-bold text-xs px-6 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
