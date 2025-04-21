import { User } from "./Users";

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  availability: "public" | "private";
  status: "draft" | "published";
  writtenBy: User;
  institutionOwning: string;
  tags?: string;
  createdAt: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  views?: number;
  likes?: number;
  photoURL?: string;
  commentsCount?: number;
  readingTime?: string;
  isFeatured?: boolean;
  relatedArticles?: string[];
  category: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};
