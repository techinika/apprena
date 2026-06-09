export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  subscription: OrganizationSubscription;
  settings: OrganizationSettings;
  memberCount: number;
  maxMembers: number;
  pendingInvoiceId?: string;
  isActive?: boolean;
}

export interface OrganizationInvoice {
  id: string;
  organizationId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "expired" | "cancelled";
  billingCycle: "monthly" | "annual";
  tierId: string;
  amountRwf: number;
  createdAt: string;
  paidAt?: string;
  expiresAt: string;
}

export interface OrganizationSubscription {
  tierId: string;
  status: "active" | "cancelled" | "expired" | "trial";
  billingCycle: "monthly" | "annual";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
}

export interface OrganizationSettings {
  allowMemberRoadmaps: boolean;
  requireApproval: boolean;
  defaultMentorId?: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: "owner" | "admin" | "mentor" | "member";
  status: "active" | "pending" | "inactive";
  joinedAt: string;
  permissions: MemberPermissions;
  assignedMentorId?: string;
}

export interface MemberPermissions {
  canCreateRoadmaps: boolean;
  canEditOwnRoadmaps: boolean;
  canViewAllRoadmaps: boolean;
  canInviteMembers: boolean;
  canManageBilling: boolean;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: "mentor" | "member";
  invitedBy: string;
  token: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: string;
  createdAt: string;
}

export interface OrganizationTemplate {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: string;
  roadmap: {
    steps: {
      tag: string;
      title: string;
      desc: string;
      result: string;
    }[];
    mermaidChart?: string;
  };
  learningModules?: {
    course: string;
    provider: string;
    content?: {
      title: string;
      type: string;
      content: string;
      duration: string;
    }[];
  }[];
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface RoadmapReview {
  id: string;
  roadmapId: string;
  reviewerId: string;
  reviewerRole: "owner" | "admin" | "mentor";
  status: "pending" | "approved" | "needs_revision" | "rejected";
  feedback: string;
  comments: ReviewComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface RoadmapDeadline {
  id: string;
  roadmapId: string;
  organizationId: string;
  userId: string;
  title: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
  completedAt?: string;
  createdBy: string;
}
