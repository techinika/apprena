import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";
import { verifyAuth } from "@/lib/apiAuth";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";

interface SectionFeedbackRequest {
  activityId: string;
  sectionType?: string;
  sectionTitle?: string;
  sectionContent?: any;
  itemId?: string;
  itemTitle?: string;
  feedback: string;
}

export async function POST(req: Request) {
  try {
    const body: SectionFeedbackRequest = await req.json();
    const { activityId, sectionType, sectionTitle, sectionContent, itemId, itemTitle, feedback } = body;
    const { uid } = await verifyAuth(req);

    if (!uid || !activityId || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sectionData = {
      uid,
      activityId,
      sectionType,
      sectionTitle,
      itemId,
      itemTitle,
      content: feedback,
      createdAt: serverTimestamp(),
      aiProcessed: false,
    };

    const feedbackRef = await addDoc(collection(db, "sectionFeedback"), sectionData);

    const activityRef = doc(db, "activities", activityId);
    const activitySnap = await getDoc(activityRef);

    if (!activitySnap.exists()) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const activityData = activitySnap.data();

    const getSectionData = (type?: string) => {
      switch (type) {
        case "learning":
          return {
            label: "Learning Path/Curriculum",
            data: activityData.curriculum || [],
            currentItem: itemTitle || "General learning path"
          };
        case "network":
          return {
            label: "Social Circle/Network",
            data: activityData.network || [],
            currentItem: itemTitle || "General network recommendations"
          };
        case "habits":
          return {
            label: "Action & Habits",
            data: activityData.habits || [],
            currentItem: itemTitle || "General habits"
          };
        case "achievements":
          return {
            label: "Achievements/Milestones",
            data: activityData.achievements || [],
            currentItem: itemTitle || "General achievements"
          };
        case "milestone":
          return {
            label: "Progress Milestone",
            data: activityData.milestones || [],
            currentItem: itemTitle || "Milestone"
          };
        default:
          return { label: sectionTitle || "Section", data: [], currentItem: "General feedback" };
      }
    };

    const sectionInfo = getSectionData(sectionType);

    const prompt = `
You are a career strategy expert. A user has provided feedback on their roadmap section.

## SECTION DETAILS
- Section Type: ${sectionTitle || sectionType || "General"}
- Item (if specific): ${itemTitle || "General feedback"}
- User's Feedback: ${feedback}

## CURRENT STATE
${sectionInfo.label}:
${JSON.stringify(sectionInfo.data.slice(0, 3), null, 2)}

## YOUR TASK
Analyze this feedback and determine if the section needs modification. Return JSON:

{
  "needsModification": true/false,
  "reason": "Why you agree or disagree with the feedback",
  "suggestions": ["Any helpful suggestions for the user"]
}

Focus on being helpful and practical.
`;

    let aiResponse;
    try {
      const result = await generateWithFallback(prompt);
      aiResponse = result.parsed || { needsModification: false, reason: "Could not process feedback" };
    } catch (error) {
      console.error("AI error:", error);
      aiResponse = { needsModification: false, reason: "Feedback received but AI processing failed" };
    }

    try {
      await updateDoc(doc(db, "sectionFeedback", feedbackRef.id), {
        aiProcessed: true,
        aiResponse: aiResponse,
      });
    } catch (updateErr) {
      console.error("Failed to update sectionFeedback with AI response:", updateErr);
    }

    return NextResponse.json({
      success: true,
      feedbackId: feedbackRef.id,
      analysis: aiResponse,
    });
  } catch (error: any) {
    console.error("Section feedback error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}