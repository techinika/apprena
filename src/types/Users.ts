export type User = {
  id: string;
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
  photoURL: string;
  subscriptionPlan: SubscriptionPlan;
  // coursesEnrolled: string[];
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
