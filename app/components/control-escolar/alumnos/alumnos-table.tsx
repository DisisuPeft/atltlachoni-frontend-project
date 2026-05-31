"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useGetEstudiantesQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { EstudiantePerfil } from "@/redux/features/types/control-escolar/type";
import { DataTable, StatusBadge } from "@/app/utils/data-table";
import ButtonLink from "../link-button";
import { Users } from "lucide-react";

const PAGE_SIZE = 10;

const columns: ColumnDef<EstudiantePerfil>[] = [
  {
    id: "matricula",
    header: "Matrícula",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-gray-500">
        {row.original.matricula}
      </span>
    ),
  },
  {
    id: "estudiante",
    header: "Estudiante",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-gray-900">
          {row.original.user_nombre}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{row.original.user_genero}</p>
      </div>
    ),
  },
  {
    id: "instituto",
    header: "Instituto",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 truncate max-w-[180px] block">
        {row.original.institucion_nombre ?? "—"}
      </span>
    ),
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ButtonLink
          icon="eye-icon"
          path={`/dashboard/control-escolar/alumnos/${row.original.ref}`}
        />
      </div>
    ),
  },
];

export default function EstudiantesPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";

  const [page, setPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(search);
  const [prevStatus, setPrevStatus] = useState(status);
  // Tracks the real last page once the backend confirms it (next === null)
  const [lastKnownPage, setLastKnownPage] = useState<number | null>(null);

  // Derived state: reset everything when filters change
  if (prevSearch !== search) { setPrevSearch(search); setPage(1); setLastKnownPage(null); }
  if (prevStatus !== status) { setPrevStatus(status); setPage(1); setLastKnownPage(null); }

  const { data: estudiantes, isLoading } = useGetEstudiantesQuery({
    page,
    search,
    status,
  });

  const hasNext = !!estudiantes?.next;
  const resultsLength = estudiantes?.results?.length ?? 0;

  // Derived state: discover the real last page when backend says next === null
  if (!isLoading && estudiantes !== undefined && !hasNext && resultsLength > 0) {
    if (lastKnownPage === null || page < lastKnownPage) setLastKnownPage(page);
  }
  // Derived state: auto-correct if we landed on an empty phantom page
  if (!isLoading && resultsLength === 0 && page > 1) {
    const target = lastKnownPage ?? page - 1;
    if (page !== target) setPage(Math.max(1, target));
  }

  // Use data.length to infer the backend's real page size (may differ from PAGE_SIZE)
  // Only when hasNext=true (not on last page), so we get a full-page sample
  const inferredPageSize = hasNext && resultsLength > 0 ? resultsLength : PAGE_SIZE;
  // Effective count: once we know the last page, cap pagination to avoid phantom pages
  const effectiveCount = lastKnownPage !== null
    ? lastKnownPage * inferredPageSize
    : (estudiantes?.count ?? 0);

  const activos =
    estudiantes?.results.filter((e) => e.status === 1).length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona y visualiza todos los estudiantes inscritos
          </p>
        </div>
        <ButtonLink
          path="/dashboard/control-escolar/alumnos/new"
          title="+ Nuevo Alumno"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {estudiantes?.count ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Total estudiantes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{activos}</p>
            <p className="text-xs text-gray-500">Activos esta página</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-500">#</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil(effectiveCount / inferredPageSize)}
            </p>
            <p className="text-xs text-gray-500">Páginas totales</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={estudiantes?.results ?? []}
        isLoading={isLoading}
        count={effectiveCount}
        pageSize={PAGE_SIZE}
        controlledPage={page}
        onPageChange={setPage}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Nombre, matrícula o email...",
          },
          {
            type: "select",
            key: "status",
            options: [
              { value: "all", label: "Todos los estados" },
              { value: "1", label: "Activo" },
              { value: "0", label: "Inactivo" },
            ],
          },
        ]}
        emptyIcon={Users}
        emptyMessage="No se encontraron estudiantes"
      />
    </div>
  );
}