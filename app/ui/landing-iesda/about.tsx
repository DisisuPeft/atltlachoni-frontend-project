"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const stats = [
  { value: "+3", label: "Programas activos" },
  { value: "100%", label: "En línea" },
  { value: "CINFA", label: "Red institucional" },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="nosotros-iesda" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>

        {/* Stats */}
        <motion.div
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
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="text-center px-8 py-6 rounded-2xl border min-w-[140px]"
              style={{ backgroundColor: "#FDF8F0", borderColor: "rgba(215,162,42,0.2)" }}
            >
              <div className="text-3xl lg:text-4xl font-bold" style={{ color: "#D7A22A" }}>
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium" style={{ color: "#7D8EA3" }}>
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
            <span className="font-medium text-sm uppercase tracking-wider" style={{ color: "#D7A22A" }}>
              Sobre IESDA
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-semibold leading-tight" style={{ color: "#2A2118" }}>
              Una institución comprometida con la formación integral
            </h2>

            <p className="mt-5 text-lg leading-relaxed" style={{ color: "#3A3A3A" }}>
              El Instituto de Educación Superior y Desarrollo Académico (IESDA) es una institución
              orientada a la formación profesional con un enfoque académico, humanista y ético.
              Formamos parte de la red coordinada por CINFA, garantizando estándares de calidad,
              rigor científico y acompañamiento pedagógico cercano.
            </p>

            <p className="mt-4 text-base leading-relaxed" style={{ color: "#7D8EA3" }}>
              Cada estudiante encuentra en IESDA un espacio donde el conocimiento técnico se integra
              con el desarrollo ético y humano, preparándolo para ejercer su profesión con
              responsabilidad, sensibilidad social y compromiso con el bienestar de las personas.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="border-l-4 pl-4" style={{ borderColor: "#D7A22A" }}>
                <div className="font-semibold" style={{ color: "#2A2118" }}>Acompañamiento docente</div>
                <div className="mt-1 text-sm leading-relaxed" style={{ color: "#7D8EA3" }}>
                  Docentes comprometidos con el proceso formativo de cada estudiante.
                </div>
              </div>
              <div className="border-l-4 pl-4" style={{ borderColor: "#D7A22A" }}>
                <div className="font-semibold" style={{ color: "#2A2118" }}>Red CINFA</div>
                <div className="mt-1 text-sm leading-relaxed" style={{ color: "#7D8EA3" }}>
                  Parte de una red institucional con visión compartida y estándares validados.
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
            <div className="aspect-[4/3] rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(215,162,42,0.15)" }}>
              <Image
                src="/assets/photos/joven-escuchando-musica-durante-la-sesion-de-estudio.webp"
                alt="Estudiante IESDA formándose en línea"
                className="w-full h-full object-cover"
                width={600}
                height={450}
                quality={90}
              />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-5 -left-5 bg-white p-5 rounded-xl shadow-xl"
              style={{ border: "1px solid rgba(215,162,42,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(215,162,42,0.12)" }}>
                  <svg className="w-5 h-5" fill="none" stroke="#D7A22A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#2A2118" }}>
                    Certificación institucional
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#7D8EA3" }}>
                    Validez académica garantizada · Red CINFA
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