"use client";

import { useEffect, useRef, useState } from "react";

export const FlowchartView = ({ chartData }: { chartData: string | undefined }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartData || !containerRef.current) return;

    const renderChart = async () => {
      const mermaid = await import("mermaid");
      mermaid.default.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#FFBF00",
          primaryTextColor: "#fff",
          lineColor: "#e2e8f0",
          fontSize: "14px",
        },
      });

      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.default.render(id, chartData);
      containerRef.current!.innerHTML = svg;
    };

    renderChart();
  }, [chartData, isClient]);

  if (!chartData) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-inner text-center text-slate-400">
        No flowchart data available
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-inner flex justify-center overflow-x-auto">
      <div ref={containerRef} className="mermaid-container" />
      {!isClient && (
        <div className="text-slate-400 text-sm">Loading flowchart...</div>
      )}
    </div>
  );
};
