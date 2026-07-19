"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTerm } from "./term-context";

function scrollToForm() {
  document.getElementById("solicitar-informacion-vfx")?.scrollIntoView({ behavior: "smooth" });
}

export default function VfxHeader() {
  const [open, setOpen] = useState(false);
  const term = useTerm();

  const NAV_ITEMS = [
    { label: `El ${term}`, href: "#por-que-vfx" },
    { label: "Plan de Estudios", href: "#plan-estudios-vfx" },
    { label: "Docente", href: "#docente-vfx" },
    { label: "Modalidad", href: "#modalidad-vfx" },
    { label: "FAQ", href: "#faq-vfx" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(5,5,5,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(24,198,42,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/assets/logos/Logo CINFA-01.webp"
              alt="CINFA"
              width={38}
              height={38}
              className="object-contain"
            />
            <div className="leading-tight">
              <div
                className="text-white font-bold text-sm tracking-widest uppercase"
                style={{ fontFamily: "var(--font-orbitron, monospace)" }}
              >
                CINFA
              </div>
              <div className="text-xs font-medium" style={{ color: "#18C62A" }}>
                Composición Digital &amp; VFX
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm transition-colors duration-200 hover:text-white"
                style={{ color: "#A0A0A0" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <button
              onClick={scrollToForm}
              className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                color: "#050505",
                boxShadow: "0 0 20px rgba(24,198,42,0.25)",
              }}
            >
              Solicitar información
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 transition-colors"
            style={{ color: open ? "#18C62A" : "#A0A0A0" }}
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden px-4 py-6 space-y-1"
            style={{
              background: "rgba(5,5,5,0.98)",
              borderTop: "1px solid rgba(24,198,42,0.12)",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm border-b transition-colors hover:text-white"
                style={{ color: "#A0A0A0", borderBottomColor: "rgba(255,255,255,0.05)" }}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => { scrollToForm(); setOpen(false); }}
              className="w-full mt-5 py-3.5 rounded-lg text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                color: "#050505",
              }}
            >
              Solicitar información
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}