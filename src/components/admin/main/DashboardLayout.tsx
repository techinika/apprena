"use client";

import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "./DashboardHeader";
import ProtectedRoute from "@/lib/ProtectedRoute";
import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/db/firebase";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Institution } from "@/types/Institution";
import { useParams } from "next/navigation";

export default function Page({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { institutionId } = useParams<{ institutionId: string }>();
  const [activeTeam, setActiveTeam] = React.useState<Institution | undefined>();
  const [institutions, setInstitutions] = React.useState<Institution[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      if (!user) return;

      const q = query(
        collection(db, "institutions"),
        where("organizationAdmins", "array-contains", user?.uid)
      );
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            createdAt: docData.createdAt
              ? formatDistanceToNow(docData.createdAt.toDate(), {
                  addSuffix: true,
                  locale: enUS,
                })
              : "Unknown",
            ...docData,
          } as Institution;
        });
        const activeInst = data.find((inst) => inst.id === institutionId);
        setActiveTeam(activeInst || data[0] || null);
        setInstitutions(data);
      });
    };
    getData();
  }, [institutionId, user]);

  return (
    <SidebarProvider>
      <ProtectedRoute>
        <AppSidebar
          institutions={institutions}
          activeInstitution={activeTeam}
          setActiveInstitution={setActiveTeam}
        />
        <SidebarInset>
          <DashboardHeader activeInstitution={activeTeam} />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </ProtectedRoute>
    </SidebarProvider>
  );
}
