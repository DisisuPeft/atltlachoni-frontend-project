"use client";

import { useState } from "react";
import { useGetCampaniasProximasQuery } from "@/redux/features/control-escolar/dashboardApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import Link from "next/link";
import { ArrowRight, Megaphone, Users, CalendarRange } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";

function Skeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="py-4 space-y-2">
          <div className="h-3.5 w-36 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function DaysLeft({ fechaFin }: { fechaFin: string }) {
  const [now] = useState(() => Date.now());
  const diff = Math.ceil(
    (new Date(fechaFin).getTime() - now) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0)
    return <span className="text-xs text-red-500 font-medium">Vencida</span>;
  if (diff === 0)
    return (
      <span className="text-xs text-orange-500 font-medium">Vence hoy</span>
    );
  if (diff <= 7)
    return (
      <span className="text-xs text-orange-500 font-medium">
        {diff}d restantes
      </span>
    );
  return <span className="text-xs text-gray-400">{diff}d restantes</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CampaniasProximas() {
  const { data: user } = useRetrieveUserQuery();
  const instituto = user?.departamento_info?.instituto.id;
  const { data: campanias, isLoading } = useGetCampaniasProximasQuery({
    instituto,
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">
            Campañas próximas
          </h2>
        </div>
        <Link
          href="/dashboard/control-escolar/campanias"
          className="flex items-center gap-1 text-xs text-[#0056D2] hover:underline font-medium"
        >
          Ver todas
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="px-5 py-2">
        {isLoading ? (
          <Skeleton />
        ) : !campanias?.length ? (
          <div className="py-10 text-center">
            <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Sin campañas próximas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {campanias.map((campania, index) => (
              <div key={`${campania.id}-${index}`} className="py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {campania.nombre}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {campania.programa}
                    </p>
                  </div>
                  <DaysLeft fechaFin={campania.fecha_fin} />
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarRange className="w-3 h-3 shrink-0" />
                    {formatDate(campania.fecha_inicio)} —{" "}
                    {formatDate(campania.fecha_fin)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="w-3 h-3 shrink-0" />
                    {campania.total_inscritos} inscritos
                  </span>
                  {campania.costo_asignado > 0 && (
                    <span className="text-gray-400">
                      {formatCurrency(campania.costo_asignado)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
