"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTerm } from "./term-context";

const VFX_BG = "/assets/vfx/Vector Smart Object (Double CLick to Edit).webp";

function scrollToForm() {
  document
    .getElementById("solicitar-informacion-vfx")
    ?.scrollIntoView({ behavior: "smooth" });
}

/* Pre-generated particle data — fixed values to avoid hydration mismatch */
const PARTICLES = [
  { id: 0, x: 8, y: 14, s: 2, d: 0, t: 14, c: "#18C62A" },
  { id: 1, x: 93, y: 28, s: 1.5, d: 1.5, t: 11, c: "#18A8FF" },
  { id: 2, x: 47, y: 85, s: 1, d: 3, t: 16, c: "#18C62A" },
  { id: 3, x: 78, y: 55, s: 2.5, d: 0.5, t: 12, c: "#18A8FF" },
  { id: 4, x: 23, y: 72, s: 1.5, d: 2, t: 18, c: "#18C62A" },
  { id: 5, x: 61, y: 18, s: 1, d: 4, t: 13, c: "#6C3DFF" },
  { id: 6, x: 15, y: 45, s: 2, d: 1, t: 15, c: "#18A8FF" },
  { id: 7, x: 88, y: 68, s: 1.5, d: 2.5, t: 10, c: "#18C62A" },
  { id: 8, x: 35, y: 30, s: 1, d: 3.5, t: 17, c: "#18A8FF" },
  { id: 9, x: 72, y: 90, s: 2, d: 0.8, t: 13, c: "#18C62A" },
  { id: 10, x: 52, y: 48, s: 1.5, d: 2.2, t: 19, c: "#6C3DFF" },
  { id: 11, x: 8, y: 80, s: 1, d: 4.5, t: 11, c: "#18A8FF" },
  { id: 12, x: 97, y: 15, s: 2.5, d: 1.8, t: 14, c: "#18C62A" },
  { id: 13, x: 42, y: 62, s: 1, d: 3.2, t: 16, c: "#18A8FF" },
  { id: 14, x: 28, y: 5, s: 2, d: 0.3, t: 20, c: "#18C62A" },
  { id: 15, x: 65, y: 35, s: 1.5, d: 1.2, t: 12, c: "#6C3DFF" },
  { id: 16, x: 83, y: 78, s: 1, d: 5, t: 15, c: "#18A8FF" },
  { id: 17, x: 18, y: 95, s: 2, d: 2.8, t: 13, c: "#18C62A" },
  { id: 18, x: 55, y: 22, s: 1.5, d: 0.6, t: 18, c: "#18A8FF" },
  { id: 19, x: 76, y: 48, s: 1, d: 3.8, t: 11, c: "#18C62A" },
  { id: 20, x: 33, y: 88, s: 2, d: 1.4, t: 16, c: "#6C3DFF" },
  { id: 21, x: 91, y: 42, s: 1.5, d: 4.2, t: 14, c: "#18A8FF" },
  { id: 22, x: 12, y: 58, s: 1, d: 2.6, t: 17, c: "#18C62A" },
  { id: 23, x: 68, y: 75, s: 2.5, d: 1.0, t: 12, c: "#18A8FF" },
  { id: 24, x: 44, y: 15, s: 1, d: 4.8, t: 19, c: "#18C62A" },
  { id: 25, x: 80, y: 92, s: 2, d: 2.0, t: 13, c: "#6C3DFF" },
  { id: 26, x: 25, y: 38, s: 1.5, d: 3.4, t: 15, c: "#18A8FF" },
  { id: 27, x: 58, y: 68, s: 1, d: 0.9, t: 18, c: "#18C62A" },
  { id: 28, x: 4, y: 52, s: 2, d: 4.6, t: 11, c: "#18A8FF" },
  { id: 29, x: 96, y: 80, s: 1.5, d: 1.6, t: 20, c: "#18C62A" },
];

const HIGHLIGHTS = [
  "Aprendizaje basado en práctica",
  "10 meses de formación",
  "100% virtual",
  "Reel profesional al egreso",
];

export default function VfxHero() {
  const containerRef = useRef<HTMLElement>(null);
  const term = useTerm();
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start start", "end start"],
  // });
  // const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#050505" }}
      aria-label={`${term} Composición Digital y VFX`}
    >
      {/* CSS keyframes */}
      <style>{`
        @keyframes vfx-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-18px) scale(1.15); opacity: 0.85; }
        }
        @keyframes vfx-scanline {
          0% { top: -2px; opacity: 0; }
          3% { opacity: 1; }
          97% { opacity: 0.7; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes vfx-glow-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.16; }
        }
      `}</style>

      {/* Background image — cinematic light leak */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src={VFX_BG}
          alt=""
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.55, objectPosition: "60% center" }}
        />
      </div>

      {/* Vignette radial — disuelve los bordes de la imagen sin seam */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 62% 48%, transparent 0%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.92) 80%, #050505 100%)",
        }}
      />

      {/* Overlay direccional: texto legible en la izquierda */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.90) 22%, rgba(5,5,5,0.60) 50%, rgba(5,5,5,0.15) 78%, transparent 100%)," +
            "linear-gradient(to bottom, rgba(5,5,5,0.65) 0%, transparent 18%, transparent 78%, rgba(5,5,5,0.80) 100%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24,198,42,0.025) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(24,198,42,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "vfx-glow-pulse 6s ease-in-out infinite",
        }}
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(24,198,42,0.6) 30%, rgba(24,168,255,0.6) 70%, transparent 100%)",
          animation: "vfx-scanline 9s linear infinite",
          animationDelay: "1s",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
              backgroundColor: p.c,
              boxShadow: `0 0 ${p.s * 4}px ${p.c}80`,
              animation: `vfx-float ${p.t}s ease-in-out infinite`,
              animationDelay: `${p.d}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative large BG text */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden xl:block overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="text-[320px] font-black uppercase leading-none"
          style={{
            fontFamily: "var(--font-orbitron, monospace)",
            backgroundImage:
              "linear-gradient(135deg, rgba(24,198,42,0.05), rgba(24,168,255,0.05))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          VFX
        </div>
      </div>

      {/* Header spacer */}
      <div className="h-20 lg:h-20 shrink-0" />

      {/* Main content — relative z-20 para que quede ENCIMA de los overlays absolutos */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(24,198,42,0.08)",
                border: "1px solid rgba(24,198,42,0.22)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "#18C62A",
                  boxShadow: "0 0 8px #18C62A",
                  animation: "vfx-glow-pulse 2s ease-in-out infinite",
                }}
              />
              <span
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: "#18C62A" }}
              >
                Red educativa CINFA · 10 meses · 100% Virtual
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-black uppercase leading-none text-white"
              style={{
                fontFamily: "var(--font-orbitron, monospace)",
                letterSpacing: "-0.01em",
              }}
            >
              <span
                className="block"
                style={{
                  fontSize: "clamp(0.85rem, 2vw, 1.2rem)",
                  color: "#A0A0A0",
                  letterSpacing: "0.12em",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                }}
              >
                {term.toUpperCase()} MÁSTER
              </span>
              <span style={{ fontSize: "clamp(2.2rem, 6.5vw, 5rem)" }}>
                COMPOSICIÓN
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                  }}
                >
                  DIGITAL
                </span>
                <br />
                &amp; VFX
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mt-7 text-lg md:text-xl leading-relaxed max-w-2xl"
              style={{ color: "#A0A0A0" }}
            >
              Forma parte del pipeline profesional de cine, streaming y
              publicidad. Aprende junto a un artista con créditos en Hollywood,
              desarrolla competencias reales y construye un Demo Reel que te
              abra las puertas de los estudios VFX.
            </p>

            {/* Highlight chips */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {HIGHLIGHTS.map((h) => (
                <span
                  key={h}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#A0A0A0",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-10">
              <button
                onClick={scrollToForm}
                className="px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2.5"
                style={{
                  background:
                    "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                  color: "#050505",
                  boxShadow:
                    "0 4px 30px rgba(24,198,42,0.30), 0 0 60px rgba(24,168,255,0.10)",
                }}
              >
                Quiero conocer el programa
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <a
                href="#plan-estudios-vfx"
                className="px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:border-white/20"
                style={{
                  color: "#A0A0A0",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Ver plan de estudios
              </a>
            </div>

            {/* CINFA badge */}
            <div className="mt-12 flex items-center gap-3">
              <Image
                src="/assets/logos/Logo CINFA-01.webp"
                alt="CINFA"
                width={28}
                height={28}
                className="object-contain opacity-50"
              />
              <span className="text-xs" style={{ color: "#A0A0A040" }}>
                Programa certificado por red educativa CINFA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-20 pb-10 flex justify-center">
        <a
          href="#por-que-vfx"
          aria-label="Scroll"
          className="flex flex-col items-center gap-2 group"
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "#A0A0A050" }}
          >
            Descubrir
          </span>
          <div
            className="w-px h-10 group-hover:h-14 transition-all duration-300"
            style={{
              background:
                "linear-gradient(180deg, rgba(24,198,42,0.5) 0%, transparent 100%)",
            }}
          />
        </a>
      </div>
    </section>
  );
}
