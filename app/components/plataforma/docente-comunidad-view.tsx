"use client";

import { useState } from "react";
import { useGetMisProgramasDocenteQuery } from "@/redux/features/control-escolar/maestrosApiSlice";
import ComentariosView from "@/app/components/plataforma/comentarios-view";
import { BookOpen, GraduationCap } from "lucide-react";

export default function DocenteComunidadView({
  programaInicial,
}: {
  programaInicial?: string;
}) {
  const { data: programasData, isLoading: loadingProgramas } = useGetMisProgramasDocenteQuery();
  const programas = programasData?.programas ?? [];

  const [selectedRef, setSelectedRef] = useState<string | null>(programaInicial ?? null);
  const activeRef = selectedRef && programas.some((programa) => programa.ref === selectedRef)
    ? selectedRef
    : programas[0]?.ref ?? null;

  if (loadingProgramas) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (programas.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-gray-100 rounded-xl p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-purple-400" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Sin programas asignados</p>
          <p className="text-sm text-gray-400">Contacta al administrador para que te asigne a un programa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comunidad</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preguntas y comentarios de tus alumnos en cada programa asignado
        </p>
      </div>

      {programas.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {programas.map((p) => (
            <button
              key={p.ref}
              type="button"
              onClick={() => setSelectedRef(p.ref)}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors border ${
                activeRef === p.ref
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              {p.nombre}
            </button>
          ))}
        </div>
      )}

      {programas.length === 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <span className="font-medium">{programas[0].nombre}</span>
        </div>
      )}

      {activeRef && <ComentariosView key={activeRef} diplomadoId={activeRef} />}
    </div>
  );
}
