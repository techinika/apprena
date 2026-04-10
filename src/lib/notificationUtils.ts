import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/db/firebase";
import { UserNotification } from "@/types/user";

type NotificationType = UserNotification["type"];

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  metadata,
}: CreateNotificationParams) {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      type,
      title,
      message,
      isRead: false,
      createdAt: serverTimestamp(),
      link,
      metadata,
    });
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
}

export const NotificationMessages = {
  courseGenerated: (courseName: string) => ({
    type: "learning" as const,
    title: "Course Generated!",
    message: `Your personalized learning path "${courseName}" is ready. Start your learning journey today!`,
  }),
  moduleCompleted: (moduleName: string) => ({
    type: "learning" as const,
    title: "Module Completed!",
    message: `Great job! You've completed "${moduleName}". Keep up the momentum!`,
  }),
  courseCompleted: (courseName: string, grade: number) => ({
    type: "achievement" as const,
    title: "Course Mastered!",
    message: `Congratulations! You've completed "${courseName}" with a score of ${grade}%!`,
  }),
  roadmapGenerated: (roadmapName: string) => ({
    type: "milestone" as const,
    title: "Roadmap Created!",
    message: `Your career roadmap "${roadmapName}" has been generated. Start building your path to success!`,
  }),
  badgeEarned: (badgeName: string) => ({
    type: "badge" as const,
    title: "Badge Earned!",
    message: `Congratulations! You've earned the "${badgeName}" badge.`,
  }),
  milestoneCompleted: (milestoneName: string) => ({
    type: "milestone" as const,
    title: "Milestone Reached!",
    message: `You've completed the milestone "${milestoneName}". Keep pushing forward!`,
  }),
};
