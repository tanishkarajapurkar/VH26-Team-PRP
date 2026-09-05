import React, { useState } from 'react';
import { CheckCircle2, Package, Truck, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Order } from '../types/index.js';
import { InvoiceModal } from '../components/InvoiceModal.js';

interface OrderConfirmationPageProps {
  order: Order | null;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onContinueShopping,
}) => {
  const [showInvoice, setShowInvoice] = useState(false);

  if (!order) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-400">No active order found.</p>
        <button
          onClick={onContinueShopping}
          className="bg-prime-gold text-obsidian-950 font-bold text-xs px-4 py-2 rounded-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  const steps = [
    { title: 'Order Confirmed', time: 'Today, 2:45 PM', done: true },
    { title: 'Preparing in Warehouse', time: 'Fulfillment Hub #4', done: true },
    { title: 'Out for Delivery', time: 'Tomorrow morning', done: false, active: true },
    { title: 'Delivered to Doorstep', time: 'By Tomorrow 10 AM', done: false },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 pb-20">
      
      {/* Success Notification Banner */}
      <div className="bg-obsidian-900 border border-emerald-500/40 rounded-2xl p-6 md:p-8 space-y-4 text-center relative overflow-hidden shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-white">
          Order Placed! Thank you, {order.customerName}.
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          We've sent a confirmation email with full tracking details to{' '}
          <strong className="text-white">{order.customerEmail}</strong>.
        </p>

        <div className="inline-flex items-center gap-2 bg-obsidian-950 px-4 py-2 rounded-xl border border-obsidian-800 text-xs text-slate-300 font-mono">
          <span>Order #: <strong>{order.id}</strong></span>
          <span className="text-slate-600">•</span>
          <span className="text-prime-gold font-bold">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Package Tracking Visual Stepper */}
      <div className="bg-obsidian-900 border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-prime-gold" />
            <h2 className="text-sm font-bold text-white">Live Prime Delivery Tracking</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            ⚡ On Schedule
          </span>
        </div>

        {/* Stepper Dots & Line */}
        <div className="relative flex justify-between items-center py-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-obsidian-800 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-prime-gold -translate-y-1/2 z-0 transition-all duration-700" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center max-w-[100px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step.done
                    ? 'bg-prime-gold text-black shadow-lg shadow-amber-500/20'
                    : step.active
                    ? 'bg-obsidian-950 border-2 border-prime-gold text-prime-gold animate-pulse'
                    : 'bg-obsidian-950 border border-obsidian-700 text-slate-500'
                }`}
              >
                {step.done ? '✓' : idx + 1}
              </div>
              <p className="text-[11px] font-bold text-slate-200 mt-2 leading-tight">{step.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{step.time}</p>
            </div>
          ))}
        </div>

        <div className="bg-obsidian-950 p-3.5 rounded-xl border border-obsidian-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300">Carrier: <strong>Apex Prime Logistics</strong></span>
          </div>
          <span className="text-slate-400">Tracking: APX-994827-US</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => setShowInvoice(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-obsidian-700 font-bold text-xs px-6 py-3 rounded-xl transition"
        >
          <FileText className="w-4 h-4 text-prime-gold" />
          <span>View / Print Tax Invoice</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-prime-gold to-amber-500 hover:from-amber-400 hover:to-prime-gold text-obsidian-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        onClose={() => setShowInvoice(false)}
      />

    </div>
  );
};
