import { NextResponse } from "next/server";
import { generateJsonWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { name, description, category } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
You are an expert organizational learning and development specialist. Create a reusable roadmap template for team members.

## TEMPLATE DETAILS

### Name: ${name}
### Description: ${description}
### Category: ${category}

## TASK
Create a structured roadmap template with phases that team members can follow. The template should be:
- Clear and actionable
- Suitable for onboarding new team members or upskilling existing ones
- Measurable with clear outcomes

## OUTPUT FORMAT (JSON ONLY)
{
  "name": "Template name",
  "description": "Template description",
  "category": "${category}",
  "roadmap": {
    "steps": [
      { "tag": "Week 1-2", "title": "Phase title", "desc": "What to learn/do", "result": "Expected outcome" }
    ]
  },
  "learningModules": [
    { "course": "Module name", "provider": "Platform", "content": [{ "title": "Content title", "type": "lesson|exercise|quiz", "content": "Content", "duration": "Time estimate" }] }
  ]
}

## RULES
- Create 4-6 phases spanning 8-16 weeks
- Each phase should have clear, achievable outcomes
- Include both learning and practical application
- Be specific to the ${category} domain
- Output ONLY valid JSON
`;

    const aiResponse = await generateJsonWithFallback(prompt);

    if (!aiResponse) {
      throw new Error("Failed to generate template");
    }

    return NextResponse.json({ template: aiResponse });
  } catch (error: any) {
    console.error("Template generation error:", error);
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 });
  }
}