import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";
import { Topic } from "./Discussion";

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  upvotes: {
    id: string;
    user: string;
  }[];
  coverImage: string;
  status: "Enrolled" | "Completed" | "Not Enrolled";
  duration: string;
  modules: string;
  lessons: string;
  availability: "OPEN" | "SUBSCRIPTION REQUIRED";
  topic: Topic;
  learners: string;
  realPrice: number;
  discountePrice: number;
  discount: boolean;
  discountPercentage: number;
  levels: "beginner" | "intermediate" | "expert";
  courseLanguage: string;
  updatedAt: string;
  rating: number;
  ratingDistribution: { stars: number; percentage: number }[];
  instructors: {
    id: string;
    photoURL: string;
    displayName: string;
    title: string;
    courseRatings: number;
    students: number;
    coursesMade: number;
    bio: string;
  }[];
  detailedSummary: string;
  keyLessons: string[];
  courseRequirements: string[];
  targetAudience: string[];
  curriculum: Curriculum | undefined;
  createdBy: CustomUser;
}

export interface Review {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  createdBy: CustomUser;
}

export type LessonType = "video" | "file";

export interface Lesson {
  type: LessonType;
  title: string;
  duration?: string;
  size?: string;
}

export interface Module {
  moduleTitle: string;
  lectures: number;
  duration: string;
  lessons: Lesson[];
}

export interface Curriculum {
  sections: number;
  totalLectures: number;
  totalDuration: string;
  modules: Module[];
}
