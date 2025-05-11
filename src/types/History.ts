import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";

export interface History {
  id: string;
  title: string;
  cover: string;
  description?: string;
  occuringDate?: string;
  institutionOwning: string;
  likes: {
    userId: string;
    date: string;
  }[];
  shares: number;
  createdAt: string;
  updatedAt: string;
  createdBy: CustomUser | null;
  updatedBy: string;
}
