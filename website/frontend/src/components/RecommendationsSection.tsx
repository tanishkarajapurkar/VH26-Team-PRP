import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { fetchRecommendations } from '../services/api';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

export const RecommendationsSection: React.FC = () => {
  const { currentUser } = useStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchRecommendations(currentUser.id, 8)
      .then((data) => {
        if (isMounted) setRecommendations(data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  if (recommendations.length === 0 && !loading) return null;

  return (
    <div className="bg-white p-5 rounded-sm border border-slate-200 mb-8 max-w-7xl mx-auto shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-1.5 rounded-full text-amber-700">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recommended for You, {currentUser.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-500">
              Personalized based on popular selections and your browsing history
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};
