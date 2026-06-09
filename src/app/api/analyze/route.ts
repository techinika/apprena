import { verifyAuth } from "@/lib/apiAuth";
import { rateLimitMiddleware } from "@/lib/rateLimit";
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
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46];
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

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
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", CLOUDINARY_API_KEY || "");

    const timestamp = Math.round(Date.now() / 1000);
    formData.append("timestamp", String(timestamp));

    const toSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET ? `&upload_preset=apprena_signed` : ""}`;
    const signature = CLOUDINARY_API_SECRET
      ? await generateSignature(toSign, CLOUDINARY_API_SECRET)
      : "";

    if (signature) {
      formData.append("signature", signature);
      formData.append("upload_preset", "apprena_signed");
    } else {
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "apprena_docs",
      );
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return "";
  }
}

async function generateSignature(toSign: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(toSign + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: Request) {
  try {
    const { uid } = await verifyAuth(req);

    const { allowed, remaining, resetAt } = rateLimitMiddleware(req, 5, 60);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before generating another roadmap.",
          retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const assessmentAnswers = formData.get("answers") as string;
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

      const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());
      if (
        header.length < PDF_MAGIC_BYTES.length ||
        !PDF_MAGIC_BYTES.every((b, i) => header[i] === b)
      ) {
        return NextResponse.json(
          { error: `File ${file.name} appears to be corrupted or not a valid PDF.` },
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

    const { CAREER_ANALYSIS_SYSTEM_PROMPT } = await import("@/prompts/career-analysis");
    const prompt = `${CAREER_ANALYSIS_SYSTEM_PROMPT}

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
`;

    let aiResponse;
    try {
      aiResponse = await generateJsonWithFallback(prompt);
    } catch (parseError) {
      console.error("AI JSON parse error:", parseError);
      try {
        const userRef = doc(db, "profiles", uid);
        await updateDoc(userRef, { purchasedCredits: increment(1) });
      } catch (refundError) {
        console.error("Refund failed:", refundError);
      }
      return NextResponse.json(
        { error: "Failed to generate valid roadmap. Please try again." },
        { status: 502 },
      );
    }

    const docRef = await addDoc(collection(db, "activities"), {
      ...aiResponse,
      status: "claimed",
      userId: uid,
      ipAddress: ip,
      createdAt: serverTimestamp(),
      userInput: sanitizedAnswers,
      uploadedDocuments: uploadedDocs,
    });

    await createNotification({
      ...NotificationMessages.roadmapGenerated(aiResponse.title || "Your Career Roadmap"),
      userId: uid,
      link: `/workspace/${docRef.id}`,
    });

    return NextResponse.json(
      { id: docRef.id, ...aiResponse },
      {
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
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
