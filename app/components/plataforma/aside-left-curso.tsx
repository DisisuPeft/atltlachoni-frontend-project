"use client";

import { IconChevronUp } from "./iconst";
import { useState } from "react";
import Link from "next/link";
import { useProgramaEstudianteQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
// import { usePathname } from "next/navigation";

export default function AsideCurso({ id, slug }: { id: string; slug: string }) {
  const { data: inscripcion } = useProgramaEstudianteQuery(id);
  // const pathname = usePathname();
  const [sidebarSeccion, setSidebarSeccion] = useState<
    "material" | "grades" | "notes"
  >("material");
  const [moduloActivo, setModuloActivo] = useState(1);
  return (
    <>
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 min-h-[calc(100vh-56px)] overflow-y-auto bg-white">
        {/* University logo + course name */}
        <div className="p-5 border-b border-gray-200">
          <div className="w-16 h-16 bg-[#0056D2] rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-2xl font-bold"></span>
          </div>
          <h2 className="font-bold text-gray-900 text-sm leading-snug">
            {slug} en {inscripcion?.nombre}
          </h2>
          <p className="text-xs text-[#0056D2] mt-0.5">
            {inscripcion?.institucion_nombre}
          </p>
        </div>

        {/* Navigation sections */}
        <div className="px-4 py-3">
          <button
            onClick={() => setSidebarSeccion("material")}
            className={`flex items-center gap-2 text-sm font-semibold w-full text-left mb-3 ${
              sidebarSeccion === "material"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <IconChevronUp
              className={`w-4 h-4 transition-transform ${sidebarSeccion === "material" ? "" : "rotate-180"}`}
            />
            Material del Curso
          </button>

          {sidebarSeccion === "material" && (
            <div className="space-y-0.5">
              {inscripcion?.modulos_obj.map((modulo) => (
                <Link
                  key={modulo.id}
                  href={`#`}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors ${
                    moduloActivo === modulo.id
                      ? "bg-white font-medium text-gray-900 border-l-3 border-[#0056D2] -ml-px pl-[11px]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{modulo.nombre}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Grades & Notes */}
        <div className="px-4 border-t border-gray-200 py-3 space-y-1">
          <button
            onClick={() => setSidebarSeccion("grades")}
            className={`w-full text-left text-sm font-semibold py-2 px-3 rounded-md transition-colors ${
              sidebarSeccion === "grades"
                ? "text-gray-900 bg-gray-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Calificaciones
          </button>
          <button
            onClick={() => setSidebarSeccion("notes")}
            className={`w-full text-left text-sm font-semibold py-2 px-3 rounded-md transition-colors ${
              sidebarSeccion === "notes"
                ? "text-gray-900 bg-gray-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Notas
          </button>
        </div>
      </aside>

      <main></main>
    </>
  );
}
