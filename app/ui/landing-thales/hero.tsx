"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useProgramasDestacadosQuery } from "@/redux/features/control-escolar/programasApiSlice";

function solicitarPrograma(ref: string | undefined) {
  if (ref) {
    window.dispatchEvent(new CustomEvent("thales:preselect-programa", { detail: ref }));
  }
  document.getElementById("solicitar-informacion-thales")?.scrollIntoView({ behavior: "smooth" });
}

/* Textura SVG: rejilla de triángulos (metáfora del prisma) */
const PRISM_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpolygon points='40,4 76,68 4,68' fill='none' stroke='rgba(31%2C186%2C196%2C0.07)' stroke-width='1'/%3E%3Cpolygon points='40,20 64,62 16,62' fill='none' stroke='rgba(244%2C180%2C0%2C0.05)' stroke-width='0.5'/%3E%3C/svg%3E")`;

const BLOBS = [
  /* intro */
  [
    { color: "#1FBAC4", size: 420, top: "-10%", right: "-5%", opacity: 0.18 },
    { color: "#F4B400", size: 280, bottom: "5%", left: "15%", opacity: 0.10 },
    { color: "#F78C1F", size: 200, top: "30%", right: "30%", opacity: 0.07 },
  ],
  /* program slides — turquesa dominant */
  [
    { color: "#1FBAC4", size: 500, top: "-15%", right: "-10%", opacity: 0.20 },
    { color: "#1E3A5F", size: 320, bottom: "0", left: "-5%", opacity: 0.30 },
    { color: "#F4B400", size: 180, top: "50%", right: "20%", opacity: 0.10 },
  ],
];

const INTRO_SLIDE = {
  id: "intro",
  subtitle: "Centro Internacional de Formación Académica",
  title: "Conecta saberes,\ntransforma realidades",
  description:
    "En el Instituto Thales unimos ciencia, arte y humanidades para formar mentes críticas, creativas y conscientes del mundo que habitan.",
  imagen_url: null as string | null,
  ref: undefined as string | undefined,
  isIntro: true,
};

type Slide = typeof INTRO_SLIDE;

export default function Hero() {
  const { data: programas = [] } = useProgramasDestacadosQuery({ limit: 6, instituto: 1 });

  const slides: Slide[] = [
    INTRO_SLIDE,
    ...programas.map((p) => ({
      id: String(p.id),
      subtitle: "Instituto Thales · Modalidad en línea",
      title: p.nombre,
      description:
        "Programa multidisciplinario con certificación institucional. Desarrolla competencias que conectan conocimiento con aplicación real.",
      imagen_url: p.imagen_url ?? null,
      ref: p.ref,
      isIntro: false,
    })),
  ];

  const [current, setCurrent] = useState(0);
  const hovering = useRef(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      if (!hovering.current) setCurrent((p) => (p + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const goTo = (i: number) => setCurrent(i);
  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  const slide = slides[current] ?? INTRO_SLIDE;
  const blobSet = BLOBS[slide.isIntro ? 0 : 1];

  return (
    <div
      className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center text-white overflow-hidden"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* ── Base: gradiente oscuro + textura de triángulos ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, #0d2240 0%, #1E3A5F 55%, #1a4e72 100%)",
          backgroundImage: PRISM_PATTERN,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Blobs de color (cambian por slide) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blobs-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
        >
          {blobSet.map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-[100px]"
              style={{
                width: b.size,
                height: b.size,
                background: b.color,
                opacity: b.opacity,
                top: "top" in b ? b.top : undefined,
                bottom: "bottom" in b ? b.bottom : undefined,
                left: "left" in b ? b.left : undefined,
                right: "right" in b ? b.right : undefined,
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Líneas de refracción decorativas (prisma) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-0 right-0 h-full opacity-[0.06]"
          viewBox="0 0 400 900"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          <line x1="380" y1="0" x2="0" y2="900" stroke="#1FBAC4" strokeWidth="1" />
          <line x1="340" y1="0" x2="60" y2="900" stroke="#F4B400" strokeWidth="0.8" />
          <line x1="300" y1="0" x2="120" y2="900" stroke="#F78C1F" strokeWidth="0.6" />
          <line x1="260" y1="0" x2="180" y2="900" stroke="#28A745" strokeWidth="0.5" />
          <line x1="220" y1="0" x2="220" y2="900" stroke="#1FBAC4" strokeWidth="0.4" />
        </svg>
      </div>

      {/* ── Contenido ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10">

          {/* Texto */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
              className="lg:col-span-6"
            >
              <span
                className="inline-block text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-6"
                style={{
                  background: "rgba(31,186,196,0.15)",
                  color: "#1FBAC4",
                  border: "1px solid rgba(31,186,196,0.3)",
                }}
              >
                {slide.subtitle}
              </span>

              <h1 className="font-bold leading-tight mb-5 text-[clamp(1.9rem,5vw,3.8rem)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {slide.title.split("\n").map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>

              <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {slide.isIntro ? (
                  <>
                    <a
                      href="#oferta-diplomados"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #F4B400 0%, #F78C1F 100%)",
                        color: "#1E3A5F",
                        boxShadow: "0 4px 24px rgba(244,180,0,0.35)",
                      }}
                    >
                      Explorar oferta educativa
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <button
                      onClick={() => solicitarPrograma(undefined)}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all hover:scale-105"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "#fff",
                      }}
                    >
                      Solicitar información
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => solicitarPrograma(slide.ref)}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #F4B400 0%, #F78C1F 100%)",
                        color: "#1E3A5F",
                        boxShadow: "0 4px 24px rgba(244,180,0,0.35)",
                      }}
                    >
                      Solicitar información
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    <a
                      href="#oferta-diplomados"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all hover:scale-105"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "#fff",
                      }}
                    >
                      Ver todos los programas
                    </a>
                  </>
                )}
              </div>

              {slide.isIntro && (
                <div className="mt-10 flex flex-wrap gap-5 text-white/55 text-sm">
                  {["Modalidad 100% en línea", "Certificación institucional", "+100 profesionales inscritos"].map((t) => (
                    <span key={t} className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#1FBAC4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Imagen del programa (panel derecho) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              {!slide.isIntro && slide.imagen_url ? (
                <motion.div
                  key={`img-${slide.id}`}
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: "1px solid rgba(31,186,196,0.25)" }}
                >
                  <Image
                    src={slide.imagen_url}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/60 to-transparent" />
                  {/* Badge "En línea" */}
                  <span
                    className="absolute bottom-4 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(31,186,196,0.85)",
                      color: "#fff",
                    }}
                  >
                    100% en línea · Instituto Thales
                  </span>
                </motion.div>
              ) : slide.isIntro ? (
                /* Prisma decorativo en slide intro */
                <motion.div
                  key="prism-deco"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 300 340"
                    fill="none"
                    className="w-64 lg:w-80 drop-shadow-2xl"
                  >
                    {/* Prisma principal */}
                    <polygon
                      points="150,20 280,300 20,300"
                      fill="none"
                      stroke="rgba(31,186,196,0.5)"
                      strokeWidth="2"
                    />
                    {/* Refracción turquesa */}
                    <polygon
                      points="150,20 280,300 220,300"
                      fill="rgba(31,186,196,0.12)"
                      stroke="none"
                    />
                    {/* Refracción dorada */}
                    <polygon
                      points="150,20 220,300 180,300"
                      fill="rgba(244,180,0,0.12)"
                      stroke="none"
                    />
                    {/* Refracción naranja */}
                    <polygon
                      points="150,20 180,300 140,300"
                      fill="rgba(247,140,31,0.10)"
                      stroke="none"
                    />
                    {/* Refracción verde */}
                    <polygon
                      points="150,20 140,300 100,300"
                      fill="rgba(40,167,69,0.09)"
                      stroke="none"
                    />
                    {/* Refracción azul oscuro */}
                    <polygon
                      points="150,20 100,300 20,300"
                      fill="rgba(255,255,255,0.04)"
                      stroke="none"
                    />
                    {/* Rayos de luz saliendo */}
                    <line x1="280" y1="300" x2="320" y2="260" stroke="#1FBAC4" strokeWidth="1.5" strokeOpacity="0.6" />
                    <line x1="250" y1="300" x2="310" y2="290" stroke="#F4B400" strokeWidth="1.5" strokeOpacity="0.5" />
                    <line x1="220" y1="300" x2="300" y2="320" stroke="#F78C1F" strokeWidth="1.2" strokeOpacity="0.45" />
                    <line x1="190" y1="300" x2="280" y2="340" stroke="#28A745" strokeWidth="1" strokeOpacity="0.4" />
                    {/* Punto de incidencia */}
                    <circle cx="150" cy="20" r="4" fill="#1FBAC4" fillOpacity="0.8" />
                    <circle cx="150" cy="20" r="8" fill="none" stroke="#1FBAC4" strokeOpacity="0.3" strokeWidth="1" />
                  </svg>
                  {/* Lema flotante */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                  >
                    <p className="text-xs text-white/50 italic px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(31,186,196,0.08)", border: "1px solid rgba(31,186,196,0.15)" }}>
                      "La luz del conocimiento en infinitos colores"
                    </p>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Controles del slider */}
        {slides.length > 1 && (
          <div className="mt-12 flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="h-9 w-9 rounded-full grid place-items-center transition hover:bg-white/15"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              ‹
            </button>
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir al slide ${i + 1}`}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === current ? "24px" : "8px",
                    background: i === current ? "#1FBAC4" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="h-9 w-9 rounded-full grid place-items-center transition hover:bg-white/15"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full flex justify-center pt-2"
          style={{ border: "2px solid rgba(31,186,196,0.35)" }}
        >
          <div className="w-1.5 h-3 rounded-full" style={{ background: "rgba(31,186,196,0.55)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
}