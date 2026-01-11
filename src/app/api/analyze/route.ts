/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";
import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { verifyAndDeductCredit } from "@/db/operations/CreditCheck";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const assessmentAnswers = formData.get("answers") as string;
    const userId = formData.get("userId") as string;
    const ip = req.headers.get("x-forwarded-for") || "anonymous";

    // let combinedPdfText = "";
    // for (const file of files) {
    //   // const parser = new PDFParse({ url: file?.webkitRelativePath });
    //   const result = await parser.getText();

    //   combinedPdfText += result + "\n";
    // }

    if (userId) {
      const verification = await verifyAndDeductCredit(userId);
      if (!verification.allowed) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 403 }
        );
      }
    }

    // const ipLimitRef = doc(db, "rate_limits", ip.replace(/\./g, "_"));
    // const ipSnap = await getDoc(ipLimitRef);
    // const ipData = ipSnap.data();

    // if (ipData && ipData.count >= 2) {
    //   return NextResponse.json(
    //     { error: "Free limit reached. Please log in to continue." },
    //     { status: 429 }
    //   );
    // }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = `
      You are a world-class Career Strategist and Executive Coach. 
      Your goal is to take a user's current reality and map a clear, jargon-free path to their "North Star" goal.

      CONTEXT:
      - User Answers: ${assessmentAnswers}
      - Resume/Document Data: ${files}

      TASK:
      1. Analyze the gap between current skills and the target goal.
      2. Generate a high-performance execution plan.
      3. Create a URL-friendly slug based on the generated title.
      4. Avoid corporate jargon (e.g., instead of "synergize," use "work together"). Use simple, powerful language.

      OUTPUT FORMAT (JSON ONLY):
      {
        "title": "A bold, inspiring title for the path", //keep this title short 1-3 words are enough
        "slug": "url-friendly-version-of-title",
        "confidenceScore": number (how realistic the goal is based on current data),
        "roadmap": [
          { "tag": "Timeline (e.g. Month 1)", "title": "Phase Name", "desc": "Actionable steps", "result": "Measurable outcome" }
        ], // this roadmap should be ad detailed as possible with easy to understand steps, small steps, whether its too many or too few steps, provide it, just be clear enough and be reasonable.
        "mermaidChart": "A valid Mermaid.js graph TD string connecting the roadmap phases, this should be a sophisticated chart, easy to understand covering the path to follow, with explanations of each steps, risk that might be involved, and other steps that might come in the middle. It does not have to be just line to line",
        "learningGaps": {
          "technical": [{ "skill": "Skill Name", "priority": "High" | "Medium", "progress": number (0-100) }],
          "soft": ["Specific behavior or mindset shift"]
        },
        "curriculum": [{ "course": "Course Name", "provider": "Platform", "url": "Link" }],
        "habits": [{ "title": "Daily/Weekly Habit", "desc": "How it helps", "icon": "Emoji" }],
        "network": [{ "name": "Persona Title", "role": "Industry Role", "type": "Mentor|Peer|Gatekeeper", "reason": "Why connect?" }],
        "networkReason: string; // explain why you suggest certain network and the gap in the current network. example: Based on your current ecosystem ..., your roadmap requires a strategic shift. You should prioritize connecting with ... to bridge the gap to your goal.
        "achievements": [
          { "time": "Short/Medium/Long term", "title": "Milestone Name", "achievement": "Specific description" }
        ] // show the person the potential that lies in following the path we laid, and what they can achieve; keep titles simple, no fancy words.
      }

      RULES:
      - Mermaid code must be clean. Example: graph TD\n  A[Start] --> B[Phase 1]
      - Be brutally honest but encouraging. 
      - If data is missing, suggest the most logical step based on industry standards.
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text());

    // if (ipSnap.exists()) {
    //   await updateDoc(ipLimitRef, { count: increment(1) });
    // } else {
    //   await setDoc(ipLimitRef, { count: 1, firstUsed: serverTimestamp() });
    // }

    const docRef = await addDoc(collection(db, "activities"), {
      ...aiResponse,
      status: userId ? "claimed" : "unclaimed",
      userId: userId || null,
      ipAddress: ip,
      createdAt: serverTimestamp(),
      userInput: JSON.parse(assessmentAnswers),
    });

    return NextResponse.json({
      id: docRef.id,
      ...aiResponse,
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
