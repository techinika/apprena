"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, Trash2, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/db/firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function MentorChat() {
  const { user, profile, loading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setIsReady(true);
    }
  }, [authLoading]);

  useEffect(() => {
    if (isReady && isOpen && user) {
      loadChatHistory();
    }
  }, [isReady, isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (authLoading || !user || !isReady) {
    return null;
  }

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, "chatHistory"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setMessages(docData.messages || []);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const context = await getUserContext();
      
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          message: userMessage.content,
          context,
        }),
      });

      const result = await res.json();

      if (result.response) {
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: result.response,
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(result.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from mentor");
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const getUserContext = async () => {
    if (!user) return null;

    const roadmapRef = doc(db, "activities");
    const roadmapsQuery = query(
      collection(db, "activities"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    
    const learningQuery = query(
      collection(db, "learningPlans"),
      where("userId", "==", user.uid),
      orderBy("lastUpdated", "desc"),
      limit(3)
    );

    const [roadmapsSnap, learningSnap] = await Promise.all([
      getDocs(roadmapsQuery),
      getDocs(learningQuery),
    ]);

    return {
      userId: user.uid,
      displayName: user.displayName || profile?.displayName,
      email: user.email,
      accountType: profile?.accountType,
      baseCredits: profile?.baseCredits,
      purchasedCredits: profile?.purchasedCredits,
      recentRoadmaps: roadmapsSnap.docs.map(d => ({
        id: d.id,
        title: d.data().title,
        goal: d.data().userInput?.goal,
        status: d.data().status,
      })),
      recentLearningPlans: learningSnap.docs.map(d => ({
        id: d.id,
        title: d.data().title,
        target: d.data().target,
        progress: calculateLearningProgress(d.data()),
      })),
      badges: profile?.badges || [],
    };
  };

  const calculateLearningProgress = (plan: any) => {
    const modules = plan.modules || [];
    if (modules.length === 0) return 0;
    
    let completed = 0;
    for (const module of modules) {
      if (module.content) {
        completed += module.content.filter((c: any) => c.completed).length;
      } else if (module.status === "completed") {
        completed++;
      }
    }
    
    const total = modules.reduce((acc: number, m: any) => {
      return acc + (m.content?.length || 1);
    }, 0);
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-amber-500 text-slate-900 rounded-full shadow-lg hover:bg-amber-400 transition-all flex items-center gap-2 font-black"
      >
        <Sparkles size={20} />
        <span className="hidden sm:inline">Mentor</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div className="w-full max-w-md h-[80vh] max-h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-slate-900" />
                </div>
                <div>
                  <h3 className="font-black text-sm">AI Mentor</h3>
                  <p className="text-xs text-slate-400">Your personal career assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Clear chat"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot size={32} className="text-amber-600" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">Hi! I&apos;m your AI Mentor</h4>
                  <p className="text-sm text-slate-500 px-4">
                    Ask me anything about your career, learning path, or get personalized advice based on your roadmaps and progress.
                  </p>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-amber-500 text-slate-900"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === "assistant" && (
                        <Bot size={16} className="text-amber-500 mt-1 shrink-0" />
                      )}
                      {msg.role === "user" && (
                        <User size={16} className="text-slate-900 mt-1 shrink-0" />
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask your mentor..."
                  className="flex-1 p-3 bg-slate-50 rounded-2xl border-0 outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
                  rows={1}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-3 bg-amber-500 text-slate-900 rounded-2xl font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}