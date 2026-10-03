"use client";

import { useMemo, useState } from "react";
import {
  useGetMaterialesProgramaQuery,
  useProgramaEstudianteQuery,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import type { Material } from "@/redux/features/types/control-escolar/type";
import type { ModulosInterface } from "@/redux/features/types/alumnos/inscription";
import { isMaterialVisible } from "@/app/utils/plataforma/materiales";
import { contarPorTipo, filtrarPorTipo, type TipoFiltro } from "./materiales";

/** Un módulo tal como se muestra: materiales del endpoint + horas del programa si coinciden. */
export interface ModuloEntrada {
  key: string;
  nombre: string;
  /** Datos del módulo en `programa_estudiante` (horas, id para su ruta), si se encontró. */
  modulo: ModulosInterface | null;
  materiales: Material[];
}

export type ModuloFiltro = string | "todos";

const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

/**
 * Los materiales se agrupan por el `modulo_id` que devuelve `materiales/?programa=`
 * (igual que las vistas de docente y admin). Los módulos de `programa_estudiante`
 * solo aportan orden y horas; se emparejan por id y, si no coincide, por nombre.
 */
export function useContenidoDiplomado(programaId: string) {
  const programaQuery = useProgramaEstudianteQuery(programaId);
  const materialesQuery = useGetMaterialesProgramaQuery(programaId);

  const [moduloFiltro, setModuloFiltro] = useState<ModuloFiltro>("todos");
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("todos");

  const modulosPrograma = useMemo(
    () => programaQuery.data?.modulos_obj ?? [],
    [programaQuery.data],
  );

  const { entradas, generales, total } = useMemo(() => {
    const grupos = (materialesQuery.data ?? []).map((g) => ({
      ...g,
      materiales: g.materiales.filter(isMaterialVisible),
    }));
    const usados = new Set<number>();
    const generales: Material[] = [];
    let total = 0;

    grupos.forEach((g, i) => {
      total += g.materiales.length;
      if (g.modulo_id == null) {
        generales.push(...g.materiales);
        usados.add(i);
      }
    });

    // 1) Módulos del programa, en su orden, con los grupos que les correspondan.
    const entradas: ModuloEntrada[] = modulosPrograma.map((m) => {
      const materiales: Material[] = [];
      grupos.forEach((g, i) => {
        if (usados.has(i)) return;
        if (
          Number(g.modulo_id) === m.id ||
          (norm(g.modulo_nombre) !== "" && norm(g.modulo_nombre) === norm(m.nombre))
        ) {
          materiales.push(...g.materiales);
          usados.add(i);
        }
      });
      return { key: `p-${m.id}`, nombre: m.nombre, modulo: m, materiales };
    });

    // 2) Grupos con módulo que no se pudieron emparejar: se muestran igual.
    grupos.forEach((g, i) => {
      if (usados.has(i)) return;
      const key = `g-${g.modulo_id}`;
      const existente = entradas.find((e) => e.key === key);
      if (existente) existente.materiales.push(...g.materiales);
      else
        entradas.push({
          key,
          nombre: g.modulo_nombre ?? "Módulo",
          modulo: null,
          materiales: [...g.materiales],
        });
    });

    return { entradas, generales, total };
  }, [materialesQuery.data, modulosPrograma]);

  const materialesLoading = materialesQuery.isLoading;

  const conteo = useMemo(() => {
    if (materialesLoading) return null;
    const base =
      moduloFiltro === "todos"
        ? [...generales, ...entradas.flatMap((e) => e.materiales)]
        : (entradas.find((e) => e.key === moduloFiltro)?.materiales ?? []);
    return contarPorTipo(base);
  }, [materialesLoading, moduloFiltro, entradas, generales]);

  const filtrandoTipo = tipoFiltro !== "todos";

  const modulosVisibles = entradas
    .map((entrada, index) => ({
      entrada,
      index,
      materiales: filtrarPorTipo(entrada.materiales, tipoFiltro),
    }))
    .filter(({ entrada }) => moduloFiltro === "todos" || entrada.key === moduloFiltro)
    .filter(({ materiales }) => !filtrandoTipo || materiales.length > 0);

  const generalesVisibles =
    moduloFiltro === "todos" ? filtrarPorTipo(generales, tipoFiltro) : [];

  return {
    programa: programaQuery.data,
    programaLoading: programaQuery.isLoading,
    programaError: programaQuery.isError,
    materialesLoading,
    entradas,
    generales,
    totalMateriales: materialesLoading ? null : total,
    conteo,
    moduloFiltro,
    setModuloFiltro,
    tipoFiltro,
    setTipoFiltro,
    filtrandoTipo,
    modulosVisibles,
    generalesVisibles,
  };
}
