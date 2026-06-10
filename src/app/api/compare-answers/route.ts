import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";
import { generateWithFallback } from "@/lib/ai";

interface Exercise {
  exerciseId: string;
  title: string;
  userAnswer: string;
  aiSolution: string;
}

export async function POST(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const { exercises } = await req.json();

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ error: "No exercises provided" }, { status: 400 });
    }

    let comparisons: any[] = [];
    let aiDetectedCount = 0;

    const prompt = `
You are an AI detection system. Analyze each student's answer by comparing it to the corresponding model answer.

## Exercises
${JSON.stringify(exercises.map((e: Exercise) => ({
  id: e.exerciseId,
  title: e.title,
  modelAnswer: e.aiSolution,
  studentAnswer: e.userAnswer
})))}

For each exercise, determine:
1. Similarity percentage (0-100) between the student's answer and the model answer
2. Whether the student's answer appears to be AI-generated or heavily AI-assisted (true if similarity > 70 OR if the writing style appears AI-generated)
3. A brief reason for your assessment

Respond with a JSON array ONLY:
[
  {
    "exerciseId": "the-exercise-id",
    "similarity": number (0-100),
    "aiDetected": boolean,
    "reason": "brief explanation"
  }
]
`;

    try {
      const result = await generateWithFallback(prompt);
      const parsedArray = result.parsed;

      if (Array.isArray(parsedArray)) {
        comparisons = exercises.map((exercise: Exercise) => {
          const match = parsedArray.find((item: any) => item.exerciseId === exercise.exerciseId);
          const similarity = match?.similarity ?? 0;
          const aiDetected = match?.aiDetected ?? false;
          if (aiDetected) aiDetectedCount++;
          return {
            exerciseId: exercise.exerciseId,
            title: exercise.title,
            userAnswer: exercise.userAnswer,
            aiSolution: exercise.aiSolution,
            similarity,
            aiDetected,
            reason: match?.reason || "Analysis complete",
          };
        });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Comparison error:", error);
      comparisons = exercises.map((exercise: Exercise) => ({
        exerciseId: exercise.exerciseId,
        title: exercise.title,
        userAnswer: exercise.userAnswer,
        aiSolution: exercise.aiSolution,
        similarity: 0,
        aiDetected: false,
        reason: "Analysis failed",
      }));
    }

    return NextResponse.json({
      comparisons,
      aiDetectedCount,
      finalPenalty: aiDetectedCount * 10,
    });
  } catch (error: any) {
    console.error("Compare answers error:", error);
    return NextResponse.json({ error: "Failed to compare answers" }, { status: 500 });
  }
}
