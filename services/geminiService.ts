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

export async function generateFixScriptWithGemini(error: string, solution: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `Based on the following error description and suggested solution, generate a single, concise, and safe-to-execute bash command to fix the issue.

Error: "${error}"
Solution: "${solution}"

Instructions:
- Return ONLY the shell command as plain text.
- Do NOT include any explanations, markdown backticks (\`\`\`), or the word "bash".
- If a single command is not appropriate or the solution is more complex, return a short bash comment starting with '#', like '# Manual fix required' or '# Multiple steps needed'.

Example 1:
Error: "Permission denied on storage/"
Solution: "Ubah permission folder storage/ dan bootstrap/cache/ (e.g., chmod -R 775 storage)."
Output: chmod -R 775 storage/ bootstrap/cache/

Example 2:
Error: "MODULE_NOT_FOUND"
Solution: "Pastikan dependensi terinstall, jalankan \`npm install\`."
Output: npm install

Example 3:
Error: "Hydration failed"
Solution: "Periksa perbedaan antara hasil render di server dan client."
Output: # Manual code inspection required.

Now, generate the command for the provided error and solution.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        // The response text is expected to be the raw command
        return response.text.trim();
    } catch (e) {
        console.error("Error generating fix script with Gemini API:", e);
        return "# Error generating script via AI.";
    }
}