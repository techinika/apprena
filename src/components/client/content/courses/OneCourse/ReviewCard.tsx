"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/ui/star-rating";
import { Review } from "@/types/Course";
import { formatDistance } from "date-fns";
import { Dot } from "lucide-react";
import React from "react";

function ReviewCard({ item }: { item: Review | null }) {
  return (
    <div className="flex gap-3 items-start py-7">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={"/placeholder.jpg"}
          alt={item?.createdBy?.displayName ?? "No Name"}
        />
        <AvatarFallback>
          {item?.createdBy?.displayName?.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-3">
        <h2 className="flex items-center font-semibold text-xl">
          {item?.createdBy?.displayName} <Dot />{" "}
          <span className="text-sm text-muted-foreground">
            {formatDistance(item?.createdAt ?? new Date(), new Date(), {
              includeSeconds: true,
            })}
          </span>
        </h2>
        <StarRating value={item?.rating ?? 0} size={20} />
        <p>{item?.comment}</p>
      </div>
    </div>
  );
}

export default ReviewCard;
