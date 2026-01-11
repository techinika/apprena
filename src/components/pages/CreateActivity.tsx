"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import LoadingAnalysis from "@/app/loading-analysis";

const QUESTIONS = [
  {
    id: "current",
    label: "Current Reality",
    placeholder:
      "What is your current role and biggest professional frustration?",
  },
  {
    id: "goal",
    label: "The North Star",
    placeholder:
      "Where do you want to be in 5-10 years? Be specific (e.g., CEO of a Biotech Startup).",
  },
  {
    id: "skills",
    label: "Inventory",
    placeholder:
      "What are your top 3 'Superpowers' (skills) and 3 biggest gaps?",
  },
  {
    id: "blocks",
    label: "Obstacles",
    placeholder:
      "What is the #1 thing stopping you from reaching your goal right now?",
  },
  {
    id: "ecosystem",
    label: "Social Circle",
    placeholder:
      "Do you have mentors? Who are the people you spend the most time with professionally?",
  },
];

export default function CreateRoadmap() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const updateAnswer = (val: string) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: val });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        toast.error("Maximum 5 attachments allowed");
        return;
      }
      setFiles([...files, ...selectedFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const remaining =
      (profile?.baseCredits ?? 0) + (profile?.purchasedCredits ?? 0);
    if (remaining <= 0 && profile?.accountType === "free") {
      toast.error("Insufficient credits.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      formData.append("answers", JSON.stringify(answers));
      formData.append("userId", String(user?.uid));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/workspace?analysis=success&id=${result.id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "Analysis failed");
    }
  };

  if (loading) return <LoadingAnalysis />;

  return (
    <div className="min-h-[92vh] bg-white flex flex-col md:flex-row">
      <div className="md:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mb-8">
            <Sparkles className="text-slate-900" size={24} />
          </div>
          <h1 className="text-3xl font-black mb-12">
            Intelligence <br />
            Gathering.
          </h1>

          <div className="space-y-8">
            {QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                className={`flex items-center gap-4 transition-opacity ${
                  step >= i ? "opacity-100" : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    step === i
                      ? "border-amber-500 text-amber-500"
                      : "border-slate-700 text-slate-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-bold">{q.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:w-2/3 p-6 md:p-24 bg-slate-50/50 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2 block">
            Step {step + 1} of {QUESTIONS.length}
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-8">
            {QUESTIONS[step].label}
          </h2>

          <textarea
            autoFocus
            key={step} // Reset animation/focus on step change
            value={answers[QUESTIONS[step].id] || ""}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={QUESTIONS[step].placeholder}
            className="w-full p-8 rounded-3xl border border-slate-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all bg-white min-h-[250px] outline-none text-lg"
          />

          {/* Attachments Section - Only show on last step or specific step */}
          {step === QUESTIONS.length - 1 && (
            <div className="mt-8">
              <label className="text-sm font-bold text-slate-500 block mb-4">
                Supporting Files (Optional)
              </label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-white">
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">
                  Add up to 5 PDFs (Resume, Portfolio, etc.)
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg"
                  >
                    {f.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-12">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 text-slate-400 font-bold disabled:opacity-0"
            >
              <ChevronLeft size={20} /> Back
            </button>

            {step < QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answers[QUESTIONS[step].id]}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-amber-600 transition-all disabled:opacity-50"
              >
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-amber-700 transition-all shadow-xl shadow-amber-200"
              >
                Construct Roadmap <Sparkles size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
