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
import { Training } from "@/types/Training";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function TrainingSessionCard({ item }: { item: Training | null }) {
  const router = useRouter();

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const formattedStart = format(startDate, "dd/MM/yyyy HH:mm");
  const formattedEnd = format(endDate, "dd/MM/yyyy HH:mm");

  return (
    <Card className="overflow-hidden cursor-pointer relative">
      <div className="absolute top-0 left-0 z-50 bg-yellow-600 p-1 text-xs font-bold">
        {item?.availability}
      </div>
      <Image
        src={item?.coverImage ?? "/placeholder.jpg"}
        width={100}
        height={100}
        className="w-full object-cover h-40"
        alt={item?.title ?? "Course Cover Image"}
      />
      <CardHeader>
        <CardTitle>{item?.title}</CardTitle>
        <CardDescription>{item?.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground flex gap-4 items-center flex-wrap">
        <p>{`${formattedStart} - ${formattedEnd}`}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button size="sm" onClick={() => router.push(`/training/${item?.id}`)}>
          Learn More
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

export default TrainingSessionCard;
