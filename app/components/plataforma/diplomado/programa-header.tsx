"use client";

import Image from "next/image";
import type { ProgramaEducativoDetail } from "@/redux/features/types/control-escolar/type";
import { BookOpen, CalendarClock, Clock, File } from "lucide-react";

/**
 * Encabezado del diplomado. Solo usa campos de `programa_estudiante`;
 * estatus de inscripción, generación y créditos no se exponen al alumno.
 */
export function ProgramaHeader({
  programa,
  totalMateriales,
}: {
  programa: ProgramaEducativoDetail;
  /** `null` mientras cargan los materiales. */
  totalMateriales: number | null;
}) {
  const modulos = programa.modulos_obj ?? [];
  const horas =
    modulos.reduce((s, m) => s + (m.horas_totales ?? 0), 0) ||
    programa.duracion_horas ||
    null;

  const stats = [
    { icon: BookOpen, label: "Módulos", value: modulos.length },
    { icon: File, label: "Materiales", value: totalMateriales ?? "…" },
    ...(horas ? [{ icon: Clock, label: "Horas", value: horas }] : []),
  ];

  return (
    <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {programa.banner_url && (
        <div className="relative h-28 bg-slate-200 sm:h-36">
          <Image
            src={programa.banner_url}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            {[programa.tipo_nombre, programa.modalidad_nombre]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {programa.nombre}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            {programa.institucion_nombre && (
              <span>{programa.institucion_nombre}</span>
            )}
            {programa.horario && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4 text-slate-400" />
                {programa.horario}
              </span>
            )}
          </div>
          {programa.descripcion && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {programa.descripcion}
            </p>
          )}
        </div>

        <dl
          className={`grid grid-cols-2 gap-3 ${stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-inset ring-slate-100"
            >
              <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold text-slate-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
