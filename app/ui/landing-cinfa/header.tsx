"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

function scrollToForm() {
  document.getElementById("solicitar-informacion")?.scrollIntoView({ behavior: "smooth" });
}

const navItems = [
  { label: "Inicio", href: "#" },
  { label: "Oferta Académica", href: "#diplomados" },
  { label: "Instituciones", href: "#instituciones" },
  { label: "¿Por qué elegirnos?", href: "#por-que-cinfa" },
  { label: "Nuestra misión", href: "#mision" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/assets/logos/Logo CINFA-01.webp"
              alt="Logo CINFA"
              width={44}
              height={44}
              className="object-contain"
            />
            <span className="text-[#0F4C75] font-semibold text-lg tracking-tight font-heading">
              CINFA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6" aria-label="Navegación principal">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-[#2F7FB1] transition-colors text-sm font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden xl:flex items-center gap-3">
            <Link
              href="/login"
              className="text-gray-500 hover:text-[#2F7FB1] transition-colors text-sm font-medium"
            >
              Iniciar sesión
            </Link>
            <button
              onClick={scrollToForm}
              className="bg-[#2F7FB1] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0F4C75] transition-colors"
            >
              Solicitar Información
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-gray-700 rounded-md"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-[#2F7FB1] hover:bg-blue-50 transition-colors text-base font-medium py-2.5 px-3 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                <button
                  onClick={() => { setIsMenuOpen(false); scrollToForm(); }}
                  className="bg-[#2F7FB1] text-white px-5 py-3 rounded-lg text-sm font-semibold text-center"
                >
                  Solicitar Información
                </button>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center text-gray-500 text-sm py-2 hover:text-[#2F7FB1] transition-colors"
                >
                  Iniciar sesión
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}