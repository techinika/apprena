export interface UserProfile {
  accountType: "free" | "pro" | "architect";
  joinedAt: string;
  lastLogin: string;
  baseCredits: number;
  purchasedCredits: number;
  totalUsed: number;
}
