"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/db/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { UserProfile } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  profile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  profile: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/terms", "/privacy"];
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && !publicRoutes.includes(pathname)) {
        router.push("/login");
      }

      if (currentUser && pathname === "/login") {
        router.push("/workspace");
      }

      if (currentUser) {
        const userRef = doc(db, "profiles", currentUser.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const logout = useCallback(async () => {
    await signOut(auth);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, logout, profile }),
    [user, loading, logout, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
