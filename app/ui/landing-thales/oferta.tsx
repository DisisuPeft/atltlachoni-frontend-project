"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useProgramasDestacadosQuery } from "@/redux/features/control-escolar/programasApiSlice";

function solicitarPrograma(ref: string | undefined) {
  if (ref) {
    window.dispatchEvent(new CustomEvent("thales:preselect-programa", { detail: ref }));
  }
  document.getElementById("solicitar-informacion-thales")?.scrollIntoView({ behavior: "smooth" });
}

export default function OfertaEducativaPage() {
  const { data: programas = [], isLoading } = useProgramasDestacadosQuery({ limit: 8, instituto: 1 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      id="oferta-diplomados"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#F4B400" }} />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#1FBAC4" }} />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Prisma icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(31,186,196,0.15)", border: "1px solid rgba(31,186,196,0.3)" }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#1FBAC4" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 19h20L12 3z" />
              </svg>
            </div>
          </div>

          <span className="text-[#1FBAC4] font-medium text-sm uppercase tracking-wider">
            Oferta Académica
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Nuestra oferta educativa
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full mt-4"
            style={{ background: "linear-gradient(90deg, #1FBAC4, #F4B400)" }} />
          <p className="mt-6 text-base sm:text-lg max-w-3xl mx-auto text-white/75 leading-relaxed">
            Programas de excelencia que integran conocimiento científico,
            sensibilidad artística y reflexión humanística
          </p>
        </motion.div>

        {/* Programs grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-[#1FBAC4] border-t-transparent animate-spin" />
          </div>
        ) : programas.length === 0 ? (
          <div className="text-center py-16 text-white/50">
            Próximamente nuevos programas disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {programas.map((programa, index) => (
              <motion.article
                key={programa.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(215,165,86,0.2)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                {/* Image */}
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  {programa.imagen_url ? (
                    <Image
                      src={programa.imagen_url}
                      alt={programa.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #1FBAC4 100%)" }}>
                      <span className="text-white/30 text-5xl font-bold select-none">
                        {programa.nombre.charAt(0)}
                      </span>
                    </div>
                  )}
                  {index === 0 && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{ background: "#F4B400", color: "#1E3A5F" }}>
                      Más popular
                    </span>
                  )}
                  {programa.probabilidad != null && programa.probabilidad > 0 && (
                    <span className="absolute top-3 right-3 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: "#1E3A5F" }}>
                      {programa.probabilidad.toFixed(0)}% demanda
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <span className="text-xs font-medium uppercase tracking-wide mb-2"
                    style={{ color: "#1FBAC4" }}>
                    En línea · Instituto Thales
                  </span>
                  <h3 className="text-lg font-semibold mb-3 flex-1 leading-snug"
                    style={{ color: "#1E3A5F" }}>
                    {programa.nombre}
                  </h3>

                  {programa.total_inscritos != null && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs" style={{ color: "#1E3A5F", opacity: 0.6 }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {programa.total_inscritos} inscritos
                    </div>
                  )}

                  <button
                    onClick={() => solicitarPrograma(programa.ref)}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #F4B400 0%, #F78C1F 100%)",
                      color: "#1E3A5F",
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Solicitar información
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* CTA bottom */}
        {programas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => document.getElementById("solicitar-informacion-thales")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 font-semibold text-sm px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg"
              style={{
                background: "rgba(31,186,196,0.15)",
                border: "1px solid rgba(31,186,196,0.4)",
                color: "#1FBAC4",
              }}
            >
              Ver todos los programas disponibles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}