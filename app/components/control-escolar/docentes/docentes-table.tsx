"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useGetMaestrosQuery } from "@/redux/features/control-escolar/maestrosApiSlice";
import { useRetrieveUserQuery, useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import { useGetInstitucionesQuery } from "@/redux/features/catalogos/institucionesApiSlice";
import { MaestroPerfil } from "@/redux/features/types/control-escolar/type";
import { DataTable, StatusBadge } from "@/app/utils/data-table";
import ButtonLink from "../link-button";
import { GraduationCap } from "lucide-react";

const columns: ColumnDef<MaestroPerfil>[] = [
  {
    id: "docente",
    header: "Docente",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-gray-900">
          {row.original.user_nombre}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {row.original.user_genero}
        </p>
      </div>
    ),
  },
  {
    id: "cedula",
    header: "Cédula",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-gray-500">
        {row.original.numero_cedula ?? "—"}
      </span>
    ),
  },
  {
    id: "nivel",
    header: "Nivel educativo",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 truncate max-w-[180px] block">
        {row.original.nivel_educativo_nombre ?? "—"}
      </span>
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
    id: "certificado",
    header: "Certificado",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          row.original.tiene_certificado
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {row.original.tiene_certificado ? "Sí" : "No"}
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
          path={`/dashboard/control-escolar/docentes/${row.original.ref}`}
        />
      </div>
    ),
  },
];

export default function DocentesTable() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const institutoParam = searchParams.get("instituto") ?? "all";

  const { data: verify } = useVerifyUserQuery();
  const { data: user } = useRetrieveUserQuery();
  const isAdmin =
    verify?.superuser ||
    verify?.roles?.some((r) => r.nombre === "Administrador");
  const fixedInstituto = user?.departamento_info?.instituto.id;

  const instituto = isAdmin
    ? institutoParam !== "all"
      ? parseInt(institutoParam)
      : undefined
    : fixedInstituto;

  const { data: instituciones } = useGetInstitucionesQuery(undefined, {
    skip: !isAdmin,
  });

  const [page, setPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(search);
  const [prevStatus, setPrevStatus] = useState(status);
  const [prevInstituto, setPrevInstituto] = useState(institutoParam);
  const [lastKnownPage, setLastKnownPage] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState<number | null>(null);

  if (prevSearch !== search) { setPrevSearch(search); setPage(1); setLastKnownPage(null); }
  if (prevStatus !== status) { setPrevStatus(status); setPage(1); setLastKnownPage(null); }
  if (prevInstituto !== institutoParam) { setPrevInstituto(institutoParam); setPage(1); setLastKnownPage(null); }

  const { data: maestros, isLoading } = useGetMaestrosQuery({ page, search, status, instituto });

  const hasNext = !!maestros?.next;
  const resultsLength = maestros?.results?.length ?? 0;

  if (!isLoading && hasNext && resultsLength > 0 && pageSize !== resultsLength) {
    setPageSize(resultsLength);
  }
  if (!isLoading && !hasNext && resultsLength > 0) {
    if (lastKnownPage === null || page < lastKnownPage) setLastKnownPage(page);
  }
  if (!isLoading && resultsLength === 0 && page > 1) {
    const target = lastKnownPage ?? page - 1;
    if (page !== target) setPage(Math.max(1, target));
  }

  const effectivePageSize = pageSize ?? resultsLength;
  const effectiveCount =
    lastKnownPage !== null && effectivePageSize > 0
      ? lastKnownPage * effectivePageSize
      : (maestros?.count ?? 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plantilla Docente</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona el registro de docentes de la institución
          </p>
        </div>
        <ButtonLink
          path="/dashboard/control-escolar/docentes/new"
          title="+ Nuevo Docente"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {maestros?.count ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Total docentes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {maestros?.results.filter((m) => m.status === 1).length ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Activos esta página</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={maestros?.results ?? []}
        isLoading={isLoading}
        count={effectiveCount}
        pageSize={effectivePageSize || 1}
        controlledPage={page}
        onPageChange={setPage}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Nombre, cédula o email...",
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
          ...(isAdmin
            ? [
                {
                  type: "select" as const,
                  key: "instituto",
                  options: [
                    { value: "all", label: "Todos los institutos" },
                    ...(instituciones?.results ?? []).map((i) => ({
                      value: String(i.id),
                      label: i.nombre,
                    })),
                  ],
                },
              ]
            : []),
        ]}
        emptyIcon={GraduationCap}
        emptyMessage="No se encontraron docentes"
      />
    </div>
  );
}