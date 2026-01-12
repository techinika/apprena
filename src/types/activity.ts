export interface Activity {
  id: string;
  title: string;
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
    goal: string;
  };
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
