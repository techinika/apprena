import { NextResponse } from "next/server";
import { db } from "@/db/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { generateJsonWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { activityId, section } = await req.json();

    if (!activityId || !section) {
      return NextResponse.json({ error: "Missing activityId or section" }, { status: 400 });
    }

    const activityRef = doc(db, "activities", activityId);
    const activitySnap = await getDoc(activityRef);

    if (!activitySnap.exists()) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const activity = activitySnap.data();
    let prompt = "";
    let updateField = "";

    switch (section) {
      case "curriculum":
        prompt = `
Create a learning curriculum for: ${activity.title}

Goal: ${activity.userInput?.goal || "Professional growth"}
Current: ${activity.userInput?.current || "Not specified"}

Generate a JSON array of courses with this structure:
[
  { "course": "Course name", "provider": "Platform name", "url": "https://...", "duration": "4 weeks", "level": "Beginner/Intermediate/Advanced" }
]

Return ONLY a valid JSON array.
`.trim();
        updateField = "curriculum";
        break;

      case "habits":
        prompt = `
Create actionable habits for: ${activity.title}

Goal: ${activity.userInput?.goal || "Professional growth"}

Generate JSON with this structure:
{
  "habits": [
    { "id": "h1", "title": "Habit name", "desc": "Why it matters", "icon": "💪", "frequency": "daily" }
  ]
}

Return ONLY valid JSON.
`.trim();
        updateField = "habits";
        break;

      case "network":
        prompt = `
Create networking recommendations for: ${activity.title}

Goal: ${activity.userInput?.goal || "Professional growth"}

Generate JSON with this structure:
{
  "network": [
    { "id": "n1", "type": "mentor", "name": "Role/Title", "action": "What to do", "platform": "LinkedIn" }
  ],
  "networkReason": "Why networking matters for this goal"
}

Return ONLY valid JSON.
`.trim();
        updateField = "network";
        break;

      case "achievements":
        prompt = `
Create achievement milestones for: ${activity.title}

Goal: ${activity.userInput?.goal || "Professional growth"}

Generate JSON with this structure:
{
  "achievements": [
    { "id": "a1", "title": "Achievement name", "description": "What to achieve", "type": "skill|certification|project", "status": "pending" }
  ]
}

Return ONLY valid JSON.
`.trim();
        updateField = "achievements";
        break;

      case "learningGaps":
        prompt = `
Analyze learning gaps for: ${activity.title}

Goal: ${activity.userInput?.goal || "Professional growth"}
Current: ${activity.userInput?.current || "Not specified"}

Generate JSON with this structure:
{
  "learningGaps": {
    "technical": [
      { "skill": "Skill name", "priority": "High|Medium|Low", "progress": 0 }
    ],
    "soft": ["Communication", "Leadership"]
  }
}

Return ONLY valid JSON.
`.trim();
        updateField = "learningGaps";
        break;

      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const result = await generateJsonWithFallback(prompt);

    if (!result) {
      return NextResponse.json({ error: "Failed to generate content" }, { status: 502 });
    }

    const updateData: Record<string, any> = {
      [updateField]: result[updateField] || result,
      lastUpdated: serverTimestamp(),
    };

    const allSections = {
      curriculum: activity.curriculum,
      habits: activity.habits,
      network: activity.network,
      achievements: activity.achievements,
      learningGaps: activity.learningGaps,
      [updateField]: result[updateField] || result,
    };

    let filledSections = 0;
    const totalSections = 6;

    if (allSections.curriculum && allSections.curriculum.length > 0) filledSections++;
    if (allSections.habits && allSections.habits.length > 0) filledSections++;
    if (allSections.network && allSections.network.length > 0) filledSections++;
    if (allSections.achievements && allSections.achievements.length > 0) filledSections++;
    if (allSections.learningGaps && (allSections.learningGaps.technical?.length > 0 || allSections.learningGaps.soft?.length > 0)) filledSections++;
    if (activity.roadmap && activity.roadmap.length > 0) filledSections++;

    const newConfidenceScore = Math.round((filledSections / totalSections) * 100);
    updateData.confidenceScore = newConfidenceScore;

    await updateDoc(activityRef, updateData);

    return NextResponse.json({ success: true, data: result, confidenceScore: newConfidenceScore });
  } catch (error: any) {
    console.error("Generate section error:", error);
    return NextResponse.json({ error: "Failed to generate section" }, { status: 500 });
  }
}