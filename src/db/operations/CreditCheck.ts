import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

interface CreditCheckResult {
  allowed: boolean;
  type: "subscription" | "base" | "sprint" | "free" | "none";
  creditsRemaining?: number | "unlimited";
}

export const verifyAndDeductCredit = async (userId: string): Promise<CreditCheckResult> => {
  const now = new Date();

  const subQuery = query(
    collection(db, "subscriptions"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );

  const subSnap = await getDocs(subQuery);

  if (!subSnap.empty) {
    for (const subDoc of subSnap.docs) {
      const subData = subDoc.data();
      if (subData.endDate) {
        let endDate: Date;
        if (subData.endDate.toDate) {
          endDate = subData.endDate.toDate();
        } else if (subData.endDate instanceof Date) {
          endDate = subData.endDate;
        } else {
          endDate = new Date(subData.endDate);
        }
        
        if (endDate > now) {
          return { allowed: true, type: "subscription", creditsRemaining: "unlimited" };
        }
      } else {
        return { allowed: true, type: "subscription", creditsRemaining: "unlimited" };
      }
    }
  }

  const profileRef = doc(db, "profiles", userId);
  const profileSnap = await getDoc(profileRef);
  const data = profileSnap.data();

  if (!profileSnap.exists()) {
    await setDoc(profileRef, {
      uid: userId,
      baseCredits: 3,
      accountType: "free",
      purchasedCredits: 0,
      totalUsed: 0,
      lastLogin: serverTimestamp(),
      joinedAt: serverTimestamp(),
    });
    await updateDoc(profileRef, { baseCredits: increment(-1) });
    return { allowed: true, type: "base", creditsRemaining: 2 };
  }

  if (data?.baseCredits > 0) {
    await updateDoc(profileRef, {
      baseCredits: increment(-1),
      totalUsed: increment(1),
    });
    const newData = (await getDoc(profileRef)).data();
    return { allowed: true, type: "base", creditsRemaining: (newData?.baseCredits || 0) };
  }

  if (data?.purchasedCredits > 0) {
    await updateDoc(profileRef, {
      purchasedCredits: increment(-1),
      totalUsed: increment(1),
    });
    const newData = (await getDoc(profileRef)).data();
    return { allowed: true, type: "sprint", creditsRemaining: (newData?.purchasedCredits || 0) };
  }

  if (!data?.accountType || data?.accountType === "free") {
    await setDoc(profileRef, {
      uid: userId,
      baseCredits: 3,
      accountType: "free",
      purchasedCredits: 0,
      totalUsed: 0,
    }, { merge: true });
    await updateDoc(profileRef, { baseCredits: increment(-1), totalUsed: increment(1) });
    return { allowed: true, type: "free", creditsRemaining: 2 };
  }

  return { allowed: false, type: "none", creditsRemaining: 0 };
};

export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  const now = new Date();

  const subQuery = query(
    collection(db, "subscriptions"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );

  const subSnap = await getDocs(subQuery);

  if (subSnap.empty) return false;

  for (const subDoc of subSnap.docs) {
    const subData = subDoc.data();
    if (subData.endDate) {
      let endDate: Date;
      if (subData.endDate.toDate) {
        endDate = subData.endDate.toDate();
      } else if (subData.endDate instanceof Date) {
        endDate = subData.endDate;
      } else {
        endDate = new Date(subData.endDate);
      }
      
      if (endDate > now) {
        return true;
      }
    } else {
      return true;
    }
  }

  return false;
};

export const getSubscriptionStatus = async (userId: string): Promise<{
  hasActive: boolean;
  plan?: string;
  endDate?: Date;
  daysRemaining?: number;
}> => {
  const now = new Date();

  const subQuery = query(
    collection(db, "subscriptions"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );

  const subSnap = await getDocs(subQuery);

  if (subSnap.empty) {
    return { hasActive: false };
  }

  for (const subDoc of subSnap.docs) {
    const subData = subDoc.data();
    if (subData.endDate) {
      let endDate: Date;
      if (subData.endDate.toDate) {
        endDate = subData.endDate.toDate();
      } else if (subData.endDate instanceof Date) {
        endDate = subData.endDate;
      } else {
        endDate = new Date(subData.endDate);
      }
      
      if (endDate > now) {
        const diffTime = endDate.getTime() - now.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          hasActive: true,
          plan: subData.planId || "architect",
          endDate,
          daysRemaining,
        };
      }
    } else {
      return {
        hasActive: true,
        plan: subData.planId || "architect",
      };
    }
  }

  return { hasActive: false };
};
