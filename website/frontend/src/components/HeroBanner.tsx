import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const BANNERS = [
  {
    id: 1,
    title: 'Up to 40% off Tech Essentials',
    subtitle: 'Laptops, headphones, and gaming gear with lightning-fast Prime shipping',
    bg: 'from-amber-700 via-orange-900 to-slate-900',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200',
    category: 'cat_computers'
  },
  {
    id: 2,
    title: 'Immersive Noise Cancellation',
    subtitle: 'Experience world-class studio sound on high-res wireless headphones',
    bg: 'from-blue-900 via-indigo-950 to-slate-900',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
    category: 'cat_audio'
  },
  {
    id: 3,
    title: 'Smart Home & Solar Security',
    subtitle: 'Automate your life and protect what matters with 2K solar surveillance',
    bg: 'from-emerald-900 via-teal-950 to-slate-900',
    img: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200',
    category: 'cat_smart_home'
  }
];

export const HeroBanner: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { navigateTo } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentIdx];

  return (
    <div className="relative w-full h-[280px] sm:h-[380px] md:h-[450px] overflow-hidden">
      {/* Background Image & Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url(${banner.img})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-85 mix-blend-multiply`} />
        {/* Amazon bottom fade gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/30 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center text-white pb-20 sm:pb-32">
        <span className="inline-block bg-amber-500 text-slate-950 text-xs font-extrabold uppercase px-2.5 py-1 rounded w-fit mb-3">
          Special Prime Deals
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black max-w-xl tracking-tight leading-tight mb-2 drop-shadow-md">
          {banner.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-200 max-w-lg mb-6 drop-shadow">
          {banner.subtitle}
        </p>
        <div>
          <button
            onClick={() => navigateTo('category', { categoryId: banner.category })}
            className="bg-amazon-yellow hover:bg-amazon-yellowHover text-slate-900 font-bold px-6 py-2.5 rounded-full text-sm shadow-md transition-all active:scale-95"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrentIdx((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-2 top-1/3 -translate-y-1/2 z-20 p-2 text-white/80 hover:text-white hover:bg-black/20 rounded border border-white/20 transition-colors"
      >
        <ChevronLeft size={36} />
      </button>

      <button
        onClick={() => setCurrentIdx((prev) => (prev + 1) % BANNERS.length)}
        className="absolute right-2 top-1/3 -translate-y-1/2 z-20 p-2 text-white/80 hover:text-white hover:bg-black/20 rounded border border-white/20 transition-colors"
      >
        <ChevronRight size={36} />
      </button>
    </div>
  );
};
