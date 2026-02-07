// src/services/serper.ts
import { env } from "../config/env";

export async function searchHotels(city: string) {
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": env.SERPER_API_KEY,
    },
    body: JSON.stringify({
      q: `melhores hotéis e preços em ${city} site:trivago.com.br`,
      gl: "br",
      hl: "pt-br",
    }),
  });

  if (!response.ok) throw new Error("Erro no Serper");

  const data = await response.json();
  return data.organic || [];
}