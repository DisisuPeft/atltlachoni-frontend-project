"use client";

import { useState } from "react";
import type { Material } from "@/redux/features/types/control-escolar/type";
import { Loader2 } from "lucide-react";
import { FiltrosMateriales } from "./diplomado/filtros";
import { MaterialList } from "./diplomado/material-item";
import {
  contarPorTipo,
  filtrarPorTipo,
  type TipoFiltro,
} from "./diplomado/materiales";

interface Props {
  materiales: Material[];
  programaId: string;
  loading: boolean;
}

/** Materiales del módulo, filtrables por tipo. */
export default function ModuloMateriales({ materiales, programaId, loading }: Props) {
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("todos");
  const visibles = filtrarPorTipo(materiales, tipoFiltro);

  return (
    <section className="space-y-4" aria-labelledby="materiales-modulo-title">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="materiales-modulo-title" className="text-lg font-semibold text-slate-900">
          Materiales del módulo
        </h2>
        {loading && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Cargando materiales…
          </span>
        )}
      </div>

      {materiales.length > 0 && (
        <FiltrosMateriales
          tipoFiltro={tipoFiltro}
          onTipo={setTipoFiltro}
          conteo={contarPorTipo(materiales)}
        />
      )}

      {!loading && visibles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400">
          {materiales.length === 0
            ? "Este módulo aún no tiene materiales publicados."
            : "No hay materiales de este tipo en el módulo."}
        </p>
      ) : (
        <MaterialList materiales={visibles} programaId={programaId} />
      )}
    </section>
  );
}
