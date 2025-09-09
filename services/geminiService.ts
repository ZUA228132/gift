

import { GoogleGenAI } from "@google/genai";

// Fix: Adhere to Gemini API guidelines.
// API key is sourced directly from environment variables and assumed to be present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function getToyFact(toyName: string): Promise<string> {
  // Fix: Removed redundant API key check to align with guidelines.
  // The try/catch block will handle any API errors, including those from an invalid key.
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tell me a single, short, and surprising fun fact for a kid about a ${toyName}. Keep it to one or two sentences.`,
        config: {
            thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response
        }
    });

    return response.text.trim();
  } catch (error) {
    console.error(`Error fetching fun fact for ${toyName}:`, error);
    throw new Error('Failed to communicate with the Gemini API.');
  }
}
