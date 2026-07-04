"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const stats = [
  { value: "+90", label: "Estudiantes", icon: "" },
  { value: "+6", label: "Diplomados activos", icon: "" },
];

export default function AboutCINFA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="nosotros" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats row */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl lg:text-4xl font-bold text-[#0F4C75] font-heading">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-500 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Content + image */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <span className="text-[#2F7FB1] font-medium text-sm uppercase tracking-wider">
              Sobre CINFA
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
              Más de 150 profesionales de la salud ya confían en nosotros
            </h2>

            <p className="mt-5 text-gray-600 text-lg leading-relaxed">
              El Centro Internacional de Formación Académica (CINFA) es la
              institución matriz que impulsa la especialización de profesionales
              de la salud a través de programas académicos rigurosos, flexibles
              y con acompañamiento personalizado.
            </p>

            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Nuestro modelo formativo combina el rigor científico con la
              aplicación clínica real, apoyado por docentes que ejercen
              activamente su profesión en el sector salud.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="border-l-4 border-[#2F7FB1] pl-4">
                <div className="font-semibold text-gray-900">
                  Formación práctica
                </div>
                <div className="mt-1 text-sm text-gray-500 leading-relaxed">
                  Contenido aplicable desde el primer módulo, basado en casos
                  clínicos reales.
                </div>
              </div>
              <div className="border-l-4 border-[#2F7FB1] pl-4">
                <div className="font-semibold text-gray-900">
                  Proyección internacional
                </div>
                <div className="mt-1 text-sm text-gray-500 leading-relaxed">
                  Estudiantes de México, Colombia, Argentina y más países de
                  Latinoamérica.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/assets/photos/joven-escuchando-musica-durante-la-sesion-de-estudio.webp"
                alt="Profesional de la salud estudiando en CINFA"
                className="w-full h-full object-cover"
                width={600}
                height={450}
                quality={90}
              />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-5 -left-5 bg-white p-5 rounded-xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#2F7FB1]/10 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#2F7FB1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    Certificación institucional
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    Validez académica garantizada
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
