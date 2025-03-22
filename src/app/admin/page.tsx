import MainPage from "@/components/admin/MainPage";
import ProtectedRoute from "@/lib/ProtectedRoute";
import React from "react";

function page() {
  return (
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  );
}

export default page;
