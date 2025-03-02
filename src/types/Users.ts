export type User = {
  id: string; // Unique identifier for the user
  name: string; // Full name of the user
  email: string; // Email address for communication and authentication
  role: ROLES; // User's role in the system, for access control
  avatarUrl?: string; // Optional avatar/profile picture URL
  bio?: string; // Optional bio or description of the user
  isActive: boolean; // Whether the user is active in the platform
  lastLogin: Date; // Date when the user last logged in
  subscriptionStatus: SubscriptionStatus; // Whether the user has an active subscription
  coursesEnrolled: string[]; // List of course IDs that the user is enrolled in
  preferences: UserPreferences; // User's learning preferences, such as language or notification settings
  createdAt: Date; // Date when the user account was created
  updatedAt: Date; // Date when the user account was last updated
};

export enum ROLES {
  SUPER_ADMIN = "super_admin", // Highest level admin
  ORG_ADMIN = "org_admin", // Organization-level admin
  USER = "user", // Regular user (can access most content), registered but using only free stuff
  CONTRIBUTOR = "contributor", // User who can add or contribute content
  SUBSCRIBER = "subscriber", // Free subscriber with access to only the newsletter
  PREMIUM_USER = "premium_user", // Paid subscriber with access to all public content on the platform, free and paid
}

export enum SubscriptionStatus {
  ACTIVE = "active", // The user has an active subscription
  EXPIRED = "expired", // The user’s subscription has expired
  TRIAL = "trial", // The user is on a trial period
}

export type UserPreferences = {
  language: string; // Preferred language of the user
  receiveEmailNotifications: boolean; // Whether the user wants to receive email notifications
  darkModeEnabled: boolean; // Whether the user prefers dark mode for the platform
  learningGoals: string[]; // List of learning goals or topics the user is interested in
  courseCompletionNotifications: boolean; // Whether the user wants notifications when a course is completed
};
