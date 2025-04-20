"use client";

import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/lib/AuthContext";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import FooterSection from "@/components/sections/footer/default";
import { Course } from "@/types/Course";
import CourseCard from "./CourseCard";
import { Topic } from "@/types/Discussion";

export const metadata: Metadata = {
  title: "APPRENA Courses",
  description: "Example music app using the components.",
};

export default function MainPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<(Course | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [topics] = useState<Topic[]>([]);

  useEffect(() => {
    const getData = async () => {
      setCourses([
        {
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
                  {
                    type: "video",
                    title: "Ternary Operator",
                    duration: "07:00",
                  },
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
                  {
                    type: "video",
                    title: "Arrow Functions",
                    duration: "10:00",
                  },
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
        },
      ]);
    };
    getData();
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="md:block">
      {user ? <AuthNav /> : <Nav />}
      <div className="size border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar topics={topics} className="hidden lg:block" />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">
                <Tabs defaultValue="recent" className="h-full space-y-6">
                  <div className="space-between flex items-center">
                    <TabsList>
                      <TabsTrigger value="recent" className="relative">
                        Recent
                      </TabsTrigger>
                      <TabsTrigger value="popular">Popular</TabsTrigger>
                      <TabsTrigger value="oldest">Oldest</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent
                    value="recent"
                    className="border-none p-0 outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Active Courses
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {`${courses.length} courses available.`}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-3">
                      {courses.length > 0 ? (
                        courses
                          .toSorted((a: Course | null, b: Course | null) => {
                            const dateA = a?.createdAt
                              ? new Date(a?.createdAt).getTime()
                              : new Date().getTime();
                            const dateB = b?.createdAt
                              ? new Date(b?.createdAt).getTime()
                              : new Date().getTime();
                            return dateB - dateA;
                          })
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <CourseCard item={item} />
                              </div>
                            );
                          })
                      ) : (
                        <p>No courses for now! Please check back later.</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="popular"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Popular Courses
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Courses with a big number of enrollment and upvotes.
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-3">
                      {courses.length > 0 ? (
                        courses
                          .toSorted(
                            (a, b) =>
                              (b ? b.upvotes?.length : 0) -
                              (a ? a.upvotes?.length : 0)
                          )
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <CourseCard item={item} />
                              </div>
                            );
                          })
                      ) : (
                        <p>No courses for now! Please check back later.</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="oldest"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Oldest Courses
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Courses sorted by post date.
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-3">
                      {courses.length > 0 ? (
                        courses
                          .toSorted((a, b) => {
                            const dateA = a?.createdAt
                              ? new Date(a?.createdAt).getTime()
                              : new Date().getTime();
                            const dateB = b?.createdAt
                              ? new Date(b?.createdAt).getTime()
                              : new Date().getTime();
                            return dateA - dateB;
                          })
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <CourseCard item={item} />
                              </div>
                            );
                          })
                      ) : (
                        <p>No courses for now! Please check back later.</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
