"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AUDIENCIA = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Creativos digitales",
    description:
      "Diseñadores, animadores y artistas digitales que quieren dar el salto a la composición profesional y la producción visual para medios audiovisuales.",
    color: "#18C62A",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5-3.75c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125H9.75" />
      </svg>
    ),
    title: "Profesionales audiovisuales",
    description:
      "Editores, camarógrafos y directores que buscan integrar efectos visuales a su flujo de trabajo y ampliar su propuesta de valor en el mercado.",
    color: "#18A8FF",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: "Futuros especialistas en VFX",
    description:
      "Personas sin experiencia previa que desean iniciar una carrera en efectos visuales, composición digital o postproducción para videojuegos.",
    color: "#6C3DFF",
  },
];

export function VfxAudiencia() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-24 lg:py-32"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(24,198,42,0.05) 0%, transparent 60%)," +
          "linear-gradient(180deg, #080808 0%, #050505 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#18C62A" }}>
            ¿A quién va dirigido?
          </span>
          <h2
            className="mt-4 text-3xl lg:text-4xl font-black uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron, monospace)" }}
          >
            ESTE DIPLOMADO ES{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #18A8FF, #6C3DFF)" }}
            >
              PARA TI
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {AUDIENCIA.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
              className="group p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(14,14,14,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: `0 0 0 0 ${a.color}00`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${a.color}18, inset 0 0 30px ${a.color}04`;
                (e.currentTarget as HTMLElement).style.borderColor = `${a.color}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `${a.color}12`,
                  border: `1px solid ${a.color}25`,
                  color: a.color,
                }}
              >
                {a.icon}
              </div>
              <h3
                className="text-lg font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-orbitron, monospace)", fontSize: "0.9rem" }}
              >
                {a.title.toUpperCase()}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
                {a.description}
              </p>
              <div
                className="mt-6 w-8 h-0.5 transition-all duration-300 group-hover:w-16"
                style={{ background: a.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}