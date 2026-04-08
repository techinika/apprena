import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Activity } from "@/types/activity";

export const getUserActivities = async (userId: string) => {
  const activitiesRef = collection(db, "activities");
  const q = query(
    activitiesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Activity[];
};

export const fetchActivityById = async (activityId: string, userId?: string) => {
  try {
    const docRef = doc(db, "activities", activityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.status === "unclaimed") {
        return {
          id: docSnap.id,
          ...data,
        } as Activity;
      }

      if (data.userId) {
        if (userId && data.userId !== userId) {
          console.warn("User attempted to access another user's activity.");
          return null;
        }
        return {
          id: docSnap.id,
          ...data,
        } as Activity;
      }

      return null;
    } else {
      console.error("No such activity document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching activity:", error);
    throw error;
  }
};
