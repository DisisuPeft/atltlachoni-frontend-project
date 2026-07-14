"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CARDS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: "100% Virtual",
    items: ["Clases en vivo vía Zoom", "Sin desplazamientos", "Desde cualquier lugar"],
    color: "#18C62A",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Clases en Vivo",
    items: ["2 sábados al mes", "9:00 a.m. – 2:00 p.m.", "Hora del centro de México"],
    color: "#18A8FF",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "10 Meses",
    items: ["10 módulos progresivos", "2 sesiones de 5 hrs por módulo", "Acompañamiento constante"],
    color: "#6C3DFF",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </svg>
    ),
    title: "Grabaciones 24/7",
    items: ["Todas las sesiones grabadas", "Plataforma CINFA", "Acceso durante todo el diplomado"],
    color: "#18C62A",
  },
];

export function VfxModalidad() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="modalidad-vfx"
      className="py-24 lg:py-32"
      style={{
        background:
          "radial-gradient(circle at 100% 100%, rgba(24,168,255,0.06) 0%, transparent 50%)," +
          "linear-gradient(180deg, #080808 0%, #050505 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#18C62A" }}>
            Modalidad
          </span>
          <h2
            className="mt-4 text-3xl lg:text-4xl font-black uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron, monospace)" }}
          >
            DISEÑADO PARA{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #18A8FF, #6C3DFF)" }}
            >
              TU RITMO
            </span>
          </h2>
          <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: "#A0A0A0" }}>
            Formación de nivel industria con la flexibilidad que necesitas para
            combinarla con tu vida profesional.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="group p-7 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(14,14,14,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${card.color}30`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${card.color}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `${card.color}12`,
                  border: `1px solid ${card.color}20`,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
              <h3
                className="text-base font-black uppercase text-white mb-5"
                style={{ fontFamily: "var(--font-orbitron, monospace)", fontSize: "0.8rem", letterSpacing: "0.05em" }}
              >
                {card.title}
              </h3>
              <ul className="space-y-2.5">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "#A0A0A0" }}>
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: card.color }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}