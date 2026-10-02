"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCarteraVencidaQuery } from "@/redux/features/control-escolar/pagosApiSlice";
import { useRetrieveCampaniasQuery } from "@/redux/features/control-escolar/campaniasApiSlice";
import { useGetInstitucionesQuery } from "@/redux/features/catalogos/institucionesApiSlice";
import {
  useRetrieveUserQuery,
  useVerifyUserQuery,
} from "@/redux/features/auth/authApiSlice";
import {
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  DollarSign,
  Loader2,
  Search,
  ShieldX,
  Users,
} from "lucide-react";

const LIMITES = [100, 250, 500];

function fmtMXN(monto: string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(parseFloat(monto));
}

// fecha_vencimiento llega como "YYYY-MM-DD"; new Date() la tomaría como UTC y restaría un día.
function fmtFecha(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function diasClass(dias: number) {
  if (dias > 60) return "bg-red-100 text-red-700";
  if (dias > 30) return "bg-orange-100 text-orange-700";
  return "bg-amber-100 text-amber-700";
}

function KpiCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function CarteraVencidaView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduloRef = searchParams.get("ref");

  const { data: verify } = useVerifyUserQuery();
  const { data: user } = useRetrieveUserQuery();
  const isAdmin =
    verify?.superuser ||
    verify?.roles?.some((r) => r.nombre === "Administrador");
  const fixedInstituto = user?.departamento_info?.instituto.id;

  const [institutoSel, setInstitutoSel] = useState<number | "">("");
  const [campania, setCampania] = useState<number | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [diasMin, setDiasMin] = useState<number | "">("");
  const [limit, setLimit] = useState(100);

  // Debounce de la búsqueda por nombre/matrícula.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Admin elige instituto; el resto queda acotado al suyo (igual que la tabla de alumnos).
  const instituto = isAdmin
    ? institutoSel === ""
      ? undefined
      : institutoSel
    : fixedInstituto;

  const { data: instituciones } = useGetInstitucionesQuery(undefined, {
    skip: !isAdmin,
  });
  const { data: campanias } = useRetrieveCampaniasQuery({ instituto });

  const { data, isLoading, isFetching, error } = useGetCarteraVencidaQuery({
    instituto,
    campania: campania === "" ? undefined : campania,
    search: search || undefined,
    dias_min: diasMin === "" ? undefined : diasMin,
    limit,
  });

  const status = (error as { status?: number } | undefined)?.status;

  const abrirEstadoCuenta = (estudianteRef: string) => {
    // Con `ref` el detalle del alumno abre directo en la pestaña de inscripciones/pagos.
    const qs = moduloRef ? `?ref=${moduloRef}` : "";
    router.push(`/dashboard/control-escolar/alumnos/${estudianteRef}${qs}`);
  };

  const selectCls =
    "text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]";

  if (status === 403) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <ShieldX className="w-10 h-10 text-red-400" />
        <p className="text-sm font-medium text-gray-700">No autorizado</p>
        <p className="text-xs text-gray-400">
          Solo Administradores y Tutores pueden consultar la cartera vencida.
        </p>
      </div>
    );
  }

  const pagos = data?.pagos ?? [];
  const resumen = data?.resumen;
  const recortado = resumen && resumen.total_pagos_vencidos > pagos.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cartera vencida</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Pagos pendientes cuya fecha de vencimiento ya pasó, los más urgentes
          primero.
        </p>
      </div>

      {/* KPIs: reflejan el total filtrado, sin aplicar el límite de filas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          icon={DollarSign}
          label="Monto total vencido"
          value={resumen ? fmtMXN(resumen.monto_total_vencido) : "—"}
          color="bg-red-50 text-red-600"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Pagos vencidos"
          value={resumen?.total_pagos_vencidos ?? "—"}
          color="bg-amber-50 text-amber-600"
        />
        <KpiCard
          icon={Users}
          label="Alumnos afectados"
          value={resumen?.total_estudiantes_afectados ?? "—"}
          color="bg-[#F0F6FF] text-[#0056D2]"
        />
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre o matrícula"
            className={`${selectCls} w-full pl-9`}
          />
        </div>
        {isAdmin && (
          <select
            value={institutoSel}
            onChange={(e) => {
              setInstitutoSel(
                e.target.value === "" ? "" : Number(e.target.value),
              );
              setCampania("");
            }}
            className={selectCls}
            aria-label="Instituto"
          >
            <option value="">Todos los institutos</option>
            {instituciones?.results?.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        )}
        <select
          value={campania}
          onChange={(e) =>
            setCampania(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={selectCls}
          aria-label="Campaña"
        >
          <option value="">Todas las campañas</option>
          {campanias?.results?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          value={diasMin}
          onChange={(e) =>
            setDiasMin(
              e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
            )
          }
          placeholder="Días mín. de atraso"
          aria-label="Días mínimos de atraso"
          className={`${selectCls} w-44`}
        />
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className={selectCls}
          aria-label="Máximo de filas"
        >
          {LIMITES.map((l) => (
            <option key={l} value={l}>
              Mostrar {l}
            </option>
          ))}
        </select>
        {isFetching && !isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      {recortado && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Mostrando {pagos.length} de {resumen.total_pagos_vencidos} pagos
          vencidos. Ajusta los filtros o aumenta el límite para ver más.
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando cartera vencida…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
            <AlertCircle className="w-8 h-8 text-red-300" />
            <p className="text-sm">No se pudo cargar la cartera vencida.</p>
          </div>
        ) : pagos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
            <DollarSign className="w-8 h-8" />
            <p className="text-sm">No hay pagos vencidos con estos filtros.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Alumno</th>
                  <th className="px-4 py-3 text-left font-medium">Programa</th>
                  <th className="px-4 py-3 text-left font-medium">Concepto</th>
                  <th className="px-4 py-3 text-right font-medium">Monto</th>
                  <th className="px-4 py-3 text-left font-medium">Venció</th>
                  <th className="px-4 py-3 text-left font-medium">Atraso</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Saldo inscripción
                  </th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagos.map((p) => {
                  // Solo un `false` explícito cuenta como inactivo; si el campo no llega, se asume activo.
                  const inactivo = p.estudiante_activo === false;
                  return (
                  <tr
                    key={p.pago_id}
                    onClick={() => abrirEstadoCuenta(p.estudiante_ref)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${inactivo ? "bg-gray-50/60 text-gray-500" : ""}`}
                    title="Ver estado de cuenta del alumno"
                  >
                    <td className="px-4 py-3">
                      <p className="flex items-center gap-2">
                        <span
                          className={`font-medium ${inactivo ? "text-gray-500" : "text-gray-900"}`}
                        >
                          {p.estudiante_nombre}
                        </span>
                        {inactivo && (
                          <span
                            className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-gray-200 text-gray-600"
                            title="Alumno desactivado; el adeudo sigue vigente"
                          >
                            Inactivo
                          </span>
                        )}
                      </p>
                      <p className="text-xs font-mono text-gray-400">
                        {p.matricula ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 truncate max-w-[220px]">
                        {p.programa}
                      </p>
                      <p className="text-xs text-[#0056D2]">{p.campania}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{p.concepto ?? "—"}</p>
                      {p.periodo && (
                        <p className="text-xs text-gray-400">{p.periodo}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {fmtMXN(p.monto)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {fmtFecha(p.fecha_vencimiento)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${diasClass(p.dias_vencido)}`}
                      >
                        {p.dias_vencido} día{p.dias_vencido !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                      {fmtMXN(p.saldo_pendiente_inscripcion)}
                    </td>
                    <td className="px-2 py-3 text-gray-300">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
