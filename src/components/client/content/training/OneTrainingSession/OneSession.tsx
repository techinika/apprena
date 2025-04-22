"use client";

import { Metadata } from "next";
import { useAuth } from "@/lib/AuthContext";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import FooterSection from "@/components/sections/footer/default";
import { Course, Review } from "@/types/Course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Anvil,
  Calendar,
  CircleCheckBig,
  CircleChevronRight,
  Clock,
  Computer,
  FileDown,
  Languages,
  MoveRight,
  Signal,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, intervalToDuration } from "date-fns";
import StarRating from "@/components/ui/star-rating";
import { RatingDistribution } from "@/components/ui/rating-distribution";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata: Metadata = {
  title: "APPRENA Courses",
  description: "Example music app using the components.",
};

export default function SessionPage({ id }: { id: string }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<(Review | null)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setCourse(null);
      setReviews([]);
    };
    getData();
    setLoading(false);
  }, [id]);

  if (loading) return <Loading />;

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const formattedStart = format(startDate, "dd/MM/yyyy HH:mm");
  const formattedEnd = format(endDate, "dd/MM/yyyy HH:mm");

  const duration = intervalToDuration({ start: startDate, end: endDate });

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
                  <Users className="h-4 w-4" /> {course?.learners} registered
                  Learners
                </p>
                <p className="flex gap-2 items-center">
                  <Calendar className="h-4 w-4" />{" "}
                  {`${formattedStart} - ${formattedEnd}`}
                </p>
              </div>
              <Button size="lg">Enroll Now</Button>
            </div>
            <div className="w-full h-64 rounded-xl overflow-hidden p-4">
              <Image
                src={course?.coverImage ?? "/placeholder.jpg"}
                width={500}
                height={200}
                alt={course?.title ?? "Course Cover Image"}
                className="w-full object-cover h-full"
              />
            </div>
          </div>
        </div>
        <div className="size grid grid-cols-4 items-start py-10 gap-3">
          <div className="col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="py-4">
                  <h2 className="text-2xl font-bold py-2">Description</h2>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: course?.detailedSummary ?? "",
                    }}
                  ></div>
                  {course?.keyLessons && (
                    <Card className="bg-gray-100 dark:bg-gray-900 my-4 p-5">
                      <h2 className="text-2xl font-bold">
                        What you will learn in this training
                      </h2>
                      <div className="grid grid-cols-2 gap-4 my-3">
                        {course?.keyLessons.map((item) => (
                          <p className=" flex items-center gap-3" key="item">
                            <CircleCheckBig />
                            {item}
                          </p>
                        ))}
                      </div>
                    </Card>
                  )}
                  {course?.targetAudience && (
                    <div className="my-7">
                      <h2 className="text-2xl font-bold">
                        Who is this training for?
                      </h2>
                      <div className="grid grid-cols-2 gap-4 my-3">
                        {course?.targetAudience.map((item) => (
                          <p className=" flex items-center gap-3" key="item">
                            <MoveRight />
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {course?.courseRequirements && (
                    <div className="my-7">
                      <h2 className="text-2xl font-bold">
                        Training Requirements
                      </h2>
                      <div className="grid grid-cols-2 gap-4 my-3">
                        {course?.courseRequirements.map((item) => (
                          <p className=" flex items-center gap-3" key="item">
                            <CircleChevronRight />
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="curriculum">
                <div className="py-4">
                  <h2 className="text-2xl font-bold py-2">Curriculum</h2>
                </div>
              </TabsContent>
              <TabsContent value="instructor">
                <div className="py-4">
                  <h2 className="text-2xl font-bold py-2">
                    Course Instructors
                  </h2>
                  <div className="flex flex-col gap-4">
                    {/* <InstructorCard /> */}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="py-4">
                  <h2 className="text-2xl font-bold py-2">Course Rating</h2>
                  <div className="grid grid-cols-5 gap-4">
                    <Card className="flex p-6 items-center justify-center gap-3 flex-col">
                      <h1 className="text-5xl text-center font-bold">
                        {course?.rating}
                      </h1>
                      <StarRating value={course?.rating ?? 0} />
                      <h2>Overall Rating</h2>
                    </Card>
                    <RatingDistribution
                      className="col-span-4 w-full"
                      data={course?.ratingDistribution ?? []}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <h2 className="text-xl font-bold">Students Feedback</h2>
                    <Select>
                      <SelectTrigger className="w-1/4">
                        <SelectValue placeholder="Filter rating level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {[...Array(5)].map((_, i) => (
                            <SelectItem value={String(i)} key={i + 1}>
                              {i + 1} Star Rating
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="py-4">
                    {reviews.length > 0 ? (
                      reviews.map((item, index) => {
                        return (
                          <div key={item?.id}>
                            {index !== 0 && <Separator />}
                          </div>
                        );
                      })
                    ) : (
                      <p className="p-5 text-center">
                        No reviews yet! Be the first to review this course
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
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
                <p>{`${duration?.days ?? 0}d ${duration?.hours ?? 0}h ${
                  duration?.minutes ?? 0
                }m`}</p>
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
                  <b>Note:</b> all sessions have 30-days money-back guarantee
                </p>
              </div>
            </CardContent>
            <Separator />
            <CardContent>
              <div className="py-3">
                <h2 className="font-bold text-xl">This training includes:</h2>
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
