import { Upvote } from "./Discussion";

export interface Training {
  id: string;
  availability: "public" | "private" | "restricted";
  title: string;
  coverImage: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  upvotes: Upvote[];
  status: "Completed" | "Enrolled" | "Not Enrolled";
}
