"use client";

import { Metadata } from "next";
import { useAuth } from "@/lib/AuthContext";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import FooterSection from "@/components/sections/footer/default";
import { Course } from "@/types/Course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Anvil,
  Calendar,
  Clock,
  Computer,
  FileDown,
  Languages,
  Signal,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistance } from "date-fns";

export const metadata: Metadata = {
  title: "APPRENA Courses",
  description: "Example music app using the components.",
};

export default function CoursePage({ id }: { id: string }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setCourse({
        id: "sgsshhdhdh",
        title: "HTML & CSS for beginners",
        description:
          "This is the description of this course and it has a summary of the corse",
        createdAt: String(new Date()),
        upvotes: [],
        coverImage: "/course.jpg",
        status: "Not Enrolled",
        duration: "10",
        modules: "23",
        lessons: "130",
        availability: "OPEN",
        learners: "12000",
        topic: {
          id: "shhshs",
          name: "Technology",
          createdAt: String(new Date()),
        },
        realPrice: 1200,
        discountePrice: 200,
        discount: true,
        discountPercentage: 10,
      });
    };
    getData();
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="md:block">
      {user ? <AuthNav /> : <Nav />}
      <div className="border-t">
        <div className="bg-gray-100 dark:bg-gray-900">
          <div className=" size grid grid-cols-3 gap-4 items-center py-10 px-3">
            <div className="flex flex-col gap-2 items-start col-span-2">
              <Badge className="text-xs">{course?.topic?.name}</Badge>
              <h1 className="font-bold text-3xl">{course?.title}</h1>
              <p className="text-muted-foreground ">{course?.description}</p>
              <div className="text-xs flex items-center gap-3 py-3">
                <p className="flex gap-2 items-center">
                  <Users className="h-4 w-4" /> {course?.learners} Learners
                </p>
                <p className="flex gap-2 items-center">
                  <Clock className="h-4 w-4" /> {course?.duration} Hours
                </p>
                <p className="flex gap-2 items-center">
                  <Calendar className="h-4 w-4" /> Last Updated{" "}
                  {formatDistance(
                    course?.updatedAt ? course?.updatedAt : new Date(),
                    new Date(),
                    {
                      includeSeconds: true,
                    }
                  )}
                </p>
              </div>
              <Button size="lg">Enroll Now</Button>
            </div>
            <div className="w-full h-64 rounded-xl overflow-hidden p-4">
              <Image
                src={
                  course?.coverImage ? course?.coverImage : "/placeholder.jpg"
                }
                width={500}
                height={200}
                alt={course?.title ? course?.title : "Course Cover Image"}
                className="w-full object-cover h-full"
              />
            </div>
          </div>
        </div>
        <div className="size grid grid-cols-4 py-10 gap-3">
          <div className="col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="account"></TabsContent>
              <TabsContent value="password"></TabsContent>
            </Tabs>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-xl">
                    $
                    {course?.discount
                      ? course?.discountePrice
                      : course?.realPrice}{" "}
                    {course?.discount && (
                      <span className="text-muted-foreground line-through text-sm">
                        ${course?.realPrice}
                      </span>
                    )}
                  </h2>
                  {course?.discount && (
                    <p className="flex text-red-600 gap-2 items-center text-xs">
                      <Clock className="h-4 w-4" /> 2 days left at this price!
                    </p>
                  )}
                </div>
                {course?.discount && (
                  <div className="p-2 bg-primary-foreground text-sm rounded-lg font-bold">{`${course?.discountPercentage}% OFF`}</div>
                )}
              </div>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="flex justify-between items-center py-3 text-sm">
                <p className="flex gap-2 items-center">
                  <Clock className="h-4 w-4" /> Course Duration
                </p>
                <p>{`${course?.duration} Hours`}</p>
              </div>
              <div className="flex justify-between items-center py-3 text-sm">
                <p className="flex gap-2 items-center">
                  <Signal className="h-4 w-4" /> Course Level
                </p>
                <p>{`${course?.levels}`}</p>
              </div>
              <div className="flex justify-between items-center py-3 text-sm">
                <p className="flex gap-2 items-center">
                  <Users className="h-4 w-4" /> Students Enrolled
                </p>
                <p>{`${course?.learners}`}</p>
              </div>
              <div className="flex justify-between items-center pt-3 text-sm">
                <p className="flex gap-2 items-center">
                  <Languages className="h-4 w-4" /> Course Language
                </p>
                <p>{`${course?.courseLanguage}`}</p>
              </div>
            </CardContent>
            <Separator />
            <CardContent>
              <div className="pt-5 flex flex-col gap-4">
                {course?.availability === "SUBSCRIPTION REQUIRED" && (
                  <Button>Buy Course</Button>
                )}
                {course?.availability === "OPEN" && <Button>Enroll Now</Button>}
                <div className="grid grid-cols-2 gap-3">
                  <Button size="xs" variant="outline">
                    Add To Wishlist
                  </Button>
                  <Button size="xs" variant="outline">
                    Gift Course
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs text-center w-full mb-0 pb-0">
                  <b>Note:</b> all courses have 30-days money-back guarantee
                </p>
              </div>
            </CardContent>
            <Separator />
            <CardContent>
              <div className="py-3">
                <h2 className="font-bold text-xl">This course includes:</h2>
                <p className="flex gap-2 items-center py-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-500" /> Lifetime access
                </p>
                <p className="flex gap-2 items-center py-2 text-sm">
                  <FileDown className="h-4 w-4 text-orange-500" /> Free
                  exercises & downloadable resources
                </p>
                <p className="flex gap-2 items-center py-2 text-sm">
                  <Anvil className="h-4 w-4 text-orange-500" /> Shareable
                  certificate of completion
                </p>
                <p className="flex gap-2 items-center py-2 text-sm">
                  <Computer className="h-4 w-4 text-orange-500" /> 100% online
                  course
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
