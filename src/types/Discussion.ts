export interface Discussion {
  id: string;
  upvotes: Upvote[];
  status: "published" | "pending_approval" | "draft";
  answers: Reply[];
  views: View[];
  title: string;
  description: string;
  topics: string[];
  createdBy: string;
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
  discussions: string[];
}
