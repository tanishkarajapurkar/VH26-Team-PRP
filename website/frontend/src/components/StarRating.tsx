import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 16,
  showCount = true
}) => {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= Math.floor(rating);
          const isHalf = !isFull && star - 0.5 <= rating;

          return (
            <div key={star} className="relative">
              <Star
                size={size}
                className={`${
                  isFull
                    ? 'fill-amber-500 text-amber-500'
                    : isHalf
                    ? 'fill-amber-300 text-amber-500'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            </div>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-amazon-blue hover:text-amazon-red hover:underline cursor-pointer font-normal">
          {rating.toFixed(1)} {reviewCount !== undefined && `(${reviewCount.toLocaleString()})`}
        </span>
      )}
    </div>
  );
};
