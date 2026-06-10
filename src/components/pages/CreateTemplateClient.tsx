"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, Loader2, Sparkles, Plus, Trash2, Layout } from "lucide-react";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { db } from "@/db/firebase";
import { toast } from "sonner";

interface TemplateForm {
  name: string;
  description: string;
  category: string;
  steps: { tag: string; title: string; desc: string; result: string }[];
}

export default function CreateTemplateClient() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState<TemplateForm>({
    name: "",
    description: "",
    category: "engineering",
    steps: [{ tag: "Phase 1", title: "", desc: "", result: "" }],
  });

  const generateTemplate = async () => {
    if (!form.name && !form.description) {
      toast.error("Please provide a template name and description");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
        }),
      });

      const result = await res.json();

      if (result.template) {
        setForm(prev => ({
          ...prev,
          name: result.template.name || prev.name,
          steps: result.template.roadmap?.steps || prev.steps,
        }));
        toast.success("Template generated!");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate template");
    } finally {
      setGenerating(false);
    }
  };

  const saveTemplate = async () => {
    if (!user || !params.orgId || !form.name) return;

    if (form.steps.some(s => !s.title || !s.desc)) {
      toast.error("Please complete all roadmap steps");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/organization-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: params.orgId,
          name: form.name,
          description: form.description,
          category: form.category,
          roadmap: { steps: form.steps },
          createdBy: user.uid,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Template saved!");
        router.push(`/organization/${params.orgId}?tab=templates`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      steps: [...prev.steps, { tag: `Phase ${prev.steps.length + 1}`, title: "", desc: "", result: "" }],
    }));
  };

  const removeStep = (index: number) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const updateStep = (index: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? { ...step, [field]: value } : step),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Layout size={24} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Create Template</h1>
              <p className="text-slate-500 text-sm">Build a reusable roadmap template for your team</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="template-name" className="block text-sm font-bold text-slate-700 mb-2">Template Name</label>
              <input
                id="template-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Junior to Senior Developer Path"
                className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="template-desc" className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                id="template-desc"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What is this template for? Who is it designed for?"
                className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
              />
            </div>

            <div>
              <label htmlFor="template-category" className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select
                id="template-category"
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="engineering">Engineering</option>
                <option value="product">Product</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="leadership">Leadership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              onClick={generateTemplate}
              disabled={generating || !form.name}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
              {generating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              Generate with AI
            </button>

            <div className="border-t border-slate-100 pt-8">
              <h3 className="font-bold text-slate-900 mb-4">Roadmap Steps</h3>
              
              {form.steps.map((step, index) => (
                <div key={index} className="bg-slate-50 rounded-2xl p-6 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-amber-600">{step.tag}</span>
                    {form.steps.length > 1 && (
                      <button
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(index, "title", e.target.value)}
                      placeholder="Step title"
                      aria-label={`Step ${index + 1} title`}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <textarea
                      value={step.desc}
                      onChange={(e) => updateStep(index, "desc", e.target.value)}
                      placeholder="Detailed description"
                      aria-label={`Step ${index + 1} description`}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
                    />
                    <input
                      type="text"
                      value={step.result}
                      onChange={(e) => updateStep(index, "result", e.target.value)}
                      placeholder="Expected outcome/result"
                      aria-label={`Step ${index + 1} expected outcome`}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addStep}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl font-bold text-slate-500 hover:border-amber-500 hover:text-amber-600 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Step
              </button>
            </div>

            <button
              onClick={saveTemplate}
              disabled={loading || !form.name}
              className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Template"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
