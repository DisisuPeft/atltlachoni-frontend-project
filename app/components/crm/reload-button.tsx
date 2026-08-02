"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

/** Recarga la página actual. Cualquier usuario autenticado puede usarlo —
 * no dispara ninguna acción con permisos, solo un refresh normal. */
export default function ReloadButton() {
  const [reloading, setReloading] = useState(false);

  const handleReload = () => {
    setReloading(true);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleReload}
      disabled={reloading}
      title="Actualizar"
      aria-label="Actualizar página"
      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <RefreshCw
        className={`h-4 w-4 ${reloading ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      Actualizar
    </button>
  );
}
