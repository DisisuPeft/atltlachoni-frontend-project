"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MODULOS = [
  {
    num: "01",
    title: "Fundamentos de Composición Digital y Pipeline VFX",
    desc: "Introducción a la industria VFX, pipeline cinematográfico y roles en producción. Primeros pasos en Nuke: interface, flujo nodal y organización profesional de proyectos.",
    color: "#18C62A",
  },
  {
    num: "02",
    title: "Rotoscopía y preparación de material",
    desc: "Rotoscopía avanzada, máscaras complejas, técnicas de paint y cleanup para eliminación de objetos. Genera material limpio y listo para composición.",
    color: "#18A8FF",
  },
  {
    num: "03",
    title: "Keying profesional para cine",
    desc: "Chroma key con calidad cinematográfica, descontaminación de bordes, tratamiento de cabello y semitransparencias. Integración avanzada sobre fondos reales.",
    color: "#6C3DFF",
  },
  {
    num: "04",
    title: "Tracking y Matchmove",
    desc: "Tracking 2D con corner pin, camera tracking 3D y matchmove profesional. Integra gráficos y elementos digitales con precisión espacial sobre cámara real.",
    color: "#18C62A",
  },
  {
    num: "05",
    title: "Integración 3D para VFX",
    desc: "Passes de render y multipass workflow. Combinación de renders CGI con metraje real: integración de objetos 3D con profundidad, atmósfera y coherencia visual.",
    color: "#18A8FF",
  },
  {
    num: "06",
    title: "Iluminación y Color para Composición",
    desc: "Teoría del color aplicada a composición, color matching entre tomas, relighting y look development para lograr integración fotorrealista de elementos digitales.",
    color: "#6C3DFF",
  },
  {
    num: "07",
    title: "Efectos Visuales para Cine y Streaming",
    desc: "Creación de explosiones, humo y partículas. Integración de FX y simulación visual para producir secuencias de acción utilizadas en cine, streaming y publicidad.",
    color: "#18C62A",
  },
  {
    num: "08",
    title: "Composición Avanzada y Secuencias Complejas",
    desc: "Deep compositing, gestión de shots multicapa y optimización de escenas complejas. Domina composiciones de alta complejidad con estándares de estudio profesional.",
    color: "#18A8FF",
  },
  {
    num: "09",
    title: "Producción Profesional y Estándares de Estudio",
    desc: "Nomenclatura de archivos, documentación de pipeline, control de versiones y flujos colaborativos. Protocolos de entrega que exigen los estudios VFX de nivel industria.",
    color: "#6C3DFF",
  },
  {
    num: "10",
    title: "Proyecto Final y Reel Profesional",
    desc: "Desarrollo del shot final con mentoría personalizada, presentación completa y construcción del Demo Reel para postular a estudios y productoras de postproducción.",
    color: "#18C62A",
  },
];

export function VfxPlanEstudios() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="plan-estudios-vfx"
      className="py-24 lg:py-36"
      style={{
        background:
          "radial-gradient(circle at 0% 50%, rgba(24,168,255,0.05) 0%, transparent 50%)," +
          "linear-gradient(180deg, #050505 0%, #080808 50%, #050505 100%)",
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
            Programa académico
          </span>
          <h2
            className="mt-4 text-3xl lg:text-4xl font-black uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron, monospace)" }}
          >
            10 MÓDULOS.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #18C62A, #18A8FF)" }}
            >
              10 MESES.
            </span>
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "#A0A0A0" }}>
            Un recorrido progresivo desde los fundamentos hasta la producción
            profesional de efectos visuales.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(24,198,42,0.3) 10%, rgba(24,168,255,0.3) 90%, transparent 100%)",
            }}
          />

          <div className="space-y-6">
            {MODULOS.map((mod, i) => {
              const isRight = i % 2 === 0;
              return (
                <motion.div
                  key={mod.num}
                  initial={{ opacity: 0, x: isRight ? -24 : 24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className={`relative flex items-start gap-6 ${
                    isRight ? "lg:flex-row" : "lg:flex-row-reverse"
                  } flex-row`}
                >
                  {/* Desktop: spacer for alternating layout */}
                  <div className="hidden lg:block lg:w-1/2" />

                  {/* Node dot */}
                  <div
                    className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 mt-5 z-10"
                    style={{
                      backgroundColor: "#050505",
                      borderColor: mod.color,
                      boxShadow: `0 0 12px ${mod.color}60`,
                    }}
                  />

                  {/* Card — mobile: always right of line; desktop: alternating */}
                  <div className="pl-14 lg:pl-0 lg:w-1/2">
                    <div
                      className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                      style={{
                        background: "rgba(14,14,14,0.75)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${mod.color}30`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${mod.color}10`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="text-2xl font-black shrink-0 leading-none"
                          style={{
                            fontFamily: "var(--font-orbitron, monospace)",
                            color: mod.color,
                            opacity: 0.7,
                          }}
                        >
                          {mod.num}
                        </div>
                        <div>
                          <h3
                            className="text-sm font-bold text-white leading-snug mb-2"
                            style={{ fontFamily: "var(--font-orbitron, monospace)", letterSpacing: "0.02em" }}
                          >
                            {mod.title.toUpperCase()}
                          </h3>
                          <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
                            {mod.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}