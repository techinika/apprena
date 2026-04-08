import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { userId, contentTitle, contentType, exerciseContent, userAnswer, planId, aiSolution } = await req.json();

    if (!userId || !exerciseContent || !userAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
You are an expert educator grading a student's submission.

## EXERCISE
${exerciseContent}

## STUDENT'S ANSWER
${userAnswer}

${aiSolution ? `## MODEL/IDEAL ANSWER
${aiSolution}` : ""}

## TASK
Grade the student's answer out of 100 based on:
1. Accuracy and correctness
2. Depth of understanding
3. Practical application
4. Clarity and organization

${aiSolution ? `## ADDITIONAL TASK - AI DETECTION
Compare the student's answer with the model answer above. Analyze if the student's answer appears to be AI-generated or heavily AI-assisted. Look for:
- Very similar phrasing or structure to the model answer
- Overly polished language that seems inhuman
- Identical key phrases or terminology
- Perfectly structured responses without natural variation

Provide your assessment in JSON format:
{
  "grade": number (0-100),
  "feedback": "2-3 sentence feedback on the answer",
  "strengths": ["strength 1", "strength 2"],
  "areasToImprove": ["area 1", "area 2"],
  "aiDetected": boolean (true if answer appears AI-generated or heavily AI-assisted),
  "similarity": number (0-100 percentage of similarity to model answer)
}` : `Provide your response in JSON format:
{
  "grade": number (0-100),
  "feedback": "2-3 sentence feedback on the answer",
  "strengths": ["strength 1", "strength 2"],
  "areasToImprove": ["area 1", "area 2"],
  "aiDetected": false,
  "similarity": 0
}`}

Be fair but rigorous. Consider the complexity of the question.
`;

    let result;
    try {
      const aiResult = await generateWithFallback(prompt);
      result = aiResult.parsed || { grade: 70, feedback: "Good attempt!", aiDetected: false, similarity: 0 };
    } catch {
      result = { grade: 70, feedback: "Well done on completing the exercise!", aiDetected: false, similarity: 0 };
    }

    return NextResponse.json({
      grade: result.grade,
      feedback: result.feedback,
      strengths: result.strengths,
      areasToImprove: result.areasToImprove,
      aiDetected: result.aiDetected || false,
      similarity: result.similarity || 0,
    });
  } catch (error: any) {
    console.error("Grade error:", error);
    return NextResponse.json({ error: "Failed to grade exercise" }, { status: 500 });
  }
}