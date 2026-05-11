import { Star } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function StarRating({ rating, reviews, size = 'md' }) {
  const sizes = { sm: 12, md: 16, lg: 20 };
  const px = sizes[size] || 16;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => {
          const filled = s <= Math.floor(rating);
          const half = !filled && s - 0.5 <= rating;
          return (
            <Star
              key={s}
              size={px}
              className={
                filled || half
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-[var(--border)]'
              }
            />
          );
        })}
      </div>
      <span className="font-semibold text-sm text-[var(--text)]">{rating}</span>
      {reviews && (
        <span className="text-sm text-[var(--text-muted)]">
          ({formatNumber(reviews)} reviews)
        </span>
      )}
    </div>
  );
}
