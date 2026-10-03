"use client";

import { GraduationCap } from "lucide-react";
import { TIPOS_FILTRO, type TipoFiltro } from "./materiales";
import type { ModuloFiltro } from "./use-contenido-diplomado";

function chip(active: boolean) {
  return `inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? "bg-indigo-600 text-white shadow-sm"
      : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
  }`;
}

/** Filtros por módulo (opcional) y por tipo de material. */
export function FiltrosMateriales({
  modulos,
  moduloFiltro,
  onModulo,
  tipoFiltro,
  onTipo,
  conteo,
}: {
  modulos?: { key: string; nombre: string }[];
  moduloFiltro?: ModuloFiltro;
  onModulo?: (m: ModuloFiltro) => void;
  tipoFiltro: TipoFiltro;
  onTipo: (t: TipoFiltro) => void;
  /** Conteo por tipo; `null` mientras cargan los materiales. */
  conteo: Record<TipoFiltro, number> | null;
}) {
  return (
    <section className="space-y-2" aria-label="Filtros de contenido">
      {modulos && onModulo && modulos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onModulo("todos")}
            className={chip(moduloFiltro === "todos")}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Todos los módulos
          </button>
          {modulos.map((m, i) => (
            <button
              key={m.key}
              type="button"
              onClick={() => onModulo(m.key)}
              className={chip(moduloFiltro === m.key)}
              title={m.nombre}
            >
              Módulo {i + 1}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TIPOS_FILTRO.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onTipo(t.key)}
            className={chip(tipoFiltro === t.key)}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                tipoFiltro === t.key
                  ? "bg-white/20"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {conteo ? conteo[t.key] : "…"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
