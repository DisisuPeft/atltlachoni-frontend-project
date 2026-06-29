"use client";

import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/utils/data-table";
import { Campania } from "@/redux/features/types/control-escolar/type";
import {
  useRetrieveCampaniasQuery,
  useActivarCampaniaMutation,
  useDesactivarCampaniaMutation,
} from "@/redux/features/control-escolar/campaniasApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { formatCurrency } from "@/lib/format-currency";
import { Loader2, Megaphone } from "lucide-react";
import Swal from "sweetalert2";

// ── Status toggle ─────────────────────────────────────────────────────

function StatusToggle({
  campania,
  onRefetch,
}: {
  campania: Campania;
  onRefetch: () => void;
}) {
  const [activar, { isLoading: isActivando }] = useActivarCampaniaMutation();
  const [desactivar, { isLoading: isDesactivando }] =
    useDesactivarCampaniaMutation();
  const isActive = campania.status === 1;
  const isLoading = isActivando || isDesactivando;

  const handleToggle = async () => {
    if (isActive) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Desactivar campaña",
        text: `¿Desactivar "${campania.nombre}"?`,
        showCancelButton: true,
        confirmButtonText: "Desactivar",
        confirmButtonColor: "#dc2626",
        cancelButtonText: "Cancelar",
      });
      if (!result.isConfirmed) return;
      try {
        await desactivar(campania.id).unwrap();
        onRefetch();
      } catch (err: unknown) {
        const msg =
          (err as { data?: { detail?: string } })?.data?.detail ??
          "No se pudo desactivar la campaña.";
        Swal.fire({ icon: "error", title: "Error", text: msg });
      }
    } else {
      try {
        await activar(campania.id).unwrap();
        onRefetch();
      } catch (err: unknown) {
        const msg =
          (err as { data?: { detail?: string } })?.data?.detail ??
          "No se pudo activar la campaña.";
        Swal.fire({ icon: "error", title: "Error", text: msg });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        title={isActive ? "Desactivar campaña" : "Activar campaña"}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
          isActive
            ? "bg-emerald-500 border-emerald-500"
            : "bg-gray-200 border-gray-200"
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin text-white absolute left-1/2 -translate-x-1/2" />
        ) : (
          <span
            className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${
              isActive ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        )}
      </button>
      <span
        className={`text-xs font-medium ${
          isActive ? "text-emerald-700" : "text-gray-400"
        }`}
      >
        {isActive ? "Activa" : "Inactiva"}
      </span>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────

export default function CampaniasView() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";

  const { data: user } = useRetrieveUserQuery();
  const instituto = user?.departamento_info?.instituto.id;

  const {
    data: campanias,
    isLoading,
    refetch,
  } = useRetrieveCampaniasQuery({
    page,
    search,
    instituto,
  });
  console.log(campanias);
  const columns: ColumnDef<Campania>[] = [
    {
      id: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <p className="text-sm font-medium text-gray-900">
          {row.original.nombre}
        </p>
      ),
    },
    {
      id: "institucion",
      header: "Institución",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.institucion_nombre}
        </span>
      ),
    },
    {
      id: "fecha_inicio",
      header: "Inicio",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.fecha_inicio.split("-").reverse().join("/")}
        </span>
      ),
    },
    {
      id: "fecha_fin",
      header: "Fin",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.fecha_fin.split("-").reverse().join("/")}
        </span>
      ),
    },
    {
      id: "costo",
      header: "Costo asignado",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(parseInt(row.original.costo_asignado))}
        </span>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <StatusToggle campania={row.original} onRefetch={refetch} />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {campanias?.count ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Total campañas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {campanias?.results?.filter((c) => c.status === 1).length ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Campañas activas</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={campanias?.results ?? []}
        isLoading={isLoading}
        count={campanias?.count ?? 0}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Nombre o institución...",
          },
        ]}
        emptyIcon={Megaphone}
        emptyMessage="No se encontraron campañas"
      />
    </div>
  );
}
