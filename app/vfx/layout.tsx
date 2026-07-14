import type { Metadata } from "next";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Composición Digital y VFX | CINFA — Diplomado Profesional",
  description:
    "Domina el pipeline profesional de composición digital y efectos visuales. Aprende con un artista con créditos en Hollywood. 10 meses, 100% virtual, reel profesional al egreso.",
  keywords: [
    "composición digital",
    "VFX",
    "efectos visuales",
    "diplomado VFX",
    "compositing",
    "Nuke",
    "DaVinci Resolve",
    "keying",
    "matchmove",
    "postproducción",
    "CINFA",
    "diplomado en línea",
    "pipeline VFX",
    "reel profesional",
    "CGI",
  ],
  openGraph: {
    title: "Composición Digital y VFX | CINFA",
    description:
      "Domina el pipeline de efectos visuales con un artista con experiencia en producciones de Hollywood. Diplomado profesional, 100% virtual.",
    type: "website",
  },
};

export default function VfxLayout({ children }: { children: React.ReactNode }) {
  return <div className={orbitron.variable}>{children}</div>;
}