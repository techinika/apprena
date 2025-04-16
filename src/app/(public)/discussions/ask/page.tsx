import NewDiscussion from "@/components/public/discussions/NewDiscussion";
import ProtectedRoute from "@/lib/ProtectedRoute";
import React from "react";

function page() {
  return (
    <div>
      <ProtectedRoute>
        <NewDiscussion />
      </ProtectedRoute>
    </div>
  );
}

export default page;
