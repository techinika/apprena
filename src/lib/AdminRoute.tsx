"use client";

import Loading from "@/app/loading";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login");
    } else if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      redirect("/home");
    }
  }, [user, loading]);

  if (loading) return <Loading />;

  return <>{user ? children : null}</>;
}
