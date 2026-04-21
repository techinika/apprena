import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface AIResponse {
  text: string;
  parsed?: any;
}

async function tryGroq(prompt: string, temperature: number = 0.3): Promise<any> {
  if (!groq) return null;
  
  const groqModels = ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "llama-3.2-11b-vision-preview"];
  const maxRetries = 3;
  
  for (const modelName of groqModels) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: modelName,
          temperature,
        });
        
        const text = result.choices[0]?.message?.content?.trim() || "";
        const parsed = extractJson(text);
        
        if (parsed) return parsed;
      } catch (error: any) {
        console.error(`Groq (${modelName}) attempt ${attempt + 1} failed:`, error?.message || error);
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }
    }
  }
  return null;
}

async function tryClaude(prompt: string, temperature: number = 0.3): Promise<any> {
  if (!anthropic) return null;
  
  const claudeModels = ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"];
  const maxRetries = 3;
  
  for (const modelName of claudeModels) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await anthropic.messages.create({
          model: modelName,
          max_tokens: 4096,
          temperature,
          messages: [{ role: "user", content: prompt }],
          system: "You are a helpful assistant. Respond with valid JSON only.",
        });
        
        const text = result.content[0].type === "text" 
          ? result.content[0].text.trim() 
          : "";
        
        const parsed = extractJson(text);
        
        if (parsed) return parsed;
      } catch (error: any) {
        console.error(`Claude (${modelName}) attempt ${attempt + 1} failed:`, error?.message || error);
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }
    }
  }
  return null;
}

async function tryGemini(prompt: string, temperature: number = 0.3): Promise<any> {
  if (!genAI) return null;
  
  const geminiModels = ["gemini-1.5-flash-8b", "gemini-1.5-flash", "gemini-2.0-flash"];
  const maxRetries = 3;
  
  for (const modelName of geminiModels) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json", temperature },
        });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        return JSON.parse(text);
      } catch (error: any) {
        console.error(`Gemini (${modelName}) attempt ${attempt + 1} failed:`, error?.message || error);
        
        const isRetryable = error?.message?.includes("503") || 
                          error?.status === 503 ||
                          error?.message?.includes("high demand");
        
        if (isRetryable && attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        
        break;
      }
    }
  }
  return null;
}

async function tryPuter(prompt: string): Promise<any> {
  try {
    const { default: puter } = await import("puterjs");
    
    const ai = puter.ai;
    const completion = await ai.complete(prompt, {
      model: "gpt-4o-mini",
    });
    
    const text = completion?.text?.trim() || completion?.choices?.[0]?.message?.content?.trim() || "";
    
    if (!text) return null;
    
    return extractJson(text);
  } catch (error: any) {
    console.error("Puter.ai failed:", error?.message || error);
    return null;
  }
}

export async function generateWithFallback(prompt: string): Promise<AIResponse> {
  const groqResult = await tryGroq(prompt, 0.3);
  if (groqResult) return { text: JSON.stringify(groqResult), parsed: groqResult };
  
  const claudeResult = await tryClaude(prompt, 0.3);
  if (claudeResult) return { text: JSON.stringify(claudeResult), parsed: claudeResult };
  
  const geminiResult = await tryGemini(prompt, 0.3);
  if (geminiResult) return { text: JSON.stringify(geminiResult), parsed: geminiResult };
  
  const puterResult = await tryPuter(prompt);
  if (puterResult) return { text: JSON.stringify(puterResult), parsed: puterResult };
  
  throw new Error("No AI provider available");
}

export async function generateText(prompt: string, modelName?: string): Promise<string> {
  if (modelName?.startsWith("claude")) {
    const result = await tryClaude(prompt, 0.3);
    if (result) return JSON.stringify(result);
  }
  
  const groqResult = await tryGroq(prompt, 0.3);
  if (groqResult) return JSON.stringify(groqResult);
  
  const claudeResult = await tryClaude(prompt, 0.3);
  if (claudeResult) return JSON.stringify(claudeResult);
  
  const geminiResult = await tryGemini(prompt, 0.3);
  if (geminiResult) return JSON.stringify(geminiResult);
  
  const puterResult = await tryPuter(prompt);
  if (puterResult) return JSON.stringify(puterResult);
  
  throw new Error("No AI provider available");
}

function extractJson(text: string): any {
  if (!text) return null;
  
  const trimmed = text.trim();
  
  try {
    if (trimmed.startsWith('{')) {
      return JSON.parse(trimmed);
    }
    
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    const jsonArrayMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonArrayMatch) {
      return JSON.parse(jsonArrayMatch[0]);
    }
    
    const cleanText = trimmed
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/```/g, '')
      .replace(/^[{[]/g, '')
      .replace(/[}\]]$/g, '');
    
    if (cleanText.includes('{') || cleanText.includes('[')) {
      const tryParse = '{' + cleanText.split('{').slice(1).join('{');
      try { return JSON.parse(tryParse); } catch {}
    }
  } catch (e) {
    console.error("extractJson error:", e);
  }
  return null;
}

export async function generateJsonWithFallback(prompt: string): Promise<any> {
  const groqResult = await tryGroq(prompt, 0.7);
  if (groqResult) return groqResult;
  
  const claudeResult = await tryClaude(prompt, 0.7);
  if (claudeResult) return claudeResult;
  
  const geminiResult = await tryGemini(prompt, 0.7);
  if (geminiResult) return geminiResult;
  
  const puterResult = await tryPuter(prompt);
  if (puterResult) return puterResult;
  
  throw new Error("No AI provider available");
}

export { genAI, groq, anthropic };
