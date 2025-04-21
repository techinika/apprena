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
  views?: number;
  likes?: number;
  photoURL?: string;
  commentsCount?: number;
  readingTime?: string;
  isFeatured?: boolean;
  relatedArticles?: string[];
  category: Topic | null;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};
