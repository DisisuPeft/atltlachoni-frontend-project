"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import {
  useGetLeadQuery,
  useGetInteraccionesQuery,
  useCreateInteraccionMutation,
  useUpdateInteraccionMutation,
  useDeleteInteraccionMutation,
  useGetSeguimientosQuery,
  useCreateSeguimientoMutation,
  useUpdateSeguimientoMutation,
  useCompletarSeguimientoMutation,
  useGetHistorialEtapasQuery,
  useGetVendedoresQuery,
  useAsignarVendedorMutation,
  useDesasignarVendedorMutation,
  useUpdateLeadMutation,
  useApagarLeadMutation,
  useReactivarLeadMutation,
} from "@/redux/features/crm/leadsApiSlice";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  useGetTiposInteraccionQuery,
  useGetEstadosInteraccionQuery,
  useGetTiposSeguimientoQuery,
  useGetNivelesTemperaturaQuery,
  useGetPipelinesQuery,
  useGetFuentesQuery,
  useGetEstatusQuery,
} from "@/redux/features/crm/catalogosCrmApiSlice";
import { useRetrieveCampaniasQuery } from "@/redux/features/control-escolar/campaniasApiSlice";
import { useRetrieveProgramasQuery } from "@/redux/features/control-escolar/programasApiSlice";
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
  MessageSquare,
  CalendarClock,
  GitBranch,
  Loader2,
  Save,
  Check,
  ImagePlus,
  X,
  Pencil,
  Trash2,
  ChevronDown,
  UserPlus,
  UserMinus,
  CreditCard,
  Power,
  Search,
  ArrowDownUp,
  UserRound,
  Activity,
} from "lucide-react";
import {
  InteraccionForm,
  SeguimientoForm,
  SeguimientoProgramado,
  InteraccionLead,
  Lead,
} from "@/redux/features/types/crm/lead-types";
import PlanPagoTab from "./plan-pago-tab";
import AssignVendedorModal from "@/app/components/crm/leads/assign-vendedor-modal";
import { Modal } from "@/app/components/common/modal";
import { useSearchParams } from "next/navigation";
import { getApiErrorMessage } from "@/redux/utils/api-error";

interface Props {
  uuid: string;
  refParam?: string;
}

type Tab = "resumen" | "interacciones" | "seguimientos" | "historial" | "plan-pago";

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

// ── Lead info sidebar (view + inline edit) ────────────────────────────

function LeadInfoSidebar({
  uuid,
  refetchLead,
}: {
  uuid: string;
  refetchLead: () => void;
}) {
  const { data: lead } = useGetLeadQuery(uuid);
  const { data: verify } = useVerifyUserQuery();
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  // Solo Administrador o superuser pueden asignar/reasignar/desasignar vendedor.
  const isAdmin =
    verify?.superuser === true ||
    verify?.roles?.some((r) => r.nombre === "Administrador");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    telefono: "",
    contacto_alterno: "",
    fuente: "",
    estatus: "",
    etapa: "",
    campania: "",
    programa_objetivo: "",
    notas: "",
  });

  const { data: fuentes } = useGetFuentesQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const { data: estatuses } = useGetEstatusQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  // const { data: pipelines } = useGetPipelinesQuery(
  //   unidadId ? { instituto: unidadId } : undefined,
  // );
  const { data: campanias } = useRetrieveCampaniasQuery();
  const { data: programas } = useRetrieveProgramasQuery();
  // const etapas = pipelines?.results?.[0]?.etapas ?? [];

  const [updateLead, { isLoading: isSaving }] = useUpdateLeadMutation();

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState<number | "">("");
  const { data: vendedores } = useGetVendedoresQuery();
  const [asignarVendedor, { isLoading: isAssigning }] =
    useAsignarVendedorMutation();
  const [desasignarVendedor, { isLoading: isUnassigning }] =
    useDesasignarVendedorMutation();

  const [apagarLead, { isLoading: isApagando }] = useApagarLeadMutation();
  const [reactivarLead, { isLoading: isReactivando }] =
    useReactivarLeadMutation();

  const isActive = lead?.status === 1;

  const handleToggleStatus = async () => {
    if (!lead) return;
    if (isActive) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Apagar lead",
        text: "Indica el motivo por el que se descarta este lead.",
        input: "textarea",
        inputPlaceholder: "Escribe el motivo...",
        inputAttributes: { rows: "3" },
        showCancelButton: true,
        confirmButtonText: "Apagar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc2626",
        inputValidator: (value) => {
          if (!value?.trim()) return "El motivo es obligatorio";
        },
      });
      if (!result.isConfirmed || !result.value?.trim()) return;
      try {
        await apagarLead({
          uuid: lead.uuid,
          motivo: result.value.trim(),
        }).unwrap();
        refetchLead();
      } catch (err: unknown) {
        const msg =
          (err as { data?: { detail?: string } })?.data?.detail ??
          "No se pudo apagar el lead.";
        Swal.fire({ icon: "error", title: "Error", text: msg });
      }
    } else {
      const result = await Swal.fire({
        icon: "question",
        title: "Reactivar lead",
        text: "Se restaurará el estatus anterior del lead.",
        showCancelButton: true,
        confirmButtonText: "Reactivar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#0056D2",
      });
      if (!result.isConfirmed) return;
      try {
        await reactivarLead(lead.uuid).unwrap();
        refetchLead();
      } catch (err: unknown) {
        const msg =
          (err as { data?: { detail?: string } })?.data?.detail ??
          "No se pudo reactivar el lead.";
        Swal.fire({ icon: "error", title: "Error", text: msg });
      }
    }
  };

  const startEdit = () => {
    if (!lead) return;
    const resolvedCampania =
      typeof lead.campania_nombre === "object"
        ? lead.campania_nombre?.id
        : lead.campania;
    setForm({
      nombre: lead.nombre,
      apellido_paterno: lead.apellido_paterno,
      apellido_materno: lead.apellido_materno ?? "",
      correo: lead.correo,
      telefono: lead.telefono,
      contacto_alterno: lead.contacto_alterno ?? "",
      fuente: String(lead.fuente ?? ""),
      estatus: String(lead.estatus ?? ""),
      etapa: String(lead.etapa ?? ""),
      campania: String(resolvedCampania ?? ""),
      programa_objetivo: String(lead.programa_objetivo ?? ""),
      notas: lead.notas ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!lead) return;
    try {
      await updateLead({
        uuid: lead.uuid,
        data: {
          nombre: form.nombre || undefined,
          apellido_paterno: form.apellido_paterno || undefined,
          apellido_materno: form.apellido_materno || undefined,
          correo: form.correo || undefined,
          telefono: form.telefono || undefined,
          contacto_alterno: form.contacto_alterno || undefined,
          fuente: form.fuente ? Number(form.fuente) : undefined,
          estatus: form.estatus ? Number(form.estatus) : undefined,
          etapa: form.etapa ? Number(form.etapa) : undefined,
          campania: form.campania ? Number(form.campania) : undefined,
          programa_objetivo: form.programa_objetivo
            ? Number(form.programa_objetivo)
            : undefined,
          notas: form.notas || undefined,
        },
      }).unwrap();
      refetchLead();
      setEditing(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error al guardar los cambios" });
    }
  };

  const handleAsignar = async () => {
    if (!selectedVendedor || !lead) return;
    await asignarVendedor({
      uuid: lead.uuid,
      vendedor: Number(selectedVendedor),
    });
    setAssignOpen(false);
    setSelectedVendedor("");
    refetchLead();
  };

  const handleDesasignar = async () => {
    if (!lead) return;
    const result = await Swal.fire({
      title: "¿Desasignar vendedor?",
      text: "El lead quedará sin vendedor asignado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0056D2",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, desasignar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    await desasignarVendedor(lead.uuid);
    refetchLead();
  };

  if (!lead) {
    return (
      <div className="space-y-4">
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const temp = lead.temperatura_actual;
  const tempColor = temp?.color ?? "#64748b";
  const nombreCompleto =
    lead.nombre_completo ||
    `${lead.nombre} ${lead.apellido_paterno} ${lead.apellido_materno ?? ""}`.trim();
  const campaniaNombre =
    typeof lead.campania_nombre === "object"
      ? lead.campania_nombre?.nombre
      : lead.campania_nombre;

  return (
    <div className="space-y-4">
      {/* Main info card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Avatar + name + badges + edit button */}
        <div
          className="px-5 pt-5 pb-4"
          style={{
            background: `linear-gradient(135deg, ${tempColor}18 0%, white 65%)`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm"
              style={{ backgroundColor: tempColor }}
            >
              {initials(nombreCompleto)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 leading-tight">
                {nombreCompleto}
              </h2>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {temp && (
                  <TempBadge
                    codigo={temp.codigo}
                    nombre={temp.nombre}
                    color={temp.color}
                  />
                )}
                {lead.etapa_nombre && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F0F6FF] text-[#0056D2]">
                    {lead.etapa_nombre}
                  </span>
                )}
                {lead.estatus_nombre && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {lead.estatus_nombre}
                  </span>
                )}
              </div>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={startEdit}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-[#0056D2] hover:border-[#0056D2]/30 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </button>
            )}
          </div>

          {!editing && (
            <div className="mt-3 space-y-1.5">
              <a
                href={`mailto:${lead.correo}`}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0056D2] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{lead.correo}</span>
              </a>
              <a
                href={`tel:${lead.telefono}`}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0056D2] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{lead.telefono}</span>
              </a>
              {lead.contacto_alterno && (
                <p className="flex items-center gap-2 text-xs text-gray-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lead.contacto_alterno}{" "}
                    <span className="text-gray-300">(alterno)</span>
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Edit form */}
        {editing ? (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
            {/* Datos personales */}
            <div className="space-y-2.5 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Datos personales
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Nombre
                </label>
                <input
                  className={inputClass}
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Apellido paterno
                  </label>
                  <input
                    className={inputClass}
                    value={form.apellido_paterno}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        apellido_paterno: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Apellido materno
                  </label>
                  <input
                    className={inputClass}
                    value={form.apellido_materno}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        apellido_materno: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  className={inputClass}
                  value={form.correo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, correo: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Teléfono
                  </label>
                  <input
                    className={inputClass}
                    value={form.telefono}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telefono: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Alterno
                  </label>
                  <input
                    className={inputClass}
                    value={form.contacto_alterno}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        contacto_alterno: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Datos comerciales */}
            <div className="space-y-2.5 pt-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Datos comerciales
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fuente
                </label>
                <select
                  className={selectClass}
                  value={form.fuente}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fuente: e.target.value }))
                  }
                >
                  <option value="">Seleccionar</option>
                  {fuentes?.results?.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Estatus
                </label>
                <select
                  className={selectClass}
                  value={form.estatus}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, estatus: e.target.value }))
                  }
                >
                  <option value="">Seleccionar</option>
                  {estatuses?.results?.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Etapa
                </label>
                <select
                  className={selectClass}
                  value={form.etapa}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, etapa: e.target.value }))
                  }
                >
                  <option value="">Seleccionar</option>
                  {etapas.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Campaña
                </label>
                <select
                  className={selectClass}
                  value={form.campania}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, campania: e.target.value }))
                  }
                >
                  <option value="">Seleccionar</option>
                  {campanias?.results?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Programa
                </label>
                <select
                  className={selectClass}
                  value={form.programa_objetivo}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      programa_objetivo: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleccionar</option>
                  {programas?.results?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Notas
                </label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.notas}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notas: e.target.value }))
                  }
                  placeholder="Observaciones..."
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 transition-colors"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Guardar cambios
              </button>
            </div>
          </div>
        ) : (
          /* View mode */
          <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
            <Field label="Programa">{lead.programa_nombre ?? "—"}</Field>
            <Field label="Campaña">{campaniaNombre ?? "—"}</Field>
            <Field label="Fuente">{lead.fuente_nombre ?? "—"}</Field>
            <Field label="Estatus">{lead.estatus_nombre ?? "—"}</Field>
            {lead.notas && (
              <Field label="Notas">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {lead.notas}
                </p>
              </Field>
            )}
          </div>
        )}
      </div>

      {/* Vendedor card — always visible */}
      {!editing && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Vendedor asignado
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {lead.vendedor_nombre ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F6FF] text-[#0056D2] text-sm font-medium">
                  {lead.vendedor_nombre}
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setAssignOpen((v) => !v);
                      setSelectedVendedor("");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Reasignar
                  </button>
                )}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleDesasignar}
                    disabled={isUnassigning}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors"
                  >
                    {isUnassigning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserMinus className="w-3.5 h-3.5" />
                    )}
                    Desasignar
                  </button>
                )}
              </>
            ) : (
              <>
                <span className="text-sm text-gray-400">Sin asignar</span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setAssignOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] border border-[#0056D2]/30 rounded-lg hover:bg-[#F0F6FF] transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Asignar vendedor
                  </button>
                )}
              </>
            )}
          </div>

          {isAdmin && assignOpen && (
            <div className="mt-3 space-y-2">
              <select
                className={selectClass}
                value={selectedVendedor}
                onChange={(e) =>
                  setSelectedVendedor(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <option value="">Seleccionar vendedor</option>
                {(vendedores ?? []).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre_completo}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAsignar}
                  disabled={!selectedVendedor || isAssigning}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 transition-colors"
                >
                  {isAssigning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssignOpen(false);
                    setSelectedVendedor("");
                  }}
                  className="px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estado del lead — switch apagar/reactivar */}
      {!editing && (
        <div
          className={`rounded-xl border p-4 transition-colors ${
            isActive ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                Estado del lead
              </p>
              <p
                className={`text-sm font-medium ${
                  isActive ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {isActive ? "Activo" : "Inactivo / Descartado"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isApagando || isReactivando}
              title={isActive ? "Apagar lead" : "Reactivar lead"}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                isActive
                  ? "bg-emerald-500 border-emerald-500 focus:ring-emerald-400"
                  : "bg-red-300 border-red-300 focus:ring-red-300"
              }`}
            >
              {isApagando || isReactivando ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white absolute left-1/2 -translate-x-1/2" />
              ) : (
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
                    isActive ? "translate-x-5" : "translate-x-0.5"
                  }`}
                >
                  <Power
                    className={`w-2.5 h-2.5 ${isActive ? "text-emerald-600" : "text-red-400"}`}
                  />
                </span>
              )}
            </button>
          </div>

          {!isActive && (
            <p className="text-xs text-red-500 mt-2">
              Este lead fue descartado. Reactívalo para retomar el seguimiento.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Pipeline progress ─────────────────────────────────────────────────

function EtapasProgress({
  etapas,
  currentEtapaId,
}: {
  etapas: { id: number; nombre: string; orden?: number }[];
  currentEtapaId: number;
}) {
  const currentIndex = etapas.findIndex((e) => e.id === currentEtapaId);

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-max gap-0">
        {etapas.map((etapa, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={etapa.id} className="flex items-center">
              {/* Step */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone
                      ? "bg-[#0056D2] text-white"
                      : isCurrent
                        ? "bg-[#0056D2] text-white ring-4 ring-[#0056D2]/20"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap max-w-[80px] text-center leading-tight ${
                    isCurrent
                      ? "text-[#0056D2]"
                      : isDone
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                >
                  {etapa.nombre}
                </span>
              </div>

              {/* Connector */}
              {index < etapas.length - 1 && (
                <div
                  className={`h-0.5 w-10 mx-1 mb-5 flex-shrink-0 transition-all ${
                    index < currentIndex ? "bg-[#0056D2]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeadSummaryPanel({ lead }: { lead: Lead }) {
  const { data: seguimientos, isLoading: isLoadingSeguimientos } =
    useGetSeguimientosQuery({ lead: lead.id, completado: false });
  const { data: interacciones, isLoading: isLoadingInteracciones } =
    useGetInteraccionesQuery({ lead: lead.id });
  const campania = typeof lead.campania_nombre === "object" ? lead.campania_nombre?.nombre : lead.campania_nombre;
  const nextFollowUp = seguimientos?.results
    ?.slice()
    .sort((a, b) => new Date(a.fecha_programada).getTime() - new Date(b.fecha_programada).getTime())[0];
  const latestInteraction = interacciones?.results
    ?.slice()
    .sort((a, b) => new Date(b.fecha_interaccion).getTime() - new Date(a.fecha_interaccion).getTime())[0];
  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "Sin registrar";
  const metrics = [
    { label: "Estado", value: lead.status === 1 ? "Activo" : "Inactivo", tone: lead.status === 1 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50" },
    { label: "Prioridad", value: lead.temperatura_actual?.nombre || "Sin definir", tone: "text-slate-700 bg-slate-100" },
    { label: "Fuente", value: lead.fuente_nombre || "Sin fuente", tone: "text-sky-700 bg-sky-50" },
    { label: "Asignado a", value: lead.vendedor_nombre || "Sin asignar", tone: "text-violet-700 bg-violet-50" },
    { label: "Última actividad", value: isLoadingInteracciones ? "Cargando…" : formatDate(latestInteraction?.fecha_interaccion), tone: "text-slate-700 bg-slate-100" },
    { label: "Próximo seguimiento", value: isLoadingSeguimientos ? "Cargando…" : formatDate(nextFollowUp?.fecha_programada), tone: nextFollowUp ? "text-amber-700 bg-amber-50" : "text-slate-600 bg-slate-100" },
  ];

  return (
    <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-5">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-slate-950">Información general</h2><span className="text-xs text-slate-500">Actualizado {formatDate(lead.updated_at)}</span></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map(({ label, value, tone }) => <article key={label} className="min-h-28 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"><p className="text-xs font-medium text-slate-500">{label}</p><p className={`mt-4 inline-flex max-w-full rounded-full px-2.5 py-1 text-sm font-semibold ${tone}`} title={value}>{value}</p></article>)}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="text-sm font-semibold text-slate-950">Resumen del lead</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
            {[["Programa", lead.programa_nombre || "Sin programa"], ["Campaña", campania || "Sin campaña"], ["Etapa", lead.etapa_nombre || "Sin etapa"], ["Correo", lead.correo || "Sin correo"], ["Teléfono", lead.telefono || "Sin teléfono"], ["Creado", formatDate(lead.created_at)]].map(([label, value]) => <div key={label}><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-800">{value}</dd></div>)}
          </dl>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="text-sm font-semibold text-slate-950">Notas internas</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{lead.notas || "No hay notas registradas para este lead."}</p>
        </section>
      </div>
      <aside className="space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-sky-700" /><h2 className="text-sm font-semibold text-slate-950">Actividad reciente</h2></div>{latestInteraction ? <div className="mt-4"><p className="text-sm font-medium text-slate-800">{latestInteraction.asunto || latestInteraction.tipo_detail?.nombre || "Interacción registrada"}</p><p className="mt-1 text-sm leading-5 text-slate-600">{latestInteraction.contenido || "Sin detalle adicional"}</p><p className="mt-3 text-xs text-slate-500">{formatDate(latestInteraction.fecha_interaccion)} · {latestInteraction.usuario || "Sin responsable"}</p></div> : <div className="py-7 text-center"><Activity className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-700">Aún no hay actividad</p><p className="mt-1 text-xs text-slate-500">Las interacciones aparecerán aquí.</p></div>}</section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"><div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-sky-700" /><h2 className="text-sm font-semibold text-slate-950">Próxima acción</h2></div><p className="mt-4 text-sm font-medium text-slate-800">{nextFollowUp?.descripcion || "Sin seguimiento programado"}</p><p className="mt-1 text-xs text-slate-500">{nextFollowUp ? `${formatDate(nextFollowUp.fecha_programada)}${nextFollowUp.responsable_nombre ? ` · ${nextFollowUp.responsable_nombre}` : ""}` : "Programa una acción desde Seguimientos."}</p></section>
      </aside>
    </div>
  );
}

// ── Interacciones tab ─────────────────────────────────────────────────

function InteraccionesTab({
  leadId,
  telefono,
  refetchLead,
}: {
  leadId: number;
  uuid?: string;
  telefono?: string;
  refetchLead?: () => void;
}) {
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const { data: verify } = useVerifyUserQuery();
  const isSuperUser = verify?.superuser === true;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<InteraccionForm>>({
    numero_telefono: telefono ?? "",
  });
  const [evidencia, setEvidencia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<InteraccionForm>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingRecibidoId, setTogglingRecibidoId] = useState<number | null>(
    null,
  );
  const [lightbox, setLightbox] = useState<{
    url: string;
    nombre: string;
  } | null>(null);

  const {
    data: interacciones,
    isLoading,
    refetch,
  } = useGetInteraccionesQuery({ lead: leadId });
  const { data: tipos } = useGetTiposInteraccionQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const { data: estados } = useGetEstadosInteraccionQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const { data: temperaturas } = useGetNivelesTemperaturaQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const [createInteraccion, { isLoading: isCreating }] =
    useCreateInteraccionMutation();
  const [updateInteraccion, { isLoading: isUpdating }] =
    useUpdateInteraccionMutation();
  const [deleteInteraccion, { isLoading: isDeleting }] =
    useDeleteInteraccionMutation();

  const tipoActual = tipos?.results?.find((t) => t.id === Number(form.tipo));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEvidencia(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setEvidencia(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!form.tipo || !form.estado || !form.asunto || !form.contenido) return;
    await createInteraccion({
      ...form,
      lead: leadId,
      ...(evidencia ? { evidencia } : {}),
    } as InteraccionForm);
    setForm({ numero_telefono: telefono ?? "" });
    clearFile();
    setOpen(false);
    refetch();
    refetchLead?.();
  };

  const handleStartEdit = (interaccion: InteraccionLead) => {
    setEditingId(interaccion.id);
    setExpandedId(interaccion.id);
    setEditForm({
      tipo: interaccion.tipo,
      estado: interaccion.estado,
      asunto: interaccion.asunto,
      contenido: interaccion.contenido,
      numero_telefono: interaccion.numero_telefono,
      duracion_minutos: interaccion.duracion_minutos,
      temperatura_post: interaccion.temperatura_post,
      proximo_paso: interaccion.proximo_paso,
      mensaje_enviado: interaccion.mensaje_enviado ? 1 : 0,
      mensaje_recibido: interaccion.mensaje_recibido ? 1 : 0,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setExpandedId(editingId);
    await updateInteraccion({ id: editingId, data: editForm });
    setEditingId(null);
    setEditForm({});
    refetch();
    refetchLead?.();
  };

  const handleDelete = async (id: number) => {
    await deleteInteraccion(id);
    setDeletingId(null);
    refetch();
  };

  const handleToggleRecibido = async (id: number, currentValue: boolean) => {
    setTogglingRecibidoId(id);
    await updateInteraccion({
      id,
      data: { mensaje_recibido: currentValue ? 0 : 1 },
    });
    setTogglingRecibidoId(null);
    refetch();
    refetchLead?.();
  };

  return (
    <div className="space-y-4">
      {/* Create form toggle */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nueva interacción
      </button>

      <Modal show={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Nueva interacción
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
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
                {tipos?.results?.map((t) => (
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
                {estados?.results?.map((e) => (
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
                  className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
                  value={form.numero_telefono ?? ""}
                  readOnly
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
                {temperaturas?.results?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
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

            {/* Mensajes */}
            <div className="space-y-3 sm:col-span-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Mensajes
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      mensaje_enviado: f.mensaje_enviado === 1 ? 0 : 1,
                    }))
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.mensaje_enviado === 1
                      ? "border-[#0056D2] bg-[#F0F6FF] text-[#0056D2]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      form.mensaje_enviado === 1
                        ? "border-[#0056D2] bg-[#0056D2]"
                        : "border-gray-300"
                    }`}
                  >
                    {form.mensaje_enviado === 1 && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </span>
                  Mensaje enviado
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      mensaje_recibido: f.mensaje_recibido === 1 ? 0 : 1,
                    }))
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.mensaje_recibido === 1
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      form.mensaje_recibido === 1
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {form.mensaje_recibido === 1 && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </span>
                  Mensaje recibido
                </button>
              </div>
            </div>

            {/* Evidencia */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Evidencia (imagen)
              </label>
              {preview ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Evidencia"
                    className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#0056D2] hover:bg-[#F0F6FF] transition-colors">
                  <ImagePlus className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Haz clic para adjuntar una imagen
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
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
      </Modal>

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
      ) : !interacciones?.results?.length ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Sin interacciones registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interacciones.results.map((interaccion) => (
            <div
              key={interaccion.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              {/* Header */}
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {timeAgo(interaccion.fecha_interaccion)}
                  </span>
                  {/* Toggle mensaje recibido — visible para todos */}
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleRecibido(
                        interaccion.id,
                        interaccion.mensaje_recibido,
                      )
                    }
                    disabled={togglingRecibidoId === interaccion.id}
                    title={
                      interaccion.mensaje_recibido
                        ? "Marcar como no recibido"
                        : "Marcar como recibido"
                    }
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-60 ${
                      interaccion.mensaje_recibido
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-gray-200 bg-white text-gray-400 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                  >
                    {togglingRecibidoId === interaccion.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    Recibido
                  </button>
                  {isSuperUser && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(interaccion)}
                        className="p-1 rounded-md text-gray-400 hover:text-[#0056D2] hover:bg-[#F0F6FF] transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeletingId(
                            deletingId === interaccion.id
                              ? null
                              : interaccion.id,
                          )
                        }
                        className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(
                        expandedId === interaccion.id ? null : interaccion.id,
                      )
                    }
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title={
                      expandedId === interaccion.id ? "Colapsar" : "Ver detalle"
                    }
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedId === interaccion.id ||
                        editingId === interaccion.id
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Confirm delete */}
              {deletingId === interaccion.id && (
                <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700 flex-1">
                    ¿Eliminar esta interacción?
                  </p>
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(interaccion.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-60"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Eliminar
                  </button>
                </div>
              )}

              {/* Body: only visible when expanded or editing */}
              {(expandedId === interaccion.id ||
                editingId === interaccion.id) && (
                <>
                  {editingId === interaccion.id ? (
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Tipo
                          </label>
                          <select
                            className={selectClass}
                            value={editForm.tipo ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                tipo: Number(e.target.value),
                              }))
                            }
                          >
                            {tipos?.results?.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.icono} {t.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Estado
                          </label>
                          <select
                            className={selectClass}
                            value={editForm.estado ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                estado: Number(e.target.value),
                              }))
                            }
                          >
                            {estados?.results?.map((e) => (
                              <option key={e.id} value={e.id}>
                                {e.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Asunto
                          </label>
                          <input
                            className={inputClass}
                            value={editForm.asunto ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                asunto: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Contenido
                          </label>
                          <textarea
                            rows={3}
                            className={inputClass}
                            value={editForm.contenido ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                contenido: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Próximo paso
                          </label>
                          <input
                            className={inputClass}
                            value={editForm.proximo_paso ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                proximo_paso: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Temperatura post
                          </label>
                          <select
                            className={selectClass}
                            value={editForm.temperatura_post ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                temperatura_post: Number(e.target.value),
                              }))
                            }
                          >
                            <option value="">Sin cambio</option>
                            {temperaturas?.results?.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Mensajes
                          </p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setEditForm((f) => ({
                                  ...f,
                                  mensaje_enviado:
                                    f.mensaje_enviado === 1 ? 0 : 1,
                                }))
                              }
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                                editForm.mensaje_enviado === 1
                                  ? "border-[#0056D2] bg-[#F0F6FF] text-[#0056D2]"
                                  : "border-gray-200 bg-white text-gray-500"
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  editForm.mensaje_enviado === 1
                                    ? "border-[#0056D2] bg-[#0056D2]"
                                    : "border-gray-300"
                                }`}
                              >
                                {editForm.mensaje_enviado === 1 && (
                                  <Check className="w-2 h-2 text-white" />
                                )}
                              </span>
                              Enviado
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditForm((f) => ({
                                  ...f,
                                  mensaje_recibido:
                                    f.mensaje_recibido === 1 ? 0 : 1,
                                }))
                              }
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                                editForm.mensaje_recibido === 1
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-gray-200 bg-white text-gray-500"
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  editForm.mensaje_recibido === 1
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {editForm.mensaje_recibido === 1 && (
                                  <Check className="w-2 h-2 text-white" />
                                )}
                              </span>
                              Recibido
                            </button>
                          </div>
                        </div>

                        {/* Evidencia actual */}
                        {(interaccion.archivos_detail?.length ?? 0) > 0 && (
                          <div className="space-y-1.5 sm:col-span-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Evidencia actual
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {interaccion.archivos_detail?.map((archivo) => (
                                <div key={archivo.id} className="inline-block">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={archivo.preview_url}
                                    alt={archivo.original_name}
                                    onClick={() =>
                                      setLightbox({
                                        url: archivo.preview_url,
                                        nombre: archivo.original_name,
                                      })
                                    }
                                    className="h-36 w-auto rounded-lg border border-gray-200 object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                                  />
                                  <p className="text-xs text-gray-400 mt-1 truncate max-w-[180px]">
                                    {archivo.original_name}
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    {archivo.size_formatted}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedId(editingId);
                            setEditingId(null);
                          }}
                          className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          Guardar cambios
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 mt-1 border-t border-gray-100 space-y-3 text-sm">
                      {/* Asunto + contenido */}
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                          Asunto
                        </p>
                        <p className="text-gray-800 font-medium">
                          {interaccion.asunto}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                          Contenido
                        </p>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {interaccion.contenido}
                        </p>
                      </div>

                      {/* Grid: duracion, telefono, temperatura */}
                      <div className="grid grid-cols-2 gap-3">
                        {interaccion.duracion_minutos != null && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Duración
                            </p>
                            <p className="text-gray-700">
                              {interaccion.duracion_minutos} min
                            </p>
                          </div>
                        )}
                        {interaccion.numero_telefono && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Teléfono
                            </p>
                            <p className="text-gray-700">
                              {interaccion.numero_telefono}
                            </p>
                          </div>
                        )}
                        {interaccion.temperatura_post_detail && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Temperatura post
                            </p>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${interaccion.temperatura_post_detail.color}18`,
                                color:
                                  interaccion.temperatura_post_detail.color,
                              }}
                            >
                              {interaccion.temperatura_post_detail.nombre}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                            Mensajes
                          </p>
                          <div className="flex gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                interaccion.mensaje_enviado
                                  ? "bg-[#F0F6FF] text-[#0056D2]"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              Enviado
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                interaccion.mensaje_recibido
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              Recibido
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Próximo paso */}
                      {interaccion.proximo_paso && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                            Próximo paso
                          </p>
                          <p className="text-[#0056D2] text-sm">
                            → {interaccion.proximo_paso}
                          </p>
                        </div>
                      )}

                      {/* Evidencia */}
                      {(interaccion.archivos_detail?.length ?? 0) > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                            Evidencia
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {interaccion.archivos_detail?.map((archivo) => (
                              <div key={archivo.id} className="inline-block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={archivo.preview_url}
                                  alt={archivo.original_name}
                                  onClick={() =>
                                    setLightbox({
                                      url: archivo.preview_url,
                                      nombre: archivo.original_name,
                                    })
                                  }
                                  className="h-28 w-auto rounded-lg border border-gray-200 object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                                />
                                <p className="text-xs text-gray-400 mt-1 truncate max-w-[160px]">
                                  {archivo.original_name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt={lightbox.nombre}
              className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <p className="text-white/60 text-xs mt-3 truncate max-w-full">
              {lightbox.nombre}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Seguimientos tab ──────────────────────────────────────────────────

function SeguimientosTab({ leadId }: { leadId: number }) {
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const { data: verify } = useVerifyUserQuery();
  const isSuperUser = verify?.superuser === true;

  const [open, setOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [form, setForm] = useState<Partial<SeguimientoForm>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SeguimientoForm>>({});

  const {
    data: seguimientos,
    isLoading,
    refetch,
  } = useGetSeguimientosQuery({ lead: leadId, completado: showCompleted });
  const { data: tipos } = useGetTiposSeguimientoQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const [createSeguimiento, { isLoading: isCreating }] =
    useCreateSeguimientoMutation();
  const [updateSeguimiento, { isLoading: isUpdating }] =
    useUpdateSeguimientoMutation();
  const [completar] = useCompletarSeguimientoMutation();
  const visibleSeguimientos = (seguimientos?.results ?? [])
    .filter((seg) => `${seg.tipo_detail?.nombre ?? ""} ${seg.descripcion} ${seg.responsable_nombre ?? ""}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    .slice()
    .sort((a, b) => sortAscending
      ? new Date(a.fecha_programada).getTime() - new Date(b.fecha_programada).getTime()
      : new Date(b.fecha_programada).getTime() - new Date(a.fecha_programada).getTime());

  const handleSubmit = async () => {
    if (!form.tipo || !form.fecha_programada || !form.descripcion) return;
    await createSeguimiento({ ...form, lead: leadId } as SeguimientoForm);
    setForm({});
    setOpen(false);
    refetch();
  };

  const handleCompletar = async (
    id: number,
    yaCompletado: boolean,
    fechaProgramada: string,
  ) => {
    if (yaCompletado) {
      await Swal.fire({
        title: "Ya completado",
        text: "Este seguimiento ya fue marcado como completado.",
        icon: "info",
        confirmButtonColor: "#0056D2",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const ahora = new Date();
    const fecha = new Date(fechaProgramada);
    if (ahora < fecha) {
      const fechaFormateada = fecha.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      await Swal.fire({
        title: "Aún no es momento",
        text: `Este seguimiento podrá completarse a partir del ${fechaFormateada}.`,
        icon: "warning",
        confirmButtonColor: "#0056D2",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Completar seguimiento?",
      text: "Esta acción marcará el seguimiento como completado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0056D2",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, completar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    await completar(id);
    refetch();
  };

  const handleStartEdit = (seg: SeguimientoProgramado) => {
    setEditingId(seg.id);
    setExpandedId(seg.id);
    setEditForm({
      tipo: seg.tipo,
      fecha_programada: seg.fecha_programada,
      descripcion: seg.descripcion,
      responsable: seg.responsable,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setExpandedId(editingId);
    await updateSeguimiento({ id: editingId, data: editForm });
    setEditingId(null);
    setEditForm({});
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Programar seguimiento
        </button>
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setShowCompleted(false)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              !showCompleted
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pendientes
          </button>
          <button
            type="button"
            onClick={() => setShowCompleted(true)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              showCompleted
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completados
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="relative block">
          <span className="sr-only">Buscar seguimientos</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por actividad o responsable" className="min-h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100" />
        </label>
        <button type="button" onClick={() => setSortAscending((value) => !value)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-600"><ArrowDownUp className="h-4 w-4" />{sortAscending ? "Más próximos" : "Más recientes"}</button>
      </div>

      <Modal show={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Programar seguimiento
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
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
                {tipos?.results?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
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
      </Modal>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : !seguimientos?.results?.length ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-12 text-center">
          <CalendarClock className="mx-auto mb-3 h-9 w-9 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">
            {showCompleted
              ? "Sin seguimientos completados"
              : "Sin seguimientos pendientes"}
          </p>
          {!showCompleted && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Crear seguimiento
            </button>
          )}
        </div>
      ) : !visibleSeguimientos.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center"><Search className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-700">No encontramos seguimientos</p><button type="button" onClick={() => setSearch("")} className="mt-2 text-sm font-medium text-sky-700 hover:text-sky-800">Limpiar búsqueda</button></div>
      ) : (
        <div className="relative space-y-3 before:absolute before:bottom-5 before:left-4 before:top-5 before:w-px before:bg-slate-200">
          {visibleSeguimientos.map((seg) => {
            const isPast = new Date(seg.fecha_programada) < new Date();
            const isExpanded = expandedId === seg.id || editingId === seg.id;
            return (
              <div
                key={seg.id}
                className="relative bg-white rounded-xl border border-gray-200 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-sm"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`relative z-[1] w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isPast ? "bg-red-50" : "bg-amber-50"}`}
                    >
                      <Clock
                        className={`w-4 h-4 ${isPast ? "text-red-500" : "text-amber-500"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {/* {seg.tipo_detail?.icono}{" "} */}
                        {seg.tipo_detail?.nombre ?? `Tipo ${seg.tipo}`}
                      </p>
                      <p
                        className={`text-xs mt-0.5 font-medium ${isPast ? "text-red-500" : "text-amber-600"}`}
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
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        handleCompletar(
                          seg.id,
                          seg.completado,
                          seg.fecha_programada,
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completar
                    </button>
                    {isSuperUser && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(seg)}
                        className="p-1 rounded-md text-gray-400 hover:text-[#0056D2] hover:bg-[#F0F6FF] transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : seg.id)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title={isExpanded ? "Colapsar" : "Ver detalle"}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Body */}
                {isExpanded && (
                  <>
                    {editingId === seg.id ? (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Tipo
                            </label>
                            <select
                              className={selectClass}
                              value={editForm.tipo ?? ""}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  tipo: Number(e.target.value),
                                }))
                              }
                            >
                              {tipos?.results?.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.icono} {t.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Fecha programada
                            </label>
                            <input
                              type="datetime-local"
                              className={inputClass}
                              value={editForm.fecha_programada ?? ""}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  fecha_programada: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Descripción
                            </label>
                            <textarea
                              rows={3}
                              className={inputClass}
                              value={editForm.descripcion ?? ""}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  descripcion: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedId(editingId);
                              setEditingId(null);
                            }}
                            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            Guardar cambios
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                            Descripción
                          </p>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {seg.descripcion}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Fecha programada
                            </p>
                            <p className="text-gray-700">
                              {new Date(seg.fecha_programada).toLocaleString(
                                "es-MX",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          {seg.responsable_nombre && (
                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                                Responsable
                              </p>
                              <p className="text-gray-700">
                                {seg.responsable_nombre}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
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

  if (!historial?.results?.length) {
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
      {historial.results.map((h) => (
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

function LeadActionBar({ lead, refetchLead }: { lead: Lead; refetchLead: () => void }) {
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const { data: verify } = useVerifyUserQuery();
  const [editing, setEditing] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido_paterno: "", apellido_materno: "", correo: "", telefono: "", contacto_alterno: "", fuente: "", estatus: "", campania: "", programa_objetivo: "" });
  const { data: fuentes } = useGetFuentesQuery(unidadId ? { instituto: unidadId } : undefined);
  const { data: estatuses } = useGetEstatusQuery(unidadId ? { instituto: unidadId } : undefined);
  const { data: campanias } = useRetrieveCampaniasQuery();
  const { data: programas } = useRetrieveProgramasQuery();
  const [updateLead, { isLoading: isSaving }] = useUpdateLeadMutation();
  const [apagarLead, { isLoading: isApagando }] = useApagarLeadMutation();
  const [reactivarLead, { isLoading: isReactivando }] = useReactivarLeadMutation();
  const canEdit = verify?.superuser === true || lead.etapa_nombre?.trim().toLocaleLowerCase() !== "venta";
  // Solo Administrador o superuser pueden asignar/reasignar vendedor.
  const isAdmin =
    verify?.superuser === true ||
    verify?.roles?.some((r) => r.nombre === "Administrador");
  const openEdit = () => {
    const campania = typeof lead.campania_nombre === "object" ? lead.campania_nombre?.id : lead.campania;
    setForm({ nombre: lead.nombre || "", apellido_paterno: lead.apellido_paterno || "", apellido_materno: lead.apellido_materno || "", correo: lead.correo || "", telefono: lead.telefono || "", contacto_alterno: lead.contacto_alterno || "", fuente: String(lead.fuente || ""), estatus: String(lead.estatus || ""), campania: String(campania || ""), programa_objetivo: String(lead.programa_objetivo || "") });
    setEditing(true);
  };
  const save = async () => {
    try {
      await updateLead({ uuid: lead.uuid, data: { ...form, fuente: form.fuente ? Number(form.fuente) : undefined, estatus: form.estatus ? Number(form.estatus) : undefined, campania: form.campania ? Number(form.campania) : undefined, programa_objetivo: form.programa_objetivo ? Number(form.programa_objetivo) : undefined } }).unwrap();
      setEditing(false); refetchLead();
    } catch (error) { Swal.fire({ icon: "error", title: "No se pudieron guardar los cambios", text: getApiErrorMessage(error) }); }
  };
  const toggleStatus = async () => {
    const willDeactivate = lead.status === 1;
    const result = await Swal.fire({ icon: willDeactivate ? "warning" : "question", title: willDeactivate ? "Cambiar estado del lead" : "Reactivar lead", text: willDeactivate ? "Indica el motivo para descartar este lead." : "Se restaurará el estatus anterior.", input: willDeactivate ? "textarea" : undefined, inputPlaceholder: "Escribe el motivo...", showCancelButton: true, confirmButtonText: willDeactivate ? "Cambiar estado" : "Reactivar", cancelButtonText: "Cancelar", inputValidator: willDeactivate ? (value: string) => (!value?.trim() ? "El motivo es obligatorio" : undefined) : undefined });
    if (!result.isConfirmed) return;
    try { if (willDeactivate) await apagarLead({ uuid: lead.uuid, motivo: result.value.trim() }).unwrap(); else await reactivarLead(lead.uuid).unwrap(); refetchLead(); }
    catch (error) { Swal.fire({ icon: "error", title: "No se pudo actualizar el estado", text: getApiErrorMessage(error) }); }
  };
  const fields = [
    ["Nombre", "nombre", "text"], ["Apellido paterno", "apellido_paterno", "text"], ["Apellido materno", "apellido_materno", "text"], ["Correo", "correo", "email"], ["Teléfono", "telefono", "tel"], ["Contacto alterno", "contacto_alterno", "tel"],
  ] as const;
  return <>
    <div className="flex flex-wrap gap-2"><button type="button" onClick={openEdit} disabled={!canEdit} title={!canEdit ? "Los leads en etapa Venta solo pueden editarlos superusuarios." : undefined} className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-600 disabled:cursor-not-allowed disabled:opacity-50"><Pencil className="mr-1.5 h-4 w-4" />Editar lead</button>{isAdmin && <button type="button" onClick={() => setAssigning(true)} className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-600"><UserPlus className="mr-1.5 h-4 w-4" />{lead.vendedor_nombre ? "Reasignar" : "Asignar vendedor"}</button>}<button type="button" onClick={toggleStatus} disabled={isApagando || isReactivando} className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-600 disabled:opacity-60"><Power className="mr-1.5 h-4 w-4" />{lead.status === 1 ? "Cambiar estado" : "Reactivar"}</button></div>
    <Modal show={editing} onClose={() => setEditing(false)}><div className="max-h-[85vh] overflow-y-auto"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-4"><div><h2 className="text-base font-semibold text-slate-950">Editar lead</h2><p className="mt-0.5 text-sm text-slate-500">Actualiza la información sin perder el contexto.</p></div><button type="button" onClick={() => setEditing(false)} aria-label="Cerrar" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="grid gap-4 p-6 sm:grid-cols-2">{fields.map(([label, key, type]) => <label key={key} className="space-y-1.5"><span className="text-xs font-medium text-slate-600">{label}</span><input type={type} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className={inputClass} /></label>)}<label className="space-y-1.5"><span className="text-xs font-medium text-slate-600">Fuente</span><select value={form.fuente} onChange={(event) => setForm((current) => ({ ...current, fuente: event.target.value }))} className={selectClass}><option value="">Seleccionar</option>{fuentes?.results?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label><label className="space-y-1.5"><span className="text-xs font-medium text-slate-600">Estatus</span><select value={form.estatus} onChange={(event) => setForm((current) => ({ ...current, estatus: event.target.value }))} className={selectClass}><option value="">Seleccionar</option>{estatuses?.results?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label><label className="space-y-1.5"><span className="text-xs font-medium text-slate-600">Campaña</span><select value={form.campania} onChange={(event) => setForm((current) => ({ ...current, campania: event.target.value }))} className={selectClass}><option value="">Seleccionar</option>{campanias?.results?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label><label className="space-y-1.5"><span className="text-xs font-medium text-slate-600">Programa</span><select value={form.programa_objetivo} onChange={(event) => setForm((current) => ({ ...current, programa_objetivo: event.target.value }))} className={selectClass}><option value="">Seleccionar</option>{programas?.results?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label></div><div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4"><button type="button" onClick={() => setEditing(false)} className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button><button type="button" onClick={save} disabled={isSaving} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{isSaving && <Loader2 className="h-4 w-4 animate-spin" />}Guardar cambios</button></div></div></Modal>
    <AssignVendedorModal
      open={assigning}
      onClose={() => setAssigning(false)}
      leads={[{ uuid: lead.uuid, label: lead.nombre_completo || `${lead.nombre} ${lead.apellido_paterno}` }]}
      onAssigned={refetchLead}
    />
  </>;
}

export default function LeadDetailView({ uuid }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("resumen");
  const searchParams = useSearchParams();
  const { data: lead, refetch: refetchLead } = useGetLeadQuery(uuid);
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const { data: pipelines } = useGetPipelinesQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const etapas = pipelines?.results?.[0]?.etapas ?? [];
  const resolvedCampania =
    typeof lead?.campania_nombre === "object"
      ? lead.campania_nombre?.id
      : lead?.campania;
  const resolvedInstituto =
    typeof lead?.campania_nombre === "object"
      ? lead.campania_nombre?.instituto_id
      : lead?.instituto;

  const tabs: {
    key: Tab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "resumen", label: "Resumen", icon: CheckCircle2 },
    { key: "interacciones", label: "Interacciones", icon: MessageSquare },
    { key: "seguimientos", label: "Seguimientos", icon: CalendarClock },
    { key: "historial", label: "Historial", icon: GitBranch },
    { key: "plan-pago", label: "Plan de Pago", icon: CreditCard },
  ];
  const ref = searchParams.get("ref");
  const nombre = lead?.nombre_completo || (lead ? `${lead.nombre} ${lead.apellido_paterno}` : "Cargando lead");
  const campaniaNombre = typeof lead?.campania_nombre === "object" ? lead.campania_nombre?.nombre : lead?.campania_nombre;
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <Link
        href={`/dashboard/crm/leads${ref ? `?ref=${ref}` : ""}`}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-1 text-sm font-medium text-slate-600 outline-none transition hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a leads
      </Link>

      <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">{lead ? initials(nombre) : "…"}</div>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-xl font-semibold tracking-tight text-slate-950">{nombre}</h1>{lead?.status === 1 ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Activo</span> : <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">Inactivo</span>}</div><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">{lead?.correo && <a href={`mailto:${lead.correo}`} className="hover:text-sky-700">{lead.correo}</a>}{lead?.telefono && <a href={`tel:${lead.telefono}`} className="hover:text-sky-700">{lead.telefono}</a>}</div></div>
          </div>
          <div className="flex flex-wrap gap-2"><>{lead && <LeadActionBar lead={lead} refetchLead={refetchLead} />}</><button type="button" onClick={() => setActiveTab("interacciones")} className="min-h-10 rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-600">Registrar interacción</button><button type="button" onClick={() => setActiveTab("seguimientos")} className="min-h-10 rounded-lg bg-slate-950 px-3.5 text-sm font-semibold text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"><CalendarClock className="mr-1.5 inline h-4 w-4" />Agregar seguimiento</button></div>
        </div>
        {lead && <div className="grid border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-5"><div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Programa</p><p className="mt-1 text-sm font-medium text-slate-800">{lead.programa_nombre || "Sin programa"}</p></div><div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Etapa</p><p className="mt-1 text-sm font-medium text-slate-800">{lead.etapa_nombre || "—"}</p></div><div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Fuente</p><p className="mt-1 text-sm font-medium text-slate-800">{lead.fuente_nombre || "—"}</p></div><div className="border-b border-slate-100 p-4 sm:border-b-0 lg:border-r"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Campaña</p><p className="mt-1 text-sm font-medium text-slate-800">{campaniaNombre || "—"}</p></div><div className="p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Asignado a</p><p className="mt-1 text-sm font-medium text-slate-800">{lead.vendedor_nombre || "Sin asignar"}</p></div></div>}
      </header>

      <div className="grid grid-cols-1 items-start gap-5">
        <div className="min-w-0 space-y-5">
          {lead && etapas.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-950">Progreso en el pipeline</h2><span className="text-xs text-slate-500">{lead.etapa_nombre}</span></div>
              <EtapasProgress etapas={etapas} currentEtapaId={lead.etapa} />
            </div>
          )}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="sticky top-0 z-10 flex overflow-x-auto border-b border-slate-200 bg-white" role="tablist" aria-label="Detalle del lead">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button key={key} type="button" role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)} className={`flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-medium whitespace-nowrap outline-none transition focus-visible:bg-sky-50 ${activeTab === key ? "border-sky-700 text-sky-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}><Icon className="h-4 w-4" />{label}</button>
              ))}
            </div>
            <div className="min-h-[360px] p-4 sm:p-6" role="tabpanel">
              {activeTab === "resumen" && lead && <LeadSummaryPanel lead={lead} />}
              {activeTab === "interacciones" && lead && <InteraccionesTab leadId={lead.id} uuid={uuid} telefono={lead.telefono} refetchLead={refetchLead} />}
              {activeTab === "seguimientos" && lead && <SeguimientosTab leadId={lead.id} />}
              {activeTab === "historial" && lead && <HistorialTab leadId={lead.id} />}
              {activeTab === "plan-pago" && lead && <PlanPagoTab leadId={lead.id} campania={resolvedCampania} instituto={resolvedInstituto} correo={lead.correo} refetchLead={refetchLead} />}
            </div>
          </section>
        </div>
        <aside id="lead-info" className="hidden min-w-0 xl:sticky xl:top-6">
          <LeadInfoSidebar uuid={uuid} refetchLead={refetchLead} />
        </aside>
      </div>
    </div>
  );
}
