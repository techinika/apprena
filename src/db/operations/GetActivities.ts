import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Activity } from "@/types/activity";

export const getUserActivities = async (userId: string) => {
  const activitiesRef = collection(db, "activities");
  const q = query(
    activitiesRef,
    where("userId", "==", userId),
    orderBy("priority", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Activity[];
};
