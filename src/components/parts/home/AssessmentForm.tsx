"use client";

import React, { useState, useRef } from "react";
import { ChevronRight, ShieldCheck, Upload, X, FileText } from "lucide-react";
import LoadingAnalysis from "@/app/loading-analysis";
import { handleGoogleLoginOnActivity } from "@/db/operations/GoogleLogin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AssessmentForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    status: "",
    goal: "",
    ecosystem: "",
    ambition: "High Impact",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<any>(null);
  const [showLoginGate, setShowLoginGate] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        toast.error("You can only upload a maximum of 5 documents.");
        return;
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataPayload = new FormData();
    files.forEach((file) => formDataPayload.append("file", file));
    formDataPayload.append("answers", JSON.stringify(formData));

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formDataPayload,
      });
      const data = await res.json();

      if (res.status === 429) {
        toast.info("Free limit reached. Please log in to continue.");
        setShowLoginGate(true);
      } else {
        setResult(data);
        setShowLoginGate(true);
      }
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative -mt-56 z-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white p-8 md:p-16 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-100"
      >
        {submitting && <LoadingAnalysis />}
        {!submitting && !result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Current Status
                </label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="e.g. Senior CS Student"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none transition-all text-slate-900 font-bold"
                  required
                />
              </div>

              {/* Goal */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  The North Star (Goal)
                </label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  placeholder="e.g. AI Product Lead"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none transition-all text-slate-900 font-bold"
                  required
                />
              </div>

              {/* Social Ecosystem */}
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Social Ecosystem
                </label>
                <input
                  type="text"
                  name="ecosystem"
                  value={formData.ecosystem}
                  onChange={handleChange}
                  placeholder="Who are you currently surrounded by? (e.g. ambitious peers, no mentors)"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none transition-all text-slate-900 font-bold"
                />
              </div>

              {/* Ambition Level Toggle */}
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Ambition Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["Steady", "High Impact", "Disruptor"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, ambition: level })
                      }
                      className={`py-4 rounded-xl font-bold transition-all border-2 ${
                        formData.ambition === level
                          ? "border-amber-600 bg-amber-50 text-amber-700 shadow-sm"
                          : "border-slate-100 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="md:col-span-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group bg-slate-50/50"
                >
                  <Upload
                    className="mx-auto mb-4 text-slate-300 group-hover:text-amber-600 group-hover:scale-110 transition-all"
                    size={32}
                  />
                  <p className="text-base font-bold text-slate-600">
                    Upload Resume or Certifications
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">
                    {files.length} of 3 files uploaded
                  </p>
                </div>

                {/* File List Preview */}
                {files.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold border border-amber-100"
                      >
                        <FileText size={14} />
                        <span className="truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-12 bg-amber-600 hover:bg-amber-700 text-white font-black text-xl py-6 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-100 hover:-translate-y-1 active:scale-[0.98]"
            >
              Generate My Roadmap <ChevronRight size={24} strokeWidth={3} />
            </button>

            <p className="text-center text-slate-400 text-[10px] mt-8 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" /> 2 Free
              analyses remaining for your IP
            </p>
          </>
        )}
        {result && (
          <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] overflow-hidden shadow-2xl relative">
            <div className="p-12 border-b border-slate-100">
              <h2 className="text-3xl font-black mb-2">
                Analysis Preview: {result?.title}
              </h2>
              <p className="text-emerald-600 font-bold">
                Confidence Score: {result?.confidenceScore}%
              </p>
            </div>

            <div className="relative p-12 h-[400px] overflow-hidden">
              <div className="filter blur-xl opacity-30 select-none pointer-events-none">
                <div className="space-y-8">
                  <div className="h-20 bg-slate-200 rounded-2xl w-full" />
                  <div className="h-20 bg-slate-200 rounded-2xl w-3/4" />
                  <div className="h-20 bg-slate-200 rounded-2xl w-full" />
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-white/40 backdrop-blur-md">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-sm">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-3">Roadmap Ready!</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    Your personalized strategy is calculated. Log in to save it
                    to your profile and unlock the full learning path.
                  </p>
                  <button
                    onClick={() => handleGoogleLoginOnActivity(result, router)}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3"
                  >
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
