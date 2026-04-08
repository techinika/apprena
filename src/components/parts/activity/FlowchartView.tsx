"use client";

import { useEffect, useRef, useState } from "react";

const isValidMermaid = (text: string): boolean => {
  if (!text || text.trim().length < 5) return false;
  const validStarts = ["graph", "flowchart", "graph TD", "flowchart TD", "graph LR", "flowchart LR"];
  const trimmed = text.trim().toLowerCase();
  return validStarts.some(start => trimmed.startsWith(start));
};

const sanitizeMermaid = (text: string): string => {
  if (!text) return "";
  
  let cleaned = text.trim();
  
  if (!isValidMermaid(cleaned)) {
    console.warn("Invalid mermaid syntax detected");
    return "";
  }
  
  cleaned = cleaned.replace(/\\[\s\S]*?\]/g, "");
  cleaned = cleaned.replace(/\([\s\S]*?\)/g, "");
  
  return cleaned;
};

export const FlowchartView = ({ chartData }: { chartData: string | undefined }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartData || !containerRef.current) return;

    const renderChart = async () => {
      const sanitized = sanitizeMermaid(chartData);
      
      if (!sanitized) {
        setError("Invalid flowchart data");
        return;
      }

      try {
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
          securityLevel: "loose",
        });

        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.default.render(id, sanitized);
        containerRef.current!.innerHTML = svg;
        setError(null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Mermaid render error:", errorMessage);
        setError("Could not render flowchart");
      }
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
      {error ? (
        <div className="text-slate-400 text-center">
          <p className="font-bold mb-2">{error}</p>
          <p className="text-sm">The flowchart could not be displayed due to invalid format.</p>
        </div>
      ) : (
        <div ref={containerRef} className="mermaid-container" />
      )}
      {!isClient && !error && (
        <div className="text-slate-400 text-sm">Loading flowchart...</div>
      )}
    </div>
  );
};