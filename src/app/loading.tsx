import { Spinner } from "@/components/ui/spinner";
import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spinner>Loading...</Spinner>
    </div>
  );
}

export default Loading;
