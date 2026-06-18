interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };

export default function Rating({ value, onChange, readonly = false, size = 'md' }: RatingProps) {
  return (
    <div className={`flex gap-1 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}
