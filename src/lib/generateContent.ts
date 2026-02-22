import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { PROMPT } from "@/lib/aiPrompt";

export interface KeywordData {
  title: string;
  pageUrl: string;
  category: string;
  definition: string;
  explanation: string;
  diagram: string | null;
  useCases: string[];
  relatedTerms: string[];
}

export async function generateKeywordContent(
  keyword: string,
  extract: string,
  pageUrl: string,
): Promise<KeywordData> {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY });
  const stream = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Keyword: ${keyword}\nSummary: ${extract ?? ""}` }],
      },
    ],
    config: {
      systemInstruction: PROMPT,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });

  let rawJson = "";
  for await (const chunk of stream) rawJson += chunk.text ?? "";

  try {
    return { title: keyword, pageUrl, ...JSON.parse(rawJson) };
  } catch {
    return {
      title: keyword,
      pageUrl,
      category: "",
      definition: rawJson.slice(0, 100),
      explanation: rawJson,
      diagram: null,
      useCases: [],
      relatedTerms: [],
    };
  }
}
