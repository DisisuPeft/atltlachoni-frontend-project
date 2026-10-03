"use client";

import { useState } from "react";
import Link from "next/link";
import type { Material } from "@/redux/features/types/control-escolar/type";
import type { ModulosInterface } from "@/redux/features/types/alumnos/inscription";
import { ChevronDown, Clock, File } from "lucide-react";
import { MaterialList } from "./material-item";

export function ModuloMeta({
  modulo,
  totalMateriales,
}: {
  modulo: ModulosInterface | null;
  totalMateriales?: number;
}) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      {modulo && (
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {modulo.horas_teoricas} h teóricas · {modulo.horas_practicas} h prácticas
        </span>
      )}
      {totalMateriales !== undefined && (
        <span className="inline-flex items-center gap-1">
          <File className="h-3.5 w-3.5" />
          {totalMateriales} material{totalMateriales !== 1 ? "es" : ""}
        </span>
      )}
    </span>
  );
}

/** Tarjeta de módulo: los materiales cuelgan directo del módulo. */
export function ModuloCard({
  index,
  nombre,
  modulo,
  materiales,
  filtrando,
  programaId,
  basePath,
  onOpen,
  selectedId,
  defaultOpen = true,
}: {
  index: number;
  nombre: string;
  modulo: ModulosInterface | null;
  /** Materiales del módulo, ya filtrados por tipo si aplica. */
  materiales: Material[];
  filtrando: boolean;
  programaId: string;
  /** `/plataforma/{slug}/{ref}` */
  basePath: string;
  onOpen?: (m: Material) => void;
  selectedId?: number | null;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4 px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-700">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block text-sm font-semibold text-slate-900">{nombre}</span>
          <span className="mt-1 block">
            <ModuloMeta modulo={modulo} totalMateriales={materiales.length} />
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          {modulo && (
            <Link
              href={`${basePath}/modulo/${modulo.id}`}
              className="hidden rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-indigo-600 sm:inline-flex"
            >
              Ver módulo
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Contraer módulo" : "Expandir módulo"}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
          {materiales.length > 0 ? (
            <MaterialList
              materiales={materiales}
              programaId={programaId}
              onOpen={onOpen}
              selectedId={selectedId}
            />
          ) : (
            <p className="text-xs text-slate-400">
              {filtrando
                ? "No hay materiales de este tipo en el módulo."
                : "Este módulo aún no tiene materiales publicados."}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
