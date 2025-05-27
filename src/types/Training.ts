import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";
import { Curriculum, Instructor, Review } from "./Course";
import { Topic } from "./Discussion";

export interface Training {
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
  trainingLanguage: string;
  updatedAt: string;
  rating: number;
  ratingDistribution: { stars: number; percentage: number }[];
  instructors: Instructor[];
  detailedSummary: string;
  keyLessons: string[];
  trainingRequirements: string[];
  targetAudience: string[];
  curriculum: Curriculum | undefined;
  createdBy: CustomUser | null;
  reviews: Review[];
  institutionOwning?: { name: string; id: string } | null;
}
