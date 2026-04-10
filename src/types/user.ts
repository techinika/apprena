export interface UserProfile {
  accountType: "free" | "pro" | "architect";
  joinedAt: string;
  lastLogin: string;
  baseCredits: number;
  purchasedCredits: number;
  totalUsed: number;
  badges: any[];
}

export interface UserNotification {
  id: string;
  userId: string;
  type: "badge" | "achievement" | "milestone" | "learning" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  metadata?: Record<string, unknown>;
}
