import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";

interface RoadmapFeedbackRequest {
  userId: string;
  activityId: string;
  roadmapStepId: string;
  stepTitle: string;
  stepDescription: string;
  feedback: string;
}

export async function POST(req: Request) {
  try {
    const body: RoadmapFeedbackRequest = await req.json();
    const { userId, activityId, roadmapStepId, stepTitle, stepDescription, feedback } = body;

    if (!userId || !activityId || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feedbackRef = await addDoc(collection(db, "roadmapFeedback"), {
      userId,
      activityId,
      roadmapStepId,
      content: feedback,
      createdAt: serverTimestamp(),
      aiProcessed: false,
      version: 1,
    });

    const prompt = `
You are a career strategy expert. A user has provided feedback on a roadmap step and wants you to improve it.

## CURRENT STEP
- Title: ${stepTitle}
- Description: ${stepDescription}

## USER FEEDBACK
${feedback}

## YOUR TASK
Analyze the feedback and determine if the roadmap step needs modification. Return a JSON response:

{
  "needsModification": true/false,
  "reason": "Why you agree or disagree with the feedback",
  "improvedStep": {
    "title": "Improved title (if needed)",
    "desc": "Improved description (if needed)",
    "result": "Improved expected result (if needed)"
  },
  "suggestions": ["Any additional suggestions for the user"]
}
`;

    let aiResponse;
    try {
      const result = await generateWithFallback(prompt);
      aiResponse = result.parsed || { needsModification: false, reason: "Could not parse response" };
    } catch (error) {
      console.error("AI error:", error);
      aiResponse = { needsModification: false, reason: "AI service unavailable. Try again later." };
    }

    if (aiResponse.needsModification) {
      try {
        const activityRef = doc(db, "activities", activityId);
        const activitySnap = await getDoc(activityRef);
        
        if (activitySnap.exists()) {
          const activityData = activitySnap.data();
          const roadmap = activityData.roadmap || [];
          const stepIndex = roadmap.findIndex((s: any, i: number) => `step-${activityId}-${i}` === roadmapStepId || s.title === stepTitle);

          if (stepIndex >= 0) {
            const previousData = JSON.stringify(roadmap[stepIndex]);
            
            const updatedStep = {
              ...roadmap[stepIndex],
              title: aiResponse.improvedStep?.title || roadmap[stepIndex].title,
              desc: aiResponse.improvedStep?.desc || roadmap[stepIndex].desc,
              result: aiResponse.improvedStep?.result || roadmap[stepIndex].result,
            };
            
            roadmap[stepIndex] = updatedStep;

            await addDoc(collection(db, "roadmapVersions"), {
              activityId,
              version: 1,
              roadmapStepId,
              changes: feedback,
              previousData,
              newData: JSON.stringify(updatedStep),
              createdAt: serverTimestamp(),
            });

            await updateDoc(activityRef, {
              roadmap,
              lastModified: serverTimestamp(),
            });
          }
        }
      } catch (updateError) {
        console.error("Error updating activity:", updateError);
      }
    }

    await updateDoc(doc(db, "roadmapFeedback", feedbackRef.id), {
      aiProcessed: true,
      aiResponse: aiResponse,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      feedbackId: feedbackRef.id,
      analysis: aiResponse,
    });
  } catch (error: any) {
    console.error("Feedback processing error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}