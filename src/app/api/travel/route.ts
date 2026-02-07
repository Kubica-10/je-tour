import { NextResponse } from "next/server";
import { fetchRealTimeData } from "@/services/search";
import { generateTravelItinerary } from "@/services/gemini";

export async function POST(req: Request) {
  try {
    const { destination, origin, message, history = [] } = await req.json();

    // Lógica de Saudação em Tempo Real (NIC Standard)
    const hour = new Date().getHours();
    const saudacao = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    // --- LÓGICA DE CONVERSA (CHAT) ---
    if (message) {
      const chatPrompt = `
        Você é o Guia da NIC para o je-tour. O roteiro de ${origin} para ${destination} já foi gerado acima.
        Sua saudação atual é: ${saudacao}.
        
        REGRAS DE RETÓRICA (CRÍTICO):
        1. Se o usuário disser "obrigado", "valeu" ou agradecer, responda APENAS com uma cortesia curta, desejando boa viagem e se despedindo elegantemente.
        2. Se o usuário fizer uma pergunta (ex: "quais cuidados"), responda de forma direta e em tópicos. 
        3. NUNCA gere um novo roteiro completo nem repita a distância/tempo de viagem se não for perguntado.
        4. Mantenha a conversa fluida, como um assistente humano.

        PERGUNTA DO USUÁRIO: "${message}"
      `;
      const response = await generateTravelItinerary(chatPrompt, history);
      return NextResponse.json({ answer: response });
    }

    // --- LÓGICA DE GERAÇÃO INICIAL DO ROTEIRO ---
    const realTimeData = await fetchRealTimeData(destination, origin);
    
    // Links Seguros e Universais
    const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    const officialSite = `https://www.google.com/search?q=portal+turismo+prefeitura+${encodeURIComponent(destination)}`;

    const prompt = `
      Crie um roteiro de 3 dias de ${origin} para ${destination}.
      DADOS REAIS: ${JSON.stringify(realTimeData)}
      
      ESTRUTURA OBRIGATÓRIA:
      1. Saudação inicial (${saudacao}) e motivação para a viagem.
      2. Logística: Distância e custos estimados (Gasolina R$ 6,00/L + pedágios).
      3. Roteiro Dia a Dia: Para cada local, inclua o link: [📍 Ver no Mapa](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}+Nome+do+Local)
      4. 'Sabores da Terra': Polos gastronômicos e pratos típicos.
      5. 'Você Sabia?': Primeiro nome da cidade e curiosidades históricas.
      6. 'Filhos Ilustres': Personagens famosos nascidos em ${destination}.
    `;

    const itinerary = await generateTravelItinerary(prompt, realTimeData);
    
    return NextResponse.json({ 
      itinerary, 
      realTimeData, 
      mapsLink, 
      officialSite 
    });
  } catch (error: any) {
    console.error("Erro na Rota NIC:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}