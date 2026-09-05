import React from 'react';
import { ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-obsidian-950 border-t border-obsidian-border text-slate-400 text-xs mt-16">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full py-3 bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition border-b border-obsidian-border"
      >
        <ChevronUp className="w-4 h-4 text-prime-gold" />
        <span>Back to top</span>
      </button>

      {/* Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Get to Know Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-prime-gold transition">About ApexMart</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Careers at ApexMart</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Sustainability & Packaging</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Investor Relations</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Apex Science & Logistics</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-3">Make Money with Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-prime-gold transition">Sell on ApexMart</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Sell Under Apex Accelerator</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Protect & Build Your Brand</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Apex Associates Affiliate</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Fulfillment by ApexMart</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-3">Apex Payment Products</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-prime-gold transition">Apex Prime Rewards Visa</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Apex Store Card</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Shop with Reward Points</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Reload Your Balance</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Currency Converter</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-3">Let Us Help You</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-prime-gold transition">Your Account</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Your Orders & Tracking</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Shipping Rates & Policies</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">Returns & Replacements</a></li>
            <li><a href="#" className="hover:text-prime-gold transition">24/7 Customer Help Center</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-obsidian-900 py-6 text-center text-slate-500 text-[11px] space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded bg-prime-gold flex items-center justify-center font-bold text-black text-xs">
            A
          </div>
          <span className="font-bold text-slate-300">apexmart.com</span>
        </div>
        <p>© 2026, ApexMart.com, Inc. or its affiliates. All rights reserved. Powered by Supabase Backend.</p>
        <p className="text-slate-600 text-[10px]">
          Conditions of Use • Privacy Notice • Consumer Health Privacy • Your Ads Privacy Choices
        </p>
      </div>
    </footer>
  );
};
