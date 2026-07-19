import type { Metadata } from "next";
import { Poppins, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/provider";
import Setup from "./utils/auth/setup";
import AlertSystem from "./utils/alert/alert";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CINFA | Diplomados en línea para profesionales de la salud",
  description:
    "Especialízate con programas en línea diseñados para profesionales de la salud. Formación flexible, docentes expertos y acompañamiento académico personalizado.",
  keywords:
    "diplomados en línea, formación médica, salud, enfermería, CINFA, THALES, IESDA, nutrición ginecológica, enfermería nefrológica, urgencias pediátricas",
  openGraph: {
    title: "CINFA | Diplomados en línea para profesionales de la salud",
    description:
      "Especialízate con programas en línea diseñados para profesionales de la salud. Formación flexible, docentes expertos y acompañamiento académico personalizado.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${sourceSans.variable}`}>
      <body className="antialiased">
        <Provider>
          <Setup />
          <Analytics />
          <AlertSystem />
          {children}
        </Provider>
      </body>
    </html>
  );
}
