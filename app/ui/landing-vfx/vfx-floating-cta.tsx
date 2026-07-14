"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function scrollToForm() {
  document.getElementById("solicitar-informacion-vfx")?.scrollIntoView({ behavior: "smooth" });
}

export default function VfxFloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          {/* WhatsApp bubble */}
          <a
            href="https://wa.link/fgv19q"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp CINFA VFX"
            className="w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            style={{
              width: 52,
              height: 52,
              backgroundColor: "#25D366",
              boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
              <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.869.52 3.617 1.422 5.113L2 22l4.984-1.404A9.934 9.934 0 0012.001 22c5.522 0 9.999-4.477 9.999-9.999 0-5.523-4.477-10-9.999-10zm5.894 13.89c-.243.684-1.404 1.308-1.922 1.36-.519.053-1.009.246-3.402-.71-2.839-1.135-4.676-4.017-4.817-4.203-.14-.186-1.143-1.52-1.143-2.9s.722-2.055.978-2.337c.257-.281.56-.351.746-.351.186 0 .374.002.537.01.173.008.404-.065.632.483.232.558.788 1.928.857 2.067.07.14.116.302.023.488-.094.186-.14.302-.28.465-.14.163-.293.364-.42.49-.14.14-.284.292-.122.573.163.28.723 1.19 1.553 1.927.999.863 1.84 1.13 2.12 1.26.28.13.443.11.606-.07.163-.181.7-.815.887-1.095.186-.28.374-.233.63-.14.257.093 1.629.769 1.908.91.28.14.466.21.535.327.07.117.07.673-.172 1.356z" />
            </svg>
          </a>

          {/* Solicitar pill */}
          <button
            onClick={scrollToForm}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #050505 0%, #18C62A 100%)",
              color: "#FFFFFF",
              border: "1px solid rgba(24,198,42,0.4)",
              boxShadow: "0 4px 24px rgba(24,198,42,0.30)",
              fontFamily: "var(--font-orbitron, monospace)",
              fontSize: "11px",
              letterSpacing: "0.06em",
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "#18C62A", boxShadow: "0 0 6px #18C62A" }}
            />
            SOLICITAR
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}