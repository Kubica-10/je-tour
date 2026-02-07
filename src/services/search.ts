import { env } from "../config/env";

export async function fetchRealTimeData(destination: string, origin: string) {
  try {
    // 1. Busca Hotéis com foco em ofertas Trivago/Booking
    const hotelSearch = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `melhores ofertas hotéis em ${destination} trivago booking 2026`,
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

    const hotelsData = await hotelSearch.json();
    const routes = await routeSearch.json();

    return {
      // Mapeia os resultados orgânicos para garantir links de reserva
      hotels: hotelsData.organic?.slice(0, 5).map((h: any) => ({
        title: h.title,
        link: h.link
      })) || [],
      routeInfo: routes.answerBox || routes.organic?.[0]?.snippet || "Dados de rota não encontrados",
    };
  } catch (error) {
    console.error("Erro na busca real-time NIC:", error);
    return null;
  }
}