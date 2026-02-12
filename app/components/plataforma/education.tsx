"use client";

import { useState } from "react";
import { useInscriptionAlumnoDetailQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { IconCheck, IconClock, IconBook } from "./iconst";
import Link from "next/link";
import Image from "next/image";

export default function MainEducationDash() {
  const { data: detalleInscripcion } = useInscriptionAlumnoDetailQuery();
  const [filtro, setFiltro] = useState<"todos" | "progreso" | "completados">(
    "todos",
  );

  //   const cursosFiltrados = cursosData.filter((curso) => {
  //     if (filtro === "progreso") return curso.progreso < 100;
  //     if (filtro === "completados") return curso.progreso === 100;
  //     return true;
  //   });

  return (
    <div className="space-y-6 mt-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
        <p className="text-gray-600">Gestiona y continúa tu aprendizaje</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filtro === "todos"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {/* Todos ({cursosData.length}) */}
        </button>
        <button
          onClick={() => setFiltro("progreso")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filtro === "progreso"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {/* En progreso ({cursosData.filter((c) => c.progreso < 100).length}) */}
        </button>
        <button
          onClick={() => setFiltro("completados")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filtro === "completados"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {/* Completados ({cursosData.filter((c) => c.progreso === 100).length}) */}
        </button>
      </div>

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {detalleInscripcion?.programasInscritos.map((curso) => (
          <div
            key={curso.ref}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 hover:transition hover:duration-200 hover:ease-in-out transition-shadow"
          >
            <div className="relative">
              <Image
                src={"/assets/placeholder.png"}
                alt={curso.nombre}
                className="w-full h-40 object-cover"
                width={100}
                height={100}
                quality={100}
              />
              {/* {curso.progreso === 100 && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <IconCheck className="w-3 h-3" />
                  Completado
                </div>
              )} */}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {curso.tipo} en {curso.nombre}
              </h3>
              {/* <p className="text-gray-500 text-sm mb-4">{curso.tipo}</p> */}

              <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                <span className="flex items-center gap-1">
                  <IconClock className="w-4 h-4" />
                  Duracion: {curso.duracion} meses
                </span>
                <span className="flex items-center gap-1">
                  <IconBook className="w-4 h-4" />
                  {curso.modulos.length === 1
                    ? `${curso.modulos.length} leccion`
                    : `${curso.modulos.length} lecciones`}
                </span>
              </div>

              <div className="mb-4">
                {/* <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {curso.completadas} de {curso.lecciones} lecciones
                  </span>
                  <span className="text-blue-600 font-medium">
                    {curso.progreso}%
                  </span>
                </div> */}
                {/* <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${curso.progreso === 100 ? "bg-green-500" : "bg-blue-600"}`}
                    style={{ width: `${curso.progreso}%` }}
                  ></div>
                </div> */}
              </div>

              <Link
                href={`/plataforma/${curso.tipo}/${curso.ref}`}
                className={`w-full py-3 p-16 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700`}
              >
                {curso.modulos.length > curso.duracion
                  ? "Ver certificado"
                  : "Continuar curso"}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* {cursosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <IconBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No hay cursos en esta categoría
          </p>
        </div>
      )} */}
    </div>
  );
}
