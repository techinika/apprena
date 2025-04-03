"use client";

import Loading from "@/app/loading";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      redirect("/login");
    } else if (user?.email !== ADMIN_EMAIL) {
      redirect("/home");
    }
  }, [user, loading]);

  if (loading) return <Loading />;

  return <>{user ? children : null}</>;
}
