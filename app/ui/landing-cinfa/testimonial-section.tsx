"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    name: "Dra. Carmen Rodríguez",
    role: "Médico General",
    program: "Diplomado en Nutrición Ginecológica",
    initials: "CR",
    color: "#2F7FB1",
    quote:
      "CINFA me permitió especializarme sin interrumpir mi práctica médica. La modalidad en línea es realmente flexible y los docentes tienen experiencia clínica real, no solo académica.",
    rating: 5,
  },
  {
    name: "Lic. Ana Torres",
    role: "Enfermera Especialista",
    program: "Diplomado en Enfermería Nefrológica",
    initials: "AT",
    color: "#0F4C75",
    quote:
      "El contenido fue práctico y aplicable desde el primer módulo. Ahora manejo casos complejos con mayor seguridad. Los tutores respondieron cada duda de manera muy oportuna.",
    rating: 5,
  },
  {
    name: "Dr. Miguel Hernández",
    role: "Médico Pediatra",
    program: "Diplomado en Urgencias Pediátricas",
    initials: "MH",
    color: "#1a6b9a",
    quote:
      "La plataforma está disponible las 24 horas y los materiales son excelentes. Puedo estudiar entre consultas. Definitivamente recomiendo CINFA a todos mis colegas del sector salud.",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section id="testimonios" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-[#2F7FB1] font-medium text-sm uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
            Lo que dicen nuestros estudiantes
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed">
            Profesionales de la salud que transformaron su carrera con CINFA.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-14 relative max-w-3xl mx-auto"
        >
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white p-8 lg:p-12 rounded-2xl border border-gray-100 shadow-sm"
              >
                {/* Quote icon */}
                <svg className="w-10 h-10 text-[#2F7FB1]/20 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <StarRating count={testimonials[current].rating} />

                <blockquote className="mt-5 text-gray-700 text-lg leading-relaxed">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <footer className="mt-8 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: testimonials[current].color }}
                  >
                    {testimonials[current].initials}
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-gray-900">
                      {testimonials[current].name}
                    </cite>
                    <p className="text-gray-400 text-sm">{testimonials[current].role}</p>
                    <p className="text-[#2F7FB1] text-xs font-medium mt-0.5">
                      {testimonials[current].program}
                    </p>
                  </div>
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#2F7FB1] hover:text-[#2F7FB1] transition-colors flex items-center justify-center text-gray-400"
              aria-label="Anterior testimonio"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-[#2F7FB1] w-6" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Ir al testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#2F7FB1] hover:text-[#2F7FB1] transition-colors flex items-center justify-center text-gray-400"
              aria-label="Siguiente testimonio"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}