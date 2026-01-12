export interface LearningModule {
  id: string;
  course: string;
  provider: string;
  url: string;
  status: "not_started" | "in_progress" | "completed";
  completedAt?: string;
}

export interface LearningPlan {
  id: string;
  userId: string;
  parentActivityId: string;
  title: string;
  target: string;
  modules: LearningModule[];
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
}
