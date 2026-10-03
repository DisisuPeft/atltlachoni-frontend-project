"use client";

import { useState } from "react";
import type { Material } from "@/redux/features/types/control-escolar/type";
import {
  AlertCircle,
  ChevronDown,
  File,
  FileText,
  Film,
  Loader2,
  Play,
} from "lucide-react";
import { MaterialViewer } from "./material-viewer";
import { tipoDeMaterial, type TipoMaterial } from "./materiales";

const ICONOS: Record<TipoMaterial, { icon: typeof File; cls: string }> = {
  video: { icon: Film, cls: "text-indigo-600" },
  pdf: { icon: FileText, cls: "text-rose-500" },
  documento: { icon: FileText, cls: "text-slate-500" },
  otro: { icon: File, cls: "text-slate-400" },
};

export function VideoStatusPill({ status }: { status: Material["hls_status"] }) {
  if (status === "ready")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
        <Play className="h-3 w-3" />
        Listo
      </span>
    );
  if (status === "failed")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600">
        <AlertCircle className="h-3 w-3" />
        Con respaldo
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
      <Loader2 className="h-3 w-3 animate-spin" />
      {status === "processing" ? "Procesando" : "En cola"}
    </span>
  );
}

/**
 * Fila de material.
 * - Con `onOpen`: delega la apertura (p. ej. al visor superior de la portada).
 * - Sin `onOpen`: despliega el visor debajo de la fila.
 */
export function MaterialItem({
  material,
  programaId,
  onOpen,
  selected = false,
}: {
  material: Material;
  programaId: string;
  onOpen?: (m: Material) => void;
  selected?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const tipo = tipoDeMaterial(material);
  const { icon: Icon, cls } = ICONOS[tipo];
  const expanded = onOpen ? selected : open;

  return (
    <li>
      <button
        type="button"
        onClick={() => (onOpen ? onOpen(material) : setOpen((v) => !v))}
        aria-expanded={onOpen ? undefined : open}
        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 ${
          expanded ? "bg-indigo-50/60" : ""
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
          <Icon className={`h-4 w-4 ${cls}`} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-slate-800">
            {material.original_name}
          </span>
          {material.description && (
            <span className="block truncate text-xs text-slate-400">
              {material.description}
            </span>
          )}
        </span>
        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
          {material.size_formatted}
        </span>
        {tipo === "video" && <VideoStatusPill status={material.hls_status} />}
        {onOpen ? (
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${
              selected ? "text-indigo-700" : "text-indigo-600"
            }`}
          >
            {selected ? "En pantalla" : "Abrir"}
          </span>
        ) : (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {!onOpen && open && (
        <div className="px-3 pb-3">
          <MaterialViewer material={material} programaId={programaId} />
        </div>
      )}
    </li>
  );
}

export function MaterialList({
  materiales,
  programaId,
  onOpen,
  selectedId,
}: {
  materiales: Material[];
  programaId: string;
  onOpen?: (m: Material) => void;
  selectedId?: number | null;
}) {
  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
      {materiales.map((m) => (
        <MaterialItem
          key={m.id}
          material={m}
          programaId={programaId}
          onOpen={onOpen}
          selected={selectedId === m.id}
        />
      ))}
    </ul>
  );
}
