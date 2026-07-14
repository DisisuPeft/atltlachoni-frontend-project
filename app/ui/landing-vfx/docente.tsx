"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const OTHER_FILMS = [
  {
    title: "2 Guns",
    year: "2013",
    src: "/assets/vfx/2_Guns-429267061-large.webp",
  },
  {
    title: "X-Men: Days of Future Past",
    year: "2014",
    src: "/assets/vfx/x-men days of future past.webp",
  },
  {
    title: "A Million Miles Away",
    year: "2023",
    src: "/assets/vfx/a millon miles away.webp",
  },
];

const METRICS = [
  { value: "10+", label: "Años en industria" },
  { value: "4", label: "Créditos cinematográficos" },
  { value: "∞", label: "Pasión por VFX" },
];

export function VfxDocente() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="docente-vfx"
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Background image con blur */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/assets/vfx/High-tech_film_post-production_w…_2K_202607021531.jpg"
          alt=""
          fill
          priority={false}
          className="object-cover"
          style={{
            opacity: 0.18,
            filter: "blur(8px)",
            transform: "scale(1.05)",
          }}
        />
        {/* Overlay para mantener legibilidad */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.4) 60%, rgba(5,5,5,0.7) 100%)",
          }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#18C62A" }}
          >
            Tu instructor
          </span>
          <h2
            className="mt-4 text-3xl lg:text-4xl font-black uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron, monospace)" }}
          >
            APRENDE DE ALGUIEN{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #18C62A, #18A8FF)",
              }}
            >
              QUE YA ESTUVO AHÍ
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="p-8 rounded-3xl"
              style={{
                background: "rgba(14,14,14,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(24,198,42,0.15)",
                boxShadow: "0 0 60px rgba(24,198,42,0.06)",
              }}
            >
              {/* Foto del docente */}
              <div
                className="relative w-full rounded-2xl overflow-hidden mb-6"
                style={{
                  border: "1px solid rgba(24,198,42,0.20)",
                  background: "#0a0a0a",
                  aspectRatio: "3/4",
                }}
              >
                <Image
                  src="/assets/vfx/Fernando Urbina.png"
                  alt="Fernando Urbina"
                  fill
                  className="object-contain object-bottom"
                />
                {/* Gradient bottom para nombre encima */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 45%, transparent 100%)",
                  }}
                />
                {/* Nombre encima de la foto */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div
                    className="text-xs font-medium uppercase tracking-widest mb-1"
                    style={{ color: "#18C62A" }}
                  >
                    Artista de efectos visuales
                  </div>
                  <h3
                    className="text-2xl font-black text-white uppercase"
                    style={{ fontFamily: "var(--font-orbitron, monospace)" }}
                  >
                    Fernando Urbina
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "#A0A0A0" }}>
                    Compositor Digital · Pipeline Hollywood
                  </p>
                </div>
                {/* Glow corner */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(24,198,42,0.15) 0%, transparent 70%)",
                  }}
                />
              </div>

              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#A0A0A0" }}
              >
                Compositor digital y artista de efectos visuales con créditos en
                producciones cinematográficas internacionales. Ha trabajado en
                el pipeline de composición de películas con estreno en cines y
                plataformas de streaming a nivel mundial.
              </p>
            </div>
          </motion.div>

          {/* Right: copy + metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <p
              className="text-base lg:text-lg leading-relaxed mb-8"
              style={{ color: "#A0A0A0" }}
            >
              No aprenderás de alguien que solo leyó sobre VFX. Tu instructor ha
              participado en el pipeline real de producciones con presencia en
              cines y plataformas internacionales. Conoce los estándares, los
              atajos y los errores que no aparecen en tutoriales de YouTube.
            </p>
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: "#A0A0A0" }}
            >
              En cada módulo transmite el conocimiento práctico que solo se gana
              trabajando en estudios de VFX de nivel mundial: flujos de trabajo
              reales, criterios profesionales y la mentalidad de un artista de
              industria.
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap gap-6">
              {METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1"
                  style={{ minWidth: "100px" }}
                >
                  <div
                    className="text-3xl font-black"
                    style={{
                      fontFamily: "var(--font-orbitron, monospace)",
                      backgroundImage:
                        i === 0
                          ? "linear-gradient(135deg, #18C62A, #18A8FF)"
                          : i === 1
                            ? "linear-gradient(135deg, #18A8FF, #6C3DFF)"
                            : "linear-gradient(135deg, #6C3DFF, #18C62A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {m.value}
                  </div>
                  <div className="text-xs" style={{ color: "#A0A0A0" }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Créditos cinematográficos ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#A0A0A0" }}
            >
              Créditos cinematográficos
            </span>
          </div>

          {/* Grid: Her ocupa 2fr, cada otra 1fr — todos portrait a la misma altura */}
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr", height: "520px" }}
          >
            {/* HER */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ background: "#0d0404", border: "1px solid rgba(212,175,55,0.25)" }}
            >
              <Image src="/assets/vfx/HER.webp" alt="Her (2013)" fill className="object-cover object-center" />
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.35) 42%, transparent 68%)",
              }} />
              <div className="absolute left-0 bottom-0 w-32 h-32 pointer-events-none select-none opacity-35">
                <Image src="/assets/vfx/wing_oscar_l.webp" alt="" fill className="object-contain object-bottom-left" />
              </div>
              <div className="absolute right-0 bottom-0 w-32 h-32 pointer-events-none select-none opacity-35">
                <Image src="/assets/vfx/wing_oscar_r.webp" alt="" fill className="object-contain object-bottom-right" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end gap-3 p-5">
                <div className="shrink-0" style={{ width: 38, height: 60, position: "relative" }}>
                  <Image src="/assets/vfx/oscar-estatuya.webp" alt="Oscar" fill className="object-contain" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-1.5"
                    style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.45)", color: "#D4AF37", fontSize: "0.58rem" }}>
                    ★ Oscar® · Mejor Guión Original
                  </span>
                  <h4 className="text-2xl font-black text-white uppercase leading-none mb-1"
                    style={{ fontFamily: "var(--font-orbitron, monospace)" }}>Her</h4>
                  <p style={{ color: "#A0A0A0", fontSize: "0.72rem" }}>2013 · Spike Jonze</p>
                </div>
              </div>
            </div>

            {/* Las otras 3 — portrait en columnas individuales */}
            {OTHER_FILMS.map((film) => (
              <div key={film.title} className="relative rounded-xl overflow-hidden"
                style={{ background: "#080808", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Image src={film.src} alt={film.title} fill className="object-cover object-center" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.10) 40%, transparent 100%)",
                }} />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-bold text-white uppercase leading-tight"
                    style={{ fontFamily: "var(--font-orbitron, monospace)", fontSize: "0.58rem" }}>
                    {film.title}
                  </p>
                  <p style={{ color: "#A0A0A0", fontSize: "0.6rem" }}>{film.year}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
