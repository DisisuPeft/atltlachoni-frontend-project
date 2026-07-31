"use client";

import React, { useState } from "react";
import {
  useGetPlanesPagoQuery,
  useCreatePlanPagoMutation,
  useGetValidacionesQuery,
  useCreateValidacionMutation,
} from "@/redux/features/crm/leadsApiSlice";
// import {
//   useGetOrigenesPagoQuery,
//   useGetEstadosPlanQuery,
// } from "@/redux/features/crm/catalogosCrmApiSlice";
import { useGetEmpresasQuery } from "@/redux/features/sistema/sistemaApiSlice";
import { CreatePlanPagoPayload } from "@/redux/features/types/crm/lead-types";
import {
  CreditCard,
  DollarSign,
  CalendarDays,
  Upload,
  XCircle,
  Loader2,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
} from "lucide-react";
import { useComprobanteStream } from "@/hooks";
import { X } from "lucide-react";
import { getApiErrorMessage } from "@/redux/utils/api-error";

function ComprobanteImg({ validacionId }: { validacionId: number }) {
  const { url, isLoading, error } = useComprobanteStream(validacionId);
  const [open, setOpen] = useState(false);

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-4 text-xs text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando comprobante...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center gap-2 py-2 text-xs text-red-400">
        <AlertCircle className="w-4 h-4" /> {error}
      </div>
    );
  if (!url) return null;

  return (
    <>
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Comprobante"
        className="max-h-48 rounded-lg border border-gray-200 object-contain cursor-zoom-in"
        onClick={() => setOpen(true)}
      />

      {/* Lightbox */}
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

// ── Shared styles ─────────────────────────────────────────────────────

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white";
// const selectClass =
//   "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white text-gray-700";

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
      {title}
    </h3>
  );
}

function moneda(val: string | number) {
  return Number(val).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

function estadoBadge(nombre?: string | null) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Pendiente: {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-3 h-3" />,
    },
    Aprobado: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    Rechazado: {
      cls: "bg-red-50 text-red-700 border-red-200",
      icon: null,
    },
  };
  const entry = map[nombre ?? ""];
  const cls = entry?.cls ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}
    >
      {entry?.icon}
      {nombre ?? "—"}
    </span>
  );
}

function validacionEstado(
  validado_por: number | null,
  motivo_rechazo: string | null,
) {
  if (motivo_rechazo) return "rechazada";
  if (validado_por) return "aprobada";
  return "pendiente";
}

// ── Props ─────────────────────────────────────────────────────────────

interface Props {
  leadId: number;
  campania?: number;
  instituto?: number;
  correo?: string | null;
  refetchLead?: () => void;
}

// ── Main component ────────────────────────────────────────────────────

export default function PlanPagoTab({
  leadId,
  campania,
  instituto,
  correo,
  refetchLead,
}: Props) {
  // ─ Catalogs
  // const { data: origenes } = useGetOrigenesPagoQuery();
  // const { data: estadosPlan } = useGetEstadosPlanQuery();
  const { data: empresas } = useGetEmpresasQuery("CINFA");
  const empresaId = empresas?.[0]?.id;

  // ─ Plan query
  const {
    data: planesData,
    isLoading: loadingPlan,
    refetch: refetchPlan,
  } = useGetPlanesPagoQuery({ lead: leadId });
  const plan = planesData?.results?.[0] ?? null;

  // ─ Validaciones query
  const { data: validacionesData, refetch: refetchValidaciones } =
    useGetValidacionesQuery({ plan_pago: plan?.id }, { skip: !plan?.id });
  const validaciones = validacionesData?.results ?? [];
  const ultimaValidacion = validaciones[0] ?? null;

  // ─ Mutations
  const [createPlanPago, { isLoading: isCreating }] =
    useCreatePlanPagoMutation();
  const [createValidacion, { isLoading: isUploading }] =
    useCreateValidacionMutation();

  // ─ Create plan form state
  const [form, setForm] = useState<
    Omit<CreatePlanPagoPayload, "lead" | "campania" | "instituto" | "empresa">
  >({
    origen: 1,
    estado_plan: 1,
    inscripcion_monto: 0,
    mensualidad_monto: 0,
    num_mensualidades: 0,
    documentacion_monto: 0,
    fecha_primera_mensualidad: "",
    motivo_descuento: "",
    notas_vendedor: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ─ Comprobante en creación de plan (obligatorio: comprobante, monto y fecha)
  const [comprobanteCrear, setComprobanteCrear] = useState<File | null>(null);
  const [comprobanteCrearPreview, setComprobanteCrearPreview] = useState<
    string | null
  >(null);
  const [montoPagadoCrear, setMontoPagadoCrear] = useState("");
  const [fechaPagoCrear, setFechaPagoCrear] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  // ─ Validacion form state
  const [showValForm, setShowValForm] = useState(false);
  const [valForm, setValForm] = useState({
    monto_pagado: "",
    fecha_pago: "",
    notas_internas: "",
  });
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(
    null,
  );

  // ── Handlers ─────────────────────────────────────────────────────────

  const validatePlanForm = () => {
    const errs: Record<string, string> = {};
    if (!form.inscripcion_monto || form.inscripcion_monto <= 0)
      errs.inscripcion_monto = "Debe ser mayor a 0";
    if (!form.num_mensualidades || form.num_mensualidades <= 0)
      errs.num_mensualidades = "Debe ser mayor a 0";
    if (!form.fecha_primera_mensualidad)
      errs.fecha_primera_mensualidad = "Requerida";
    else if (new Date(form.fecha_primera_mensualidad) <= new Date())
      errs.fecha_primera_mensualidad = "Debe ser una fecha futura";
    // El comprobante de pago (archivo, monto y fecha) ahora es obligatorio
    // para crear el plan — ya no se puede registrar la venta sin él.
    if (!comprobanteCrear)
      errs.comprobante_pago = "El comprobante de pago es obligatorio";
    if (!montoPagadoCrear || Number(montoPagadoCrear) <= 0)
      errs.monto_pagado_crear = "Debe ser mayor a 0";
    if (!fechaPagoCrear) errs.fecha_pago_crear = "Requerida";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreatePlan = async () => {
    setSubmitError(null);
    if (!validatePlanForm() || !campania || !instituto || !empresaId) return;

    let plan;
    try {
      plan = await createPlanPago({
        ...form,
        lead: leadId,
        campania,
        instituto,
        empresa: empresaId,
        mensualidad_monto: form.mensualidad_monto ?? 0,
      }).unwrap();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "No se pudo crear el plan de pago."),
      );
      return;
    }

    try {
      await createValidacion({
        plan_pago: plan.id,
        comprobante_pago: comprobanteCrear as File,
        monto_pagado: Number(montoPagadoCrear),
        fecha_pago: fechaPagoCrear,
      }).unwrap();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "El plan se creó, pero no se pudo subir el comprobante. Puedes volver a intentarlo desde 'Subir comprobante'.",
        ),
      );
    }

    refetchPlan();
    refetchLead?.();
  };

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setComprobante(file);
    setComprobantePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUploadValidacion = async () => {
    if (!plan || !comprobante || !valForm.monto_pagado || !valForm.fecha_pago)
      return;
    setSubmitError(null);
    try {
      await createValidacion({
        plan_pago: plan.id,
        comprobante_pago: comprobante,
        monto_pagado: Number(valForm.monto_pagado),
        fecha_pago: valForm.fecha_pago,
        notas_internas: valForm.notas_internas || undefined,
      }).unwrap();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "No se pudo subir el comprobante."),
      );
      return;
    }
    setShowValForm(false);
    setValForm({ monto_pagado: "", fecha_pago: "", notas_internas: "" });
    setComprobante(null);
    setComprobantePreview(null);
    refetchValidaciones();
  };

  // ── Render helpers ────────────────────────────────────────────────────

  const canUploadValidacion =
    plan &&
    (!ultimaValidacion ||
      validacionEstado(
        ultimaValidacion.validado_por,
        ultimaValidacion.motivo_rechazo,
      ) === "rechazada");

  // ── Derived blocking state ────────────────────────────────────────────

  const missingFields: string[] = [];
  if (!correo) missingFields.push("email del prospecto");
  if (!campania) missingFields.push("campaña");
  if (!instituto) missingFields.push("instituto");
  if (!empresaId) missingFields.push("empresa (cargando...)");

  // ── Loading ───────────────────────────────────────────────────────────

  if (loadingPlan) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ── No plan — create form ─────────────────────────────────────────────

  if (!plan) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleCreatePlan(); }}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5 text-[#0056D2]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Nuevo Plan de Pago
              </h3>
              <p className="text-xs text-gray-400">
                Crea el plan para avanzar el lead a la etapa de Venta
              </p>
            </div>
          </div>

          {missingFields.length > 0 && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
              <span>
                No se puede crear el plan porque el lead no tiene asignado:{" "}
                <strong>{missingFields.join(", ")}</strong>. Edita el lead y
                asigna los campos requeridos.
              </span>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-5">
            {/* Origen + Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <div className="space-y-1.5">
              <FieldLabel label="Origen de pago" required />
              <select
                className={selectClass}
                value={form.origen || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, origen: Number(e.target.value) }))
                }
              >
                <option value="">Seleccionar</option>
                {(origenes?.results ?? []).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nombre}
                  </option>
                ))}
              </select>
              {formErrors.origen && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.origen}
                </p>
              )}
            </div> */}

              {/* <div className="space-y-1.5">
              <FieldLabel label="Estado del plan" required />
              <select
                className={selectClass}
                value={form.estado_plan || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    estado_plan: Number(e.target.value),
                  }))
                }
              >
                <option value="">Seleccionar</option>
                {(estadosPlan?.results ?? []).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
              {formErrors.estado_plan && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.estado_plan}
                </p>
              )}
            </div> */}
            </div>

            {/* Montos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel label="Inscripción" required />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className={`${inputClass} pl-9`}
                    value={form.inscripcion_monto || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        inscripcion_monto: Number(e.target.value),
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                {formErrors.inscripcion_monto && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.inscripcion_monto}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <FieldLabel label="Mensualidad" />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`${inputClass} pl-9`}
                    value={form.mensualidad_monto || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        mensualidad_monto: Number(e.target.value),
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel label="Número de mensualidades" required />
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.num_mensualidades || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      num_mensualidades: Number(e.target.value),
                    }))
                  }
                  placeholder="Ej. 12"
                />
                {formErrors.num_mensualidades && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.num_mensualidades}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <FieldLabel label="Documentación (opcional)" />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`${inputClass} pl-9`}
                    value={form.documentacion_monto || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        documentacion_monto: Number(e.target.value),
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Fecha */}
            <div className="space-y-1.5">
              <FieldLabel label="Fecha primera mensualidad" required />
              <div className="relative max-w-xs">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  className={`${inputClass} pl-9`}
                  value={form.fecha_primera_mensualidad}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      fecha_primera_mensualidad: e.target.value,
                    }))
                  }
                />
              </div>
              {formErrors.fecha_primera_mensualidad && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.fecha_primera_mensualidad}
                </p>
              )}
            </div>

            {/* Motivo de descuento */}
            <div className="space-y-1.5">
              <FieldLabel label="Motivo de descuento (opcional)" />
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  className={`${inputClass} pl-9`}
                  value={form.motivo_descuento ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, motivo_descuento: e.target.value }))
                  }
                  placeholder="Ej. Beca excelencia, Promoción verano..."
                />
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-1.5">
              <FieldLabel label="Notas del vendedor" />
              <textarea
                rows={3}
                className={inputClass}
                value={form.notas_vendedor ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notas_vendedor: e.target.value }))
                }
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* Comprobante de pago (obligatorio) */}
            <div className="space-y-4 pt-2 border-t border-gray-200">
              <div>
                <FieldLabel label="Comprobante de pago" required />
                <p className="text-xs text-gray-400 mt-0.5">
                  Ya no se puede crear el plan sin registrar el pago con el
                  que se origina.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel label="Monto pagado" required />
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={`${inputClass} pl-9`}
                      value={montoPagadoCrear}
                      onChange={(e) => setMontoPagadoCrear(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  {formErrors.monto_pagado_crear && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.monto_pagado_crear}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <FieldLabel label="Fecha de pago" required />
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputClass} pl-9`}
                      value={fechaPagoCrear}
                      onChange={(e) => setFechaPagoCrear(e.target.value)}
                    />
                  </div>
                  {formErrors.fecha_pago_crear && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.fecha_pago_crear}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel label="Captura del comprobante" required />
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-[#0056D2]/50 hover:bg-[#F0F6FF]/50 transition-colors">
                  {comprobanteCrearPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={comprobanteCrearPreview}
                      alt="Comprobante"
                      className="max-h-40 rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <FileImage className="w-7 h-7 text-gray-300" />
                      <span className="text-xs text-gray-400">
                        Haz clic para adjuntar la captura de pago
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setComprobanteCrear(file);
                      setComprobanteCrearPreview(
                        file ? URL.createObjectURL(file) : null,
                      );
                    }}
                  />
                </label>
                {comprobanteCrear && (
                  <button
                    type="button"
                    onClick={() => {
                      setComprobanteCrear(null);
                      setComprobanteCrearPreview(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Quitar imagen
                  </button>
                )}
                {formErrors.comprobante_pago && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.comprobante_pago}
                  </p>
                )}
              </div>
            </div>
          </div>

          {submitError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || isUploading || missingFields.length > 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating || isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {isUploading ? "Subiendo comprobante..." : "Crear Plan de Pago"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  // ── Plan exists ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {submitError && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Plan detail card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <SectionTitle title="Plan de Pago" />
          </div>
          <div className="flex items-center gap-2">
            {estadoBadge(
              plan.aprobado_por
                ? "Aprobado"
                : plan.estado_plan_detail?.nombre,
            )}
          </div>
        </div>

        {/* Montos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Inscripción
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {moneda(plan.inscripcion_monto)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Mensualidad
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {moneda(plan.mensualidad_monto)} × {plan.num_mensualidades}
            </p>
          </div>
          {Number(plan.documentacion_monto) > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                Documentación
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {moneda(plan.documentacion_monto)}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Origen
            </p>
            <p className="text-sm text-gray-700">
              {plan.origen_detail?.nombre ?? "—"}
            </p>
          </div>
        </div>

        {/* Fecha + descuento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
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
          {plan.motivo_descuento && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                Motivo de descuento
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
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
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Notas del vendedor
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {plan.notas_vendedor}
            </p>
          </div>
        )}
      </div>

      {/* Validaciones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionTitle title="Comprobante de pago" />
          {canUploadValidacion && (
            <button
              type="button"
              onClick={() => {
                setSubmitError(null);
                setShowValForm((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] border border-[#0056D2]/30 rounded-lg hover:bg-[#F0F6FF] transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              {showValForm ? "Cancelar" : "Subir comprobante"}
            </button>
          )}
        </div>

        {/* Upload form */}
        {showValForm && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel label="Monto pagado" required />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className={`${inputClass} pl-9`}
                    value={valForm.monto_pagado}
                    onChange={(e) =>
                      setValForm((f) => ({
                        ...f,
                        monto_pagado: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel label="Fecha de pago" required />
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    className={`${inputClass} pl-9`}
                    value={valForm.fecha_pago}
                    onChange={(e) =>
                      setValForm((f) => ({ ...f, fecha_pago: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* File upload */}
            <div className="space-y-1.5">
              <FieldLabel label="Comprobante (imagen)" required />
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#0056D2]/50 hover:bg-[#F0F6FF]/50 transition-colors">
                {comprobantePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comprobantePreview}
                    alt="Comprobante"
                    className="max-h-40 rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <FileImage className="w-8 h-8 text-gray-300" />
                    <span className="text-xs text-gray-400">
                      Haz clic para seleccionar imagen
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleComprobanteChange}
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <FieldLabel label="Notas internas (opcional)" />
              <textarea
                rows={2}
                className={inputClass}
                value={valForm.notas_internas}
                onChange={(e) =>
                  setValForm((f) => ({
                    ...f,
                    notas_internas: e.target.value,
                  }))
                }
                placeholder="Observaciones..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUploadValidacion}
                disabled={
                  isUploading ||
                  !comprobante ||
                  !valForm.monto_pagado ||
                  !valForm.fecha_pago
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Subir comprobante
              </button>
            </div>
          </div>
        )}

        {/* Validaciones list */}
        {validaciones.length === 0 && !showValForm ? (
          <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <FileImage className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Sin comprobantes subidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {validaciones.map((val) => {
              const estado = validacionEstado(
                val.validado_por,
                val.motivo_rechazo,
              );
              const estadoMeta = {
                pendiente: {
                  label: "Pendiente",
                  icon: Clock,
                  cls: "bg-amber-50 text-amber-700 border-amber-200",
                },
                aprobada: {
                  label: "Aprobada",
                  icon: CheckCircle2,
                  cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
                },
                rechazada: {
                  label: "Rechazada",
                  icon: XCircle,
                  cls: "bg-red-50 text-red-700 border-red-200",
                },
              }[estado];
              const EstadoIcon = estadoMeta.icon;

              return (
                <div
                  key={val.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {moneda(val.monto_pagado)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(val.fecha_pago).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {val.subido_por_nombre &&
                          ` · Subido por ${val.subido_por_nombre}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${estadoMeta.cls}`}
                      >
                        <EstadoIcon className="w-3 h-3" />
                        {estadoMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Comprobante image */}
                  {val.comprobante_url && (
                    <ComprobanteImg validacionId={val.id} />
                  )}

                  {/* Motivo rechazo */}
                  {val.motivo_rechazo && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-xs font-medium text-red-700 mb-0.5">
                        Motivo de rechazo
                      </p>
                      <p className="text-sm text-red-600">
                        {val.motivo_rechazo}
                      </p>
                    </div>
                  )}

                  {/* Notas internas */}
                  {val.notas_internas && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                        Notas internas
                      </p>
                      <p className="text-sm text-gray-600">
                        {val.notas_internas}
                      </p>
                    </div>
                  )}

                  {/* Validated by */}
                  {val.validado_por_nombre && (
                    <p className="text-xs text-emerald-600">
                      Validado por {val.validado_por_nombre}
                      {val.fecha_validacion &&
                        ` el ${new Date(val.fecha_validacion).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
