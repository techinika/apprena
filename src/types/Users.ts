export type User = {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  role: ROLES;
  avatarUrl?: string;
  bio?: string;
  isActive: boolean;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  lastLogin: Date;
  score: number;
  scoreInLastHour: number;
  referrals: number;
  referralsInLastMonth: number;
  badges: number;
  badgesInLastMonth: number;
  communityContributions: number;
  communityContributionsInLastMonth: number;
  institutionMemberships: number;
  institutionMembershipsInLastMonth: number;
  coursesTaken: number;
  coursesTakenInLastMonth: number;
  blogsRead: number;
  blogsReadInLastMonth: number;
  mostActiveTimes: string;
  photoURL: string;
  subscriptionPlan: SubscriptionPlan;
  coursesEnrolled: {courseId: string, enrollmentStatus: ""}[];
  // preferences: UserPreferences;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
  preferredNotificationMethod: string;
  status: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
  address: {
    country: string;
    city: string;
    state: string;
    zipCode: string;
    physicalAddress: string;
  };
  interests: [];
  twoFactorAuthEnabled: boolean;
  nationality: string;
};

export enum ROLES {
  SUPER_ADMIN = "super_admin",
  ORG_ADMIN = "org_admin",
  USER = "user",
  CONTRIBUTOR = "contributor",
  SUBSCRIBER = "subscriber",
  PREMIUM_USER = "premium_user",
}

export type Role = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export enum SubscriptionPlan {
  ACTIVE = "active",
  EXPIRED = "expired",
  TRIAL = "trial",
}

export type UserPreferences = {
  language: string;
  receiveEmailNotifications: boolean;
  darkModeEnabled: boolean;
  learningGoals: string[];
  courseCompletionNotifications: boolean;
};
