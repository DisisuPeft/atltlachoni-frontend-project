"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const institutes = [
  {
    id: "thales",
    name: "Instituto Thales",
    shortName: "THALES",
    tagline: "Especialización clínica y profesional",
    description:
      "Instituto enfocado en la especialización clínica avanzada para profesionales de la salud. Desarrolla competencias técnicas, científicas y humanísticas que elevan la práctica profesional.",
    image: "/assets/logos/logo-thales.svg",
    accent: "#1C3D54",
    path: "/thales",
    features: ["Especialización clínica", "Docentes con práctica activa", "Enfoque científico"],
  },
  {
    id: "iesda",
    name: "Instituto de Educación Superior y Desarrollo Académico",
    shortName: "IESDA",
    tagline: "Formación ética y científica en salud",
    description:
      "Instituto dedicado a la formación integral con enfoque ético y humanístico. Promueve el desarrollo académico riguroso alineado con los más altos estándares en ciencias de la salud.",
    image: "/assets/logos/iesdalogo.webp",
    accent: "#2F7FB1",
    path: "/iesda",
    features: ["Formación ética", "Enfoque humanístico", "Estándares internacionales"],
  },
];

export default function InstitutesPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="instituciones" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-[#2F7FB1] font-medium text-sm uppercase tracking-wider">
            Instituciones
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
            Instituciones que integran CINFA
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed">
            CINFA es la institución matriz que agrupa dos institutos académicos
            especializados en ciencias de la salud.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {institutes.map((institute, index) => (
            <motion.article
              key={institute.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Logo area */}
              <div className="bg-gray-50 p-10 flex items-center justify-center border-b border-gray-100">
                <div className="h-20 flex items-center justify-center">
                  <Image
                    src={institute.image}
                    alt={`Logo ${institute.name}`}
                    width={180}
                    height={80}
                    className="object-contain max-h-20"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col flex-1">
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: institute.accent }}
                >
                  {institute.shortName}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                  {institute.tagline}
                </h3>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed flex-1">
                  {institute.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {institute.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-[#2F7FB1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <Link
                    href={institute.path}
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#0F4C75] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#2F7FB1] transition-colors"
                  >
                    Conocer programas
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}