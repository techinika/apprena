import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";

export interface Discussion {
  id: string;
  upvotes: Upvote[];
  status: "approved" | "pending_approval" | "rejected" | "hidden";
  replyCount: number;
  views: View[];
  title: string;
  content: string;
  description: string;
  topic: Topic | null;
  createdBy: CustomUser | null;
  createdAt: string;
}

export interface Upvote {
  userId: string;
  createdAt: string;
}

export interface View {
  userId: string;
  createdAt: string;
}

export interface Reply {
  id: string;
  content: string;
  createdBy: string;
  discussion: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  createdAt: string;
}
