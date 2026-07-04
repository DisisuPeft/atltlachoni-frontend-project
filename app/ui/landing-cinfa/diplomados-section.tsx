"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const diplomados = [
  {
    title: "Nutrición Ginecológica",
    image: "/assets/diplomados/thales/Nutricionginecologica.webp",
    duration: "3 meses",
    modality: "En línea",
    institute: "Instituto Thales",
    href: "/thales",
  },
  {
    title: "Urgencias Pediátricas",
    image: "/assets/diplomados/iesda/URGENCIA-PEDIATRICAS.webp",
    duration: "3 meses",
    modality: "En línea",
    institute: "IESDA",
    href: "/iesda",
  },
  {
    title: "Atención Perinatal",
    image: "/assets/diplomados/perinatal.webp",
    duration: "3 meses",
    modality: "En línea",
    institute: "Instituto Thales",
    href: "/thales",
  },
  {
    title: "Composición Digital en Salud",
    image: "/assets/diplomados/thales/COMPOSICION-DIGITAL.webp",
    duration: "3 meses",
    modality: "En línea",
    institute: "Instituto Thales",
    href: "/thales",
  },
];

export default function DiplomadosSection() {
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
              Programas especializados en ciencias de la salud con modalidad
              100% en línea y certificación institucional.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/thales"
              className="inline-flex items-center gap-2 text-[#2F7FB1] font-semibold text-sm hover:text-[#0F4C75] transition-colors"
            >
              Ver todos los programas
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {diplomados.map((diplomado, index) => (
            <motion.article
              key={diplomado.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Imagen */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={diplomado.image}
                  alt={diplomado.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-medium text-[#2F7FB1] uppercase tracking-wide mb-2">
                  {diplomado.institute}
                </span>
                <h3 className="text-base font-semibold text-gray-900 leading-snug flex-1">
                  {diplomado.title}
                </h3>

                {/* Meta */}
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {diplomado.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {diplomado.modality}
                  </span>
                </div>

                <Link
                  href={diplomado.href}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-[#0F4C75] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#2F7FB1] transition-colors"
                >
                  Más información
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}