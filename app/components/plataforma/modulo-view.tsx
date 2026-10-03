"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ModuloMateriales from "./modulo-materiales";
import { ModuloMeta } from "./diplomado/modulo-card";
import { useContenidoDiplomado } from "./diplomado/use-contenido-diplomado";

interface Props {
  moduloId: number;
  uuid: string;
  slug: string;
}

export default function ModuloView({ moduloId, uuid, slug }: Props) {
  // Misma fuente que la portada: módulos del programa + materiales del programa.
  const c = useContenidoDiplomado(uuid);
  const basePath = `/plataforma/${slug}/${uuid}`;
  const index = c.entradas.findIndex((e) => e.modulo?.id === Number(moduloId));
  const entrada = index >= 0 ? c.entradas[index] : null;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href={`${basePath}/bienvenida`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al {c.programa?.tipo_nombre?.toLowerCase() ?? "programa"}
        </Link>

        {c.programaLoading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando módulo…</span>
          </div>
        ) : !entrada ? (
          <p className="py-24 text-center text-sm text-slate-500">
            No encontramos este módulo en el programa.
          </p>
        ) : (
          <>
            <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                Módulo {index + 1}
                {c.programa?.nombre && (
                  <span className="normal-case tracking-normal text-slate-400">
                    {" "}· {c.programa.nombre}
                  </span>
                )}
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                {entrada.nombre}
              </h1>
              <div className="mt-2">
                <ModuloMeta modulo={entrada.modulo} />
              </div>
            </header>

            <ModuloMateriales
              materiales={entrada.materiales}
              programaId={uuid}
              loading={c.materialesLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
