// components/learning/SuccessModal.tsx
"use client";
import React, { useRef } from "react";
import { Trophy, Download } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { APP } from "@/variables/globals";

export const SuccessModal = ({
  planTitle,
  onClose,
}: {
  planTitle: string;
  onClose: () => void;
}) => {
  const flierRef = useRef<HTMLDivElement>(null);

  const downloadFlier = async () => {
    if (!flierRef.current) return;

    const canvas = await html2canvas(flierRef.current, {
      backgroundColor: "#0f172a",
      scale: 2,
      useCORS: true,
      logging: false,

      onclone: (clonedDoc) => {
        const problematicElements = clonedDoc.querySelectorAll("*");

        problematicElements.forEach((el) => {
          const element = el as HTMLElement;

          element.style.backdropFilter = "none";

          element.style.filter = "none";

          const computed = window.getComputedStyle(element);
          if (computed.backgroundColor?.includes("lab")) {
            element.style.backgroundColor = "#0f172a";
          }
        });
      },
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "apprena-achievement.png";
    link.href = image;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
      <div className="max-w-2xl w-full flex flex-col items-center">
        <div
          ref={flierRef}
          className="w-full aspect-square bg-slate-900 p-12 flex flex-col justify-between items-center text-center border-12 border-amber-500 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative z-10">
            <Trophy className="text-amber-500 mx-auto mb-6" size={80} />
            <p className="text-amber-500 font-black tracking-[0.3em] text-sm uppercase mb-2">
              Certification of Completion
            </p>
            <h1 className="text-4xl font-black text-white leading-tight">
              Mastered: <br /> {planTitle}
            </h1>
          </div>

          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium italic">
              Verified by Your Platform Intelligence
            </p>
            <div className="mt-4 text-white font-bold text-xl uppercase tracking-widest">
              {APP?.NAME}. Built for the most ambitious!
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 w-full">
          <button
            onClick={downloadFlier}
            className="flex-1 bg-amber-500 text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-400 transition-all"
          >
            <Download size={20} /> Download Achievement
          </button>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
