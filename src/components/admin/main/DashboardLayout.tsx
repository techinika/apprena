"use client";

import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "./DashboardHeader";
import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/db/firebase";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Institution } from "@/types/Institution";
import AdminRoute from "@/lib/AdminRoute";
import { getCookies, setCookies } from "@/lib/Cookies";

export default function Page({
  institutionId,
  children,
}: {
  children: React.ReactNode;
  institutionId: string;
}) {
  const { user } = useAuth();
  const [activeTeam, setActiveTeam] = React.useState<Institution | undefined>();
  const [institutions, setInstitutions] = React.useState<Institution[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      if (!user) return;

      const cookieData = await getCookies();
      const cookieInstitution = cookieData?.activeInstitution;

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
        const activeInst =
          cookieInstitution && cookieInstitution.id === institutionId
            ? cookieInstitution
            : data.find((inst) => inst.id === institutionId);
        setActiveTeam(activeInst || data[0] || null);
        setCookies({
          institution: {
            ...activeInst,
            createdAt: activeInst?.createdAt?.seconds
              ? new Date(activeInst.createdAt.seconds * 1000).toISOString()
              : activeInst?.createdAt || null,
          },
        });

        setInstitutions(data);
      });
    };
    getData();
  }, [institutionId, user]);

  return (
    <SidebarProvider>
      <AdminRoute>
        <AppSidebar
          institutions={institutions}
          activeInstitution={activeTeam}
          setActiveInstitution={setActiveTeam}
          institutionId={institutionId}
        />
        <SidebarInset>
          <DashboardHeader activeInstitution={activeTeam} />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </AdminRoute>
    </SidebarProvider>
  );
}
