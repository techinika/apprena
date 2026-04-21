import { NextResponse } from "next/server";
import { db } from "@/db/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { generateJsonWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { prompt, memberId, memberName, targetRole, organizationId } = await req.json();

    if (!prompt || !memberId || !organizationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let aiResponse;
    try {
      aiResponse = await generateJsonWithFallback(prompt);
    } catch (parseError) {
      console.error("AI parse error:", parseError);
      return NextResponse.json({ error: "Failed to generate roadmap. Please try again." }, { status: 502 });
    }

    if (!aiResponse || !aiResponse.roadmap) {
      return NextResponse.json({ error: "Invalid roadmap generated" }, { status: 502 });
    }

    const memberDoc = await getDoc(doc(db, "organizationMembers", memberId));
    const userId = memberDoc.exists() ? memberDoc.data().userId : null;

    const docRef = await addDoc(collection(db, "activities"), {
      ...aiResponse,
      userId: userId,
      organizationId,
      status: "claimed",
      isOrganizationRoadmap: true,
      createdFromTemplate: null,
      createdAt: serverTimestamp(),
      userInput: {
        current: "Team member roadmap",
        goal: targetRole,
      },
      confidenceScore: aiResponse.confidenceScore || 17,
    });

    return NextResponse.json({
      success: true,
      roadmapId: docRef.id,
      roadmap: aiResponse,
    });
  } catch (error: any) {
    console.error("Generate roadmap error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}