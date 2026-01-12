import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getBadgeData(badgeId: string) {
  const profilesRef = collection(db, "profiles");

  const q = query(profilesRef, where("badges", "!=", null));

  const querySnapshot = await getDocs(q);
  let foundBadge = null;
  let userData = null;

  querySnapshot.forEach((doc) => {
    const profile = doc.data();
    const badge = profile.badges.find((b: any) => b.id === badgeId);
    if (badge) {
      foundBadge = badge;
      userData = {
        displayName: profile.displayName || "Anonymous Student",
        photoURL: profile.photoURL,
      };
    }
  });

  if (foundBadge && userData) {
    return { ...foundBadge, ...userData } as any;
  }
  return null;
}
