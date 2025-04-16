"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course } from "@/types/Course";
import { Clock, Component, Milestone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function CourseCard({ item }: { item: Course | null }) {
  const router = useRouter();
  return (
    <Card className="overflow-hidden cursor-pointer relative">
      <div className="absolute top-0 left-0 z-50 bg-yellow-600 p-1 text-xs font-bold">
        {item?.availability}
      </div>
      <Image
        src={item?.coverImage ? item?.coverImage : "/placeholder.jpg"}
        width={100}
        height={100}
        className="w-full object-cover h-40"
        alt={item?.title ? item?.title : "Course Cover Image"}
      />
      <CardHeader>
        <CardTitle>{item?.title}</CardTitle>
        <CardDescription>{item?.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <Component className="h-3 w-3" /> {item?.modules} Modules
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Milestone className="h-3 w-3" /> {item?.lessons} Lessons
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Clock className="h-3 w-3" /> {item?.duration} Hours
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button size="sm" onClick={() => router.push(`/courses/${item?.id}`)}>
          Start Learning
        </Button>
        <p
          className={`${
            item?.status === "Completed"
              ? "text-green-600"
              : item?.status === "Enrolled"
              ? "text-yellow-600"
              : "text-muted-foreground"
          } font-bold text-sm`}
        >
          {item?.status}
        </p>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
