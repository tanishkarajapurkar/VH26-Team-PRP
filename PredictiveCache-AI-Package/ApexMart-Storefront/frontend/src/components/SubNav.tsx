import React from 'react';
import { Menu, Zap, Sparkles, Flame, Tag } from 'lucide-react';

interface SubNavProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const SubNav: React.FC<SubNavProps> = ({ onSelectCategory, activeCategory }) => {
  const links = [
    { id: 'all', label: 'All Catalog' },
    { id: 'beauty', label: 'Beauty & Skincare' },
    { id: 'home_appliances', label: 'Home Appliances' },
    { id: 'tech', label: 'Electronics & Audio' },
    { id: 'kitchen', label: 'Kitchen & Dining' },
    { id: 'gaming', label: 'Gaming & Setup' },
  ];

  return (
    <nav className="bg-obsidian-950 border-b border-obsidian-border text-slate-300 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-1.5 font-bold text-white hover:text-prime-gold transition px-2 py-1 rounded hover:bg-obsidian-850"
          >
            <Menu className="w-4 h-4 text-prime-gold" />
            <span>All Departments</span>
          </button>

          {links.map((link) => {
            const isActive = activeCategory === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectCategory(link.id)}
                className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-obsidian-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right Prime Delivery banner promo */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-amber-400 font-semibold shrink-0 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>Prime: FREE Guaranteed Next-Day Delivery on 15,000+ items</span>
        </div>

      </div>
    </nav>
  );
};
