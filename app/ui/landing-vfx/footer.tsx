"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { label: "El Diplomado", href: "#por-que-vfx" },
  { label: "Plan de estudios", href: "#plan-estudios-vfx" },
  { label: "Docente", href: "#docente-vfx" },
  { label: "Modalidad", href: "#modalidad-vfx" },
  { label: "FAQ", href: "#faq-vfx" },
  { label: "Solicitar información", href: "#solicitar-informacion-vfx" },
];

const INSTITUTOS = [
  { label: "CINFA", href: "/" },
  { label: "Instituto Thales", href: "/thales" },
  { label: "IESDA", href: "/iesda" },
];

export function VfxFooter() {
  return (
    <footer
      className="py-16 px-6"
      style={{
        backgroundColor: "#030303",
        borderTop: "1px solid rgba(24,198,42,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-12 mb-12"
        >
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src="/assets/logos/Logo CINFA-01.webp"
                alt="CINFA"
                width={36}
                height={36}
                className="object-contain opacity-80"
              />
              <div>
                <div
                  className="text-white font-bold text-sm tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-orbitron, monospace)" }}
                >
                  CINFA
                </div>
                <div className="text-xs" style={{ color: "#18C62A" }}>Composición Digital &amp; VFX</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#A0A0A0" }}>
              Diplomado profesional en composición digital y efectos visuales.
              Formación práctica basada en pipelines reales de la industria cinematográfica.
            </p>
            <p className="text-xs" style={{ color: "#A0A0A050" }}>
              Programa impartido a través de la Red educativa CINFA
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#18C62A" }}
            >
              El Diplomado
            </h4>
            <ul className="space-y-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#A0A0A0" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutos */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#18C62A" }}
            >
              Red CINFA
            </h4>
            <ul className="space-y-3 mb-8">
              {INSTITUTOS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#A0A0A0" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="https://wa.link/fgv19q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: "rgba(37,211,102,0.10)",
                border: "1px solid rgba(37,211,102,0.22)",
                color: "#25D366",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.869.52 3.617 1.422 5.113L2 22l4.984-1.404A9.934 9.934 0 0012.001 22c5.522 0 9.999-4.477 9.999-9.999 0-5.523-4.477-10-9.999-10zm5.894 13.89c-.243.684-1.404 1.308-1.922 1.36-.519.053-1.009.246-3.402-.71-2.839-1.135-4.676-4.017-4.817-4.203-.14-.186-1.143-1.52-1.143-2.9s.722-2.055.978-2.337c.257-.281.56-.351.746-.351.186 0 .374.002.537.01.173.008.404-.065.632.483.232.558.788 1.928.857 2.067.07.14.116.302.023.488-.094.186-.14.302-.28.465-.14.163-.293.364-.42.49-.14.14-.284.292-.122.573.163.28.723 1.19 1.553 1.927.999.863 1.84 1.13 2.12 1.26.28.13.443.11.606-.07.163-.181.7-.815.887-1.095.186-.28.374-.233.63-.14.257.093 1.629.769 1.908.91.28.14.466.21.535.327.07.117.07.673-.172 1.356z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)", color: "#A0A0A050" }}
        >
          <span>© {new Date().getFullYear()} CINFA · Todos los derechos reservados</span>
          <span
            className="font-mono"
            style={{
              fontFamily: "var(--font-orbitron, monospace)",
              fontSize: "10px",
              color: "rgba(24,198,42,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            COMPOSICIÓN DIGITAL &amp; VFX
          </span>
        </div>
      </div>
    </footer>
  );
}