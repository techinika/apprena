import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "./DashboardHeader";
import ProtectedRoute from "@/lib/ProtectedRoute";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProtectedRoute>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </ProtectedRoute>
    </SidebarProvider>
  );
}
