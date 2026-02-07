// src/services/search.ts
import { env } from "../config/env";

export async function fetchRealTimeData(destination: string, origin: string) {
  try {
    // 1. Busca Hotéis e Preços Reais
    const hotelSearch = await fetch("https://google.serper.dev/shopping", {
      method: "POST",
      headers: {
        "X-API-KEY": env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `hotéis em ${destination} preços reais 2026`,
        gl: "br",
        hl: "pt-br",
      }),
    });

    // 2. Busca Rotas e Distâncias
    const routeSearch = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `distância e tempo de viagem de ${origin} para ${destination} de carro`,
      }),
    });

    const hotels = await hotelSearch.json();
    const routes = await routeSearch.json();

    return {
      hotels: hotels.shopping?.slice(0, 5) || [],
      routeInfo: routes.answerBox || routes.organic?.[0]?.snippet || "Dados de rota não encontrados",
    };
  } catch (error) {
    console.error("Erro na busca real-time:", error);
    return null;
  }
}