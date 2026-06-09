export interface Activity {
  id: string;
  title: string;
  slug?: string;
  tags?: string[];
  category: string;
  status: "todo" | "in-progress" | "completed";
  priority: number;
  userId: string;
  createdAt: string;
  roadmap: RoadmapStep[];
  confidenceScore: number;
  mermaidChart: string;
  learningGaps: LearningGaps;
  curriculum: CurriculumItem[];
  habits: HabitItem[];
  networkReason: string;
  network: NetworkPerson[];
  achievements: AchievementItem[];
  userInput: {
    current?: string;
    goal: string;
    skills?: string;
    blocks?: string;
    ecosystem?: string;
  };
  uploadedDocuments?: UploadedDocument[];
  milestones?: Milestone[];
  isPublic?: boolean;
  publicSlug?: string;
  originalRoadmapId?: string;
  forkedFrom?: string;
  ownFeedbacks?: OwnFeedback[];
  curriculumNeedsGeneration?: boolean;
  linkedLearningPlanIds?: string[];
  roadmapProgress?: RoadmapProgress;
}

export interface RoadmapProgress {
  totalSteps: number;
  completedSteps: number;
  totalLearningItems: number;
  completedLearningItems: number;
  lastUpdated: string;
}

export interface OwnFeedback {
  id: string;
  roadmapStepId: string;
  userId: string;
  content: string;
  createdAt: string;
  aiProcessed: boolean;
  aiResponse?: string;
}

export interface UploadedDocument {
  name: string;
  url: string;
  extractedText?: string;
}

export interface RoadmapStep {
  tag: string;
  title: string;
  desc: string;
  result: string;
}

export interface AchievementItem {
  time: string;
  title: string;
  achievement: string;
}

export interface NetworkPerson {
  name: string;
  role: string;
  type: string;
  reason: string;
}

export interface HabitItem {
  icon: string;
  title: string;
  desc: string;
}

export interface LearningGaps {
  soft: string[];
  technical: TechnicalSkill[];
}

export interface TechnicalSkill {
  skill: string;
  priority: "High" | "Medium" | "Low";
  progress: number;
}

export interface CurriculumItem {
  course: string;
  provider: string;
  url: string;
}

export interface LearningSectionProps {
  learningGaps: LearningGaps;
  curriculum: CurriculumItem[];
  goal: string;
}

export interface Milestone {
  id: string;
  type: "learning" | "network" | "habit" | "achievement";
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "needs_revision";
  evidence?: Evidence[];
  aiFeedback?: AIFeedback;
  completedAt?: string;
}

export interface Evidence {
  id: string;
  type: "image" | "document" | "text";
  url: string;
  description: string;
  uploadedAt: string;
  aiReview?: AIFeedback;
}

export interface AIFeedback {
  rating: number;
  feedback: string;
  suggestions: string[];
  strengths: string[];
  needsImprovement: string[];
  status: "pending" | "approved" | "needs_work";
}

export interface StepFeedback {
  id: string;
  roadmapStepId: string;
  userId: string;
  content: string;
  createdAt: string;
  aiProcessed: boolean;
  aiResponse?: string;
  version: number;
}

export interface RoadmapVersion {
  id: string;
  activityId: string;
  version: number;
  createdAt: string;
  changes: string;
  previousData: string;
}
