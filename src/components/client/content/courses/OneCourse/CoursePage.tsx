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

export const metadata: Metadata = {
  title: "APPRENA Courses",
  description: "Example music app using the components.",
};

export default function CoursePage({ id }: { id: string }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<(Review | null)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      console.log(id);
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
        levels: "beginner",
        courseLanguage: "English",
        updatedAt: String(new Date()),
        rating: 4.9,
        ratingDistribution: [
          { stars: 5, percentage: 75 },
          { stars: 4, percentage: 21 },
          { stars: 3, percentage: 3 },
          { stars: 2, percentage: 1 },
          { stars: 1, percentage: 10 },
        ],
        instructors: [
          {
            displayName: "Achille Songa",
            photoURL: "/placeholder.jpg",
            bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, delectus harum! Incidunt aperiam consequuntur eligendi nisi ea perspiciatis vero laborum corporis architecto asperiores voluptates unde, voluptas ad blanditiis placeat accusantium?",
            students: 100000,
            coursesMade: 10,
            courseRatings: 4.3,
            id: "hshshhshsh",
            title: "Software Engineer",
          },
          {
            displayName: "Achille Songa",
            photoURL: "/placeholder.jpg",
            bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, delectus harum! Incidunt aperiam consequuntur eligendi nisi ea perspiciatis vero laborum corporis architecto asperiores voluptates unde, voluptas ad blanditiis placeat accusantium?",
            students: 100000,
            coursesMade: 10,
            courseRatings: 4.3,
            id: "jshhdhdhd",
            title: "Software Engineer",
          },
        ],
        detailedSummary: `<div>
  <p>
    This comprehensive course is designed to provide students with a solid foundation in both theoretical concepts and practical applications. Throughout the program, learners will engage in hands-on projects and real-world scenarios that challenge their understanding and encourage deep exploration of the subject matter. Whether you are a beginner or looking to sharpen your skills, this course offers a structured path toward mastering core concepts and gaining confidence in your abilities.
  </p>
<br>
  <p>
    Students will explore a wide range of topics, including essential tools, best practices, and modern methodologies used in the industry today. Lessons are carefully crafted to build upon one another, creating a seamless learning experience. Instructors bring years of experience and insight, providing not only technical instruction but also sharing lessons from the field. Supplementary materials, quizzes, and group discussions further enhance the learning environment, ensuring students remain engaged and supported throughout the course.
  </p>
<br>
  <p>
    By the end of the course, participants will be well-equipped to apply what they’ve learned in both academic and professional settings. Graduates will receive a certificate of completion and gain access to exclusive alumni resources, including career development tools, job boards, and networking events. This course is more than just a learning opportunity — it's a step forward in your personal and professional growth, empowering you to achieve your goals with confidence.
  </p>
</div>`,
        keyLessons: [
          "Understanding core concepts and foundational principles of the subject",
          "Hands-on experience through practical exercises and real-world projects",
          "Exploration of modern tools and technologies used in the industry",
          "Best practices for problem-solving and critical thinking",
          "Collaborative learning through group discussions and peer reviews",
          "Mastering workflows and methodologies relevant to the field",
          "Effective communication of ideas and technical knowledge",
          "Building a professional portfolio to showcase your skills",
          "Receiving personalized feedback and mentorship from instructors",
          "Preparation for real-world applications and job market readiness",
        ],
        courseRequirements: [
          "A laptop or desktop computer with internet access",
          "Basic computer literacy and familiarity with using a web browser",
          "A willingness to learn and try out new concepts",
          "No prior experience needed — we start from the basics",
          "Optional: Notebook for taking notes during lessons",
          "Commitment to completing assignments and practice tasks",
        ],
        targetAudience: [
          "Beginners looking to gain foundational knowledge in the subject",
          "Students currently pursuing related academic fields",
          "Professionals seeking to upgrade or refresh their skills",
          "Entrepreneurs who want to apply the skills to their own projects",
          "Freelancers aiming to expand their service offerings",
          "Career switchers exploring new opportunities in this field",
          "Tech enthusiasts curious about the latest industry trends",
        ],
        curriculum: {
          sections: 6,
          totalLectures: 43,
          totalDuration: "9h 32m",
          modules: [
            {
              moduleTitle: "Getting Started with JavaScript",
              lectures: 5,
              duration: "45m",
              lessons: [
                {
                  type: "video",
                  title: "Welcome to the Course",
                  duration: "05:00",
                },
                {
                  type: "video",
                  title: "Introduction to JavaScript",
                  duration: "10:00",
                },
                {
                  type: "video",
                  title: "How JavaScript Works",
                  duration: "12:00",
                },
                { type: "file", title: "Course Handbook", size: "1.2 MB" },
                {
                  type: "video",
                  title: "Installing VSCode",
                  duration: "08:00",
                },
              ],
            },
            {
              moduleTitle: "Variables, Data Types & Operators",
              lectures: 6,
              duration: "1h 10m",
              lessons: [
                {
                  type: "video",
                  title: "Declaring Variables: var, let, const",
                  duration: "10:00",
                },
                {
                  type: "video",
                  title: "Primitive Data Types",
                  duration: "12:00",
                },
                {
                  type: "video",
                  title: "Type Conversion & Coercion",
                  duration: "08:00",
                },
                {
                  type: "video",
                  title: "Operators in JavaScript",
                  duration: "10:00",
                },
                {
                  type: "file",
                  title: "Reference Sheet: Data Types",
                  size: "700 KB",
                },
                {
                  type: "video",
                  title: "Expressions vs Statements",
                  duration: "10:00",
                },
              ],
            },
            {
              moduleTitle: "Control Flow",
              lectures: 5,
              duration: "50m",
              lessons: [
                {
                  type: "video",
                  title: "If...Else Statements",
                  duration: "10:00",
                },
                {
                  type: "video",
                  title: "Switch Statements",
                  duration: "08:00",
                },
                { type: "video", title: "Ternary Operator", duration: "07:00" },
                {
                  type: "file",
                  title: "Control Flow Cheatsheet",
                  size: "500 KB",
                },
                {
                  type: "video",
                  title: "Truthy & Falsy Values",
                  duration: "10:00",
                },
              ],
            },
            {
              moduleTitle: "Loops & Iteration",
              lectures: 5,
              duration: "48m",
              lessons: [
                { type: "video", title: "For Loops", duration: "10:00" },
                {
                  type: "video",
                  title: "While & Do While Loops",
                  duration: "12:00",
                },
                { type: "video", title: "Nested Loops", duration: "08:00" },
                {
                  type: "video",
                  title: "Loop Control: Break & Continue",
                  duration: "08:00",
                },
                { type: "file", title: "Practice Exercises", size: "1 MB" },
              ],
            },
            {
              moduleTitle: "Functions & Scope",
              lectures: 7,
              duration: "1h 35m",
              lessons: [
                {
                  type: "video",
                  title: "Function Declarations & Expressions",
                  duration: "12:00",
                },
                { type: "video", title: "Arrow Functions", duration: "10:00" },
                {
                  type: "video",
                  title: "Function Parameters & Return",
                  duration: "10:00",
                },
                {
                  type: "video",
                  title: "Function Scope & Closures",
                  duration: "15:00",
                },
                {
                  type: "video",
                  title: "Immediately Invoked Functions (IIFE)",
                  duration: "08:00",
                },
                {
                  type: "video",
                  title: "Callback Functions",
                  duration: "10:00",
                },
                { type: "file", title: "Function Examples", size: "2 MB" },
              ],
            },
            {
              moduleTitle: "Objects & Arrays",
              lectures: 6,
              duration: "1h 24m",
              lessons: [
                {
                  type: "video",
                  title: "Object Literals & Properties",
                  duration: "12:00",
                },
                {
                  type: "video",
                  title: "Dot vs Bracket Notation",
                  duration: "08:00",
                },
                {
                  type: "video",
                  title: "Array Methods (map, filter, reduce)",
                  duration: "20:00",
                },
                {
                  type: "video",
                  title: "Looping through Objects",
                  duration: "10:00",
                },
                {
                  type: "video",
                  title: "Destructuring Objects & Arrays",
                  duration: "10:00",
                },
                {
                  type: "file",
                  title: "Practice Project: User Profile Builder",
                  size: "3.5 MB",
                },
              ],
            },
          ],
        },
      });
      setReviews([
        {
          id: "yguwffyhw",
          comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis adipisci voluptates amet corrupti exercitationem quae, aut excepturi repudiandae reiciendis nam.",
          rating: 5,
          createdAt: new Date().toLocaleDateString(),
          createdBy: {
            id: "hdhvhv",
            uid: "hdhvhv",
            displayName: "Achille Songa",
            email: "hhshhs@hh.cnn",
          },
        },
        {
          id: "jsjjsjjss",
          comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis adipisci voluptates amet corrupti exercitationem quae, aut excepturi repudiandae reiciendis nam.",
          rating: 1,
          createdAt: new Date().toLocaleDateString(),
          createdBy: {
            id: "hdhvhv",
            uid: "hdhvhv",
            displayName: "Achille Songa",
            email: "hhshhs@hh.cnn",
          },
        },
        {
          id: "sjjsjjsjsjs",
          comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis adipisci voluptates amet corrupti exercitationem quae, aut excepturi repudiandae reiciendis nam.",
          rating: 3,
          createdAt: new Date().toLocaleDateString(),
          createdBy: {
            id: "hdhvhv",
            uid: "hdhvhv",
            displayName: "Achille Songa",
            email: "hhshhs@hh.cnn",
          },
        },
      ]);
    };
    getData();
    setLoading(false);
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
                  {formatDistance(course?.updatedAt ?? new Date(), new Date(), {
                    includeSeconds: true,
                  })}
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
            <Tabs defaultValue="curriculum" className="w-full">
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
                  <CurriculumAccordion
                    curriculum={course?.curriculum ?? undefined}
                  />
                </div>
              </TabsContent>
              <TabsContent value="instructor">
                <div className="py-4">
                  <h2 className="text-2xl font-bold py-2">
                    Course Instructors
                  </h2>
                  <div className="flex flex-col gap-4">
                    {course?.instructors && course?.instructors.length > 0 ? (
                      course?.instructors.map((item) => (
                        <InstructorCard key={item?.id} item={item} />
                      ))
                    ) : (
                      <p className="p-5 text-center">
                        No reviews yet! Be the first to review this course
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
                    {reviews.length > 0 ? (
                      reviews.map((item, index) => {
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
