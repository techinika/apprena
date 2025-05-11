"use client";

import { Metadata } from "next";
import { useAuth } from "@/lib/AuthContext";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import FooterSection from "@/components/sections/footer/default";
import { Course, Instructor } from "@/types/Course";
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
import { formatDistance } from "date-fns";
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
import ReviewCard from "./ReviewCard";
import InstructorCard from "./InstructorCard";
import { CurriculumAccordion } from "./CurriculumView";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { useRouter } from "next/navigation";
import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";

export default function CoursePage({ id }: { id: string }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructors, setInstructors] = useState<Instructor[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const articleRef = doc(db, "courses", id as string);
        const articleSnap = await getDoc(articleRef);

        if (!articleSnap.exists()) {
          router.push("/courses");
          return;
        }

        const docData = articleSnap.data();
        if (!docData) {
          console.warn("No data in course doc.");
          return;
        }

        const userRef = docData?.createdBy as DocumentReference<DocumentData>;
        const institutionRef =
          docData?.institutionOwning as DocumentReference<DocumentData>;
        const topicRef = docData?.topic as DocumentReference<DocumentData>;

        let userData: CustomUser | null = null;
        let topicData: DocumentData | null = null;
        let institutionData: { id: string; name: string } | null = null;

        try {
          if (userRef) {
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
              userData = {
                id: userSnapshot?.id,
                uid: userSnapshot?.id,
                displayName: userSnapshot.data()?.displayName,
                email: userSnapshot.data().email ?? "",
              };
            }
          }

          if (topicRef) {
            const topicSnapshot = await getDoc(topicRef);
            if (topicSnapshot.exists()) {
              topicData = {
                id: topicSnapshot?.id,
                name: topicSnapshot.data().name,
                createdAt: topicSnapshot.data().createdAt,
              };
            }
          }

          if (institutionRef) {
            const institutionSnapshot = await getDoc(institutionRef);
            if (institutionSnapshot.exists()) {
              institutionData = {
                id: institutionSnapshot?.id,
                name: institutionSnapshot.data().name,
              };
            }
          }
        } catch (error) {
          console.error("Error fetching referenced document:", error);
          return null;
        }

        try {
          const instructorPromises = docData?.instructors.map((id: string) =>
            getDoc(doc(db, "profile", id))
          );
          const instructorDocs = await Promise.all(instructorPromises);
          const instructors = instructorDocs.map((doc) => ({
            id: doc.id,
            photoURL: doc.data().photoURL,
            displayName: doc.data().displayName,
            title: doc.data().title,
            courseRatings: 5,
            students: 0,
            coursesMade: 0,
            bio: doc.data().bio,
          }));
          console.log(instructors);
          setInstructors(instructors);
        } catch (error) {
          console.error("Error fetching instructors:", error);
        }

        setCourse({
          id: articleSnap.id,
          topic: topicData
            ? {
                id: topicData.id,
                name: topicData.name,
                createdAt: topicData.createdAt,
              }
            : null,
          createdAt: formatDistance(new Date(), new Date(), {
            includeSeconds: true,
          }),
          createdBy: userData,
          detailedSummary: docData?.detailedSummary ?? "",
          title: docData.title ?? "",
          status: docData.status ?? "",
          description: docData.description ?? "",
          visibility: docData?.visibility ?? "public",
          institutionOwning: institutionData ?? null,
          coverImage: docData?.coverImage,
          upvotes: docData?.upvotes ?? 0,
          duration: docData?.duration ?? 0,
          modules: docData?.modules ?? [],
          lessons: docData?.lessons ?? [],
          learners: docData?.learners ?? 0,
          levels: docData?.levels ?? "",
          courseLanguage: docData?.courseLanguage ?? "",
          keyLessons: docData?.keyLessons ?? [],
          targetAudience: docData?.targetAudience ?? [],
          courseRequirements: docData?.courseRequirements ?? [],
          curriculum: docData?.curriculum ?? [],
          instructors: docData?.instructors ?? [],
          reviews: docData?.reviews ?? [],
          rating: docData?.rating ?? 0,
          ratingDistribution: docData?.ratingDistribution ?? [],
          updatedAt: docData?.updatedAt ?? new Date(),
          discount: docData?.discount ?? false,
          discountePrice: docData?.discountePrice ?? 0,
          realPrice: docData?.realPrice ?? 0,
          discountPercentage: docData?.discountPercentage ?? 0,
        });
      } catch (error) {
        console.error("Error fetching article data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
                  {course?.createdAt} ago
                </p>
              </div>
              {course?.realPrice !== "0" ? (
                <Button size="lg">Buy Now</Button>
              ) : (
                <Button size="lg">Enroll Now</Button>
              )}
            </div>
            <div className="w-full h-64 rounded-xl overflow-hidden p-4">
              <Image
                src={course?.coverImage ?? "/placeholder.jpg"}
                width={700}
                height={300}
                alt={course?.title ?? "Course Cover Image"}
                className="w-full object-cover w-64 h-full rounded-xl"
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
                    className="prose !max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: course?.detailedSummary ?? "",
                    }}
                  ></div>
                  {course?.keyLessons && (
                    <Card className="bg-gray-100 dark:bg-gray-900 my-4 p-5">
                      <h2 className="text-2xl font-bold">
                        What you will learn in this course
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
                        Who is this course for?
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
                        Course Requirements
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
                  {course?.curriculum && (
                    <CurriculumAccordion
                      curriculum={course?.curriculum ?? null}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="instructor">
                <div className="py-4">
                  <h2 className="text-2xl font-bold py-2">
                    Course Instructors
                  </h2>
                  <div className="flex flex-col gap-4">
                    {instructors && instructors.length > 0 ? (
                      instructors.map((item: Instructor) => (
                        <InstructorCard key={item?.id} item={item} />
                      ))
                    ) : (
                      <p className="p-5 text-center">
                        No instructors for this course!
                      </p>
                    )}
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
                    {course?.reviews && course?.reviews.length > 0 ? (
                      course?.reviews.map((item, index) => {
                        return (
                          <div key={item?.id}>
                            {index !== 0 && <Separator />}
                            <ReviewCard item={item} key={item?.id} />
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
                <h2 className="font-bold w-full text-6xl text-center">
                  {course?.realPrice !== "0" ? `${course?.realPrice}` : "Free"}
                </h2>
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
                {course?.realPrice !== "0" ? (
                  <Button size="lg">Buy Now</Button>
                ) : (
                  <Button size="lg">Enroll Now</Button>
                )}
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
