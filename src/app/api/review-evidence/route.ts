import { NextResponse } from "next/server";
import { generateJsonWithFallback, genAI } from "@/lib/ai";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";

interface EvidenceReviewRequest {
  userId: string;
  activityId: string;
  milestoneId: string;
  evidenceUrl: string;
  evidenceType: "image" | "document" | "text";
  description: string;
  context: {
    milestoneTitle: string;
    milestoneDescription: string;
    roadmapGoal: string;
    stepDetails?: string;
  };
}

export async function POST(req: Request) {
  try {
    const body: EvidenceReviewRequest = await req.json();
    const { userId, activityId, milestoneId, evidenceUrl, evidenceType, description, context } = body;

    if (!userId || !activityId || !milestoneId || !evidenceUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let evidenceAnalysis = "";
    
    if (evidenceType === "image" && genAI) {
      try {
        const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const imagePart = { inlineData: { data: evidenceUrl.replace(/^data:image\/[^;]+;base64,/, ""), mimeType: "image/jpeg" } };
        const imageResult = await visionModel.generateContent([
          `Analyze this image as evidence for completing the milestone: "${context.milestoneTitle}". 
           Description provided: "${description}"
           
           Does this image demonstrate progress toward the goal: "${context.roadmapGoal}"?
           What specific elements show achievement or progress?`,
          imagePart,
        ]);
        evidenceAnalysis = imageResult.response.text();
      } catch (visionError) {
        console.error("Vision API error:", visionError);
        evidenceAnalysis = "Image analysis unavailable. Please provide additional context.";
      }
    }

    const prompt = `
You are an expert career coach and mentor. Your role is to review evidence submitted by a user who is following a career roadmap.

## CONTEXT

### Milestone Details
- Title: ${context.milestoneTitle}
- Description: ${context.milestoneDescription}
- User's Goal: ${context.roadmapGoal}
${context.stepDetails ? `- Step Details: ${context.stepDetails}` : ""}

### Evidence Description
${description}

${evidenceType === "image" ? `### Image Analysis\n${evidenceAnalysis}` : ""}

## YOUR TASK

Review this evidence and provide constructive feedback. Evaluate:
1. Does this evidence demonstrate meaningful progress?
2. Is it relevant to the milestone and overall goal?
3. What is done well?
4. What can be improved?
5. What specific suggestions can help the user succeed?

## OUTPUT FORMAT (JSON ONLY)
{
  "rating": number (1-10),
  "feedback": "Overall feedback summary (2-3 sentences)",
  "suggestions": ["Specific actionable suggestion 1", "Specific actionable suggestion 2", "Specific actionable suggestion 3"],
  "strengths": ["What the user did well 1", "What the user did well 2"],
  "needsImprovement": ["Area to improve 1", "Area to improve 2"],
  "status": "approved" | "needs_work"
}

Be encouraging but honest. Focus on helping the user grow.
`;

    let aiResponse;
    try {
      aiResponse = await generateJsonWithFallback(prompt);
    } catch (parseError) {
      console.error("AI parse error:", parseError);
      return NextResponse.json({ error: "Failed to analyze evidence. Please try again." }, { status: 502 });
    }

    const evidenceRef = await addDoc(collection(db, "evidence"), {
      userId,
      activityId,
      milestoneId,
      type: evidenceType,
      url: evidenceUrl,
      description,
      uploadedAt: serverTimestamp(),
      aiReview: {
        ...aiResponse,
        reviewedAt: serverTimestamp(),
      },
    });

    const activityRef = doc(db, "activities", activityId);
    const activitySnap = await getDoc(activityRef);
    
    if (activitySnap.exists()) {
      const activityData = activitySnap.data();
      const milestones = activityData.milestones || [];
      const milestoneIndex = milestones.findIndex((m: any) => m.id === milestoneId);
      
      if (milestoneIndex >= 0) {
        milestones[milestoneIndex].status = aiResponse.status === "approved" ? "completed" : "needs_revision";
        if (milestones[milestoneIndex].evidence) {
          milestones[milestoneIndex].evidence.push({
            id: evidenceRef.id,
            type: evidenceType,
            url: evidenceUrl,
            description,
            uploadedAt: new Date().toISOString(),
            aiReview: { ...aiResponse, reviewedAt: new Date().toISOString() },
          });
        } else {
          milestones[milestoneIndex].evidence = [{
            id: evidenceRef.id,
            type: evidenceType,
            url: evidenceUrl,
            description,
            uploadedAt: new Date().toISOString(),
            aiReview: { ...aiResponse, reviewedAt: new Date().toISOString() },
          }];
        }
        
        if (aiResponse.status === "approved") {
          milestones[milestoneIndex].completedAt = serverTimestamp();
        }
        
        await updateDoc(activityRef, { milestones });
      }
    }

    return NextResponse.json({
      success: true,
      evidenceId: evidenceRef.id,
      feedback: aiResponse,
    });
  } catch (error: any) {
    console.error("Evidence Review Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}