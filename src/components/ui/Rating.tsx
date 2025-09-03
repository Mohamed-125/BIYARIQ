import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Rating = ({ rating, showText = true, size = "md" }: RatingProps) => {
  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => {
          const starValue = index;
          const isFullStar = starValue <= Math.floor(rating);
          const isHalfStar =
            !isFullStar && starValue === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <div key={index} className="relative">
              <Star
                className={`${starSizes[size]} ${
                  isFullStar
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300 fill-current"
                }`}
              />
              {isHalfStar && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star
                    className={`${starSizes[size]} text-yellow-400 fill-current`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className={`${textSizes[size]} text-gray-600 mr-1`}>
        تقييم ({rating})
      </span>
    </div>
  );
};

export default Rating;
