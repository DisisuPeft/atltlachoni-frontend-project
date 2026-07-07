"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VALORES = [
  {
    title: "Transformación intelectual",
    description:
      "Cada programa está diseñado para cambiar la forma en que el estudiante piensa, no solo lo que sabe.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Rigor con propósito",
    description:
      "La exigencia académica existe al servicio del impacto real, no como fin en sí mismo.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
      </svg>
    ),
  },
  {
    title: "Articulación institucional",
    description:
      "La fortaleza de CINFA está en la coherencia y la sinergia entre sus institutos.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Compromiso social",
    description:
      "El conocimiento se mide por su capacidad de mejorar comunidades.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: "Criterio propio",
    description:
      "Formamos personas que cuestionan, analizan y deciden con fundamento.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
];

export default function CinfaMision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="mision" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-[#2F7FB1] font-medium text-sm uppercase tracking-wider">
            Nuestra identidad
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
            La educación que reorienta,
            <br />
            no solo informa
          </h2>
          <p className="mt-5 text-gray-500 text-lg leading-relaxed">
            CINFA articula una red de instituciones educativas comprometidas con
            provocar cambios de perspectiva duraderos en cada profesional.
          </p>
        </motion.div>

        {/* Lema destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-12 max-w-2xl mx-auto text-center"
        >
          <blockquote
            className="text-2xl lg:text-3xl font-semibold italic leading-snug"
            style={{ color: "#0F4C75" }}
          >
            &ldquo;Aprende. Transforma.{" "}
            <span className="not-italic font-bold" style={{ color: "#2F7FB1" }}>
              No hay vuelta atrás.
            </span>
            &rdquo;
          </blockquote>
        </motion.div>

        {/* Misión + Visión */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="rounded-2xl p-8 border border-[#2F7FB1]/20"
            style={{ background: "linear-gradient(135deg, #EBF4FB 0%, #F0F8FF 100%)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#0F4C75" }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-[#0F4C75] uppercase tracking-wide text-sm">Misión</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Articular y potenciar una red de instituciones educativas que ofrezcan programas
              de alto rigor académico, capaces de provocar en cada estudiante un cambio de
              perspectiva duradero. CINFA establece los estándares, la visión compartida y
              el respaldo institucional para que sus institutos generen profesionales que
              piensan diferente, actúan con criterio y contribuyen al bienestar de sus comunidades.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="rounded-2xl p-8 border border-[#2F7FB1]/20"
            style={{ background: "linear-gradient(135deg, #EBF4FB 0%, #F0F8FF 100%)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#2F7FB1" }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="font-bold text-[#2F7FB1] uppercase tracking-wide text-sm">Visión</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Consolidarse como la red formativa de referencia en LATAM, reconocida por producir
              egresados cuya manera de comprender su profesión y su entorno ha sido profundamente
              ampliada. CINFA aspira a ser sinónimo de una educación que no solo informa,
              sino que reorienta.
            </p>
          </motion.div>
        </div>

        {/* 5 Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-center"
        >
          <span className="text-[#2F7FB1] font-medium text-sm uppercase tracking-wider">
            Nuestros principios
          </span>
        </motion.div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {VALORES.map((valor, index) => (
            <motion.div
              key={valor.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + index * 0.08, ease: "easeOut" }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2F7FB1]/30 transition-all duration-300 flex flex-col"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-[#2F7FB1]"
                style={{ background: "#EBF4FB" }}>
                {valor.icon}
              </div>
              <h3 className="font-semibold text-[#0F4C75] text-sm leading-snug mb-2">
                {valor.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed flex-1">
                {valor.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}