"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function scrollToForm() {
  document.getElementById("solicitar-informacion-vfx")?.scrollIntoView({ behavior: "smooth" });
}

export function VfxCtaFinal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-24 lg:py-36 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 50%, rgba(24,198,42,0.12) 0%, transparent 50%)," +
          "radial-gradient(circle at 70% 50%, rgba(24,168,255,0.10) 0%, transparent 50%)," +
          "radial-gradient(circle at 50% 50%, rgba(108,61,255,0.06) 0%, transparent 60%)," +
          "linear-gradient(180deg, #050505 0%, #080808 50%, #050505 100%)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24,198,42,0.03) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(24,198,42,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#18C62A" }}>
            El momento es ahora
          </span>

          <h2
            className="mt-6 font-black uppercase leading-tight text-white"
            style={{
              fontFamily: "var(--font-orbitron, monospace)",
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
            }}
          >
            TU PRÓXIMO CRÉDITO
            <br />
            PUEDE APARECER EN UNA
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #18C62A 0%, #18A8FF 60%, #6C3DFF 100%)" }}
            >
              PRODUCCIÓN INTERNACIONAL
            </span>
          </h2>

          <p className="mt-8 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#A0A0A0" }}>
            Empieza a construir un portafolio competitivo con proyectos reales,
            mentoría especializada y un reel profesional que demuestre tus
            habilidades en composición digital y efectos visuales.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2.5"
              style={{
                background: "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                color: "#050505",
                boxShadow: "0 4px 40px rgba(24,198,42,0.35), 0 0 80px rgba(24,168,255,0.10)",
                fontFamily: "var(--font-orbitron, monospace)",
                letterSpacing: "0.04em",
              }}
            >
              SOLICITAR INFORMACIÓN
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a
              href="https://wa.link/fgv19q"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
              style={{
                color: "#25D366",
                border: "1px solid rgba(37,211,102,0.25)",
                background: "rgba(37,211,102,0.06)",
              }}
            >
              WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {["Sin costo de asesoría", "Respuesta en &lt; 24h", "+50 artistas formados"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm" style={{ color: "#A0A0A070" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#18C62A" }} />
                <span dangerouslySetInnerHTML={{ __html: t }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}