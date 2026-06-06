"use client";

import { useState } from "react";
import {
  useGetSeguimientosQuery,
  useCompletarSeguimientoMutation,
} from "@/redux/features/crm/leadsApiSlice";
import {
  Calendar,
  CheckCircle,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";

type Tab = "pendientes" | "completados";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isVencido(fechaIso: string) {
  return new Date(fechaIso) < new Date();
}

function SkeletonCard() {
  return (
    <div className="animate-pulse border border-gray-200 rounded-xl p-4 flex gap-4">
      <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
        <div className="h-3 w-40 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export default function SeguimientosView() {
  const [tab, setTab] = useState<Tab>("pendientes");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetSeguimientosQuery({
    completado: tab === "completados",
    page,
  });
  const [completar, { isLoading: completing }] = useCompletarSeguimientoMutation();

  const seguimientos = data?.results ?? [];

  const handleCompletar = async (id: number) => {
    await completar(id);
    refetch();
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {(["pendientes", "completados"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Summary */}
      {!isLoading && data && (
        <p className="text-sm text-gray-500 mb-4">
          {data.count} seguimiento{data.count !== 1 ? "s" : ""} {tab}
        </p>
      )}

      {/* List */}
      <div className="space-y-3">
        {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading && seguimientos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-gray-200 rounded-xl">
            <CheckCheck className="w-10 h-10 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              No hay seguimientos {tab}
            </p>
          </div>
        )}

        {!isLoading &&
          seguimientos.map((seg) => {
            const vencido = !seg.completado && isVencido(seg.fecha_programada);
            return (
              <div
                key={seg.id}
                className={`border rounded-xl p-4 flex items-start gap-4 transition-colors ${
                  vencido
                    ? "border-red-200 bg-red-50"
                    : seg.completado
                    ? "border-gray-100 bg-gray-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    seg.completado
                      ? "bg-green-100"
                      : vencido
                      ? "bg-red-100"
                      : "bg-blue-50"
                  }`}
                >
                  {seg.completado ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : vencido ? (
                    <Clock className="w-4 h-4 text-red-500" />
                  ) : (
                    <Calendar className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {seg.tipo_detail?.nombre ?? `Tipo #${seg.tipo}`}
                    </span>
                    {vencido && (
                      <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                        Vencido
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 truncate">{seg.descripcion}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {fmt(seg.fecha_programada)}
                    </span>
                    {seg.responsable_nombre && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {seg.responsable_nombre}
                      </span>
                    )}
                    <Link
                      href={`/dashboard/crm/detalle-lead`}
                      className="text-blue-500 hover:underline"
                    >
                      Lead #{seg.lead}
                    </Link>
                  </div>
                  {seg.completado && seg.fecha_completado && (
                    <p className="text-xs text-green-600 mt-1">
                      Completado el {fmt(seg.fecha_completado)}
                    </p>
                  )}
                </div>

                {/* Action */}
                {!seg.completado && (
                  <button
                    type="button"
                    onClick={() => handleCompletar(seg.id)}
                    disabled={completing}
                    className="shrink-0 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    Completar
                  </button>
                )}
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      {(data?.next || data?.previous) && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Página {page} · {data.count} total
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={!data.previous}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}