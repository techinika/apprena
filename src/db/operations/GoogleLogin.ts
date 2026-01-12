/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db, googleProvider } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { syncUserProfile } from "./Profile";
import { doc, updateDoc } from "firebase/firestore";
import { verifyAndDeductCredit } from "./CreditCheck";

export const handleGoogleLogin = async (setLoading: any, router: any) => {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, googleProvider);

    if (result.user) {
      await syncUserProfile(result.user);
      router.push("/workspace");
    }
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    alert("Failed to sign in. Please try again.");
  } finally {
    setLoading(false);
  }
};

export const handleGoogleLoginOnActivity = async (result: any, router: any) => {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;

    if (user && result) {
      await syncUserProfile(result.user);

      const verification = await verifyAndDeductCredit(user.uid);

      if (!verification.allowed) {
        router.push("/pricing?reason=no-credits");
        return;
      }

      const activityRef = doc(db, "activities", result.id);
      await updateDoc(activityRef, {
        userId: user.uid,
        status: "claimed",
        paymentType: verification.type,
      });

      router.push(`/workspace/${result.id}`);
    }
  } catch (e) {
    console.error("Login or Credit deduction failed", e);
    alert("Something went wrong during verification.");
  }
};
