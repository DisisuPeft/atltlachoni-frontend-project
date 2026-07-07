"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VALORES = [
  {
    title: "Rigor científico",
    description: "Conocimiento basado en evidencia y actualización constante. La formación en IESDA no admite medias verdades.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Ética profesional",
    description: "Criterio moral en cada decisión académica y clínica. La excelencia no existe sin integridad.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    title: "Humanismo",
    description: "Respeto profundo por la dignidad y la vida humana. La persona, siempre en el centro de la formación.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Pensamiento crítico",
    description: "Reflexión y análisis como base del aprendizaje. Formamos profesionales que cuestionan y comprenden antes de actuar.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Empatía",
    description: "Sensibilidad hacia las personas y las comunidades. Comprender al otro es el primer paso para servir bien.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Excelencia",
    description: "Compromiso con el más alto estándar en formación y servicio. No formamos para cumplir; formamos para destacar.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export default function IesdaIdentidad() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="identidad-iesda"
      className="py-24 lg:py-32"
      style={{ background: "linear-gradient(135deg, #FDF8F0 0%, #FEFCF7 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>

        {/* Lema */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-8"
            style={{ color: "#D7A22A", background: "rgba(215,162,42,0.10)", border: "1px solid rgba(215,162,42,0.25)" }}>
            Identidad institucional
          </span>

          <blockquote className="text-3xl lg:text-4xl xl:text-5xl font-semibold leading-snug"
            style={{ color: "#2A2118" }}>
            &ldquo;Saber,{" "}
            <span className="italic" style={{ color: "#D7A22A" }}>ser</span>{" "}
            y{" "}
            <span className="italic font-bold" style={{ color: "#C4943A" }}>servir.</span>&rdquo;
          </blockquote>

          <div className="mt-6 w-20 h-0.5 mx-auto" style={{ background: "linear-gradient(90deg, #D7A22A, #C4943A)" }} />

          <p className="mt-6 text-lg leading-relaxed" style={{ color: "#7D8EA3" }}>
            Tres pilares que definen la esencia de IESDA: el rigor del conocimiento, la integridad del ser
            y el compromiso de servir a quienes más lo necesitan.
          </p>
        </motion.div>

        {/* Misión + Visión */}
        <div className="mt-20 grid lg:grid-cols-2 gap-8">
          {[
            {
              label: "Misión",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              content: "Ofrecer programas y diplomados de educación superior que promuevan una formación integral basada en el rigor científico, la ética profesional y el respeto por la vida humana. IESDA busca fortalecer las competencias académicas, clínicas y humanas de los estudiantes, brindando espacios de aprendizaje que fomenten la empatía, el pensamiento crítico y la excelencia en el servicio.",
            },
            {
              label: "Visión",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
              content: "Consolidarse como un instituto referente en la formación académica y humanista, reconocido por preparar profesionales capaces de actuar con conocimientos sólidos, criterio ético y sensibilidad hacia las necesidades de la comunidad. IESDA aspira a ser un centro formativo que contribuya al fortalecimiento de la red CINFA y al desarrollo de comunidades más sanas, informadas y humanas.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: "easeOut" }}
              className="bg-white rounded-2xl p-8 lg:p-10 border"
              style={{ borderColor: "rgba(215,162,42,0.15)", boxShadow: "0 4px 24px rgba(42,33,24,0.06)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(215,162,42,0.12)", color: "#D7A22A" }}>
                  {item.icon}
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#D7A22A" }}>
                  {item.label}
                </span>
              </div>
              <div className="w-10 h-0.5 mb-5" style={{ background: "#D7A22A" }} />
              <p className="text-base leading-relaxed" style={{ color: "#3A3A3A" }}>
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <span className="text-sm font-medium uppercase tracking-wider" style={{ color: "#7D8EA3" }}>
            Nuestros valores
          </span>
          <h3 className="mt-2 text-2xl font-semibold" style={{ color: "#2A2118" }}>
            Los principios que guían la formación
          </h3>
        </motion.div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALORES.map((valor, index) => (
            <motion.div
              key={valor.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.07, ease: "easeOut" }}
              className="group bg-white rounded-2xl p-7 border hover:border-[#D7A22A]/40 transition-colors"
              style={{ borderColor: "rgba(215,162,42,0.12)", boxShadow: "0 2px 12px rgba(42,33,24,0.04)" }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                style={{ background: "rgba(215,162,42,0.10)", color: "#D7A22A" }}>
                {valor.icon}
              </div>
              <div className="w-8 h-0.5 mb-4" style={{ background: "#D7A22A" }} />
              <h4 className="text-base font-semibold mb-2" style={{ color: "#2A2118" }}>{valor.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#7D8EA3" }}>{valor.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}