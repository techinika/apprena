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
import { db } from "@/db/firebase";
import { useAuth } from "@/lib/AuthContext";
import { Course } from "@/types/Course";
import { doc, getDoc } from "firebase/firestore";
import { Clock, Component, Milestone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function CourseCard({ item }: { item: Course | null }) {
  const { user } = useAuth();
  const [userStatus, setUserStatus] = useState("Not Enrolled");

  useEffect(() => {
    const fetchUserEnrollmentStatus = async () => {
      if (!user || !item?.id) {
        setUserStatus("Not Enrolled");
        return;
      }

      try {
        const userRef = doc(db, "profile", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const coursesEnrolled = userData.coursesEnrolled ?? [];

          const enrollment = coursesEnrolled.find(
            (entry: { courseId: string; enrollmentStatus: string }) =>
              entry?.courseId === item?.id
          );

          if (enrollment) {
            setUserStatus(enrollment.enrollmentStatus ?? "Enrolled");
          } else {
            setUserStatus("Not Enrolled");
          }
        } else {
          setUserStatus("Not Enrolled");
        }
      } catch (error) {
        console.error("Error fetching user enrollment status:", error);
        setUserStatus("Not Enrolled");
      }
    };

    fetchUserEnrollmentStatus();
  }, [user, item]);

  return (
    <Card className="overflow-hidden cursor-pointer relative">
      {item?.realPrice == "0" && (
        <div className="absolute top-0 left-0 z-50 bg-yellow-600 p-1 text-xs font-bold">
          Free
        </div>
      )}
      <Image
        src={item?.coverImage ?? "/placeholder.jpg"}
        width={500}
        height={400}
        className="w-full object-cover h-40"
        alt={item?.title ?? "Course Cover Image"}
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
        <Link href={`/courses/${item?.id}`}>
          <Button size="sm">Start Learning</Button>
        </Link>
        {(() => {
          let statusClass = "text-muted-foreground";
          if (userStatus === "Completed") {
            statusClass = "text-green-600";
          } else if (userStatus === "Enrolled") {
            statusClass = "text-yellow-600";
          }
          return (
            <p className={`${statusClass} font-bold text-sm`}>{userStatus}</p>
          );
        })()}
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
