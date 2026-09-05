import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-apts-card border border-apts-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-apts-primary">
            {review.author_name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>{review.author_name}</span>
              {review.verified && (
                <span className="flex items-center text-[10px] text-emerald-400 font-normal">
                  <CheckCircle className="w-3 h-3 mr-0.5" /> Verified Purchase
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < review.rating ? 'fill-amber-400' : 'text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <h4 className="text-sm font-bold text-slate-200 mb-1.5">{review.title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{review.content}</p>
    </div>
  );
};
