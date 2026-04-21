import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/db/firebase";

export async function POST(req: Request) {
  try {
    const { userId, message, context } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userContextPrompt = buildUserContextPrompt(context);
    const chatHistory = await getChatHistory(userId);
    
    const systemPrompt = `You are Apprena AI, a personal career mentor and assistant. You help users with their career development, learning paths, and professional growth.

Your characteristics:
- Be encouraging, supportive, and motivating
- Provide actionable advice based on the user's goals and current situation
- Reference their specific roadmaps and learning progress when relevant
- Keep responses concise but meaningful (2-4 sentences for simple questions, short paragraphs for complex topics)
- Ask clarifying questions when needed
- Suggest next steps when appropriate

${userContextPrompt}

${chatHistory.length > 0 ? `Recent conversation:\n${chatHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\n` : ''}

Current question: ${message}

Provide a helpful, personalized response:`;

    const response = await generateText(systemPrompt);

    await addDoc(collection(db, "chatHistory"), {
      userId,
      messages: [
        { role: "user", content: message, createdAt: new Date().toISOString() },
        { role: "assistant", content: response, createdAt: new Date().toISOString() },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}

function buildUserContextPrompt(context: any): string {
  if (!context) return "No user context available.";

  let prompt = "USER PROFILE:\n";
  
  if (context.displayName) {
    prompt += `- Name: ${context.displayName}\n`;
  }
  if (context.accountType) {
    prompt += `- Account Type: ${context.accountType}\n`;
  }
  if (context.baseCredits !== undefined || context.purchasedCredits !== undefined) {
    const total = (context.baseCredits || 0) + (context.purchasedCredits || 0);
    prompt += `- Credits Available: ${total}\n`;
  }

  prompt += "\nROADMAPS:\n";
  if (context.recentRoadmaps && context.recentRoadmaps.length > 0) {
    context.recentRoadmaps.forEach((r: any, i: number) => {
      prompt += `${i + 1}. ${r.title} - Goal: ${r.goal} (${r.status})\n`;
    });
  } else {
    prompt += "No roadmaps created yet.\n";
  }

  prompt += "\nLEARNING PLANS:\n";
  if (context.recentLearningPlans && context.recentLearningPlans.length > 0) {
    context.recentLearningPlans.forEach((l: any, i: number) => {
      prompt += `${i + 1}. ${l.title} - Target: ${l.target} (${l.progress}% complete)\n`;
    });
  } else {
    prompt += "No learning plans yet.\n";
  }

  if (context.badges && context.badges.length > 0) {
    prompt += "\nACHIEVEMENTS:\n";
    context.badges.forEach((b: any) => {
      prompt += `- ${b.title}\n`;
    });
  }

  return prompt;
}

async function getChatHistory(userId: string): Promise<{ role: string; content: string }[]> {
  try {
    const q = query(
      collection(db, "chatHistory"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0].data();
      return doc.messages || [];
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
  }
  return [];
}
