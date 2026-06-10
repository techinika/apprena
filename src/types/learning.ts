export interface LearningModule {
  id: string;
  course: string;
  provider: string;
  url: string;
  status: "not_started" | "in_progress" | "completed";
  completedAt?: string;
  isGenerated?: boolean;
  content?: GeneratedContent[];
}

export interface GeneratedContent {
  id: string;
  title: string;
  type: "lesson" | "reading" | "exercise" | "quiz";
  content: string;
  duration: string;
  completed?: boolean;
  grade?: number;
  feedback?: string;
  aiSolution?: string;
  usedAiForAnswer?: boolean;
  userAnswer?: string;
}

export interface LearningPlan {
  id: string;
  userId: string;
  parentActivityId?: string;
  parentRoadmapId?: string;
  title: string;
  target: string;
  modules: LearningModule[];
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
  isGenerated?: boolean;
  totalGrade?: number;
  passedAt?: string;
  attempts?: number;
  aiAnswerDetected?: boolean;
  totalHours?: number;
  finalComparison?: {
    exerciseId: string;
    userAnswer: string;
    aiSolution: string;
    similarity: number;
    aiDetected: boolean;
  }[];
  roadmapData?: {
    title: string;
    goal: string;
    skills: string;
    blocks: string;
    ecosystem: string;
  };
  milestones?: LearningMilestone[];
  progress?: {
    completedItems: number;
    totalItems: number;
    lastUpdated: string;
  };
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  type: "learning" | "network" | "habit" | "achievement";
  status: "pending" | "in_progress" | "completed" | "needs_revision";
  moduleIds: string[];
  completedAt?: string;
}
