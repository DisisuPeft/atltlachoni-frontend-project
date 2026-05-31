"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import {
  useGetPlanesPagoQuery,
  useAprobarPlanPagoMutation,
  useGetValidacionesQuery,
  useValidarValidacionMutation,
  useRechazarValidacionMutation,
} from "@/redux/features/crm/leadsApiSlice";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import { useComprobanteStream } from "@/hooks";
import { PlanPagoDetalle, Validacion } from "@/redux/features/types/crm/lead-types";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  DollarSign,
  CalendarDays,
  GraduationCap,
  Loader2,
  AlertCircle,
  X,
  FileImage,
  BadgeCheck,
  ShieldCheck,
  CreditCard,
  RefreshCw,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────

function moneda(val: string | number) {
  return Number(val).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

function validacionEstado(v: Validacion): "pendiente" | "aprobada" | "rechazada" {
  if (v.motivo_rechazo) return "rechazada";
  if (v.validado_por) return "aprobada";
  return "pendiente";
}

const ESTADO_VAL_META = {
  pendiente: {
    label: "Pendiente de revisión",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: Clock,
  },
  aprobada: {
    label: "Validada",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
  },
  rechazada: {
    label: "Rechazada",
    cls: "bg-red-50 text-red-700 border-red-200",
    Icon: XCircle,
  },
};

const ESTADO_PLAN_CLS: Record<string, string> = {
  Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  Aprobado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rechazado: "bg-red-50 text-red-700 border-red-200",
};

// ─── ComprobanteImg ───────────────────────────────────────────────────

function ComprobanteImg({ validacionId }: { validacionId: number }) {
  const { url, isLoading, error } = useComprobanteStream(validacionId);
  const [open, setOpen] = useState(false);

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cargando comprobante...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center gap-2 text-xs text-red-400 py-2">
        <AlertCircle className="w-3.5 h-3.5" /> {error}
      </div>
    );
  if (!url) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Comprobante"
        className="max-h-48 rounded-lg border border-gray-200 object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Comprobante"
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// ─── ValidacionCard ───────────────────────────────────────────────────

interface ValidacionCardProps {
  val: Validacion;
  canAdmin: boolean;
  onValidar: (id: number) => void;
  onRechazar: (id: number, motivo: string) => void;
}

function ValidacionCard({ val, canAdmin, onValidar, onRechazar }: ValidacionCardProps) {
  const estado = validacionEstado(val);
  const meta = ESTADO_VAL_META[estado];
  const Icon = meta.Icon;
  const [rechazarOpen, setRechazarOpen] = useState(false);
  const [motivo, setMotivo] = useState("");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-base font-semibold text-gray-900">
            {moneda(val.monto_pagado)}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(val.fecha_pago).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {val.subido_por_nombre && (
            <p className="text-xs text-gray-400">
              Subido por <span className="font-medium text-gray-600">{val.subido_por_nombre}</span>
              {" · "}
              {new Date(val.fecha_subida).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
              })}
            </p>
          )}
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${meta.cls}`}
        >
          <Icon className="w-3 h-3" />
          {meta.label}
        </span>
      </div>

      {/* Comprobante */}
      {val.comprobante_url && <ComprobanteImg validacionId={val.id} />}

      {/* Notas internas */}
      {val.notas_internas && (
        <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Notas internas
          </p>
          <p className="text-sm text-gray-700">{val.notas_internas}</p>
        </div>
      )}

      {/* Motivo rechazo */}
      {val.motivo_rechazo && (
        <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-100">
          <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
            Motivo de rechazo
          </p>
          <p className="text-sm text-red-700">{val.motivo_rechazo}</p>
        </div>
      )}

      {/* Validado por */}
      {val.validado_por_nombre && (
        <p className="text-xs text-emerald-600 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Validado por <span className="font-medium">{val.validado_por_nombre}</span>
          {val.fecha_validacion &&
            ` · ${new Date(val.fecha_validacion).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}`}
        </p>
      )}

      {/* Admin actions */}
      {canAdmin && estado === "pendiente" && (
        <div className="pt-1 space-y-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onValidar(val.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Validar comprobante
            </button>
            <button
              type="button"
              onClick={() => setRechazarOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Rechazar
            </button>
          </div>

          {rechazarOpen && (
            <div className="space-y-2 pl-0.5">
              <textarea
                rows={2}
                placeholder="Escribe el motivo del rechazo..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 bg-white resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!motivo.trim()}
                  onClick={() => {
                    onRechazar(val.id, motivo.trim());
                    setRechazarOpen(false);
                    setMotivo("");
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirmar rechazo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRechazarOpen(false);
                    setMotivo("");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PlanRow ─────────────────────────────────────────────────────────

interface PlanRowProps {
  plan: PlanPagoDetalle;
  isExpanded: boolean;
  onToggle: () => void;
  canAdmin: boolean;
  onAprobarSuccess: () => void;
}

function PlanRow({ plan, isExpanded, onToggle, canAdmin, onAprobarSuccess }: PlanRowProps) {
  const { data: valData, refetch: refetchVal } = useGetValidacionesQuery(
    { plan_pago: plan.id },
    { skip: !isExpanded },
  );
  const validaciones = valData?.results ?? [];

  const [aprobarPlan, { isLoading: isAprobando }] = useAprobarPlanPagoMutation();
  const [validarVal] = useValidarValidacionMutation();
  const [rechazarVal] = useRechazarValidacionMutation();

  const estadoNombre = plan.estado_plan_detail?.nombre ?? "";
  const isPendiente = estadoNombre === "Pendiente";

  const pendientesCount = validaciones.filter(
    (v) => validacionEstado(v) === "pendiente",
  ).length;

  const handleAprobar = async () => {
    const res = await Swal.fire({
      title: "¿Aprobar este plan de pago?",
      html: `<p class="text-sm text-gray-600">Plan <strong>#${plan.id}</strong> — ${moneda(plan.inscripcion_monto)} de inscripción · ${moneda(plan.mensualidad_monto)} × ${plan.num_mensualidades} meses</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#059669",
    });
    if (!res.isConfirmed) return;
    try {
      await aprobarPlan(plan.id).unwrap();
      onAprobarSuccess();
      Swal.fire({
        icon: "success",
        title: "Plan aprobado",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({ icon: "error", title: "No se pudo aprobar el plan" });
    }
  };

  const handleValidar = async (id: number) => {
    const res = await Swal.fire({
      title: "¿Validar este comprobante?",
      text: "Confirma que el pago fue verificado correctamente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Validar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#059669",
    });
    if (!res.isConfirmed) return;
    try {
      await validarVal(id).unwrap();
      refetchVal();
      Swal.fire({ icon: "success", title: "Comprobante validado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error al validar" });
    }
  };

  const handleRechazar = async (id: number, motivo: string) => {
    try {
      await rechazarVal({ id, motivo_rechazo: motivo }).unwrap();
      refetchVal();
      Swal.fire({ icon: "success", title: "Comprobante rechazado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error al rechazar" });
    }
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors ${
        isExpanded ? "border-[#0056D2]/30 bg-white shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <span className="shrink-0 text-gray-400">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">
              Plan #{plan.id}
            </span>
            {plan.lead_nombre && (
              <span className="text-xs text-gray-500">— {plan.lead_nombre}</span>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                ESTADO_PLAN_CLS[estadoNombre] ?? "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {estadoNombre || "—"}
            </span>
            {plan.aprobado_por && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" /> Aprobado
              </span>
            )}
            {plan.motivo_descuento && (
              <span className="inline-flex items-center gap-1 text-xs text-violet-600">
                <GraduationCap className="w-3.5 h-3.5" /> {plan.motivo_descuento}
              </span>
            )}
            {isExpanded && pendientesCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                {pendientesCount} comprobante{pendientesCount > 1 ? "s" : ""} por revisar
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {moneda(plan.inscripcion_monto)} inscripción
            </span>
            <span>·</span>
            <span>
              {moneda(plan.mensualidad_monto)} × {plan.num_mensualidades} meses
            </span>
            <span className="hidden sm:flex items-center gap-1">
              · <CalendarDays className="w-3 h-3" />
              {new Date(plan.fecha_primera_mensualidad).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 shrink-0 hidden md:block">
          {new Date(plan.created_at).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5 space-y-5">
          {/* Desglose de montos */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Desglose del plan
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Inscripción
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {moneda(plan.inscripcion_monto)}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Mensualidad
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {moneda(plan.mensualidad_monto)}{" "}
                  <span className="font-normal text-gray-500">
                    × {plan.num_mensualidades}
                  </span>
                </p>
              </div>
              {Number(plan.documentacion_monto) > 0 && (
                <div className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                    Documentación
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {moneda(plan.documentacion_monto)}
                  </p>
                </div>
              )}
              <div className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Total estimado
                </p>
                <p className="text-sm font-semibold text-[#0056D2]">
                  {moneda(
                    Number(plan.inscripcion_monto) +
                      Number(plan.mensualidad_monto) * plan.num_mensualidades +
                      Number(plan.documentacion_monto),
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                Primera mensualidad
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                {new Date(plan.fecha_primera_mensualidad).toLocaleDateString(
                  "es-MX",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </p>
            </div>
            {plan.origen_detail && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Origen
                </p>
                <p className="text-sm text-gray-700">{plan.origen_detail.nombre}</p>
              </div>
            )}
            {plan.motivo_descuento && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Motivo de descuento
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  {plan.motivo_descuento}
                </p>
              </div>
            )}
            {plan.fecha_aprobacion && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Fecha aprobación
                </p>
                <p className="text-sm text-gray-700">
                  {new Date(plan.fecha_aprobacion).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {plan.notas_vendedor && (
            <div className="px-3 py-2.5 rounded-lg bg-white border border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Notas del vendedor
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {plan.notas_vendedor}
              </p>
            </div>
          )}

          {/* Acción: Aprobar plan */}
          {canAdmin && isPendiente && !plan.aprobado_por && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleAprobar}
                disabled={isAprobando}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isAprobando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                Aprobar plan de pago
              </button>
            </div>
          )}

          {/* Validaciones */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Comprobantes de pago
            </p>
            {validaciones.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                <FileImage className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Sin comprobantes subidos</p>
              </div>
            ) : (
              validaciones.map((val) => (
                <ValidacionCard
                  key={val.id}
                  val={val}
                  canAdmin={canAdmin}
                  onValidar={handleValidar}
                  onRechazar={handleRechazar}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  colorCls,
}: {
  label: string;
  value: number;
  sub?: string;
  colorCls: string;
}) {
  return (
    <div className={`rounded-xl border px-5 py-4 space-y-1 ${colorCls}`}>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      {sub && <p className="text-xs opacity-50">{sub}</p>}
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────

type TabKey = "todos" | "pendientes" | "aprobados";

export default function FinanzasPlanesPago() {
  const { data: verify } = useVerifyUserQuery();
  const isSuperUser = verify?.superuser === true;

  const { data: planesData, isLoading, refetch } = useGetPlanesPagoQuery({});
  const planes = planesData?.results ?? [];

  const [activeTab, setActiveTab] = useState<TabKey>("pendientes");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const pendientesCount = planes.filter(
    (p) => p.estado_plan_detail?.nombre === "Pendiente",
  ).length;
  const aprobadosCount = planes.filter(
    (p) => p.aprobado_por != null,
  ).length;
  const conComprobante = planes.filter((p) => p.status === 1).length;

  const filtered = planes.filter((p) => {
    const nombre = p.estado_plan_detail?.nombre ?? "";
    const matchTab =
      activeTab === "todos" ||
      (activeTab === "pendientes" && nombre === "Pendiente") ||
      (activeTab === "aprobados" && (nombre === "Aprobado" || p.aprobado_por != null));
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `plan #${p.id}`.includes(q) ||
      (p.lead_nombre?.toLowerCase().includes(q) ?? false);
    return matchTab && matchSearch;
  });

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: planes.length },
    { key: "pendientes", label: "Pendientes", count: pendientesCount },
    { key: "aprobados", label: "Aprobados", count: aprobadosCount },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Planes de Pago</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Revisión y aprobación de comprobantes de pago
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total de planes"
          value={planes.length}
          colorCls="border-gray-200 bg-white text-gray-900"
        />
        <StatCard
          label="Pendientes"
          value={pendientesCount}
          sub={pendientesCount > 0 ? "Requieren revisión" : "Al día"}
          colorCls={
            pendientesCount > 0
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-gray-200 bg-white text-gray-900"
          }
        />
        <StatCard
          label="Aprobados"
          value={aprobadosCount}
          sub={`${conComprobante} con comprobante`}
          colorCls="border-emerald-200 bg-emerald-50 text-emerald-800"
        />
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === t.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === t.key
                    ? t.key === "pendientes" && t.count > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                    : "bg-white/60 text-gray-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar por #plan o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] bg-white"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            {search ? "Sin resultados para tu búsqueda" : "Sin planes en esta categoría"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((plan) => (
            <PlanRow
              key={plan.id}
              plan={plan}
              isExpanded={expandedId === plan.id}
              onToggle={() =>
                setExpandedId((id) => (id === plan.id ? null : plan.id))
              }
              canAdmin={isSuperUser}
              onAprobarSuccess={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}