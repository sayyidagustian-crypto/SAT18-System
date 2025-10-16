// FIX: Add new file to handle Gemini API interactions.
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

// As per guidelines, API key is sourced from process.env.API_KEY
// The environment should be pre-configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeErrorLogWithGemini(logContent: string): Promise<AnalysisResult[]> {
    const model = 'gemini-2.5-flash';
    const prompt = `Analyze the following build or deployment log to identify errors. For each error found, provide a concise solution and categorize the framework or technology involved (e.g., Node.js, React, Laravel, Docker, General).

Log content:
---
${logContent}
---

Provide the analysis in a JSON array format. Each object in the array should have the following structure:
{
  "match": "A brief description or snippet of the error found",
  "solution": "A clear, actionable suggestion to fix the error",
  "framework": "The relevant framework (Node.js, React, Laravel, Docker, General)"
}

If no errors are found, return an empty array.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            match: {
                                type: Type.STRING,
                                description: "A brief description or snippet of the error found"
                            },
                            solution: {
                                type: Type.STRING,
                                description: "A clear, actionable suggestion to fix the error"
                            },
                            framework: {
                                type: Type.STRING,
                                description: "The relevant framework (Node.js, React, Laravel, Docker, General)"
                            }
                        },
                        required: ["match", "solution", "framework"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        // Handle cases where the model might return an empty string for no errors
        if (!jsonText) {
            return [];
        }
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error analyzing log with Gemini API:", error);
        // Return a user-friendly error message that fits the AnalysisResult interface
        return [
            {
                match: "API Error",
                solution: "Could not analyze the log due to an issue with the AI service. Please try again later.",
                framework: "General"
            }
        ];
    }
}
