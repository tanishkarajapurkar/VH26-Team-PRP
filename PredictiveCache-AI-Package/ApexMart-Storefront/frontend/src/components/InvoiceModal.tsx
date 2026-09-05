import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { Order } from '../types/index.js';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const tax = (order.totalAmount * 0.08);
  const grandTotal = order.totalAmount + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-obsidian-900 border border-obsidian-border rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="bg-obsidian-950 px-6 py-4 border-b border-obsidian-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-prime-gold flex items-center justify-center font-bold text-black text-sm">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Order Receipt & Tax Invoice</h2>
              <p className="text-[11px] text-slate-400">Order {order.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-obsidian-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-obsidian-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Header Metadata */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-obsidian-800">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Sold By:</span>
              <p className="font-bold text-slate-100 text-sm">ApexMart Retail LLC</p>
              <p className="text-slate-400 text-[11px]">Prime Fulfillment Center #402</p>
              <p className="text-slate-400 text-[11px]">Seattle, WA 98109 • USA</p>
              <p className="text-slate-400 text-[11px]">GSTIN / Tax ID: US-APX-882910</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block mb-1">Shipping Details:</span>
              <p className="font-bold text-slate-100">{order.customerName}</p>
              <p className="text-slate-300 text-[11px] max-w-xs ml-auto">{order.shippingAddress}</p>
              <p className="text-slate-400 text-[11px] mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Payment Verified: PAID
              </span>
            </div>
          </div>

          {/* Delivery & Speed */}
          <div className="bg-obsidian-950 p-3 rounded-lg border border-obsidian-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[11px] block">Shipping Method:</span>
              <span className="font-bold text-amber-400">{order.deliverySpeed}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Delivery Status:</span>
              <span className="font-bold text-sky-400">⚡ Dispatched (In Transit)</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h3 className="font-bold text-slate-200 mb-2">Order Items:</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-obsidian-800 text-[11px] text-slate-400 font-semibold uppercase">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-200">
                    <td className="py-2.5 pr-2">
                      <p className="font-medium text-slate-100">{item.product.title}</p>
                      <p className="text-[10px] text-slate-400">Brand: {item.product.brand}</p>
                    </td>
                    <td className="py-2.5 text-center text-slate-300 font-semibold">{item.quantity}</td>
                    <td className="py-2.5 text-right text-slate-300">${item.product.price.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-bold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="border-t border-obsidian-800 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal:</span>
                <span className="text-slate-200">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping & Handling:</span>
                <span className="text-emerald-400 font-semibold">FREE (Prime Benefit)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8%):</span>
                <span className="text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white border-t border-obsidian-700 pt-2">
                <span>Grand Total:</span>
                <span className="text-prime-gold">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-obsidian-800 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Thank you for shopping with ApexMart. Return policy: 30 days replacement guarantee.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
