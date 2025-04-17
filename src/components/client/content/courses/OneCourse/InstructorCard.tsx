"use client";

import { Card } from "@/components/ui/card";
import { Play, Star, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

function InstructorCard({
  item,
}: {
  item: {
    id: string;
    photoURL: string;
    displayName: string;
    title: string;
    courseRatings: number;
    students: number;
    coursesMade: number;
    bio: string;
  };
}) {
  return (
    <Card className="flex items-start gap-5 p-5 bg-gray-100 dark:bg-gray-900 my-3">
      <Image
        src={item?.photoURL ?? "/placeholder.jpg"}
        width={200}
        height={200}
        alt={item?.title}
        className="object-cover rounded-full"
      />
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-semibold">{item?.displayName}</h2>
        <p className="text-xs text-muted-foreground">{item?.title}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Star
              className="w-4 h-4"
              fill={item?.courseRatings > 0 ? "text-yellow-500" : ""}
            />
            {item?.courseRatings ?? 0} Ratings
          </p>
          <p className="flex items-center gap-2">
            <Users className="w-4 h-4" /> {item?.students ?? 0} Learners
          </p>
          <p className="flex items-center gap-2">
            <Play className="w-4 h-4" /> {item?.coursesMade ?? 0} Courses
          </p>
        </div>
        <p className="text-muted-foreground text-lg">{item?.bio}</p>
      </div>
    </Card>
  );
}

export default InstructorCard;
