// src/config/env.ts
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`❌ Variável de ambiente ausente: ${name}`);
  }
  return value;
}

export const env = {
  GROQ_API_KEY: requiredEnv("GROQ_API_KEY"),
  SERPER_API_KEY: requiredEnv("SERPER_API_KEY"),
};