import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IESDA — Saber, ser y servir | Instituto de Educación Superior y Desarrollo Académico",
  description:
    "IESDA forma profesionales con rigor científico, ética y humanismo. Diplomados especializados en línea con certificación institucional avalada por la red CINFA. Descubre nuestra oferta académica.",
  keywords: [
    "IESDA",
    "Instituto de Educación Superior y Desarrollo Académico",
    "diplomados en línea",
    "educación superior",
    "formación profesional",
    "ética profesional",
    "rigor científico",
    "CINFA",
    "certificación institucional",
  ],
  openGraph: {
    title: "IESDA — Saber, ser y servir",
    description:
      "Formación profesional con rigor científico, ética y humanismo. Diplomados en línea con certificación institucional.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}