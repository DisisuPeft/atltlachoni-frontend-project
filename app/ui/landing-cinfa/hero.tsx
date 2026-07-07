"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function scrollToForm() {
  document.getElementById("solicitar-informacion")?.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero/hero-img-section.webp"
          alt="Profesionales estudiando en línea"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3A5A]/92 via-[#0F4C75]/82 to-[#2F7FB1]/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block bg-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-7 border border-white/25 backdrop-blur-sm">
              Centro Internacional de Formación Académica
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.5rem] font-semibold text-white leading-tight"
          >
            Diplomados en línea para profesionales que quieren seguir creciendo
          </motion.h1>

          {/* Lema */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: "easeOut" }}
            className="mt-5 text-xl md:text-2xl font-medium italic text-white/90"
          >
            Aprende. Transforma.{" "}
            <span className="not-italic font-bold text-white">No hay vuelta atrás.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="mt-4 text-base md:text-lg text-white/75 max-w-xl leading-relaxed"
          >
            Programas de alto rigor académico, modalidad 100% en línea y docentes
            con experiencia real. Formación que cambia cómo piensas, no solo lo que sabes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#diplomados"
              className="bg-white text-[#0F4C75] px-8 py-4 rounded-lg text-base font-semibold hover:bg-white/95 transition-colors text-center shadow-lg"
            >
              Ver diplomados
            </a>
            <button
              onClick={scrollToForm}
              className="border-2 border-white/50 text-white px-8 py-4 rounded-lg text-base font-medium hover:bg-white/10 transition-colors text-center backdrop-blur-sm"
            >
              Solicitar información
            </button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="mt-14 flex flex-wrap gap-6 text-white/70 text-sm"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-white/60 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              +100 profesionales inscritos
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-white/60 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Modalidad 100% en línea
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-white/60 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Certificación con validez institucional
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
