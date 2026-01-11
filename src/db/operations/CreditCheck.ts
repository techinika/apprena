import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

export const verifyAndDeductCredit = async (userId: string) => {
  const now = new Date();

  const subQuery = query(
    collection(db, "subscriptions"),
    where("userId", "==", userId),
    where("status", "==", "active"),
    where("endDate", ">", now)
  );

  const subSnap = await getDocs(subQuery);

  if (!subSnap.empty) {
    return { allowed: true, type: "subscription" };
  }

  const profileRef = doc(db, "profiles", userId);
  const profileSnap = await getDoc(profileRef);
  const data = profileSnap.data();

  if (data?.baseCredits > 0) {
    await updateDoc(profileRef, {
      baseCredits: increment(-1),
      totalUsed: increment(1),
    });
    return { allowed: true, type: "base" };
  }

  if (data?.purchasedCredits > 0) {
    await updateDoc(profileRef, {
      purchasedCredits: increment(-1),
      totalUsed: increment(1),
    });
    return { allowed: true, type: "sprint" };
  }

  return { allowed: false };
};
