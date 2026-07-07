"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const valores = [
  {
    number: "01",
    title: "Rigor científico",
    description:
      "Conocimiento basado en evidencia y actualización constante. Cada programa IESDA está respaldado por contenido académico de primer nivel.",
  },
  {
    number: "02",
    title: "Ética profesional",
    description:
      "Criterio moral en cada decisión académica y profesional. Formamos personas que actúan con integridad en cualquier contexto.",
  },
  {
    number: "03",
    title: "Humanismo",
    description:
      "Respeto profundo por la dignidad y la vida humana. La persona está siempre en el centro de nuestra propuesta educativa.",
  },
  {
    number: "04",
    title: "Pensamiento crítico",
    description:
      "Reflexión y análisis como base del aprendizaje. Cuestionamos, comprendemos y construimos conocimiento con fundamento.",
  },
  {
    number: "05",
    title: "Empatía",
    description:
      "Sensibilidad hacia las personas y las comunidades. Entender al otro es el primer paso para servir con excelencia.",
  },
  {
    number: "06",
    title: "Excelencia",
    description:
      "Compromiso con el más alto estándar en formación y servicio. No formamos para cumplir; formamos para sobresalir.",
  },
];

export function WhyIesda() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="por-que-iesda"
      className="py-24 lg:py-32"
      style={{ background: "linear-gradient(145deg, #2A2118 0%, #1C1208 50%, #221A10 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(215,162,42,0.7)" }}>
            Nuestra propuesta
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-semibold text-white leading-tight">
            ¿Por qué elegir IESDA?
          </h2>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            IESDA no solo forma profesionales competentes. Forma personas íntegras, empáticas
            y comprometidas con el bienestar de quienes los rodean.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valores.map((valor, index) => (
            <motion.div
              key={valor.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              className="p-7 rounded-2xl border transition-colors hover:border-[#D7A22A]/40"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                borderColor: "rgba(215,162,42,0.15)",
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold shrink-0 leading-none" style={{ color: "rgba(215,162,42,0.3)" }}>
                  {valor.number}
                </span>
                <div>
                  <div className="w-8 h-0.5 mb-4" style={{ background: "#D7A22A" }} />
                  <h3 className="text-base font-semibold text-white mb-2">{valor.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {valor.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}