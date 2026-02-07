import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("=== Modelos Disponíveis para sua Chave ===");
    models.models.forEach((m) => {
      console.log(`- Nome: ${m.name} | Suporta: ${m.supportedGenerationMethods}`);
    });
  } catch (error) {
    console.error("❌ Erro ao listar modelos:", error.message);
  }
}

listModels();