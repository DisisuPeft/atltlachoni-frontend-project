"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetLeadQuery,
  useUpdateLeadMutation,
  useGetInteraccionesQuery,
  useCreateInteraccionMutation,
  useGetSeguimientosQuery,
  useCreateSeguimientoMutation,
  useCompletarSeguimientoMutation,
  useGetHistorialEtapasQuery,
} from "@/redux/features/crm/leadsApiSlice";
import {
  useGetTiposInteraccionQuery,
  useGetEstadosInteraccionQuery,
  useGetTiposSeguimientoQuery,
  useGetNivelesTemperaturaQuery,
  useGetPipelinesQuery,
} from "@/redux/features/crm/catalogosCrmApiSlice";
import {
  ArrowLeft,
  Mail,
  Phone,
  Flame,
  Thermometer,
  Snowflake,
  Plus,
  CheckCircle2,
  Clock,
  // ChevronDown,
  // ChevronUp,
  MessageSquare,
  CalendarClock,
  GitBranch,
  Loader2,
  Save,
} from "lucide-react";
import {
  InteraccionForm,
  SeguimientoForm,
} from "@/redux/features/types/crm/lead-types";

interface Props {
  uuid: string;
  refParam?: string;
}

type Tab = "info" | "interacciones" | "seguimientos" | "historial";

// ── Shared primitives ────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="text-sm text-gray-900">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white";
const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white text-gray-700";

function TempBadge({
  codigo,
  nombre,
  color,
}: {
  codigo: string;
  nombre: string;
  color: string;
}) {
  const Icon =
    codigo === "caliente" ? Flame : codigo === "frio" ? Snowflake : Thermometer;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <Icon className="w-3 h-3" />
      {nombre}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return "hoy";
  if (diff === 1) return "ayer";
  if (diff < 30) return `hace ${diff}d`;
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// ── Info tab ─────────────────────────────────────────────────────────

function InfoTab({ uuid }: { uuid: string }) {
  const { data: lead } = useGetLeadQuery(uuid);
  const { data: pipelines } = useGetPipelinesQuery();
  const [updateLead, { isLoading }] = useUpdateLeadMutation();
  const [etapaId, setEtapaId] = useState<number | undefined>();

  const etapas = pipelines?.[0]?.etapas ?? [];

  const handleMoveEtapa = async (newEtapaId: number) => {
    await updateLead({ uuid, data: { etapa: newEtapaId } });
    setEtapaId(undefined);
  };

  if (!lead) return null;

  return (
    <div className="space-y-6">
      {/* Datos personales */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Datos personales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Nombre completo">
            {lead.nombre_completo ||
              `${lead.nombre} ${lead.apellido_paterno} ${lead.apellido_materno ?? ""}`}
          </Field>
          <Field label="Email">
            <a
              href={`mailto:${lead.correo}`}
              className="text-[#0056D2] hover:underline"
            >
              {lead.correo}
            </a>
          </Field>
          <Field label="Teléfono">
            <a
              href={`tel:${lead.telefono}`}
              className="text-[#0056D2] hover:underline"
            >
              {lead.telefono}
            </a>
          </Field>
          {lead.contacto_alterno && (
            <Field label="Contacto alterno">{lead.contacto_alterno}</Field>
          )}
        </div>
      </div>

      {/* Datos comerciales */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Información comercial
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Programa de interés">
            {lead.programa_nombre ?? "—"}
          </Field>
          <Field label="Campaña">{lead.campania_nombre ?? "—"}</Field>
          <Field label="Fuente">{lead.fuente_nombre ?? "—"}</Field>
          <Field label="Vendedor">
            {lead.vendedor_nombre ?? "Sin asignar"}
          </Field>
          <Field label="Estatus">{lead.estatus_nombre ?? "—"}</Field>
          <Field label="Temperatura">
            {lead.temperatura_actual ? (
              <TempBadge
                codigo={lead.temperatura_actual.codigo}
                nombre={lead.temperatura_actual.nombre}
                color={lead.temperatura_actual.color}
              />
            ) : (
              "—"
            )}
          </Field>
        </div>
      </div>

      {/* Mover etapa */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Mover de etapa
        </h3>
        <div className="flex items-center gap-3">
          <select
            className={`${selectClass} max-w-xs`}
            value={etapaId ?? lead.etapa}
            onChange={(e) => setEtapaId(Number(e.target.value))}
          >
            {etapas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
          {etapaId && etapaId !== lead.etapa && (
            <button
              onClick={() => handleMoveEtapa(etapaId)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Confirmar
            </button>
          )}
        </div>
      </div>

      {lead.notas && (
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Notas
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {lead.notas}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Interacciones tab ─────────────────────────────────────────────────

function InteraccionesTab({ leadId, uuid }: { leadId: number; uuid?: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<InteraccionForm>>({});

  const {
    data: interacciones,
    isLoading,
    refetch,
  } = useGetInteraccionesQuery({ lead: leadId });
  const { data: tipos } = useGetTiposInteraccionQuery();
  const { data: estados } = useGetEstadosInteraccionQuery();
  const { data: temperaturas } = useGetNivelesTemperaturaQuery();
  const [createInteraccion, { isLoading: isCreating }] =
    useCreateInteraccionMutation();

  const tipoActual = tipos?.find((t) => t.id === Number(form.tipo));

  const handleSubmit = async () => {
    if (!form.tipo || !form.estado || !form.asunto || !form.contenido) return;
    await createInteraccion({ ...form, lead: leadId } as InteraccionForm);
    setForm({});
    setOpen(false);
    refetch();
  };

  return (
    <div className="space-y-4">
      {/* Create form toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nueva interacción
      </button>

      {open && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Tipo *
              </label>
              <select
                className={selectClass}
                value={form.tipo ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipo: Number(e.target.value) }))
                }
              >
                <option value="">Seleccionar</option>
                {tipos?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icono} {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Estado *
              </label>
              <select
                className={selectClass}
                value={form.estado ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estado: Number(e.target.value) }))
                }
              >
                <option value="">Seleccionar</option>
                {estados?.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Asunto *
              </label>
              <input
                className={inputClass}
                value={form.asunto ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, asunto: e.target.value }))
                }
                placeholder="Ej: Llamada de seguimiento"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Contenido *
              </label>
              <textarea
                rows={3}
                className={inputClass}
                value={form.contenido ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contenido: e.target.value }))
                }
                placeholder="Describe la interacción..."
              />
            </div>
            {tipoActual?.requiere_telefono && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Teléfono
                </label>
                <input
                  className={inputClass}
                  value={form.numero_telefono ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, numero_telefono: e.target.value }))
                  }
                />
              </div>
            )}
            {tipoActual?.requiere_duracion && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Duración (min)
                </label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.duracion_minutos ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      duracion_minutos: Number(e.target.value),
                    }))
                  }
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Temperatura post
              </label>
              <select
                className={selectClass}
                value={form.temperatura_post ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    temperatura_post: Number(e.target.value),
                  }))
                }
              >
                <option value="">Sin cambio</option>
                {temperaturas?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icono} {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Próximo paso
              </label>
              <input
                className={inputClass}
                value={form.proximo_paso ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, proximo_paso: e.target.value }))
                }
                placeholder="Ej: Llamar el viernes"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : !interacciones?.length ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Sin interacciones registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interacciones.map((interaccion) => (
            <div
              key={interaccion.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {interaccion.tipo_detail?.icono}{" "}
                    {interaccion.tipo_detail?.nombre ??
                      `Tipo ${interaccion.tipo}`}
                  </span>
                  {interaccion.estado_detail && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${interaccion.estado_detail.color}18`,
                        color: interaccion.estado_detail.color,
                      }}
                    >
                      {interaccion.estado_detail.nombre}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {timeAgo(interaccion.fecha_interaccion)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {interaccion.asunto}
              </p>
              <p className="text-sm text-gray-500">{interaccion.contenido}</p>
              {interaccion.proximo_paso && (
                <p className="text-xs text-[#0056D2] mt-2">
                  → {interaccion.proximo_paso}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Seguimientos tab ──────────────────────────────────────────────────

function SeguimientosTab({ leadId }: { leadId: number }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<SeguimientoForm>>({});

  const {
    data: seguimientos,
    isLoading,
    refetch,
  } = useGetSeguimientosQuery({ lead: leadId, completado: false });
  const { data: tipos } = useGetTiposSeguimientoQuery();
  const [createSeguimiento, { isLoading: isCreating }] =
    useCreateSeguimientoMutation();
  const [completar] = useCompletarSeguimientoMutation();

  const handleSubmit = async () => {
    if (!form.tipo || !form.fecha_programada || !form.descripcion) return;
    await createSeguimiento({ ...form, lead: leadId } as SeguimientoForm);
    setForm({});
    setOpen(false);
    refetch();
  };

  const handleCompletar = async (id: number) => {
    await completar(id);
    refetch();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Programar seguimiento
      </button>

      {open && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Tipo *
              </label>
              <select
                className={selectClass}
                value={form.tipo ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipo: Number(e.target.value) }))
                }
              >
                <option value="">Seleccionar</option>
                {tipos?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icono} {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Fecha programada *
              </label>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.fecha_programada ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fecha_programada: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Descripción *
              </label>
              <textarea
                rows={2}
                className={inputClass}
                value={form.descripcion ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descripcion: e.target.value }))
                }
                placeholder="¿Qué se va a hacer?"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : !seguimientos?.length ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <CalendarClock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Sin seguimientos pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {seguimientos.map((seg) => {
            const isPast = new Date(seg.fecha_programada) < new Date();
            return (
              <div
                key={seg.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isPast ? "bg-red-50" : "bg-amber-50"}`}
                  >
                    <Clock
                      className={`w-4 h-4 ${isPast ? "text-red-500" : "text-amber-500"}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {seg.tipo_detail?.icono}{" "}
                      {seg.tipo_detail?.nombre ?? `Tipo ${seg.tipo}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {seg.descripcion}
                    </p>
                    <p
                      className={`text-xs mt-1 font-medium ${isPast ? "text-red-500" : "text-amber-600"}`}
                    >
                      {new Date(seg.fecha_programada).toLocaleDateString(
                        "es-MX",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                      {isPast && " · Vencido"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCompletar(seg.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex-shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Historial tab ─────────────────────────────────────────────────────

function HistorialTab({ leadId }: { leadId: number }) {
  const { data: historial, isLoading } = useGetHistorialEtapasQuery({
    lead: leadId,
  });

  if (isLoading)
    return <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />;

  if (!historial?.length) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
        <GitBranch className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Sin historial de movimientos</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-100" />
      {historial.map((h) => (
        <div key={h.id} className="relative">
          <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-[#0056D2] border-2 border-white" />
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {h.etapa_nombre ?? `Etapa ${h.etapa}`}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span>
                Entrada:{" "}
                {new Date(h.fecha_entrada).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {h.fecha_salida && (
                <span>
                  Salida:{" "}
                  {new Date(h.fecha_salida).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────

export default function LeadDetailView({ uuid, refParam }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const { data: lead, isLoading } = useGetLeadQuery(uuid);

  const tabs: {
    key: Tab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: "info",
      label: "Información",
      icon: ({ className }) => <span className={className}>📋</span>,
    },
    { key: "interacciones", label: "Interacciones", icon: MessageSquare },
    { key: "seguimientos", label: "Seguimientos", icon: CalendarClock },
    { key: "historial", label: "Historial", icon: GitBranch },
  ];

  const temp = lead?.temperatura_actual;
  const tempColor = temp?.color ?? "#64748b";

  const nombreCompleto = lead
    ? lead.nombre_completo ||
      `${lead.nombre} ${lead.apellido_paterno} ${lead.apellido_materno ?? ""}`.trim()
    : "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Back */}
      <Link
        href={`/dashboard/crm/menu?ref=${refParam}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al tablero
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : lead ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: tempColor }}
            >
              {initials(nombreCompleto)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">
                {nombreCompleto}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Mail className="w-3 h-3" /> {lead.correo}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Phone className="w-3 h-3" /> {lead.telefono}
                </span>
              </div>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              {temp && (
                <TempBadge
                  codigo={temp.codigo}
                  nombre={temp.nombre}
                  color={temp.color}
                />
              )}
              {lead.etapa_nombre && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0F6FF] text-[#0056D2]">
                  {lead.etapa_nombre}
                </span>
              )}
              {lead.estatus_nombre && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {lead.estatus_nombre}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Tabs card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === key
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "info" && <InfoTab uuid={uuid} />}
          {activeTab === "interacciones" && lead && (
            <InteraccionesTab leadId={lead.id} uuid={uuid} />
          )}
          {activeTab === "seguimientos" && lead && (
            <SeguimientosTab leadId={lead.id} />
          )}
          {activeTab === "historial" && lead && (
            <HistorialTab leadId={lead.id} />
          )}
        </div>
      </div>
    </div>
  );
}
