import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";
import { db } from "@/db/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId, originalRoadmapId } = await req.json();

    if (!userId || !originalRoadmapId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const originalDoc = await getDoc(doc(db, "activities", originalRoadmapId));
    if (!originalDoc.exists()) {
      return NextResponse.json(
        { error: "Original roadmap not found" },
        { status: 404 }
      );
    }

    const originalData = originalDoc.data();

    if (!originalData.isPublic) {
      return NextResponse.json(
        { error: "This roadmap is not public" },
        { status: 403 }
      );
    }

    const personalizedPrompt = `
You are personalizing a career roadmap for a new user based on an existing roadmap.

## Original Roadmap
- Title: ${originalData.title}
- Goal: ${originalData.userInput?.goal}
- Current Situation: ${originalData.userInput?.current}
- Skills: ${originalData.userInput?.skills}
- Obstacles: ${originalData.userInput?.blocks}
- Ecosystem: ${originalData.userInput?.ecosystem}

## Your Task
Create a personalized version of this roadmap that takes into account that this is a NEW USER with potentially different:
- Current situation
- Skills and background
- Timeline preferences

Provide a brief personalization summary in JSON:
{
  "personalizedGoal": "Refined goal for the new user",
  "adaptations": ["Key changes made for this user"]
}
`;

    let personalization = {
      personalizedGoal: originalData.userInput?.goal,
      adaptations: ["Based on original roadmap structure"],
    };

    try {
      const result = await generateWithFallback(personalizedPrompt);
      if (result.parsed) {
        personalization = { ...personalization, ...result.parsed };
      }
    } catch (e) {
      console.log("Personalization skipped, using defaults");
    }

    const newDoc = await addDoc(collection(db, "activities"), {
      userId,
      title: `${originalData.title} (Personalized)`,
      category: originalData.category || "career",
      status: "claimed",
      priority: 0,
      createdAt: serverTimestamp(),
      roadmap: originalData.roadmap,
      confidenceScore: originalData.confidenceScore,
      mermaidChart: originalData.mermaidChart,
      learningGaps: originalData.learningGaps,
      curriculum: [],
      habits: originalData.habits,
      networkReason: originalData.networkReason,
      network: originalData.network,
      achievements: originalData.achievements,
      userInput: {
        ...originalData.userInput,
        goal: personalization.personalizedGoal || originalData.userInput?.goal,
        current: originalData.userInput?.current,
      },
      originalRoadmapId,
      forkedFrom: originalRoadmapId,
      isPublic: false,
      isActive: true,
      ownFeedbacks: [],
      personalizationNote: personalization.adaptations,
      curriculumNeedsGeneration: true,
    });

    return NextResponse.json({
      success: true,
      newRoadmapId: newDoc.id,
      personalization: personalization,
    });
  } catch (error: any) {
    console.error("Fork roadmap error:", error);
    return NextResponse.json(
      { error: "Failed to create personalized roadmap" },
      { status: 500 }
    );
  }
}