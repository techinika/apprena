import { Star } from "lucide-react";
import { Progress } from "./progress";

interface RatingDistributionProps {
  data: { stars: number; percentage: number }[];
  className: string;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  data,
  className,
}) => {
  return (
    <div className={`${className} space-y-4 p-4 rounded-xl w-full`}>
      {data.map(({ stars, percentage }) => (
        <div key={stars} className="flex items-center gap-3">
          <div className="flex min-w-[120px] items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i + 1}
                size={16}
                className={
                  i < stars
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {stars} Star Rating
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 h-2 rounded overflow-hidden">
            <Progress value={percentage} className="w-full" />
          </div>

          {/* Percentage Text */}
          <div className="min-w-[40px] text-sm text-primary text-right">
            {percentage < 1 ? "< 1%" : `${percentage}%`}
          </div>
        </div>
      ))}
    </div>
  );
};
