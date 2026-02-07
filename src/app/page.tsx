"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [realData, setRealData] = useState<any>(null);
  const [mapsLink, setMapsLink] = useState("");
  const [officialSite, setOfficialSite] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!destination || !origin) {
      alert("Por favor, preencha origem e destino.");
      return;
    }
    setLoading(true);
    setItinerary(""); 
    try {
      const res = await fetch("/api/travel", {
        method: "POST",
        body: JSON.stringify({ origin, destination }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) throw new Error("Erro NIC");
      
      const data = await res.json();
      setItinerary(data.itinerary);
      setRealData(data.realTimeData);
      setMapsLink(data.mapsLink);
      setOfficialSite(data.officialSite);
    } catch (e) { 
      alert("Erro de conexão NIC. Verifique suas APIs."); 
    } finally { 
      setLoading(false); 
    }
  };

  const resetTravel = () => {
    setOrigin(""); setDestination(""); setItinerary("");
    setRealData(null); setChatHistory([]); setMapsLink(""); setOfficialSite("");
  };

  const handleChat = async () => {
    if (!chatInput) return;
    const msg = chatInput; setChatInput("");
    try {
      const res = await fetch("/api/travel", {
        method: "POST",
        body: JSON.stringify({ message: msg, origin, destination, history: chatHistory }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setChatHistory([...chatHistory, { role: "user", text: msg }, { role: "ai", text: data.answer }]);
    } catch (e) { console.error(e); }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-16">
          <h1 className="text-8xl font-black italic tracking-tighter mb-4 uppercase">je-tour</h1>
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-[0.5em]">
            Viaje com segurança, pense no seu bolso e conforto
          </p>
        </header>

        {/* Console de Busca NIC */}
        <div className="glass p-3 flex flex-col lg:flex-row gap-4 mb-16 rounded-[2.5rem] border border-white/10 shadow-3xl">
          <input placeholder="Origem" className="flex-1 bg-white/5 p-5 rounded-2xl outline-none" value={origin} onChange={e => setOrigin(e.target.value)} />
          <input placeholder="Destino" className="flex-1 bg-white/5 p-5 rounded-2xl outline-none" value={destination} onChange={e => setDestination(e.target.value)} />
          <div className="flex gap-2">
            <button 
              onClick={handleSearch} 
              disabled={loading} 
              className="flex-[2] bg-blue-600 px-10 py-5 rounded-2xl font-black hover:bg-blue-500 shadow-xl transition-all active:scale-95"
            >
              {loading ? "BUSCANDO..." : "EXPLORAR"}
            </button>
            {itinerary && (
              <button onClick={resetTravel} className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 rounded-2xl font-bold text-[10px] border border-white/10">
                NOVA ROTA
              </button>
            )}
          </div>
        </div>

        {itinerary && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
            <div className="lg:col-span-2 space-y-10">
              
              {/* IMAGEM E AÇÕES */}
              <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-3xl group">
                <img 
                  src={`https://images.unsplash.com/photo-1590424744299-fcc06992991a?auto=format&fit=crop&q=80&w=1200&brazil,travel,city,${destination}`} 
                  alt={destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6">
                  <div>
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter">{destination}</h2>
                    <p className="text-blue-400 font-bold tracking-widest text-[10px] mt-2 mb-4 uppercase">Tecnologia NIC Verified</p>
                    <a href={officialSite} target="_blank" rel="noopener noreferrer" className="bg-blue-600/20 backdrop-blur-md border border-blue-600/50 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 transition-all inline-block">
                      🏛️ Portal de Turismo
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => window.open(`https://wa.me/?text=Veja meu roteiro de gastronomia para ${destination}!`, "_blank")} className="bg-green-600 px-8 py-4 rounded-full font-bold text-[10px] uppercase shadow-xl hover:scale-105 transition-all">Compartilhar 🟢</button>
                    <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-4 rounded-full font-bold text-[10px] uppercase shadow-xl hover:scale-105 transition-all">Ver no Maps 📍</a>
                  </div>
                </div>
              </div>

              {/* Roteiro Markdown */}
              <div className="glass p-12 rounded-[3.5rem] border border-white/5 bg-[#020617]/50">
                <div className="prose prose-invert max-w-none prose-blue mb-16">
                  <ReactMarkdown 
                    components={{
                      a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" />
                    }}
                  >
                    {itinerary}
                  </ReactMarkdown>
                </div>

                {/* Chat Interativo */}
                <div className="pt-10 border-t border-white/10">
                  <div className="space-y-4 mb-6">
                    {chatHistory.map((m, i) => (
                      <div key={i} className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-white/10 ml-12' : 'bg-blue-600/20 mr-12'}`}>{m.text}</div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input className="flex-1 bg-white/5 p-4 rounded-2xl outline-none" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Dúvidas sobre os locais citados?" onKeyDown={e => e.key === 'Enter' && handleChat()} />
                    <button onClick={handleChat} className="bg-white text-black px-10 rounded-2xl font-black text-xs hover:bg-blue-400">CONVERSAR</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar de Ofertas e Gastronomia */}
            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-[3rem] border border-blue-500/30 sticky top-10 space-y-8 bg-[#020617]/80 backdrop-blur-3xl shadow-3xl">
                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">Guia Local</h3>
                
                <div className="p-5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <p className="font-bold text-yellow-500 text-[10px] uppercase mb-2 tracking-widest">🍴 Sabores Locais</p>
                  <p className="text-xs text-slate-400 leading-relaxed italic">Consulte os links no roteiro ao lado para abrir o mapa de cada restaurante.</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ofertas Trivago & Estadia</p>
                  {realData?.hotels?.slice(0, 4).map((h: any, i: number) => (
                    <a 
                      key={i} 
                      href={h.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group block p-4 bg-white/5 rounded-2xl text-[11px] font-bold hover:bg-blue-600/20 border border-white/5 transition-all truncate"
                    >
                      <span className="text-blue-400 group-hover:text-white transition-colors">🏨 {h.title}</span>
                      <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-tighter">Ver melhor preço disponível</p>
                    </a>
                  ))}
                </div>

                {/* BOTÃO DE PATROCINADOR (NIC Standard) */}
                <div className="p-5 bg-gradient-to-r from-blue-900/40 to-transparent rounded-2xl border border-blue-500/30">
                  <p className="text-[9px] font-black text-blue-400 uppercase mb-2 tracking-[0.2em]">⭐ Destaque NIC</p>
                  <p className="text-[11px] font-bold text-white mb-2">Anuncie aqui seu comércio!</p>
                  <button className="w-full bg-white text-black py-2 rounded-lg font-black text-[9px] uppercase">Saiba Mais</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-32 pb-16 flex flex-col items-center gap-6 opacity-60">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-2xl font-black text-lg shadow-2xl transition-transform group-hover:rotate-12">NIC</div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-[0.5em] text-slate-500 uppercase">Innovation Leader</span>
            <span className="text-sm font-bold text-slate-300 italic">NETWORKED INNOVATION COMPANY</span>
          </div>
        </div>
      </footer>
    </main>
  );
}