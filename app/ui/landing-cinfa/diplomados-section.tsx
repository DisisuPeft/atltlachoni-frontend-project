"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useProgramasDestacadosQuery } from "@/redux/features/control-escolar/programasApiSlice";

const WA_LINK = "https://wa.link/fgv19q";

function solicitarPrograma(ref: string | undefined) {
  if (ref) {
    window.dispatchEvent(
      new CustomEvent("cinfa:preselect-programa", { detail: ref }),
    );
  }
  document
    .getElementById("solicitar-informacion")
    ?.scrollIntoView({ behavior: "smooth" });
}

export default function DiplomadosSection() {
  const { data: programas = [] } = useProgramasDestacadosQuery({ limit: 4 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="diplomados" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <span className="text-[#2F7FB1] font-medium text-sm uppercase tracking-wider">
              Oferta Académica
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
              Diplomados destacados
            </h2>
            <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-xl">
              Programas especializados con modalidad 100% en línea y
              certificación institucional.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2F7FB1] font-semibold text-sm hover:text-[#0F4C75] transition-colors"
            >
              Ver todos los programas
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* VFX — diplomado de lanzamiento, ancho completo */}
          <motion.a
            href="/vfx"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="col-span-full group relative flex flex-col lg:flex-row overflow-hidden rounded-2xl min-h-[200px] lg:min-h-[220px]"
            style={{ background: "#050505", textDecoration: "none" }}
          >
            {/* Fondo cinematográfico */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <Image
                src="/assets/vfx/High-tech_film_post-production_w…_2K_202607021531.jpg"
                alt=""
                fill
                className="object-cover"
                style={{
                  opacity: 0.25,
                  filter: "blur(5px)",
                  transform: "scale(1.04)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.80) 55%, rgba(5,5,5,0.50) 100%)",
                }}
              />
            </div>

            {/* Grid scan line decorativa */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(24,198,42,0.025) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(24,198,42,0.025) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* Contenido */}
            <div className="relative z-10 p-8 lg:p-10 flex flex-col justify-center flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(24,198,42,0.12)",
                    border: "1px solid rgba(24,198,42,0.40)",
                    color: "#18C62A",
                  }}
                >
                  ✦ Nuevo · Lanzamiento
                </span>
                <span
                  className="text-[10px] font-medium uppercase tracking-widest"
                  style={{ color: "#A0A0A0" }}
                >
                  100% Virtual · 10 meses · Red CINFA
                </span>
              </div>

              <h3
                className="text-2xl lg:text-3xl font-black uppercase text-white leading-tight mb-3"
                style={{ fontFamily: "var(--font-orbitron, monospace)" }}
              >
                Composición Digital{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                  }}
                >
                  &amp; VFX
                </span>
              </h3>

              <p
                className="text-sm leading-relaxed mb-6 max-w-lg"
                style={{ color: "#A0A0A0" }}
              >
                Forma parte del pipeline de cine y streaming junto a un artista
                con créditos en Hollywood. Construye tu Demo Reel y entra a la
                industria VFX.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 group-hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                    color: "#050505",
                    boxShadow: "0 4px 24px rgba(24,198,42,0.25)",
                  }}
                >
                  Ver el programa
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
                </span>
                <span className="text-xs" style={{ color: "#A0A0A050" }}>
                  Diplomado Máster · Certificado CINFA
                </span>
              </div>
            </div>

            {/* Lado derecho: peliculas destacadas */}
            <div className="relative hidden lg:flex items-center justify-end shrink-0 w-64 xl:w-80 p-6 gap-3">
              {[
                { src: "/assets/vfx/HER.webp", label: "Her" },
                {
                  src: "/assets/vfx/x-men days of future past.webp",
                  label: "X-Men",
                },
                {
                  src: "/assets/vfx/a millon miles away.webp",
                  label: "A Million Miles",
                },
              ].map((film, i) => (
                <div
                  key={film.label}
                  className="relative rounded-lg overflow-hidden shrink-0"
                  style={{
                    width: i === 0 ? 72 : 56,
                    height: i === 0 ? 108 : 84,
                    opacity: i === 0 ? 1 : 0.65,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Image
                    src={film.src}
                    alt={film.label}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ))}
              {/* Oscar badge sobre Her */}
              <div
                className="absolute bottom-8 left-6 text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  border: "1px solid rgba(212,175,55,0.45)",
                  color: "#D4AF37",
                }}
              >
                ★ Oscar®
              </div>
            </div>
          </motion.a>

          {programas.map((programa, index) => (
            <motion.article
              key={programa.ref}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Imagen */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0F4C75] to-[#2F7FB1]">
                {programa.imagen_url ? (
                  <Image
                    src={programa.imagen_url}
                    alt={programa.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Dot grid */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    {/* Glow central */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)",
                      }}
                    />
                    {/* Inicial grande */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-black leading-none select-none"
                        style={{
                          fontSize: "6rem",
                          fontFamily: "var(--font-orbitron, serif)",
                          color: "transparent",
                          WebkitTextStroke: "1.5px rgba(255,255,255,0.18)",
                        }}
                      >
                        {programa.nombre.charAt(0)}
                      </span>
                    </div>
                    {/* Badge CINFA esquina */}
                    <div className="absolute top-3 right-3">
                      {/* <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                        style={{
                          border: "1px solid rgba(255,255,255,0.18)",
                          color: "rgba(255,255,255,0.45)",
                        }}
                      >
                        CINFA
                      </span> */}
                    </div>
                    {/* Línea inferior decorativa */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
                      }}
                    />
                  </div>
                )}
                {/* {index === 0 && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Más popular
                  </span>
                )} */}
                {/* {programa.probabilidad != null && programa.probabilidad > 0 && (
                  <span className="absolute top-3 right-3 bg-white/90 text-[#0F4C75] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {programa.probabilidad.toFixed(0)}% demanda
                  </span>
                )} */}
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-medium text-[#2F7FB1] uppercase tracking-wide mb-2">
                  En línea · CINFA
                </span>
                <h3 className="text-base font-semibold text-gray-900 leading-snug flex-1 line-clamp-3">
                  {programa.nombre}
                </h3>

                {programa.total_inscritos != null && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {/* {programa.total_inscritos} inscritos */}
                  </div>
                )}

                <button
                  onClick={() => solicitarPrograma(programa.ref)}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-[#0F4C75] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#2F7FB1] transition-colors w-full"
                >
                  Solicitar información
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
