"use client";

import Link from "next/link";
import { ArrowLeft, File, FolderOpen, Loader2 } from "lucide-react";
import { FiltrosMateriales } from "./diplomado/filtros";
import { ModuloCard } from "./diplomado/modulo-card";
import { MaterialList } from "./diplomado/material-item";
import { useContenidoDiplomado } from "./diplomado/use-contenido-diplomado";
import { usePreferenciaModulos } from "./diplomado/use-preferencia-modulos";
import { ToggleModulos } from "./diplomado/toggle-modulos";

interface Props {
  programaId: string;
  slug: string;
}

export default function ArchivosProgramaView({ programaId, slug }: Props) {
  const c = useContenidoDiplomado(programaId);
  const { contraidos, setContraidos } = usePreferenciaModulos();
  const basePath = `/plataforma/${slug}/${programaId}`;
  const loading = c.programaLoading || c.materialesLoading;
  const sinMateriales = !loading && c.totalMateriales === 0;
  const sinResultados =
    c.modulosVisibles.length === 0 && c.generalesVisibles.length === 0;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href={`${basePath}/bienvenida`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al {c.programa?.tipo_nombre?.toLowerCase() ?? "programa"}
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Archivos del {c.programa?.tipo_nombre?.toLowerCase() ?? "programa"}
            </h1>
            {c.programa && (
              <p className="text-sm text-slate-500">{c.programa.nombre}</p>
            )}
          </div>
          {!loading && !sinMateriales && c.modulosVisibles.length > 0 && (
            <ToggleModulos contraidos={contraidos} onChange={setContraidos} />
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando archivos…</span>
          </div>
        ) : sinMateriales ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-slate-400">
            <FolderOpen className="h-8 w-8" />
            <p className="text-sm">No hay archivos disponibles para este programa.</p>
          </div>
        ) : (
          <>
            <FiltrosMateriales
              modulos={c.entradas}
              moduloFiltro={c.moduloFiltro}
              onModulo={c.setModuloFiltro}
              tipoFiltro={c.tipoFiltro}
              onTipo={c.setTipoFiltro}
              conteo={c.conteo}
            />

            {sinResultados ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-slate-400">
                <File className="h-8 w-8" />
                <p className="text-sm">No hay archivos que coincidan con los filtros.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {c.modulosVisibles.map(({ entrada, index, materiales }) => (
                  <ModuloCard
                    // Remontar al usar "Expandir/Contraer todo".
                    key={`${entrada.key}-${contraidos}`}
                    nombre={entrada.nombre}
                    modulo={entrada.modulo}
                    index={index}
                    materiales={materiales}
                    filtrando={c.filtrandoTipo}
                    programaId={programaId}
                    basePath={basePath}
                    defaultOpen={!contraidos}
                  />
                ))}

                {c.generalesVisibles.length > 0 && (
                  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">
                      Recursos generales
                    </h3>
                    <MaterialList
                      materiales={c.generalesVisibles}
                      programaId={programaId}
                    />
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
