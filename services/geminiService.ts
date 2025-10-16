
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should not happen in a configured environment
  console.warn("API_KEY is not set. Please set the environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateArchitectResponse = async (moduleName: string): Promise<string> => {
    const prompt = `
        Sebagai seorang arsitek sistem senior, berikan analisa strategis mengapa memulai pengembangan dari modul "${moduleName}" adalah pilihan yang tepat untuk "Sistem Deploy Mandiri SAT18". 
        
        Fokus pada keuntungan jangka panjang, mitigasi risiko, dan bagaimana pilihan ini membangun fondasi yang kokoh untuk modul-modul berikutnya.
        
        Gunakan bahasa yang profesional, jelas, dan memotivasi. Jawab dalam Bahasa Indonesia. Format jawaban dalam beberapa paragraf singkat.
    `;

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};
