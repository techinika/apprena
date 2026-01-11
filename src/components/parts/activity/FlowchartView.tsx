"use client";

import mermaid from "mermaid";
import { useEffect } from "react";

export const FlowchartView = ({ chartData }: { chartData: any }) => {
  useEffect(() => {
    mermaid.contentLoaded();
  }, [chartData]);

  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-inner flex justify-center overflow-x-auto">
      <div className="mermaid">{chartData}</div>
    </div>
  );
};
