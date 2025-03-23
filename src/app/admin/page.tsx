import MainPage from "@/components/admin/MainPage";
import AdminRoute from "@/lib/AdminRoute";
import React from "react";

function page() {
  return (
    <AdminRoute>
      <MainPage />
    </AdminRoute>
  );
}

export default page;
