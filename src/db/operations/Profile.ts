import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import {
  deleteUser,
  GoogleAuthProvider,
  reauthenticateWithPopup,
  User,
} from "firebase/auth";
import { auth, db } from "../firebase";

export const syncUserProfile = async (user: User) => {
  const userRef = doc(db, "profiles", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newProfile = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      joinedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      accountType: "free",
      baseCredits: 2,
      purchasedCredits: 0,
      totalUsed: 0,
    };
    await setDoc(userRef, newProfile);
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  }
};

export const deleteUserAccountPermanently = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");

  const provider = new GoogleAuthProvider();
  await reauthenticateWithPopup(user, provider);

  const batch = writeBatch(db);

  const profileRef = doc(db, "profiles", user?.uid);
  batch.delete(profileRef);

  const activitiesQ = query(
    collection(db, "activities"),
    where("userId", "==", user?.uid)
  );
  const activitiesSnap = await getDocs(activitiesQ);
  activitiesSnap.forEach((d) => batch.delete(d.ref));

  await batch.commit();

  await deleteUser(user);

  return { success: true };
};
