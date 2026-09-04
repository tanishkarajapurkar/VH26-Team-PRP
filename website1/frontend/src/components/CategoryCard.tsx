import React from 'react';
import { Category } from '../types';
import { useStore } from '../context/StoreContext';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { navigateTo } = useStore();

  return (
    <div
      onClick={() => navigateTo('category', { categoryId: category.id })}
      className="group relative bg-apts-card border border-apts-border hover:border-apts-primary rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:shadow-glow-primary hover:-translate-y-1 overflow-hidden"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl mb-3 overflow-hidden bg-slate-900 border border-white/5">
        <img
          src={category.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-apts-primary transition-colors">
        {category.name}
      </h4>
      <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">
        {category.description || 'Explore collection'}
      </span>
    </div>
  );
};
