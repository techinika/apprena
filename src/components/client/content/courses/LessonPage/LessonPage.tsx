"use client";

import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import FooterSection from "@/components/sections/footer/default";
import { useAuth } from "@/lib/AuthContext";
import React from "react";
import CourseSidebar from "./Sidebar";
import { Course } from "@/types/Course";
import LessonViewer from "./LectureItem";
import CourseHeader from "./HeaderBar";

export const dummyCourse: Course = {
  id: "course-001",
  title: "Complete Responsive Web Design",
  description:
    "Learn responsive design from scratch with Figma, Webflow, and real-world projects.",
  createdAt: "2025-06-01",
  updatedAt: "2025-06-15",
  upvotes: [],
  coverImage: "/images/web-design-cover.jpg",
  status: "published",
  duration: "19h 37m",
  modules: [
    {
      id: "mod-1",
      moduleTitle: "Getting Started",
      lectures: 4,
      duration: "51m",
      lessons: [
        {
          id: "les-1",
          title: "What is Webflow?",
          type: "video",
          duration: "7:31",
          url: "https://youtu.be/lDK9QqIzhwk?list=RDXEjLoHdbVeE",
          unlocked: true,
          completed: true,
        },
        {
          id: "les-2",
          title: "Sign up in Webflow",
          type: "video",
          duration: "7:31",
          url: "https://youtu.be/lDK9QqIzhwk?list=RDXEjLoHdbVeE",
          unlocked: true,
          completed: false,
        },
        {
          id: "les-3",
          title: "Intro PDF",
          type: "document",
          size: "2MB",
          url: "https://uou.ac.in/sites/default/files/slm/BHM-503T.pdf",
          unlocked: true,
          completed: false,
        },
        {
          id: "les-4",
          title: "Welcome Audio",
          type: "audio",
          duration: "5:00",
          url: "https://soundcloud.com/tatsunoshin_ofc/aiscream-tatsunoshins-happy",
          unlocked: true,
          completed: false,
        },
      ],
    },
    {
      id: "mod-2",
      moduleTitle: "Design Basics",
      lectures: 3,
      duration: "35m",
      lessons: [
        {
          id: "les-5",
          title: "Principles of Design",
          type: "document",
          size: "3MB",
          url: "/docs/design-principles.pdf",
          unlocked: false,
          completed: false,
        },
        {
          id: "les-6",
          title: "Color Theory",
          type: "video",
          duration: "12:00",
          url: "/videos/color-theory.mp4",
          unlocked: false,
          completed: false,
        },
        {
          id: "les-7",
          title: "Typography Tips",
          type: "audio",
          duration: "8:00",
          url: "/audios/typography.mp3",
          unlocked: false,
          completed: false,
        },
      ],
    },
  ],
  lessons: "",
  visibility: "public",
  topic: null,
  learners: "1234",
  realPrice: "100",
  discountePrice: 50,
  discount: true,
  discountPercentage: 50,
  levels: "beginner",
  courseLanguage: "English",
  rating: 4.8,
  ratingDistribution: [],
  instructors: [],
  detailedSummary: "",
  keyLessons: [],
  courseRequirements: [],
  targetAudience: [],
  createdBy: null,
  reviews: [],
  curriculum: undefined,
};

function LessonPage({
  courseId,
  lessonId,
  moduleId,
}: {
  courseId: string;
  lessonId: string;
  moduleId: string;
}) {
  const { user } = useAuth();

  return (
    <div>
      {user ? <AuthNav /> : <Nav />}
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="flex-1 p-6">
          <CourseHeader />
          <LessonViewer modules={dummyCourse?.modules} />
        </div>

        <div className="w-full md:w-[320px] border-l border-gray-200 p-4">
          <CourseSidebar modules={dummyCourse?.modules} />
        </div>
      </div>
      <FooterSection />
    </div>
  );
}

export default LessonPage;
