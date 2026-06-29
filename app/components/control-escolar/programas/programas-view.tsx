"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  useRetrieveProgramasQuery,
  useActivarProgramaMutation,
  useDesactivarProgramaMutation,
} from "@/redux/features/control-escolar/programasApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { ProgramaEducativo } from "@/redux/features/types/control-escolar/type";
import { DataTable } from "@/app/utils/data-table";
import ButtonLink from "../link-button";
import { BookOpen, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

// ── Status chips ───────────────────────────────────────────────────────

type StatusFilter = "" | "1" | "0";

const STATUS_CHIPS: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "" },
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

// ── Toggle button ──────────────────────────────────────────────────────

function ToggleStatusButton({ programa }: { programa: ProgramaEducativo }) {
  const [activar, { isLoading: isActivating }] = useActivarProgramaMutation();
  const [desactivar, { isLoading: isDeactivating }] = useDesactivarProgramaMutation();
  const isLoading = isActivating || isDeactivating;
  const isActive = programa.status === 1;

  const handleToggle = async () => {
    const action = isActive ? "desactivar" : "activar";
    const { isConfirmed } = await Swal.fire({
      title: `¿${isActive ? "Desactivar" : "Activar"} programa?`,
      text: `${isActive ? "Desactivar" : "Activar"} "${programa.tipo_nombre} en ${programa.nombre}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isActive ? "Desactivar" : "Activar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: isActive ? "#dc2626" : "#0056D2",
    });
    if (!isConfirmed || !programa.ref) return;

    try {
      const fn = isActive ? desactivar : activar;
      const res = await fn(programa.ref).unwrap();
      Swal.fire({ icon: "success", title: res.message, timer: 2000, showConfirmButton: false });
    } catch (err: unknown) {
      const msg = (err as { data?: { detail?: string } })?.data?.detail ?? `No se pudo ${action} el programa.`;
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isActive ? "Desactivar" : "Activar"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isActive ? (
        <XCircle className="w-3.5 h-3.5" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5" />
      )}
      {isActive ? "Desactivar" : "Activar"}
    </button>
  );
}

// ── Columns ────────────────────────────────────────────────────────────

const columns: ColumnDef<ProgramaEducativo>[] = [
  {
    id: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-gray-900">
          {row.original.tipo_nombre} en {row.original.nombre}
        </p>
      </div>
    ),
  },
  {
    id: "instituto",
    header: "Instituto",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.institucion_nombre}
      </span>
    ),
  },
  {
    id: "modalidad",
    header: "Modalidad",
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
        {row.original.modalidad_nombre ?? "—"}
      </span>
    ),
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const active = row.original.status === 1;
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            active
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}`} />
          {active ? "Activo" : "Inactivo"}
        </span>
      );
    },
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <ToggleStatusButton programa={row.original} />
        <ButtonLink
          path={`/dashboard/control-escolar/programas/${row.original.ref}`}
          icon="eye-icon"
        />
      </div>
    ),
  },
];

// ── View ───────────────────────────────────────────────────────────────

export default function ProgramasView() {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("1");

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";

  const { data: user } = useRetrieveUserQuery();
  const instituto = user?.departamento_info?.instituto.id;

  const { data: programas, isLoading } = useRetrieveProgramasQuery({
    page,
    search,
    status: statusFilter,
    instituto,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {programas?.count ?? "—"}
            </p>
            <p className="text-xs text-gray-500">
              {statusFilter === "1" ? "Programas activos" : statusFilter === "0" ? "Programas inactivos" : "Total programas"}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-500">#</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil((programas?.count ?? 0) / 10)}
            </p>
            <p className="text-xs text-gray-500">Páginas totales</p>
          </div>
        </div>
      </div>

      {/* Status chips */}
      <div className="flex items-center gap-2">
        {STATUS_CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setStatusFilter(chip.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === chip.value
                ? "bg-[#0056D2] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#0056D2]/40 hover:text-[#0056D2]"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={programas?.results ?? []}
        isLoading={isLoading}
        count={programas?.count ?? 0}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Nombre, tipo o modalidad...",
          },
        ]}
        emptyIcon={BookOpen}
        emptyMessage="No se encontraron programas educativos"
      />
    </div>
  );
}