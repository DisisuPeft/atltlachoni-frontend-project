"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useTerm } from "./term-context";

export function VfxFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const term = useTerm();
  const t = term.toLowerCase();

  const FAQS = [
    {
      q: "¿Necesito experiencia previa?",
      a: "No es indispensable. El programa está diseñado para desarrollar habilidades desde fundamentos hasta técnicas avanzadas. Si tienes experiencia previa en diseño, edición o animación, te adaptarás más rápido, pero no es un requisito.",
    },
    {
      q: "¿Qué software aprenderé?",
      a: "Principalmente Nuke, la herramienta estándar de la industria VFX, además de conocimientos complementarios empleados en pipelines profesionales de postproducción. Durante el programa se orienta sobre las opciones de licenciamiento para estudiantes.",
    },
    {
      q: "¿Cuál es el horario?",
      a: "Las clases se imparten dos sábados al mes, de 9:00 a.m. a 2:00 p.m. (hora del centro de México), vía Zoom. Son sesiones en vivo de 5 horas con interacción directa con el docente.",
    },
    {
      q: "¿Qué computadora necesito?",
      a: "Mínimo recomendado: procesador Intel Core i5 / AMD Ryzen 5, 16 GB de RAM (32 GB recomendados), tarjeta gráfica dedicada, SSD e internet estable. Estas especificaciones permiten ejecutar Nuke y el software complementario con fluidez.",
    },
    {
      q: "¿Las clases quedan grabadas?",
      a: `Sí. Todas las sesiones en vivo quedan grabadas y disponibles en la plataforma CINFA. Tendrás acceso a las grabaciones durante todo el periodo del ${t}.`,
    },
    {
      q: "¿Qué proyectos realizaré?",
      a: "Composiciones digitales completas, integración de elementos 3D, eliminación de objetos, extensiones de escenarios, reemplazo de fondos y ejercicios inspirados en producciones reales. Cada módulo incorpora una actividad práctica con resultado esperado.",
    },
    {
      q: "¿Crearé un Demo Reel?",
      a: `Sí. Uno de los objetivos principales del ${t} es construir un Demo Reel profesional. Lo desarrollas en el módulo final con mentoría personalizada para postular a estudios y empresas de postproducción.`,
    },
    {
      q: "¿Obtendré diploma?",
      a: "Sí. Al concluir satisfactoriamente el programa recibirás tu diploma de la red educativa CINFA.",
    },
    {
      q: "¿Está dirigido únicamente a diseñadores?",
      a: `No. El ${t} está dirigido también a cineastas, comunicólogos, artistas digitales, fotógrafos, videógrafos, editores, creadores de contenido y cualquier persona interesada en el campo de los efectos visuales.`,
    },
    {
      q: "¿Podré trabajar en cine o estudios VFX?",
      a: "Sí. El programa está diseñado para desarrollar competencias profesionales utilizadas en estudios VFX. Al egresar contarás con un Demo Reel y habilidades directamente aplicables a postular a estudios y productoras.",
    },
    {
      q: "¿Necesito saber inglés?",
      a: "No es obligatorio. El programa se imparte en español. Sin embargo, conocimientos básicos de inglés ayudan a comprender documentación técnica y terminología de la industria.",
    },
    {
      q: `¿Este ${t} ayuda a conseguir empleo?`,
      a: `Sí. Además de desarrollar habilidades profesionales, el programa orienta en la elaboración de un Demo Reel para postular a estudios y empresas de postproducción. El mercado de VFX en Latinoamérica está en expansión.`,
    },
  ];

  return (
    <section
      id="faq-vfx"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#18C62A" }}>
            Preguntas frecuentes
          </span>
          <h2
            className="mt-4 text-3xl lg:text-4xl font-black uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron, monospace)" }}
          >
            RESOLVEMOS TUS{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #18C62A, #18A8FF)" }}
            >
              DUDAS
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(14,14,14,0.75)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: isOpen
                    ? "1px solid rgba(24,198,42,0.25)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: isOpen ? "0 0 30px rgba(24,198,42,0.08)" : "none",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span
                    className="text-sm font-semibold leading-snug text-white"
                    style={{ fontFamily: isOpen ? "var(--font-orbitron, monospace)" : "inherit" }}
                  >
                    {faq.q}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: isOpen ? "rgba(24,198,42,0.12)" : "rgba(255,255,255,0.04)",
                      border: isOpen ? "1px solid rgba(24,198,42,0.25)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 transition-transform duration-300"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        color: isOpen ? "#18C62A" : "#A0A0A0",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="pb-6 px-6 text-sm leading-relaxed"
                        style={{ color: "#A0A0A0" }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}