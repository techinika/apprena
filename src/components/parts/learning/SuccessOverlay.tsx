"use client";
import React, { useRef } from "react";
import { Download, X } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { APP } from "@/variables/globals";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/lib/AuthContext";

export const SuccessModal = ({
  planTitle,
  badgeId,
  onClose,
}: {
  planTitle: string;
  badgeId: string;
  onClose: () => void;
}) => {
  const flierRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const downloadFlier = async () => {
    if (!flierRef.current) return;

    const canvas = await html2canvas(flierRef.current, {
      backgroundColor: "#0f172a",
      scale: 3,
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById("flier-container");
        if (el) {
          el.style.borderRadius = "0px";
        }
      },
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `achievement-${planTitle
      .toLowerCase()
      .replace(/\s+/g, "-")}.png`;
    link.href = image;
    link.click();
  };

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${badgeId}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-2xl w-full flex flex-col items-center">
        <div
          ref={flierRef}
          id="flier-container"
          className="w-full aspect-square bg-[#0f172a] p-12 flex flex-col justify-center gap-8 items-center text-center border-12 border-amber-500 rounded-3xl relative overflow-hidden"
          style={{ backgroundColor: "#0f172a" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="relative z-10 w-full">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png"
              alt="Trophy"
              className="w-24 h-24 mx-auto mb-6 object-contain"
              style={{
                filter: "drop-shadow(0px 0px 10px rgba(245, 158, 11, 0.5))",
              }}
            />

            <p className="text-amber-500 font-black tracking-[0.4em] text-xs uppercase mb-4">
              Official Certification
            </p>

            <h2 className="text-2xl font-bold text-slate-400 mb-1">
              {user?.displayName || "Ambition Learner"}
            </h2>

            <h1 className="text-4xl font-black text-white leading-tight mb-8">
              Mastered: <br />
              <span className="bg-clip-text  text-amber-500">{planTitle}</span>
            </h1>
          </div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="bg-white p-3 rounded-2xl mb-6 shadow-2xl">
              <QRCodeCanvas
                value={verificationUrl}
                size={100}
                level={"H"}
                imageSettings={{
                  src: "/logo-short.png",
                  x: undefined,
                  y: undefined,
                  height: 20,
                  width: 20,
                  excavate: true,
                }}
              />
            </div>

            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
              Scan to verify
            </p>

            <div className="text-white font-black text-lg uppercase tracking-[0.2em] opacity-80">
              {APP?.NAME}, {APP?.SLOGAN}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 w-full max-w-md">
          <button
            onClick={downloadFlier}
            className="flex-1 bg-amber-500 text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
          >
            <Download size={20} /> Get PNG
          </button>
          <button
            onClick={onClose}
            className="px-6 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
