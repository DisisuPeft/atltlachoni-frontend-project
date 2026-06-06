"use client";

import { useGetMisPagosQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { MiInscripcionPagos, MiPagoItem } from "@/redux/features/types/control-escolar/type";
import { IconCalendar, IconCheck, IconClock } from "./iconst";

// ── Helpers ────────────────────────────────────────────────────────────

function fmt(monto: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    parseFloat(monto)
  );
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function progressPct(pagado: string, total: string) {
  const t = parseFloat(total);
  if (!t) return 0;
  return Math.min(100, Math.round((parseFloat(pagado) / t) * 100));
}

// ── Status badge ───────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === "completado") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
        <IconCheck className="w-3 h-3" />
        Completado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
      <IconClock className="w-3 h-3" />
      Pendiente
    </span>
  );
}

// ── Pago row ───────────────────────────────────────────────────────────

function PagoRow({ pago }: { pago: MiPagoItem }) {
  const isCompleted = pago.estado === "completado";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isCompleted ? "bg-green-50" : "bg-amber-50"
        }`}
      >
        {isCompleted ? (
          <IconCheck className="w-4 h-4 text-green-600" />
        ) : (
          <IconClock className="w-4 h-4 text-amber-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{pago.concepto}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <IconCalendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-400">
            {isCompleted
              ? `Pagado el ${fmtDate(pago.fecha_pago)}`
              : `Vence el ${fmtDate(pago.fecha_vencimiento)}`}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 space-y-1">
        <p className="text-sm font-semibold text-gray-900">{fmt(pago.monto)}</p>
        <EstadoBadge estado={pago.estado} />
      </div>
    </div>
  );
}

// ── Inscripcion card ───────────────────────────────────────────────────

function InscripcionCard({ ins }: { ins: MiInscripcionPagos }) {
  const pct = progressPct(ins.pagado, ins.total);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs font-medium text-[#0056D2] uppercase tracking-wide mb-0.5">
          {ins.campania}
        </p>
        <h3 className="text-base font-semibold text-gray-900">{ins.programa}</h3>
      </div>

      <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Total</p>
          <p className="text-sm font-semibold text-gray-900">{fmt(ins.total)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Pagado</p>
          <p className="text-sm font-semibold text-green-600">{fmt(ins.pagado)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Pendiente</p>
          <p className="text-sm font-semibold text-amber-600">{fmt(ins.pendiente)}</p>
        </div>
      </div>

      <div className="px-5 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Progreso de pago</span>
          <span className="text-xs font-medium text-gray-700">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0056D2] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="px-5">
        {ins.pagos.map((p) => (
          <PagoRow key={p.id} pago={p} />
        ))}
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-gray-100 space-y-2">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </div>
      <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-gray-100">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-12 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="px-5 py-3 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3 py-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
            <div className="w-16 h-4 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────

export default function MisPagosView() {
  const { data, isLoading } = useGetMisPagosQuery();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Consulta el estado de tus pagos por cada programa inscrito
        </p>
      </div>

      {isLoading && (
        <div className="space-y-5">
          <Skeleton />
          <Skeleton />
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <IconClock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium">Sin pagos registrados</p>
          <p className="text-sm text-gray-400 mt-1">
            Aquí aparecerán los pagos de tus inscripciones
          </p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="space-y-5">
          {data.map((ins) => (
            <InscripcionCard key={ins.inscripcion_id} ins={ins} />
          ))}
        </div>
      )}
    </div>
  );
}