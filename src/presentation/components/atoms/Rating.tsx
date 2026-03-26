import { Star } from 'lucide-react';

interface RatingProps {
  rate: number;
  count?: number;
  showCount?: boolean;
}

export function Rating({ rate, count, showCount = false }: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rate} out of 5`}>
      <div className="flex items-center">
        {stars.map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= Math.round(rate)
                ? 'fill-warning text-warning'
                : 'fill-neutral-200 text-neutral-200'
            }
          />
        ))}
      </div>
      <span className="text-caption text-neutral-500">
        {rate.toFixed(1)}
        {showCount && count !== undefined && (
          <span className="ml-1">({count})</span>
        )}
      </span>
    </div>
  );
}
