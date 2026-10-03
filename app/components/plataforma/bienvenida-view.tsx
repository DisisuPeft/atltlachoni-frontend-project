"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  File,
  GraduationCap,
  ListChecks,
  Loader2,
  X,
} from "lucide-react";
import ExamenesView from "@/app/components/plataforma/examenes-view";
import ActividadesAlumnoView from "@/app/components/plataforma/actividades-alumno-view";
import type { Material } from "@/redux/features/types/control-escolar/type";
import { ProgramaHeader } from "./diplomado/programa-header";
import { FiltrosMateriales } from "./diplomado/filtros";
import { ModuloCard } from "./diplomado/modulo-card";
import { MaterialList } from "./diplomado/material-item";
import { MaterialViewer } from "./diplomado/material-viewer";
import { useContenidoDiplomado } from "./diplomado/use-contenido-diplomado";
import { usePreferenciaModulos } from "./diplomado/use-preferencia-modulos";
import { ToggleModulos } from "./diplomado/toggle-modulos";

interface Props {
  programaId: string;
  slug: string;
}

type Tab = "inicio" | "actividades" | "examenes";

const HERRAMIENTAS: { key: Exclude<Tab, "inicio">; label: string; icon: typeof ListChecks }[] = [
  { key: "actividades", label: "Actividades", icon: ListChecks },
  { key: "examenes", label: "Exámenes", icon: GraduationCap },
];

function VolverAlCurso({ onClick }: { onClick: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al diplomado
      </button>
    </div>
  );
}

export default function BienvenidaView({ programaId, slug }: Props) {
  const [tab, setTab] = useState<Tab>("inicio");
  const [selected, setSelected] = useState<Material | null>(null);

  const c = useContenidoDiplomado(programaId);
  const { contraidos, setContraidos } = usePreferenciaModulos();
  const basePath = `/plataforma/${slug}/${programaId}`;

  // Video de presentación: el primer video sin módulo (igual que antes).
  const presentacion = c.generales.find((m) => m.file_type === "video");
  const generalesLista = c.generalesVisibles.filter(
    (m) => m.id !== presentacion?.id,
  );

  const abrir = (m: Material) => {
    setSelected(m);
    document
      .getElementById("plataforma-main")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (tab === "actividades")
    return (
      <div className="min-h-full bg-slate-50">
        <VolverAlCurso onClick={() => setTab("inicio")} />
        <ActividadesAlumnoView programaId={programaId} />
      </div>
    );

  if (tab === "examenes")
    return (
      <div className="min-h-full bg-slate-50">
        <VolverAlCurso onClick={() => setTab("inicio")} />
        <ExamenesView programaId={programaId} />
      </div>
    );

  if (c.programaLoading)
    return (
      <div className="flex min-h-full items-center justify-center gap-2 bg-slate-50 py-24 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando tu diplomado…</span>
      </div>
    );

  if (c.programaError || !c.programa)
    return (
      <div className="flex min-h-full flex-col items-center gap-3 bg-slate-50 py-24 text-center">
        <AlertCircle className="h-10 w-10 text-slate-300" />
        <p className="text-sm text-slate-500">
          No pudimos cargar la información del programa.
        </p>
      </div>
    );

  const programa = c.programa;
  const sinResultados =
    c.modulosVisibles.length === 0 && generalesLista.length === 0;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/plataforma/educacion"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis{" "}
          {programa.tipo_nombre ? `${programa.tipo_nombre.toLowerCase()}s` : "programas"}
        </Link>

        <ProgramaHeader programa={programa} totalMateriales={c.totalMateriales} />

        {/* ── Visor: material seleccionado o video de presentación ── */}
        {selected ? (
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="break-words text-base font-semibold text-slate-900">
                  {selected.original_name}
                </h2>
                {selected.description && (
                  <p className="mt-0.5 text-sm text-slate-500">
                    {selected.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Cerrar material"
                className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <MaterialViewer material={selected} programaId={programaId} />
          </section>
        ) : presentacion ? (
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Presentación
            </p>
            <MaterialViewer material={presentacion} programaId={programaId} />
          </section>
        ) : null}

        {/* ── Contenido ─────────────────────────────────────────── */}
        <section className="space-y-4" aria-labelledby="contenido-title">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2
                id="contenido-title"
                className="text-lg font-semibold text-slate-900"
              >
                Contenido del {programa.tipo_nombre?.toLowerCase() ?? "programa"}
              </h2>
              <p className="text-sm text-slate-500">
                Módulos y sus materiales.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {c.materialesLoading && (
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Cargando materiales…
                </span>
              )}
              {c.modulosVisibles.length > 0 && (
                <ToggleModulos contraidos={contraidos} onChange={setContraidos} />
              )}
            </div>
          </div>

          <FiltrosMateriales
            modulos={c.entradas}
            moduloFiltro={c.moduloFiltro}
            onModulo={c.setModuloFiltro}
            tipoFiltro={c.tipoFiltro}
            onTipo={c.setTipoFiltro}
            conteo={c.conteo}
          />

          {c.entradas.length === 0 && generalesLista.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-slate-400">
              <BookOpen className="h-8 w-8" />
              <p className="text-sm">Aún no hay módulos publicados.</p>
            </div>
          ) : sinResultados ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-slate-400">
              <File className="h-8 w-8" />
              <p className="text-sm">No hay materiales que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {c.modulosVisibles.map(({ entrada, index, materiales }) => (
                <ModuloCard
                  // Remontar al cambiar la preferencia para aplicarla a todas.
                  key={`${entrada.key}-${contraidos}`}
                  defaultOpen={!contraidos}
                  nombre={entrada.nombre}
                  modulo={entrada.modulo}
                  index={index}
                  materiales={materiales}
                  filtrando={c.filtrandoTipo}
                  programaId={programaId}
                  basePath={basePath}
                  onOpen={abrir}
                  selectedId={selected?.id ?? null}
                />
              ))}

              {generalesLista.length > 0 && (
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Recursos generales
                  </h3>
                  <MaterialList
                    materiales={generalesLista}
                    programaId={programaId}
                    onOpen={abrir}
                    selectedId={selected?.id ?? null}
                  />
                </section>
              )}
            </div>
          )}
        </section>

        {/* ── Herramientas ──────────────────────────────────────── */}
        <section className="border-t border-slate-200 pt-6" aria-labelledby="herramientas-title">
          <h2 id="herramientas-title" className="text-lg font-semibold text-slate-900">
            Herramientas del {programa.tipo_nombre?.toLowerCase() ?? "programa"}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {HERRAMIENTAS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-800">
                  Ver {label.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
