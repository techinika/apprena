"use client";

import React, { useState, useRef } from "react";
import { ChevronRight, ShieldCheck, Upload, X, FileText } from "lucide-react";
import LoadingAnalysis from "@/app/loading-analysis";

export const AssessmentForm = () => {
  const [formData, setFormData] = useState({
    status: "",
    goal: "",
    ecosystem: "",
    ambition: "High Impact",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [submitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        alert("You can only upload a maximum of 5 documents.");
        return;
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // 4. Final Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionPayload = {
      ...formData,
      attachments: files, // This is your object of values
    };
    console.log("Final Object of Responses:", submissionPayload);
  };
  return (
    <div className="relative -mt-56 z-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white p-8 md:p-16 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-100"
      >
        {submitting && <LoadingAnalysis />}
        {!submitting && (
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
      </form>
    </div>
  );
};
