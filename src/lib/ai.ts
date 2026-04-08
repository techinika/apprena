import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export interface AIResponse {
  text: string;
  parsed?: any;
}

export async function generateWithFallback(prompt: string): Promise<AIResponse> {
  const maxRetries = 3;
  const groqModels = ["llama-3.1-8b-instant", "llama-3.3-70b-instruct", "mixtral-8x7b-32768"];
  
  if (groq) {
    for (const modelName of groqModels) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: modelName,
            temperature: 0.3,
          });
          
          const text = result.choices[0]?.message?.content?.trim() || "";
          const parsed = extractJson(text);
          
          if (parsed) {
            return { text, parsed };
          }
        } catch (error: any) {
          console.error(`Groq (${modelName}) attempt ${attempt + 1} failed:`, error?.message || error);
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
        }
      }
    }
  }
  
  if (genAI) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
        });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        const parsed = extractJson(text);
        
        return { text, parsed };
      } catch (error: any) {
        console.error(`Gemini attempt ${attempt + 1} failed:`, error?.message || error);
        
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
  
  throw new Error("No AI provider available");
}

export async function generateText(prompt: string, modelName?: string): Promise<string> {
  const maxRetries = 3;
  const groqModels = modelName ? [modelName] : ["llama-3.1-8b-instant", "llama-3.3-70b-instruct"];
  
  if (groq) {
    for (const gModel of groqModels) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: gModel,
            temperature: 0.3,
          });
          
          return result.choices[0]?.message?.content?.trim() || "";
        } catch (error: any) {
          console.error(`Groq text (${gModel}) attempt ${attempt + 1} failed:`, error?.message || error);
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
        }
      }
    }
  }
  
  if (genAI) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const ai = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: { temperature: 0.3 },
        });
        
        const result = await ai.generateContent(prompt);
        return result.response.text().trim();
      } catch (error: any) {
        console.error(`Gemini text attempt ${attempt + 1} failed:`, error?.message || error);
        
        const isRetryable = error?.message?.includes("503") || 
                          error?.status === 503;
        
        if (isRetryable && attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        
        break;
      }
    }
  }
  
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
  const maxRetries = 3;
  const groqModels = ["llama-3.1-8b-instant", "llama-3.3-70b-instruct", "mixtral-8x7b-32768"];
  
  if (groq) {
    for (const modelName of groqModels) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: modelName,
            temperature: 0.7,
          });
          
          const text = result.choices[0]?.message?.content?.trim() || "";
          const parsed = extractJson(text);
          
          if (parsed) return parsed;
        } catch (error: any) {
          console.error(`Groq JSON (${modelName}) attempt ${attempt + 1} failed:`, error?.message || error);
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
        }
      }
    }
  }
  
  if (genAI) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
        });
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        return JSON.parse(responseText);
      } catch (error: any) {
        console.error(`Gemini JSON attempt ${attempt + 1} failed:`, error?.message || error);
        
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
  
  throw new Error("No AI provider available");
}

export { genAI, groq };