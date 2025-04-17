"use client";

import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  value: number; // Example: 4.7
  outOf?: number; // Total number of stars (default: 5)
  size?: number; // Size of each star
  className?: string; // Optional Tailwind classes
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  outOf = 5,
  size = 24,
  className = "",
}) => {
  const stars = [];

  for (let i = 0; i < outOf; i++) {
    const rawFill = value - i;
    let fillLevel = 0;

    if (rawFill >= 1) {
      fillLevel = 100;
    } else if (rawFill > 0) {
      // Cap slightly below full for decimals like 0.9
      fillLevel = Math.min(rawFill * 100, 94);
    }

    stars.push(
      <div key={i} className="relative" style={{ width: size, height: size }}>
        {/* Empty star */}
        <Star
          size={size}
          className={`text-gray-300 stroke-current ${className}`}
        />

        {/* Filled part */}
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{
            width: `${fillLevel}%`,
            height: "100%",
          }}
        >
          <Star
            size={size}
            className={`text-yellow-400 stroke-yellow-400 fill-yellow-400 ${className}`}
          />
        </div>
      </div>
    );
  }

  return <div className="flex gap-1">{stars}</div>;
};

export default StarRating;
