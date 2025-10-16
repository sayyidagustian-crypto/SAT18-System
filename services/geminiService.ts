import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should not happen in a configured environment
  console.warn("API_KEY is not set. Please set the environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAiResponse = async (topic: string, context: 'module_choice' | 'next_step' | 'simulation_choice' | 'ux_choice' | 'implementation_choice'): Promise<string> => {
    let prompt = '';

    if (context === 'module_choice') {
        prompt = `
            Sebagai seorang arsitek sistem senior, berikan analisa strategis mengapa memulai pengembangan dari modul "${topic}" adalah pilihan yang tepat untuk "Sistem Deploy Mandiri SAT18". 
            
            Fokus pada keuntungan jangka panjang, mitigasi risiko, dan bagaimana pilihan ini membangun fondasi yang kokoh untuk modul-modul berikutnya.
            
            Gunakan bahasa yang profesional, jelas, dan memotivasi. Jawab dalam Bahasa Indonesia. Format jawaban dalam beberapa paragraf singkat.
        `;
    } else if (context === 'next_step') {
        prompt = `
            Sebagai seorang arsitek sistem senior yang sedang merancang Core Engine untuk "Sistem Deploy Mandiri SAT18", berikan analisa strategis mengapa memilih langkah berikutnya: "${topic}".

            Konteks: Kita baru saja mendefinisikan Build Engine dan Error Analyzer. Pilihan selanjutnya adalah antara membuat alur integrasi sederhana atau memperkaya Error Analyzer.

            Jelaskan keuntungan dari pilihan "${topic}" dalam hal momentum pengembangan, validasi konsep, dan kemudahan iterasi.

            Gunakan bahasa yang profesional, jelas, dan meyakinkan. Jawab dalam Bahasa Indonesia. Format jawaban dalam beberapa paragraf singkat.
        `;
    } else if (context === 'simulation_choice') {
        prompt = `
            Sebagai seorang arsitek sistem senior yang sedang merancang alur integrasi untuk Core Engine, berikan analisa strategis mengapa memilih langkah berikutnya: "${topic}".

            Konteks: Kita baru saja merancang skrip 'deploy-local.js' yang mengintegrasikan Build Engine dan Error Analyzer. Pilihan selanjutnya adalah antara melakukan simulasi konseptual terhadap pipeline ini atau langsung memperkaya Error Analyzer dengan lebih banyak pola error.

            Jelaskan keuntungan dari pilihan "${topic}" dalam hal validasi alur kerja, pengalaman pengguna (UX), dan mitigasi risiko.

            Gunakan bahasa yang profesional, jelas, dan meyakinkan, seolah-olah Anda sedang memberikan saran kepada rekan arsitek. Jawab dalam Bahasa Indonesia. Format jawaban dalam beberapa paragraf singkat.
        `;
    } else if (context === 'ux_choice') {
        prompt = `
            Sebagai seorang arsitek sistem dan ahli UI/UX, berikan analisa strategis mengapa memilih langkah berikutnya: "${topic}".

            Konteks: Kita baru saja melakukan simulasi pipeline dan melihat potensi untuk menyempurnakan output terminalnya. Pilihan selanjutnya adalah antara menyempurnakan UX output tersebut atau langsung memperluas fungsionalitas Error Analyzer.

            Jelaskan keuntungan dari pilihan "${topic}" dari sudut pandang "Clarity Before Complexity" (Kejelasan Sebelum Kerumitan), kepercayaan pengguna, dan membangun fondasi yang solid untuk fitur-fitur masa depan.

            Gunakan bahasa yang profesional, jelas, dan meyakinkan, dengan fokus pada prinsip-prinsip desain pengalaman pengguna (UX) untuk alat developer. Jawab dalam Bahasa Indonesia. Format jawaban dalam beberapa paragagraf singkat.
        `;
    } else if (context === 'implementation_choice') {
        prompt = `
            Sebagai seorang arsitek software berpengalaman, berikan analisa strategis mengapa memilih langkah implementasi: "${topic}".

            Konteks: Kita akan mengimplementasikan format output terminal yang baru dan lebih rapi. Pilihan selanjutnya adalah antara membuat helper 'logger.js' yang terpisah atau langsung menulis ulang logika di 'deploy-local.js'.

            Jelaskan keuntungan dari pilihan "${topic}" dari sudut pandang prinsip-prinsip software engineering seperti Single Responsibility Principle (SRP), Don't Repeat Yourself (DRY), skalabilitas, dan kemudahan maintenance.

            Gunakan bahasa yang profesional, jelas, dan teknis, seolah-olah Anda sedang membimbing seorang junior developer tentang praktik coding terbaik. Jawab dalam Bahasa Indonesia. Format jawaban dalam beberapa paragraf singkat.
        `;
    }


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