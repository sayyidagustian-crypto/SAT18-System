// FIX: Replace static error patterns with a dynamic call to the Gemini service.
import { analyzeErrorLogWithGemini } from './geminiService';
import type { AnalysisResult } from '../types';

export type { AnalysisResult };

export async function analyzeLog(logContent: string): Promise<AnalysisResult[]> {
  if (!logContent) {
    return [];
  }

  try {
    const results = await analyzeErrorLogWithGemini(logContent);
    return results;
  } catch (error) {
    console.error("Failed to analyze log:", error);
    return [
      {
        match: "Analysis Failed",
        solution: "An unexpected error occurred while analyzing the log. Please check the console for more details.",
        framework: "General",
      },
    ];
  }
}
