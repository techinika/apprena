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
  status: "draft" | "published";
  duration: string;
  modules: string;
  lessons: string;
  visibility: "public" | "private";
  topic: Topic | null;
  learners: string;
  realPrice: string;
  discountePrice: number;
  discount: boolean;
  discountPercentage: number;
  levels: "beginner" | "intermediate" | "expert";
  courseLanguage: string;
  updatedAt: string;
  rating: number;
  ratingDistribution: { stars: number; percentage: number }[];
  instructors: Instructor[];
  detailedSummary: string;
  keyLessons: string[];
  courseRequirements: string[];
  targetAudience: string[];
  curriculum: Curriculum | undefined;
  createdBy: CustomUser | null;
  reviews: Review[];
  institutionOwning?: { name: string; id: string } | null;
}

export interface Review {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  createdBy: CustomUser;
}

export interface Instructor {
  id: string;
  photoURL: string;
  displayName: string;
  title: string;
  courseRatings: number;
  students: number;
  coursesMade: number;
  bio: string;
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
