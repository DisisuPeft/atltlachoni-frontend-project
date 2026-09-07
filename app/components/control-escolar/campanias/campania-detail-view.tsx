"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetCampaniaByIdQuery } from "@/redux/features/control-escolar/campaniasApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { formatCurrency } from "@/lib/format-currency";
import CampaniaAnunciosMetaTab from "./campania-anuncios-meta-tab";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";

interface Props {
  id: number;
}

export default function CampaniaDetailView({ id }: Props) {
  const ref = useSearchParams().get("ref");
  const { data: campania, isLoading } = useGetCampaniaByIdQuery(id);
  const { data: user } = useRetrieveUserQuery();

  const canEdit =
    user?.roles_list?.some((r) =>
      ["Administrador", "Tutor"].includes(r.nombre),
    ) ?? false;

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Cargando campaña...</p>
      </div>
    );
  }

  if (!campania) {
    return (
      <div className="py-24 text-center text-sm text-gray-400">
        No se encontró la campaña.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href={`/dashboard/control-escolar/campanias${ref ? `?ref=${ref}` : ""}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a campañas
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {campania.nombre}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {campania.programa_nombre || "Sin programa"} ·{" "}
              {campania.institucion_nombre || "Sin instituto asignado"}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                campania.status === 1
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {campania.status === 1 ? "Activa" : "Inactiva"}
            </span>
            {canEdit && (
              <Link
                href={`/dashboard/control-escolar/campanias/${campania.id}/edit${ref ? `?ref=${ref}` : ""}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-[#0056D2] hover:border-[#0056D2] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar campaña
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Inicio
            </p>
            <p className="text-sm text-gray-700">
              {campania.fecha_inicio
                ? campania.fecha_inicio.split("-").reverse().join("/")
                : "Sin definir"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Fin
            </p>
            <p className="text-sm text-gray-700">
              {campania.fecha_fin
                ? campania.fecha_fin.split("-").reverse().join("/")
                : "Sin definir"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Costo asignado
            </p>
            <p className="text-sm text-gray-700">
              {formatCurrency(parseFloat(campania.costo_asignado || "0") || 0)}
            </p>
          </div>
        </div>

        {campania.descripcion && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Descripción
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {campania.descripcion}
            </p>
          </div>
        )}
      </div>

      {/* Anuncios de Meta Ads */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">
          Anuncios de Meta Ads
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Vincula los anuncios, conjuntos o campañas de Meta Ads (Click to
          WhatsApp) que deben asignarse a esta campaña.
        </p>
        <CampaniaAnunciosMetaTab campaniaId={campania.id} />
      </div>
    </div>
  );
}
