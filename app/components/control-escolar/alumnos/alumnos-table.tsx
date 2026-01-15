"use client";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import { EstudiantePerfil } from "@/redux/features/types/control-escolar/type";
import { useGetEstudiantesQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import ButtonLink from "../link-button";

export default function EstudiantesPage() {
  const { data: estudiantes } = useGetEstudiantesQuery();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Estudiantes</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y visualiza todos los estudiantes inscritos
              </p>
            </div>
            <ButtonLink
              path="/dashboard/control-escolar/alumnos/new"
              title="+ Nuevo Alumno"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">
                {estudiantes?.count}
              </div>
              <div className="text-sm text-gray-600">Total Estudiantes</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-green-600">
                {/* {estudiantesActivos} */}
              </div>
              <div className="text-sm text-gray-600">Estudiantes Activos</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">
                {/* {estudiantesFiltrados.length} */}
              </div>
              <div className="text-sm text-gray-600">Resultados Filtrados</div>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nombre, matrícula o email..."
                    // value={busqueda}
                    // onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Filtro Programa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programa
                </label>
                <select
                  //   value={filtroPrograma}
                  //   onChange={(e) => setFiltroPrograma(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  {/* {programasUnicos.map((programa) => (
                    <option key={programa} value={programa}>
                      {programa}
                    </option>
                  ))} */}
                </select>
              </div>

              {/* Filtro Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  //   value={filtroStatus}
                  //   onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Botón limpiar filtros */}
            {/* {(busqueda ||
              filtroPrograma !== "all" ||
              filtroStatus !== "all") && (
              <button
                onClick={() => {
                  setBusqueda("");
                  setFiltroPrograma("all");
                  setFiltroStatus("all");
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            )} */}
          </div>
        </div>

        {/* Tabla de Estudiantes */}
        {estudiantes?.count === 0 || !estudiantes ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron estudiantes
            </h3>
            <p className="text-gray-600 mb-4">
              No hay estudiantes que coincidan con los filtros seleccionados
            </p>
            <button
              //   onClick={() => {
              //     setBusqueda("");
              //     setFiltroPrograma("all");
              //     setFiltroStatus("all");
              //   }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <p>Tabla</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
