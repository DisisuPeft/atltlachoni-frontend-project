"use client";

import Link from "next/link";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
// import { InscriptionDetail } from "@/redux/features/types/alumnos/inscription";
import { IconBook, IconCheck, IconPlay } from "./iconst";
import ButtonLink from "../control-escolar/link-button";
import { useInscriptionAlumnoDetailQuery } from "@/redux/features/control-escolar/alumnosApiSlice";

// interface Props {
//   inscription: InscriptionDetail | undefined;
//   isLoading?: boolean;
// }

export default function Dashboard() {
  const { data: user } = useRetrieveUserQuery();
  // console.log(inscription?.programasInscritos);
  const { data: inscription, isLoading } = useInscriptionAlumnoDetailQuery();
  return (
    <div className="space-y-8 mt-12">
      {/* Header de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Hola, {user?.nombre_completo}!
        </h1>
        <p className="text-blue-100 text-lg">
          Continúa aprendiendo y alcanza tus metas.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconBook className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cursos activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {inscription?.countCursos ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IconCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completados</p>
              <p className="text-2xl font-bold text-gray-900">
                {inscription?.completados ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <IconClock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Horas esta semana</p>
              <p className="text-2xl font-bold text-gray-900">{totalHoras}</p>
            </div>
          </div>
        </div> */}

        {/* <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <IconAward className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Racha de días</p>
              <p className="text-2xl font-bold text-gray-900">{racha} 🔥</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Continuar aprendiendo */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Continúa donde lo dejaste
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inscription?.programasInscritos?.length === 0 && !isLoading ? (
            <div>Sin datos</div>
          ) : (
            <>
              {inscription?.programasInscritos?.map((programa) => (
                <div
                  key={programa.ref}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex"
                >
                  <img
                    src={programa.imagen_url || "/assets/placeholder.png"}
                    alt={programa.nombre}
                    className="w-32 h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {programa.tipo} en {programa.nombre}
                    </h3>
                    <div className="mb-2">
                      {/* <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Tipo</span>
                        <span className="text-blue-600 font-medium">
                          {programa.tipo}
                        </span>
                      </div> */}
                    </div>
                    <ButtonLink
                      path={`/plataforma/${programa.tipo}/${programa.ref}`}
                    >
                      <IconPlay className="w-4 h-4" />
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Actividad reciente */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividad reciente
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          {/* {actividadReciente.map((actividad) => (
            <div key={actividad.id} className="p-4 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  actividad.tipo === "leccion"
                    ? "bg-blue-100"
                    : actividad.tipo === "quiz"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                }`}
              >
                {actividad.tipo === "leccion" && (
                  <IconPlay className="w-5 h-5 text-blue-600" />
                )}
                {actividad.tipo === "quiz" && (
                  <IconCheck className="w-5 h-5 text-green-600" />
                )}
                {actividad.tipo === "certificado" && (
                  <IconAward className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{actividad.texto}</p>
                <p className="text-gray-500 text-sm">{actividad.tiempo}</p>
              </div>
            </div>
          ))} */}
          <div className="flex justify-center p-5">
            Sin Actividades recientes
          </div>
        </div>
      </div>
    </div>
  );
}
