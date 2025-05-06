import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";
import { Topic } from "./Discussion";

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  availability: "public" | "private";
  status: "draft" | "published";
  writtenBy: CustomUser | null;
  institutionOwning: string;
  tags?: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  reads?: Read[];
  likes?: number;
  photoURL?: string;
  commentsCount?: number;
  readingTime?: string;
  isFeatured?: boolean;
  relatedArticles?: string[];
  category: Topic | null;
};

export type Read = {
  id: string;
  article: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  readTimes: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};
