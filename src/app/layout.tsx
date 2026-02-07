import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "je-tour | Planejamento Inteligente",
  description: "Roteiros gerados por IA para sua próxima viagem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}