"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  BookOpen,
  FileText,
  PenLine,
  HelpCircle,
  Lock,
  Unlock,
  Loader2,
  Send,
  RotateCcw,
  Trophy,
  Award,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { LearningPlan, GeneratedContent } from "@/types/learning";
import { db } from "@/db/firebase";
import Loading from "@/app/loading";
import confetti from "canvas-confetti";

export default function CourseViewer({ moduleIndex }: { moduleIndex: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const learningId = params.learning as string;
  const courseIndex = parseInt(params.course as string);

  const formatContent = (content: string) => {
    const elements: React.ReactNode[] = [];
    const lines = content.split("\n");
    let currentParagraph = "";
    let listItems: string[] = [];
    let listType: "ol" | "ul" | null = null;
    
    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        elements.push(<p key={elements.length} className="text-slate-700 leading-relaxed mb-4 text-lg">{currentParagraph}</p>);
        currentParagraph = "";
      }
    };
    
    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === "ol") {
          elements.push(<ol key={elements.length} className="list-decimal list-inside space-y-2 my-4 ml-4">{
            listItems.map((item, i) => <li key={i} className="text-slate-700 text-lg">{item}</li>)
          }</ol>);
        } else if (listType === "ul") {
          elements.push(<ul key={elements.length} className="list-disc list-inside space-y-2 my-4 ml-4">{
            listItems.map((item, i) => <li key={i} className="text-slate-700 text-lg">{item}</li>)
          }</ul>);
        }
        listItems = [];
        listType = null;
      }
    };
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.match(/^#{1,6}\s/)) {
        flushParagraph();
        flushList();
        const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          if (level === 1) elements.push(<h1 key={elements.length} className="text-2xl font-black text-slate-900 mt-8 mb-4">{text}</h1>);
          else if (level === 2) elements.push(<h2 key={elements.length} className="text-xl font-bold text-slate-800 mt-6 mb-3">{text}</h2>);
          else if (level === 3) elements.push(<h3 key={elements.length} className="text-lg font-bold text-slate-800 mt-4 mb-2">{text}</h3>);
          else elements.push(<h4 key={elements.length} className="text-md font-bold text-slate-700 mt-3 mb-2">{text}</h4>);
        }
      } else if (trimmed.match(/^\d+\./)) {
        flushParagraph();
        if (listType !== "ol") { flushList(); listType = "ol"; }
        listItems.push(trimmed.replace(/^\d+\.\s*/, ""));
      } else if (trimmed.match(/^[-*•]\s/)) {
        flushParagraph();
        if (listType !== "ul") { flushList(); listType = "ul"; }
        listItems.push(trimmed.replace(/^[-*•]\s*/, ""));
      } else if (trimmed === "") {
        flushParagraph();
        flushList();
      } else {
        flushList();
        currentParagraph += (currentParagraph ? " " : "") + trimmed;
      }
    }
    
    flushParagraph();
    flushList();
    
    return elements.length > 0 ? elements : <p className="text-slate-700 leading-relaxed mb-4 text-lg">{content}</p>;
  };

  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [contentIndex, setContentIndex] = useState(courseIndex);
  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showAiSolution, setShowAiSolution] = useState(false);
  const [warnedContentId, setWarnedContentId] = useState<string | null>(null);
  const [finalComparison, setFinalComparison] = useState<any[] | null>(null);

  useEffect(() => {
    if (!user || !learningId) return;

    const unsubscribe = onSnapshot(doc(db, "learningPlans", learningId), (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as LearningPlan;
        setPlan(data);
        
        const moduleIdx = parseInt(moduleIndex);
        if (data.modules[moduleIdx]?.content?.[contentIndex]) {
          setCurrentContent(data.modules[moduleIdx].content[contentIndex]);
        }
      } else {
        toast.error("Plan not found");
        router.push("/learning");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [learningId, user, moduleIndex, contentIndex]);

  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const canAccessContent = (idx: number): boolean => {
    if (!plan) return false;
    const moduleIdx = parseInt(moduleIndex);
    const module = plan.modules[moduleIdx];
    if (!module.content) return false;
    
    if (idx === 0) return true;
    return module.content[idx - 1]?.completed === true;
  };

  const calculateTotalGrade = (): number => {
    if (!plan) return 0;
    let totalGrade = 0;
    let totalItems = 0;
    
    for (const module of plan.modules) {
      if (module.content) {
        for (const content of module.content) {
          if (content.completed && content.grade !== undefined) {
            totalGrade += content.grade;
            totalItems++;
          }
        }
      }
    }
    
    return totalItems > 0 ? Math.round(totalGrade / totalItems) : 0;
  };

  const handleExerciseSubmit = async () => {
    if (!plan || !currentContent || !learningId || !exerciseAnswer.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/grade-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          contentTitle: currentContent.title,
          contentType: currentContent.type,
          exerciseContent: currentContent.content,
          userAnswer: exerciseAnswer,
          planId: learningId,
          aiSolution: currentContent.aiSolution,
        }),
      });
      
      const result = await res.json();
      
      let finalGrade = result.grade;
      let finalFeedback = result.feedback;
      
      if (result.aiDetected) {
        finalGrade = Math.max(0, finalGrade - 10);
        finalFeedback = result.feedback + " (10 marks deducted - AI assistance detected)";
      }
      
      if (res.ok) {
        await markContentComplete(finalGrade, finalFeedback, result.aiDetected);
      } else {
        await markContentComplete(50, "Unable to grade. Keep learning!", false);
      }
    } catch (error) {
      console.error("Exercise submit error:", error);
      await markContentComplete(50, "Error processing submission.", false);
    } finally {
      setSubmitting(false);
      setShowWarning(false);
    }
  };

  const handleRevealAiSolution = () => {
    setShowAiSolution(true);
    setShowWarning(false);
  };

  const handleStartWithoutAi = () => {
    setShowWarning(false);
  };

  const handleFinalComparison = async () => {
    if (!plan || !learningId) return;

    const exercises: any[] = [];
    for (const module of plan.modules) {
      if (module.content) {
        for (const content of module.content) {
          if (content.type === "exercise" && content.completed && content.aiSolution) {
            exercises.push({
              exerciseId: content.id,
              title: content.title,
              userAnswer: content.content,
              aiSolution: content.aiSolution,
            });
          }
        }
      }
    }

    if (exercises.length > 0) {
      try {
        const res = await fetch("/api/compare-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exercises }),
        });
        
        if (res.ok) {
          const result = await res.json();
          setFinalComparison(result.comparisons);
          
          if (result.aiDetectedCount > 0) {
            await updateDoc(doc(db, "learningPlans", learningId), {
              aiAnswerDetected: true,
              finalComparison: result.comparisons,
            });
            toast.warning(`AI assistance detected in ${result.aiDetectedCount} exercise(s). 10 marks deducted.`);
          } else {
            await updateDoc(doc(db, "learningPlans", learningId), {
              aiAnswerDetected: false,
              finalComparison: result.comparisons,
            });
          }
        }
      } catch (error) {
        console.error("Comparison error:", error);
      }
    }
  };

  const markContentComplete = async (grade?: number, feedback?: string, aiDetected?: boolean) => {
    if (!plan || !currentContent || !learningId) return;

    try {
      const moduleIdx = parseInt(moduleIndex);
      const updatedModules = [...plan.modules];
      const module = updatedModules[moduleIdx];
      
      if (!module.content) return;
      
      module.content = module.content.map((c, idx) =>
        idx === contentIndex 
          ? { ...c, completed: true, grade: grade ?? c.grade, feedback: feedback ?? c.feedback, usedAiForAnswer: aiDetected ?? false } 
          : c
      );

      const allContentComplete = module.content.every((c) => c.completed);
      if (allContentComplete) {
        module.status = "completed";
      } else {
        module.status = "in_progress";
      }

      const allModulesComplete = updatedModules.every((m) => m.status === "completed");
      
      const totalGrade = calculateTotalGrade();
      
      const updateData: any = {
        modules: updatedModules,
        lastUpdated: serverTimestamp(),
        isActive: !allModulesComplete,
        totalGrade,
      };
      
      if (allModulesComplete && totalGrade >= 80) {
        updateData.passedAt = serverTimestamp();
      } else if (allModulesComplete && totalGrade < 80) {
        updateData.attempts = (plan.attempts || 0) + 1;
      }

      await updateDoc(doc(db, "learningPlans", learningId), updateData);

      triggerFireworks();
      toast.success(grade && grade >= 70 ? `Great job! Score: ${grade}%` : "Content completed!");

      if (allModulesComplete) {
        if (totalGrade >= 80) {
          await updateDoc(doc(db, "profiles", user!.uid), {
            badges: arrayUnion({
              id: `badge-${learningId}`,
              title: plan.title,
              type: "path_completion",
              unlockedAt: new Date().toISOString(),
            }),
          });
          toast.success(`Congratulations! You passed with ${totalGrade}%!`);
        } else {
          toast.error(`You scored ${totalGrade}%. You need 80% to pass.`);
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleRestartCourse = async () => {
    if (!plan || !learningId) return;
    
    try {
      const resetModules = plan.modules.map(m => ({
        ...m,
        status: "not_started",
        content: m.content?.map(c => ({
          ...c,
          completed: false,
          grade: undefined,
          feedback: undefined,
        })),
      }));
      
      await updateDoc(doc(db, "learningPlans", learningId), {
        modules: resetModules,
        isActive: true,
        totalGrade: undefined,
        passedAt: null,
        lastUpdated: serverTimestamp(),
      });
      
      toast.success("Course restarted! Good luck!");
      router.push(`/learning/${learningId}`);
    } catch (error) {
      console.error("Restart error:", error);
      toast.error("Failed to restart course");
    }
  };

  const handleNavigate = (newIndex: number) => {
    if (canAccessContent(newIndex)) {
      setContentIndex(newIndex);
      router.push(`/learning/${learningId}/course/${newIndex}`);
    } else {
      toast.error("Complete the previous content first");
    }
  };

  if (loading) return <Loading />;
  if (!plan || !currentContent) return <Loading />;

  const moduleIdx = parseInt(moduleIndex);
  const module = plan.modules[moduleIdx];
  const moduleContent = module.content || [];
  const totalContent = moduleContent.length;
  const completedContent = moduleContent.filter((c: GeneratedContent) =>c.completed).length;
  let totalGrade = calculateTotalGrade();
  const allModulesComplete = plan.modules.every(m => m.status === "completed");
  const passed = allModulesComplete && totalGrade >= 80;
  
  const hasAiDetection = plan.modules.some(m => 
    m.content?.some(c => c.type === "exercise" && c.usedAiForAnswer)
  );
  if (hasAiDetection) {
    totalGrade = Math.max(0, totalGrade - 10);
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "lesson": return <BookOpen size={20} />;
      case "reading": return <FileText size={20} />;
      case "exercise": return <PenLine size={20} />;
      case "quiz": return <HelpCircle size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push(`/learning/${learningId}`)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Learning Path
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Module {moduleIdx + 1} Progress
              </p>
              <p className="text-sm font-bold text-slate-900">
                {completedContent} / {totalContent}
              </p>
            </div>
            {totalGrade > 0 && (
              <div className={`px-4 py-2 rounded-xl font-bold ${passed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {passed ? <Trophy size={16} className="inline mr-1" /> : <Award size={16} className="inline mr-1" />}
                {totalGrade}%
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sticky top-24">
              <h3 className="font-black text-slate-900 mb-4">{module.course}</h3>
              <div className="space-y-2">
                {module.content?.map((content, idx) => (
                  <button
                    key={content.id}
                    onClick={() => handleNavigate(idx)}
                    disabled={!canAccessContent(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      contentIndex === idx
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : content.completed
                        ? "text-emerald-600 bg-emerald-50"
                        : canAccessContent(idx)
                        ? "text-slate-600 hover:bg-slate-50"
                        : "text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    {content.completed ? (
                      <CheckCircle2 size={18} />
                    ) : canAccessContent(idx) ? (
                      <Circle size={18} strokeWidth={1.5} />
                    ) : (
                      <Lock size={18} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{content.title}</p>
                      <p className="text-[10px] text-slate-400">{content.duration}</p>
                    </div>
                    <span className="text-slate-300">{getContentIcon(content.type)}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12">
              <div className="flex items-center gap-3 text-amber-600 font-bold text-sm mb-6">
                {getContentIcon(currentContent.type)}
                <span className="uppercase tracking-wider">{currentContent.type}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{currentContent.duration}</span>
                {currentContent.grade !== undefined && (
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${currentContent.grade >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    Score: {currentContent.grade}%
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black text-slate-900 mb-8">
                {currentContent.title}
              </h1>

              <div className="prose prose-slate max-w-none">
                {formatContent(currentContent.content)}
              </div>

              {currentContent.type === "exercise" && !currentContent.completed && (
                <>
                  {!showWarning && !showAiSolution && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="text-blue-600 mt-1" size={20} />
                        <div>
                          <p className="font-bold text-blue-900">Important Notice</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Using AI assistance (like ChatGPT, Claude, etc.) to complete this exercise will result in a 10-mark deduction if detected. 
                            Try to answer using your own knowledge and understanding.
                          </p>
                          <button
                            onClick={() => {
                              if (currentContent.aiSolution) {
                                setShowWarning(true);
                              }
                            }}
                            className="mt-3 text-xs text-blue-600 hover:underline font-bold"
                          >
                            Show me the model answer first (optional)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showWarning && currentContent.aiSolution && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-start gap-3">
                        <Eye className="text-amber-600 mt-1" size={20} />
                        <div className="flex-1">
                          <p className="font-bold text-amber-900">Model Answer Available</p>
                          <p className="text-sm text-amber-700 mt-1 mb-3">
                            You can view the model answer before attempting. However, if your answer is too similar to this model, it will be flagged as AI-assisted.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleRevealAiSolution}
                              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700"
                            >
                              View Model Answer
                            </button>
                            <button
                              onClick={handleStartWithoutAi}
                              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300"
                            >
                              I'll Try Myself
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showAiSolution && currentContent.aiSolution && (
                    <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-300">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-slate-700">Model Answer (AI Generated)</p>
                        <button
                          onClick={() => setShowAiSolution(false)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <EyeOff size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{currentContent.aiSolution}</p>
                    </div>
                  )}
                </>
              )}

              {currentContent.type === "exercise" && !currentContent.completed && (
                <div className="mt-12 p-6 bg-slate-50 rounded-2xl">
                  <h3 className="font-black text-slate-900 mb-4">Submit Your Answer</h3>
                  <textarea
                    value={exerciseAnswer}
                    onChange={(e) => setExerciseAnswer(e.target.value)}
                    placeholder="Write your answer here..."
                    className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 min-h-[150px]"
                  />
                  <button
                    onClick={handleExerciseSubmit}
                    disabled={submitting || !exerciseAnswer.trim()}
                    className="mt-4 px-8 py-4 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        AI is grading...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit for Grading
                      </>
                    )}
                  </button>
                </div>
              )}

              {currentContent.feedback && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm font-bold text-amber-800 mb-2">AI Feedback:</p>
                  <p className="text-sm text-amber-700">{currentContent.feedback}</p>
                </div>
              )}

              {currentContent.completed && currentContent.type !== "exercise" && (
                <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <CheckCircle2 size={20} />
                    Completed
                  </div>
                  {currentContent.grade !== undefined && (
                    <p className="text-sm text-emerald-600">
                      You scored {currentContent.grade}% on this content.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => handleNavigate(contentIndex - 1)}
                  disabled={contentIndex === 0}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  {allModulesComplete && !passed && (
                    <button
                      onClick={handleRestartCourse}
                      className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-red-600"
                    >
                      <RotateCcw size={18} />
                      Restart Course
                    </button>
                  )}
                  
                  {contentIndex < totalContent - 1 && currentContent.completed && (
                    <button
                      onClick={() => handleNavigate(contentIndex + 1)}
                      className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 transition-all flex items-center gap-2"
                    >
                      Next
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </div>

              {allModulesComplete && !finalComparison && (
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <h3 className="font-black text-blue-900 mb-4">Course Complete!</h3>
                  <p className="text-blue-700 mb-4">
                    Your answers will be analyzed to ensure you completed the exercises yourself.
                  </p>
                  <button
                    onClick={handleFinalComparison}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                  >
                    Analyze My Answers
                  </button>
                </div>
              )}

              {finalComparison && (
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="font-black text-slate-900 mb-4">Answer Analysis Results</h3>
                  
                  {plan.aiAnswerDetected && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                      <p className="font-bold text-red-800">
                        ⚠️ AI assistance was detected in your submissions. A 10-mark penalty has been applied.
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {finalComparison.map((comp: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-800 mb-2">{comp.title}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Your Answer</p>
                            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{comp.userAnswer?.slice(0, 200)}...</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Model Answer</p>
                            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{comp.aiSolution?.slice(0, 200)}...</p>
                          </div>
                        </div>
                        {comp.aiDetected && (
                          <p className="text-xs font-bold text-red-600 mt-2">⚠️ Similar to AI answer detected</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}