/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { syncUserProfile } from "./Profile";

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
