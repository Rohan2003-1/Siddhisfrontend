import { Star } from 'lucide-react';

const StarRating = ({ rating, max = 5, size = 16, showCount, count }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : i < rating ? 'fill-yellow-200 text-yellow-400' : 'text-gray-300'}
      />
    ))}
    {showCount && <span className="text-sm text-gray-500 ml-1">({count})</span>}
  </div>
);

export default StarRating;
