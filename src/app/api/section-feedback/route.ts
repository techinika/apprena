import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/db/firebase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface SectionFeedbackRequest {
  userId: string;
  activityId: string;
  sectionType: "learning" | "network" | "habits" | "achievements" | "milestone";
  sectionTitle: string;
  itemId?: string;
  itemTitle?: string;
  feedback: string;
}

export async function POST(req: Request) {
  try {
    const body: SectionFeedbackRequest = await req.json();
    const { userId, activityId, sectionType, sectionTitle, itemId, itemTitle, feedback } = body;

    if (!userId || !activityId || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feedbackRef = await addDoc(collection(db, "sectionFeedback"), {
      userId,
      activityId,
      sectionType,
      sectionTitle,
      itemId,
      itemTitle,
      content: feedback,
      createdAt: serverTimestamp(),
      aiProcessed: false,
    });

    const activityRef = doc(db, "activities", activityId);
    const activitySnap = await getDoc(activityRef);
    
    if (!activitySnap.exists()) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const activityData = activitySnap.data();
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
    });

    const getSectionData = (type: string) => {
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
          return { label: "Section", data: [], currentItem: "Section" };
      }
    };

    const sectionInfo = getSectionData(sectionType);

    const prompt = `
You are a career strategy expert. A user has provided feedback on their roadmap section.

## SECTION DETAILS
- Section Type: ${sectionTitle}
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
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      aiResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : { needsModification: false, reason: "Could not process feedback" };
    } catch (parseError) {
      console.error("AI parse error:", parseError);
      aiResponse = { needsModification: false, reason: "Feedback received but could not process fully" };
    }

    await updateDoc(doc(db, "sectionFeedback", feedbackRef.id), {
      aiProcessed: true,
      aiResponse: aiResponse,
    });

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