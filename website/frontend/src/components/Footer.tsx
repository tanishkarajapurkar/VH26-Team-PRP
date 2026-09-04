import React from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 text-slate-300 text-xs">
      {/* Back to top button */}
      <div
        onClick={scrollToTop}
        className="bg-[#37475a] hover:bg-[#485769] text-white py-4 text-center cursor-pointer transition-colors font-medium text-xs tracking-wide"
      >
        Back to top
      </div>

      {/* Main Footer Links */}
      <div className="bg-[#232f3e] py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Get to Know Us</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:underline cursor-pointer">Careers</li>
              <li className="hover:underline cursor-pointer">Blog</li>
              <li className="hover:underline cursor-pointer">About Amazon</li>
              <li className="hover:underline cursor-pointer">Investor Relations</li>
              <li className="hover:underline cursor-pointer">Amazon Devices</li>
              <li className="hover:underline cursor-pointer">Amazon Science</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Make Money with Us</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:underline cursor-pointer">Sell products on Amazon</li>
              <li className="hover:underline cursor-pointer">Sell on Amazon Business</li>
              <li className="hover:underline cursor-pointer">Sell apps on Amazon</li>
              <li className="hover:underline cursor-pointer">Become an Affiliate</li>
              <li className="hover:underline cursor-pointer">Advertise Your Products</li>
              <li className="hover:underline cursor-pointer">Self-Publish with Us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Amazon Payment Products</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:underline cursor-pointer">Amazon Business Card</li>
              <li className="hover:underline cursor-pointer">Shop with Points</li>
              <li className="hover:underline cursor-pointer">Reload Your Balance</li>
              <li className="hover:underline cursor-pointer">Amazon Currency Converter</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Let Us Help You</h4>
            <ul className="space-y-2 text-slate-300">
              <li onClick={() => navigateTo('orders')} className="hover:underline cursor-pointer">
                Your Orders
              </li>
              <li className="hover:underline cursor-pointer">Shipping Rates & Policies</li>
              <li className="hover:underline cursor-pointer">Returns & Replacements</li>
              <li className="hover:underline cursor-pointer">Manage Your Content and Devices</li>
              <li className="hover:underline cursor-pointer">Help</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div
            onClick={() => navigateTo('home')}
            className="text-xl font-black tracking-tight text-white cursor-pointer"
          >
            amazon<span className="text-amber-400 text-sm">.com</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="border border-slate-600 px-3 py-1 rounded">🌐 English</span>
            <span className="border border-slate-600 px-3 py-1 rounded">$ USD - U.S. Dollar</span>
            <span className="border border-slate-600 px-3 py-1 rounded">🇺🇸 United States</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-[#131921] py-8 text-center text-[11px] text-slate-400 space-y-2">
        <div className="flex flex-wrap justify-center gap-4">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Consumer Health Data Privacy Disclosure</span>
          <span className="hover:underline cursor-pointer">Your Ads Privacy Choices</span>
        </div>
        <p>© 1996–2026, Amazon.com, Inc. or its affiliates (Architecture Prototype 1)</p>
      </div>
    </footer>
  );
};
