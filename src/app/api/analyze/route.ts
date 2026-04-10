import { db } from "@/db/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { createNotification, NotificationMessages } from "@/lib/notificationUtils";

const ALLOWED_FILE_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface AssessmentAnswers {
  current?: string;
  goal?: string;
  skills?: string;
  blocks?: string;
  ecosystem?: string;
}

function validateAssessmentAnswers(answers: string): AssessmentAnswers | null {
  try {
    const parsed = JSON.parse(answers);
    if (!parsed.goal || typeof parsed.goal !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function sanitizeString(str: string, maxLength = 2000): string {
  return str.slice(0, maxLength).replace(/[<>]/g, "");
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  try {
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "apprena_docs",
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.log(error);
    return "";
  }
}

async function parsePDFWithAI(pdfText: string): Promise<string> {
  const { generateText } = await import("@/lib/ai");

  const prompt = `
You are a professional resume and document analyzer. Extract and summarize the following document content, focusing on:
1. Key skills and competencies
2. Work experience and titles
3. Education and certifications
4. Notable achievements or metrics

Document content:
${pdfText.slice(0, 15000)}

Provide a structured summary in plain text format.
`;

  return await generateText(prompt);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const assessmentAnswers = formData.get("answers") as string;
    const userId = formData.get("userId") as string;
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";

    const parsedAnswers = validateAssessmentAnswers(assessmentAnswers);
    if (!parsedAnswers) {
      return NextResponse.json(
        { error: "Invalid assessment data. Please provide a valid goal." },
        { status: 400 },
      );
    }

    const uploadedDocs: {
      name: string;
      url: string;
      extractedText?: string;
    }[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 5MB limit` },
          { status: 400 },
        );
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File ${file.name} type not allowed. Use PDF only.` },
          { status: 400 },
        );
      }

      const cloudinaryUrl = await uploadToCloudinary(file);
      uploadedDocs.push({ name: file.name, url: cloudinaryUrl });
    }

    const { generateJsonWithFallback } = await import("@/lib/ai");

    const sanitizedAnswers = {
      current: sanitizeString(parsedAnswers.current || ""),
      goal: sanitizeString(parsedAnswers.goal || ""),
      skills: sanitizeString(parsedAnswers.skills || ""),
      blocks: sanitizeString(parsedAnswers.blocks || ""),
      ecosystem: sanitizeString(parsedAnswers.ecosystem || ""),
    };

    const documentsInfo =
      uploadedDocs.length > 0
        ? uploadedDocs
            .map((d) => `Document: ${d.name} (URL: ${d.url})`)
            .join("\n")
        : "No documents provided";

    const prompt = `
You are a world-class Career Strategist and Executive Coach with 20+ years of experience helping professionals achieve their "North Star" goals. Your approach combines strategic thinking with practical, actionable steps.

## YOUR ROLE
Analyze the user's current reality and create a comprehensive, jargon-free roadmap to their dream role.

## USER'S INPUT

### Current Reality
${sanitizedAnswers.current}

### The North Star (Goal)
${sanitizedAnswers.goal}

### Skills Inventory
${sanitizedAnswers.skills}

### Obstacles
${sanitizedAnswers.blocks}

### Social Circle
${sanitizedAnswers.ecosystem}

### Documents
${documentsInfo}

## YOUR TASK
Create a detailed, personalized career transformation plan that:

1. **Analyzes the Gap** - Compare current skills/experience with target role requirements
2. **Maps the Path** - Create a phased roadmap with clear milestones
3. **Identifies Learning Gaps** - Technical skills and soft skills needed
4. **Suggests Curriculum** - Specific courses with links
5. **Proposes Habits** - Daily/weekly actions for transformation
6. **Recommends Network** - Who to connect with and why
7. **Sets Achievements** - Measurable milestones to celebrate

## OUTPUT FORMAT (JSON ONLY - No other text)
{
  "title": "Short 2-4 word title for this path",
  "slug": "url-friendly-version-of-title",
  "confidenceScore": number (0-100 based on realism of goal),
  "roadmap": [
    { "tag": "Phase timeline (e.g. Month 1-2)", "title": "Phase name", "desc": "Detailed actionable steps", "result": "Measurable outcome" }
  ],
  "mermaidChart": "Valid Mermaid.js graph TD showing the journey with decision points and milestones",
  "learningGaps": {
    "technical": [{ "skill": "Specific skill name", "priority": "High|Medium", "progress": number (0-100) }],
    "soft": ["Specific behavior or mindset shift needed"]
  },
  "curriculum": [{ "course": "Course name", "provider": "Platform", "url": "Course link" }],
  "habits": [{ "title": "Habit name", "desc": "Why it matters", "icon": "Emoji" }],
  "network": [{ "name": "Persona type", "role": "Industry role", "type": "Mentor|Peer|Gatekeeper", "reason": "Why connect" }],
  "networkReason": "Overall strategy for network building",
  "achievements": [
    { "time": "Short|Medium|Long term", "title": "Milestone", "achievement": "Specific outcome" }
  ],
  "milestones": [
    { "id": "milestone-1", "type": "learning", "title": "Milestone title", "description": "What to achieve", "status": "pending" },
    { "id": "milestone-2", "type": "network", "title": "Milestone title", "description": "What to achieve", "status": "pending" },
    { "id": "milestone-3", "type": "habit", "title": "Milestone title", "description": "What to achieve", "status": "pending" }
  ]
}

## RULES
- Use simple, powerful language (no corporate jargon)
- Mermaid code must be valid and clean
- Be honest but encouraging about feasibility
- If data is sparse, make reasonable assumptions based on industry standards
- Focus on practical, not theoretical, steps
`;

    let aiResponse;
    try {
      aiResponse = await generateJsonWithFallback(prompt);
    } catch (parseError) {
      console.error("AI JSON parse error:", parseError);
      if (userId) {
        try {
          const userRef = doc(db, "profiles", userId);
          await updateDoc(userRef, { purchasedCredits: increment(1) });
        } catch (refundError) {
          console.error("Refund failed:", refundError);
        }
      }
      return NextResponse.json(
        { error: "Failed to generate valid roadmap. Please try again." },
        { status: 502 },
      );
    }

    const docRef = await addDoc(collection(db, "activities"), {
      ...aiResponse,
      status: userId ? "claimed" : "unclaimed",
      userId: userId || null,
      ipAddress: ip,
      createdAt: serverTimestamp(),
      userInput: sanitizedAnswers,
      uploadedDocuments: uploadedDocs,
    });

    if (userId) {
      await createNotification({
        ...NotificationMessages.roadmapGenerated(aiResponse.title || "Your Career Roadmap"),
        userId,
        link: `/workspace/${docRef.id}`,
      });
    }

    return NextResponse.json({
      id: docRef.id,
      ...aiResponse,
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);

    const isOverloaded =
      error.message?.includes("503") ||
      error.message?.includes("overloaded") ||
      error.message?.includes("429");

    return NextResponse.json(
      {
        error: isOverloaded
          ? "The Apprena AI is currently busy. Please try again in a few seconds."
          : "An unexpected error occurred. Please try again.",
      },
      { status: isOverloaded ? 503 : 500 },
    );
  }
}
