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
      setCourses([]);
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
                    className="border-none p-0 outline-hidden"
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
