"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/utils/data-table";
import { Campania } from "@/redux/features/types/control-escolar/type";
import {
  useRetrieveCampaniasQuery,
  useHowManyCampaniasQuery,
} from "@/redux/features/control-escolar/campaniasApiSlice";
import { formatCurrency } from "@/lib/format-currency";

export default function CampaniasView() {
  const { data: howManyCampanias } = useHowManyCampaniasQuery();
  const { data: campanias } = useRetrieveCampaniasQuery();
  const headers: ColumnDef<Campania>[] = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Institucion",
      accessorKey: "institucion_nombre",
    },
    {
      header: "Fecha de inicio",
      accessorFn: (row) => row.fecha_inicio.split("-").reverse().join("/"),
    },
    {
      header: "Fecha de finalizacion",
      accessorFn: (row) => row.fecha_fin.split("-").reverse().join("/"),
    },
    {
      header: "Costo asignado",
      accessorFn: (row) => formatCurrency(parseInt(row.costo_asignado)),
    },
  ];
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {howManyCampanias ?? 0}
          </div>
          <div className="text-sm text-gray-600">Campañas Activas</div>
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
                placeholder="Nombre o descripción..."
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
        </div>
        {/* Lista de Campanias */}
        <div className="p-1 mt-5">
          {campanias?.results ? (
            <DataTable columns={headers} data={campanias?.results ?? []} />
          ) : (
            <div>Sin datos definidos</div>
          )}
        </div>
      </div>
    </>
  );
}
