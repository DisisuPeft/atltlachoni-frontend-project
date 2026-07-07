"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useProgramasDestacadosQuery } from "@/redux/features/control-escolar/programasApiSlice";

function solicitarPrograma(ref: string | undefined) {
  if (ref) {
    window.dispatchEvent(new CustomEvent("iesda:preselect-programa", { detail: ref }));
  }
  document.getElementById("solicitar-informacion-iesda")?.scrollIntoView({ behavior: "smooth" });
}

export function Programs() {
  const { data: programas = [], isLoading } = useProgramasDestacadosQuery({ limit: 6, instituto: 2 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="diplomados-iesda"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "#FDF8F0" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <span className="font-medium text-sm uppercase tracking-wider" style={{ color: "#D7A22A" }}>
              Formación académica
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-semibold leading-tight" style={{ color: "#2A2118" }}>
              Oferta académica IESDA
            </h2>
            <p className="mt-4 text-lg leading-relaxed max-w-xl" style={{ color: "#7D8EA3" }}>
              Programas especializados diseñados para integrar rigor científico, ética profesional
              y sensibilidad humana. Modalidad 100% en línea con certificación institucional.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => solicitarPrograma(undefined)}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "#D7A22A" }}
            >
              Solicitar información
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-80"
                style={{ border: "1px solid rgba(215,162,42,0.1)" }} />
            ))}
          </div>
        ) : programas.length === 0 ? (
          <p className="mt-12 text-center text-sm" style={{ color: "#7D8EA3" }}>
            Próximamente más programas disponibles. Contáctanos para más información.
          </p>
        ) : (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programas.map((programa, index) => (
              <motion.div
                key={programa.ref ?? `programa-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.09, ease: "easeOut" }}
                className="group bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
                style={{ border: "1px solid rgba(215,162,42,0.15)" }}
              >
                {programa.imagen_url && (
                  <div className="w-full h-52 overflow-hidden">
                    <Image
                      src={programa.imagen_url}
                      alt={programa.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={500}
                      height={200}
                      quality={85}
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="w-8 h-0.5 mb-4" style={{ background: "#D7A22A" }} />
                  <h3 className="text-base font-semibold leading-snug mb-3" style={{ color: "#2A2118" }}>
                    {programa.nombre}
                  </h3>
                  {programa.descripcion && (
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "#7D8EA3" }}>
                      {programa.descripcion}
                    </p>
                  )}
                  <button
                    onClick={() => solicitarPrograma(programa.ref)}
                    className="inline-flex items-center text-sm font-semibold transition-colors hover:opacity-80 mt-4"
                    style={{ color: "#D7A22A" }}
                  >
                    Solicitar información
                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}