"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useProgramasDestacadosQuery } from "@/redux/features/control-escolar/programasApiSlice";

function solicitarPrograma(ref: string | undefined) {
  if (ref) {
    window.dispatchEvent(
      new CustomEvent("iesda:preselect-programa", { detail: ref }),
    );
  }
  document
    .getElementById("solicitar-informacion-iesda")
    ?.scrollIntoView({ behavior: "smooth" });
}

/* Textura SVG: rejilla académica (libros/columnas) */
const COLUMN_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='80'%3E%3Crect x='10' y='10' width='3' height='60' fill='none' stroke='rgba(215%2C162%2C42%2C0.06)' stroke-width='1'/%3E%3Crect x='25' y='5' width='3' height='70' fill='none' stroke='rgba(215%2C162%2C42%2C0.04)' stroke-width='1'/%3E%3Crect x='40' y='15' width='3' height='50' fill='none' stroke='rgba(215%2C162%2C42%2C0.05)' stroke-width='1'/%3E%3Cline x1='0' y1='75' x2='60' y2='75' stroke='rgba(215%2C162%2C42%2C0.04)' stroke-width='0.5'/%3E%3C/svg%3E")`;

const INTRO_SLIDE = {
  id: "intro",
  subtitle: "Red educativa CINFA · Educación Superior",
  title: "Saber, ser\ny servir.",
  description:
    "En IESDA formamos profesionales con rigor científico, conciencia ética y profundo respeto por la vida humana. El conocimiento al servicio de las personas y las comunidades.",
  imagen_url: null as string | null,
  ref: undefined as string | undefined,
  isIntro: true,
};

type Slide = typeof INTRO_SLIDE;

export default function Hero() {
  const { data: programas = [] } = useProgramasDestacadosQuery({
    limit: 6,
    instituto: 2,
  });

  const slides: Slide[] = [
    INTRO_SLIDE,
    ...programas.map((p, i) => ({
      id: p.ref ?? `programa-${i}`,
      subtitle: "IESDA · Modalidad en línea",
      title: p.nombre,
      description:
        "Programa de educación superior con certificación institucional. Formación que integra rigor académico, ética profesional y sensibilidad humana.",
      imagen_url: p.imagen_url ?? null,
      ref: p.ref,
      isIntro: false,
    })),
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    if (!paused) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, slides.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  };

  const slide = slides[current];

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, #1C1208 0%, #2A1D0A 50%, #1A1410 100%)",
      }}
      aria-label="Presentación IESDA"
    >
      {/* Textura de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: COLUMN_PATTERN, backgroundSize: "60px 80px" }}
      />

      {/* Glow gold top-right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #D7A22A 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Glow warm bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #C4943A 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Línea dorada superior */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #D7A22A 40%, #C4943A 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Spacer header */}
        <div className="h-16 lg:h-20 shrink-0" />

        {/* Slide content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-12 lg:py-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className={`grid gap-12 items-center ${slide.isIntro ? "lg:grid-cols-1 max-w-3xl mx-auto text-center" : "lg:grid-cols-2"}`}
              >
                {/* Text */}
                <div className={slide.isIntro ? "" : ""}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-block text-xs font-medium uppercase tracking-widest mb-5 px-3 py-1 rounded-full border"
                    style={{
                      color: "#D7A22A",
                      borderColor: "rgba(215,162,42,0.35)",
                      background: "rgba(215,162,42,0.08)",
                    }}
                  >
                    {slide.subtitle}
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className={`font-semibold leading-tight text-white whitespace-pre-line ${
                      slide.isIntro
                        ? "text-5xl md:text-6xl lg:text-7xl"
                        : "text-3xl md:text-4xl lg:text-5xl"
                    }`}
                  >
                    {slide.isIntro ? (
                      <>
                        <span>Saber, ser</span>
                        <br />
                        <span style={{ color: "#D7A22A" }}>y servir.</span>
                      </>
                    ) : (
                      slide.title
                    )}
                  </motion.h1>

                  {slide.isIntro && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mt-4 text-lg md:text-xl font-medium italic"
                      style={{ color: "rgba(215,162,42,0.75)" }}
                    >
                      Instituto de Educación Superior y Desarrollo Académico
                    </motion.p>
                  )}

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="mt-6 text-base md:text-lg leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-10 flex flex-wrap gap-4"
                  >
                    <button
                      onClick={() => solicitarPrograma(slide.ref)}
                      className="px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #D7A22A 0%, #C4943A 100%)",
                        color: "#1C1208",
                        boxShadow: "0 4px 24px rgba(215,162,42,0.35)",
                      }}
                    >
                      {slide.isIntro
                        ? "Solicitar información"
                        : "Solicitar este programa"}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                    <a
                      href="#diplomados-iesda"
                      className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all border"
                      style={{
                        color: "rgba(215,162,42,0.85)",
                        borderColor: "rgba(215,162,42,0.3)",
                        background: "rgba(215,162,42,0.06)",
                      }}
                    >
                      Ver oferta académica
                    </a>
                  </motion.div>
                </div>

                {/* Image — solo en slides de programa */}
                {!slide.isIntro && slide.imagen_url && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative"
                  >
                    <div
                      className="aspect-[4/3] rounded-2xl overflow-hidden"
                      style={{
                        border: "1px solid rgba(215,162,42,0.2)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                      }}
                    >
                      <Image
                        src={slide.imagen_url}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        width={640}
                        height={480}
                        priority={current === 1}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(28,18,8,0.3) 0%, transparent 60%)",
                        }}
                      />
                    </div>
                    {/* Badge dorado */}
                    <div
                      className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-xl flex items-center gap-2"
                      style={{
                        background: "#D7A22A",
                        boxShadow: "0 8px 24px rgba(215,162,42,0.4)",
                      }}
                    >
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="#1C1208"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#1C1208" }}
                      >
                        100% en línea · Certificación avalada
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Intro slide: stats decorativos */}
                {slide.isIntro && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-8 mt-6"
                  >
                    {[
                      { value: "Rigor", label: "Científico" },
                      { value: "Ética", label: "Profesional" },
                      { value: "Red", label: "CINFA" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div
                          className="text-2xl font-bold"
                          style={{ color: "#D7A22A" }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className="text-xs mt-1"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Indicadores + navegación */}
        {slides.length > 1 && (
          <div className="pb-10 flex justify-center items-center gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? 28 : 8,
                  height: 8,
                  background:
                    i === current ? "#D7A22A" : "rgba(215,162,42,0.25)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
