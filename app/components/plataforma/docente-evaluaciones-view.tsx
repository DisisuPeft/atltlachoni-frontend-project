"use client";

import { useState } from "react";
import { ClipboardCheck, GraduationCap, Loader2 } from "lucide-react";
import { useGetMisProgramasDocenteQuery } from "@/redux/features/control-escolar/maestrosApiSlice";
import { useRetrieveProgramaQuery } from "@/redux/features/control-escolar/programasApiSlice";
import ProgramEvaluacionesTab from "@/app/components/control-escolar/programas/edit/program-evaluaciones-tab";

export default function DocenteEvaluacionesView({
  programaInicial,
}: {
  programaInicial?: string;
}) {
  const { data: programasData, isLoading: loadingProgramas } =
    useGetMisProgramasDocenteQuery();
  const programas = programasData?.programas ?? [];
  const initialRef = programas.some((programa) => programa.ref === programaInicial)
    ? programaInicial
    : programas[0]?.ref;
  const [selectedRef, setSelectedRef] = useState<string | undefined>(
    programaInicial,
  );
  const activeRef = programas.some((programa) => programa.ref === selectedRef)
    ? selectedRef
    : initialRef;
  const { data: programa, isLoading: loadingPrograma } = useRetrieveProgramaQuery(
    activeRef!,
    { skip: !activeRef },
  );

  if (loadingProgramas) {
    return <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400"><Loader2 className="h-5 w-5 animate-spin" />Cargando programas…</div>;
  }

  if (!programas.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-12 text-center">
          <GraduationCap className="mb-4 h-8 w-8 text-purple-400" />
          <p className="font-semibold text-gray-900">Sin programas asignados</p>
          <p className="mt-1 text-sm text-gray-400">Contacta al administrador para que te asigne a un programa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 md:py-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
        <p className="mt-1 text-sm text-gray-500">Crea exámenes y revisa las respuestas de tus alumnos.</p>
      </div>

      {programas.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {programas.map((programaItem) => (
            <button
              key={programaItem.ref}
              type="button"
              onClick={() => setSelectedRef(programaItem.ref)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                activeRef === programaItem.ref
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              {programaItem.nombre}
            </button>
          ))}
        </div>
      )}

      {programas.length === 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-600"><ClipboardCheck className="h-4 w-4 text-purple-500" />{programas[0].nombre}</div>
      )}

      {loadingPrograma ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400"><Loader2 className="h-5 w-5 animate-spin" />Cargando evaluaciones…</div>
      ) : programa?.id ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <ProgramEvaluacionesTab programaNumericId={programa.id} />
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-gray-400">No se pudo cargar el programa seleccionado.</p>
      )}
    </div>
  );
}
