// src/services/gemini.ts
import Groq from "groq-sdk";
import { env } from "../config/env";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function generateTravelItinerary(prompt: string, searchData: any) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é o especialista em viagens do je-tour. Use estes dados de hotéis: " + JSON.stringify(searchData).substring(0, 800)
        },
        {
          role: "user",
          content: `Crie um roteiro detalhado para: ${prompt}. Responda em Português com Markdown.`
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "Erro ao gerar roteiro.";
  } catch (error: any) {
    console.error("Erro na Groq:", error.message);
    throw error;
  }
}