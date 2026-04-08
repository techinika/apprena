import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { verifyAndDeductCredit } from "@/db/operations/CreditCheck";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GenerateCurriculumRequest {
  userId: string;
  planId?: string;
  roadmapData: {
    title: string;
    goal: string;
    skills?: string;
    blocks?: string;
    ecosystem?: string;
    learningGaps?: {
      technical: { skill: string; priority: string }[];
      soft: string[];
    };
  };
  targetSkill: string;
}

export async function POST(req: Request) {
  try {
    const body: GenerateCurriculumRequest = await req.json();
    const { userId, roadmapData, targetSkill, planId } = body;

    if (!userId || !roadmapData || !targetSkill) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const verification = await verifyAndDeductCredit(userId);
    if (!verification.allowed) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const technicalSkills = roadmapData.learningGaps?.technical
      ?.map((s) => s.skill)
      .join(", ") || targetSkill;
    
    const softSkills = roadmapData.learningGaps?.soft?.join(", ") || "";

    const prompt = `
You are an expert curriculum designer and educator. Create a comprehensive, self-paced learning path for someone trying to master "${targetSkill}".

## CONTEXT

### User's Goal
${roadmapData.goal}

### User's Current Skills
${roadmapData.skills || "Not specified"}

### User's Obstacles
${roadmapData.blocks || "Not specified"}

### User's Social Circle
${roadmapData.ecosystem || "Not specified"}

### Skills to Learn
- Technical: ${technicalSkills}
- Soft Skills: ${softSkills}

## YOUR TASK

Create a detailed curriculum with learning modules. Each module should have:
1. A course/topic title
2. Internal learning content (lessons, readings, exercises)
3. The content should be comprehensive enough for self-study

## OUTPUT FORMAT (JSON ONLY)

{
  "title": "Mastering ${targetSkill}: A Complete Guide",
  "modules": [
    {
      "course": "Module title",
      "provider": "Apprena AI",
      "isGenerated": true,
      "content": [
        {
          "id": "lesson-1",
          "title": "Lesson/Reading/Exercise/Quiz title",
          "type": "lesson|reading|exercise|quiz",
          "content": "Content here - keep each content piece to 100-300 words max. Be concise and practical. For exercises, make sure to include a clear question or problem statement.",
          "duration": "10-20 min",
          "aiSolution": "ONLY include this field for exercises. Provide the ideal/model answer that a student should produce. This will be used to grade and compare against the student's answer. Write a thorough, step-by-step solution that demonstrates mastery of the concepts."
        }
      ]
    }
  ]
}

## RULES
- Create 5-6 modules covering the skill from basics to advanced
- Each module should have 2-3 content pieces (NOT 3-5)
- Keep each content piece SHORT (100-300 words max) to avoid JSON parsing issues
- Include a mix of lessons, readings, exercises, and quizzes
- For EXERCISES ONLY: Include an "aiSolution" field with a model answer (100-300 words)
- Make content practical and applicable to real scenarios
- Output ONLY valid JSON - do not include any markdown code blocks or extra text
`;

    let aiResponse;
    try {
      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      
      responseText = responseText.trim();
      
      const extractJson = (text: string): any => {
        const cleanText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .replace(/\\n/g, ' ')
          .replace(/\\r/g, '')
          .replace(/\\t/g, ' ')
          .replace(/\\\\/g, '\\')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        
        try {
          return JSON.parse(cleanText);
        } catch {
          const match = cleanText.match(/\{[\s\S]*\}/);
          if (match) {
            try {
              return JSON.parse(match[0]);
            } catch {}
          }
          
          const lines = cleanText.split('\n').filter(l => l.trim());
          let obj: any = {};
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (typeof parsed === 'object') {
                obj = { ...obj, ...parsed };
              }
            } catch {}
          }
          if (Object.keys(obj).length > 0) return obj;
          
          throw new Error('Could not parse JSON');
        }
      };
      
      aiResponse = extractJson(responseText);
    } catch (parseError) {
      console.error("AI JSON parse error:", parseError);
      try {
        const userRef = doc(db, "profiles", userId);
        await updateDoc(userRef, { purchasedCredits: increment(1) });
      } catch (refundError) {
        console.error("Refund failed:", refundError);
      }
      return NextResponse.json(
        { error: "Failed to generate curriculum. Please try again." },
        { status: 502 }
      );
    }

    if (!aiResponse || !aiResponse.modules || !Array.isArray(aiResponse.modules)) {
      return NextResponse.json(
        { error: "Invalid curriculum format. Please try again." },
        { status: 502 }
      );
    }

    const modules = aiResponse.modules.slice(0, 6).map((m: any, idx: number) => ({
      ...m,
      id: `module-${Date.now()}-${idx}`,
      status: "not_started",
      content: m.content?.map((c: any, cidx: number) => ({
        ...c,
        id: `content-${Date.now()}-${idx}-${cidx}`,
        completed: false,
        usedAiForAnswer: false,
      })),
    }));

    if (planId) {
      const planRef = doc(db, "learningPlans", planId);
      await updateDoc(planRef, {
        modules: modules,
        isGenerated: true,
        lastUpdated: serverTimestamp(),
      });
      return NextResponse.json({ success: true, planId, modules });
    } else {
      const docRef = await addDoc(collection(db, "learningPlans"), {
        userId,
        title: aiResponse.title || `Mastering ${targetSkill}`,
        target: roadmapData.goal,
        modules,
        isGenerated: true,
        isActive: true,
        roadmapData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });
      return NextResponse.json({ success: true, planId: docRef.id, modules });
    }
  } catch (error: any) {
    console.error("Generate Curriculum Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}