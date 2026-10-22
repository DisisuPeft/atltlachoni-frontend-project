"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useProgramasDestacadosQuery } from "@/redux/features/control-escolar/programasApiSlice";
import type { ProgramaDestacado } from "@/redux/features/types/control-escolar/type";

const WA_LINK = "https://wa.link/fgv19q";

const NON_HEALTH_PROGRAM = /vfx|diseño|design|animación|animation|3d|motion|videojuego/i;

function getInstitute(programa: ProgramaDestacado) {
  const institute = `${programa.instituto_nombre ?? ""} ${programa.instituto ?? ""}`.toLowerCase();
  if (institute.includes("thales") || /\b1\b/.test(institute)) return "Thales";
  if (institute.includes("iesda") || institute.includes("educación superior") || /\b2\b/.test(institute)) return "IESDA";
  return "Programas de salud";
}

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
  const { data: programas = [] } = useProgramasDestacadosQuery({ limit: 20 });
  const programasSalud = programas.filter((programa) => !NON_HEALTH_PROGRAM.test(programa.nombre));
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

        <div className="mt-12 space-y-12">
          {["Thales", "IESDA", "Programas de salud"].map((institute) => {
            const institutePrograms = programasSalud.filter((programa) => getInstitute(programa) === institute);
            if (!institutePrograms.length) return null;
            return (
              <div key={institute}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#D7A22A]" aria-hidden="true" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0F4C75]">
                    {institute === "Programas de salud" ? institute : `Instituto ${institute}`}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {institutePrograms.map((programa, index) => (
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
                    {/* Recurso visual institucional para programas sin imagen */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.06) 25%, transparent 25%)",
                        backgroundPosition: "0 0, 24px 24px",
                        backgroundSize: "48px 48px",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 45%, rgba(215,162,42,0.22), transparent 38%), linear-gradient(135deg, rgba(15,76,117,0.2), transparent 65%)",
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/10 shadow-lg backdrop-blur-sm">
                        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-9 w-9 text-[#D7A22A]" fill="none">
                          <path d="M24 5 39 11v11c0 9.5-6.3 17-15 21-8.7-4-15-11.5-15-21V11l15-6Z" stroke="currentColor" strokeWidth="2.5" />
                          <path d="M24 15v14M17 22h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span
                        className="select-none text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75"
                        style={{
                          fontFamily: "var(--font-poppins, sans-serif)",
                        }}
                      >
                        Formación profesional en salud
                      </span>
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
                  {institute} · En línea
                </span>
                <h3 className="text-base font-semibold text-gray-900 leading-snug flex-1 line-clamp-3">
                  {programa.nombre}
                </h3>

                {programa.total_inscritos != null && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    {/* <svg
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
                    </svg> */}
                    {/* {programa.total_inscritos} inscritos */}
                    {/* +100 inscritos */}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
