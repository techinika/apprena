import { db } from "@/db/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Activity, RoadmapProgress } from "@/types/activity";
import { LearningPlan } from "@/types/learning";

export async function getLinkedLearningPlans(activity: Activity): Promise<LearningPlan[]> {
  const linkedIds = activity.linkedLearningPlanIds || [];
  if (linkedIds.length === 0) return [];

  const planSnaps = await Promise.all(
    linkedIds.map(planId => getDoc(doc(db, "learningPlans", planId)).catch(() => null))
  );

  const plans: LearningPlan[] = [];
  for (const planSnap of planSnaps) {
    if (planSnap?.exists()) {
      plans.push({ id: planSnap.id, ...planSnap.data() } as LearningPlan);
    }
  }

  return plans;
}

export function calculateRoadmapProgress(
  roadmapSteps: Activity["roadmap"],
  linkedPlans: LearningPlan[]
): RoadmapProgress {
  const roadmapStepCount = roadmapSteps?.length || 0;
  const completedSteps = roadmapSteps?.filter(s => s.tag === "completed").length || 0;

  let totalLearningItems = 0;
  let completedLearningItems = 0;

  for (const plan of linkedPlans) {
    if (plan.modules) {
      for (const module of plan.modules) {
        if (module.content && module.content.length > 0) {
          totalLearningItems += module.content.length;
          completedLearningItems += module.content.filter(c => c.completed).length;
        } else if (module.status === "completed") {
          totalLearningItems += 1;
          completedLearningItems += 1;
        }
      }
    }
  }

  return {
    totalSteps: roadmapStepCount,
    completedSteps,
    totalLearningItems,
    completedLearningItems,
    lastUpdated: new Date().toISOString(),
  };
}

export function calculateOverallProgress(progress: RoadmapProgress): number {
  const totalItems = progress.totalSteps + progress.totalLearningItems;
  if (totalItems === 0) return 0;

  const completedItems = progress.completedSteps + progress.completedLearningItems;
  return Math.round((completedItems / totalItems) * 100);
}

export async function updateRoadmapProgress(activityId: string): Promise<void> {
  try {
    const activitySnap = await getDoc(doc(db, "activities", activityId));
    if (!activitySnap.exists()) return;

    const activity = { id: activitySnap.id, ...activitySnap.data() } as Activity;
    const linkedPlans = await getLinkedLearningPlans(activity);
    const progress = calculateRoadmapProgress(activity.roadmap, linkedPlans);

    await updateDoc(doc(db, "activities", activityId), {
      roadmapProgress: progress,
    });
  } catch (error) {
    console.error("Error updating roadmap progress:", error);
  }
}

export async function linkLearningPlanToRoadmap(
  activityId: string,
  learningPlanId: string
): Promise<void> {
  try {
    const activitySnap = await getDoc(doc(db, "activities", activityId));
    if (!activitySnap.exists()) return;

    const activity = { id: activitySnap.id, ...activitySnap.data() } as Activity;
    const currentLinks = activity.linkedLearningPlanIds || [];

    if (!currentLinks.includes(learningPlanId)) {
      await updateDoc(doc(db, "activities", activityId), {
        linkedLearningPlanIds: [...currentLinks, learningPlanId],
      });
    }

    await updateRoadmapProgress(activityId);
  } catch (error) {
    console.error("Error linking learning plan to roadmap:", error);
  }
}
