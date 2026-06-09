export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface UserContext {
  userId: string;
  displayName?: string;
  email?: string;
  accountType?: string;
  baseCredits?: number;
  purchasedCredits?: number;
  totalRoadmaps?: number;
  totalLearningPlans?: number;
  recentRoadmaps?: {
    id: string;
    title: string;
    goal: string;
    status: string;
  }[];
  recentLearningPlans?: {
    id: string;
    title: string;
    target: string;
    progress: number;
  }[];
  badges?: { id: string; title: string }[];
}