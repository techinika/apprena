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
}
