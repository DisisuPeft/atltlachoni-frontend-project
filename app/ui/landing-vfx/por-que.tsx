"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTerm } from "./term-context";

const STATS = [
  { value: "10", label: "Módulos especializados" },
  { value: "100+", label: "Horas de práctica real" },
  { value: "1", label: "Reel profesional al egreso" },
  { value: "∞", label: "Acceso a grabaciones" },
];

export function VfxPorQue() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const term = useTerm();

  return (
    <section
      id="por-que-vfx"
      className="py-24 lg:py-36"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#18C62A" }}
            >
              ¿Por qué estudiar este {term.toLowerCase()}?
            </span>
            <h2
              className="mt-4 text-3xl lg:text-4xl font-black uppercase leading-tight text-white"
              style={{ fontFamily: "var(--font-orbitron, monospace)" }}
            >
              LA INDUSTRIA NECESITA
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #18C62A, #18A8FF)" }}
              >
                ARTISTAS REALES
              </span>
            </h2>
            <p className="mt-6 text-base lg:text-lg leading-relaxed" style={{ color: "#A0A0A0" }}>
              La industria audiovisual demanda artistas capaces de integrar efectos
              visuales con estándares profesionales. Este {term.toLowerCase()} te guía desde los
              fundamentos hasta la producción de secuencias complejas mediante una
              metodología práctica basada en flujos reales de trabajo utilizados en
              estudios de VFX.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#A0A0A0" }}>
              No aprenderás teoría aislada. Cada módulo replica el pipeline de una
              producción real: desde el ingreso del material crudo hasta la entrega
              final con estándares de cine y streaming.
            </p>
            <div className="mt-8 w-16 h-px" style={{ background: "linear-gradient(90deg, #18C62A, transparent)" }} />
          </motion.div>

          {/* Right: stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(20,20,20,0.75)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: i === 0 ? "0 0 30px rgba(24,198,42,0.08)" : "none",
                }}
              >
                <div
                  className="text-4xl font-black"
                  style={{
                    fontFamily: "var(--font-orbitron, monospace)",
                    backgroundImage: "linear-gradient(135deg, #18C62A, #18A8FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-sm leading-snug" style={{ color: "#A0A0A0" }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}