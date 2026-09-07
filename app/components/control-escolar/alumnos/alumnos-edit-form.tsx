"use client";

import { useState } from "react";
import { useAlumnoEditForm } from "@/hooks";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import Swal from "sweetalert2";
import {
  useGetInscripcionesEstudianteQuery,
  useGetComprobantesInscripcionQuery,
  useSubirComprobanteInscripcionMutation,
  useRetrieveEstudianteQuery,
  useActivarEstudianteMutation,
  useDesactivarEstudianteMutation,
  useReenviarInvitacionEstudianteMutation,
  useAplicarPagoMutation,
  useDescargarReciboPagoMutation,
  useRegenerarReciboPagoMutation,
  useDescargarReciboConsolidadoMutation,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { openOrDownloadBlob } from "@/lib/download-blob";
import { PagoInscripcion } from "@/redux/features/types/control-escolar/type";
import { Modal } from "../../common/modal";
import StepEstudiante from "./steps";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Save,
  Loader2,
  PencilIcon,
  GraduationCap,
  CheckCircle2,
  Clock,
  Upload,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Landmark,
  Hash,
  Send,
  FileText,
  RotateCw,
} from "lucide-react";

interface Props {
  uuid: string;
  initialRef?: string;
}

// ── Primitives (same system as alumnos-form) ─────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 mb-6">
      <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#0056D2]" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

// ── Profile header ───────────────────────────────────────────────────

function ProfileHeader({
  uuid,
  disabled,
  onEdit,
  onInscribir,
}: {
  uuid: string;
  disabled: boolean;
  onEdit: () => void;
  onInscribir: () => void;
}) {
  const { data: estudiante, isLoading } = useRetrieveEstudianteQuery(uuid);
  const [activar, { isLoading: activando }] = useActivarEstudianteMutation();
  const [desactivar, { isLoading: desactivando }] =
    useDesactivarEstudianteMutation();
  const [reenviarInvitacion, { isLoading: reenviando }] =
    useReenviarInvitacionEstudianteMutation();
  const toggling = activando || desactivando;

  const handleToggleStatus = async () => {
    try {
      const res =
        estudiante?.status === 1
          ? await desactivar(uuid).unwrap()
          : await activar(uuid).unwrap();
      sweetAlert("success", res.detail ?? "Estado actualizado.", "Listo");
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "No se pudo cambiar el estado", "Error");
    }
  };

  const handleReenviarInvitacion = async () => {
    try {
      const res = await reenviarInvitacion(uuid).unwrap();
      sweetAlert("success", res.detail ?? "Invitación reenviada.", "Listo");
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert(
        "error",
        detail ?? "No se pudo reenviar la invitación.",
        "Error",
      );
    }
  };

  const nombre = estudiante
    ? `${estudiante.user_obj?.nombre ?? ""} ${estudiante.user_obj?.apellido_paterno ?? ""} ${estudiante.user_obj?.apellido_materno ?? ""}`.trim()
    : "";

  const initials = nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
          {isLoading ? (
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-xl font-bold text-[#0056D2]">{initials}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {nombre || "—"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-xs font-mono text-gray-400">
                  {estudiante?.matricula ?? "—"}
                </span>
                {estudiante?.user_obj?.email && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail className="w-3 h-3" />
                    {estudiante.user_obj.email}
                  </span>
                )}
                {estudiante?.user_obj?.telefono && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone className="w-3 h-3" />
                    {estudiante.user_obj.telefono}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Status + actions */}
        <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
          {estudiante && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                estudiante.status === 1
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${estudiante.status === 1 ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {estudiante.status === 1 ? "Activo" : "Inactivo"}
            </span>
          )}
          <div className="flex items-center gap-2">
            {estudiante && (
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={toggling}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  estudiante.status === 1
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {toggling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${estudiante.status === 1 ? "bg-red-400" : "bg-emerald-500"}`}
                  />
                )}
                {estudiante.status === 1 ? "Desactivar" : "Activar"}
              </button>
            )}
            {estudiante && (
              <button
                type="button"
                onClick={handleReenviarInvitacion}
                disabled={reenviando}
                title="Reenviar el correo de activación de cuenta"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reenviando ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Reenviar invitación
              </button>
            )}
            <button
              type="button"
              onClick={onEdit}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                !disabled
                  ? "border-[#0056D2] text-[#0056D2] bg-[#F0F6FF]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PencilIcon className="w-3.5 h-3.5" />
              {disabled ? "Editar" : "Editando"}
            </button>
            <button
              type="button"
              onClick={onInscribir}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Inscribir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Comprobantes sub-panel ────────────────────────────────────────────

function ComprobantesPanel({ inscripcionId }: { inscripcionId: number }) {
  const { data: comprobantes } =
    useGetComprobantesInscripcionQuery(inscripcionId);
  const [subirComprobante, { isLoading: isUploading }] =
    useSubirComprobanteInscripcionMutation();

  const [showForm, setShowForm] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [campos, setCampos] = useState({
    monto_visible: "",
    banco_origen: "",
    referencia: "",
    notas: "",
  });

  const handleSubir = async () => {
    if (!archivo) return;
    const fd = new FormData();
    fd.append("archivo", archivo);
    if (campos.monto_visible) fd.append("monto_visible", campos.monto_visible);
    if (campos.banco_origen) fd.append("banco_origen", campos.banco_origen);
    if (campos.referencia) fd.append("referencia", campos.referencia);
    if (campos.notas) fd.append("notas", campos.notas);

    try {
      await subirComprobante({ inscripcionId, formData: fd }).unwrap();
      setShowForm(false);
      setArchivo(null);
      setCampos({
        monto_visible: "",
        banco_origen: "",
        referencia: "",
        notas: "",
      });
      sweetAlert("success", "Comprobante subido correctamente.", "Listo");
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "No se pudo subir el comprobante", "Error");
    }
  };

  const inputSm =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] bg-white";

  return (
    <div className="border-t border-gray-100 pt-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <FileCheck2 className="w-3.5 h-3.5" />
          Comprobantes ({comprobantes?.length ?? 0})
        </span>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#0056D2] hover:underline"
        >
          <Upload className="w-3 h-3" />
          {showForm ? "Cancelar" : "Subir comprobante"}
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
          {/* File picker */}
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#0056D2]/50 hover:bg-[#F0F6FF]/50 transition-colors">
            {archivo ? (
              <span className="text-xs text-gray-700 font-medium">
                {archivo.name}
              </span>
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-300" />
                <span className="text-xs text-gray-400">
                  PDF, imagen u otro comprobante
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
          </label>

          {/* Optional fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Monto visible
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={inputSm}
                placeholder="0.00"
                value={campos.monto_visible}
                onChange={(e) =>
                  setCampos((c) => ({ ...c, monto_visible: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <Landmark className="w-3 h-3" /> Banco emisor
              </label>
              <input
                className={inputSm}
                placeholder="BBVA, HSBC..."
                value={campos.banco_origen}
                onChange={(e) =>
                  setCampos((c) => ({ ...c, banco_origen: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <Hash className="w-3 h-3" /> Referencia / folio
              </label>
              <input
                className={inputSm}
                placeholder="TXN-123456"
                value={campos.referencia}
                onChange={(e) =>
                  setCampos((c) => ({ ...c, referencia: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">
                Notas internas
              </label>
              <input
                className={inputSm}
                placeholder="Observaciones..."
                value={campos.notas}
                onChange={(e) =>
                  setCampos((c) => ({ ...c, notas: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubir}
              disabled={isUploading || !archivo}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {isUploading ? "Subiendo..." : "Subir"}
            </button>
          </div>
        </div>
      )}

      {/* Comprobantes list */}
      {(comprobantes?.length ?? 0) > 0 && (
        <div className="space-y-2">
          {comprobantes!.map((c) => (
            <div
              key={c.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {c.original_name}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                  {c.monto_visible && <span>${c.monto_visible}</span>}
                  {c.banco_origen && <span>{c.banco_origen}</span>}
                  {c.referencia && <span>{c.referencia}</span>}
                  <span>
                    {new Date(c.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
              <a
                href={c.archivo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0056D2] hover:underline flex-shrink-0"
              >
                Ver
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function fmtMXN(monto: string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(parseFloat(monto));
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Aplicar pago modal ───────────────────────────────────────────────

function AplicarPagoModal({
  pago,
  inscripcionId,
  estudianteId,
  onClose,
  onPaymentSuccess,
}: {
  pago: PagoInscripcion;
  inscripcionId: number;
  estudianteId: string;
  onClose: () => void;
  onPaymentSuccess?: (pagoId: number) => void;
}) {
  const [aplicar, { isLoading }] = useAplicarPagoMutation();
  const [monto, setMonto] = useState(pago.monto);

  const pendiente = parseFloat(pago.monto);
  const montoNum = parseFloat(monto);
  const diff = !isNaN(montoNum) && monto !== "" ? montoNum - pendiente : null;
  const superaLimite = diff !== null && Math.abs(diff) > 100;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isNaN(montoNum) || montoNum <= 0) return;

    try {
      const res = await aplicar({
        inscripcionId,
        estudianteId,
        pagos: [{ id: pago.id, monto: montoNum }],
      }).unwrap();

      const resultado = res.resultados[0];
      onClose();

      const isResiduo = resultado?.resultado === "aplicado_con_residuo";
      const tipo =
        resultado?.tipo_diferencia === "excedente" ? "excedente" : "parcial";
      const absDiff = Math.abs(resultado?.diferencia ?? 0).toFixed(2);

      const alertRes = await Swal.fire({
        icon: isResiduo ? "info" : "success",
        title: "Pago aplicado",
        html: isResiduo
          ? `Registrado con <b>${tipo}</b> de <b>$${absDiff}</b>.<br/><span style="color:#6b7280">${res.message}</span>`
          : `<span>${res.message}</span>`,
        showCancelButton: true,
        confirmButtonText: "Ver recibo",
        confirmButtonColor: "#0056D2",
        cancelButtonText: "Cerrar",
        cancelButtonColor: "#6b7280",
      });

      if (alertRes.isConfirmed && onPaymentSuccess) {
        onPaymentSuccess(pago.id);
      }
    } catch (err: unknown) {
      const data = (err as { data?: Record<string, unknown> })?.data;
      const msg =
        (data?.error as string) ??
        (data?.message as string) ??
        (data?.detail as string) ??
        "No se pudo aplicar el pago.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const inputSm =
    "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white";

  return (
    <form onSubmit={handleSubmit} className="min-w-[360px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <DollarSign className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Aplicar pago</h3>
          <p className="text-xs text-gray-400 truncate max-w-[220px]">
            {pago.concepto ?? pago.tipo_pago_r}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Info */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
          <div>
            <p className="text-xs text-gray-400">Vence</p>
            <p className="text-sm font-medium text-gray-800">
              {fmtDate(pago.fecha_vencimiento)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Monto acordado</p>
            <p className="text-sm font-semibold text-gray-900">
              {fmtMXN(pago.monto)}
            </p>
          </div>
        </div>

        {/* Monto input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Monto recibido <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              className={`${inputSm} pl-9`}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-400">
            Tolerancia ±$100 — diferencias mayores rechazan el lote completo
          </p>
        </div>

        {/* Live diff preview */}
        {diff !== null && diff !== 0 && (
          <div
            className={`text-xs px-3 py-2.5 rounded-lg flex items-start gap-2 ${
              superaLimite
                ? "bg-red-50 text-red-700"
                : diff > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-blue-50 text-blue-700"
            }`}
          >
            <span className="mt-0.5">
              {superaLimite ? "⚠" : diff > 0 ? "↑" : "↓"}
            </span>
            <span>
              {superaLimite
                ? `Diferencia de $${Math.abs(diff).toFixed(2)} supera el límite de $100 — el pago será rechazado`
                : diff > 0
                  ? `Excedente de $${diff.toFixed(2)} — quedará como "excedente"`
                  : `Diferencia de $${Math.abs(diff).toFixed(2)} — quedará como "parcial"`}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || superaLimite}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <DollarSign className="w-4 h-4" />
          )}
          {isLoading ? "Aplicando..." : "Aplicar pago"}
        </button>
      </div>
    </form>
  );
}

// ── Pago row ─────────────────────────────────────────────────────────

function PagoRow({
  pago,
  onApply,
  onDescargarRecibo,
  onRegenerarRecibo,
  isDownloadingRecibo,
  isRegeneratingRecibo,
  canManagePagos,
}: {
  pago: PagoInscripcion;
  onApply?: () => void;
  onDescargarRecibo?: () => void;
  onRegenerarRecibo?: () => void;
  isDownloadingRecibo?: boolean;
  isRegeneratingRecibo?: boolean;
  canManagePagos?: boolean;
}) {
  const estadoLower = pago.estado?.toLowerCase() ?? "";
  const isResuelto = ["completado", "parcial", "excedente"].includes(
    estadoLower,
  );
  const isCompletado = estadoLower === "completado";
  const isParcial = estadoLower === "parcial";
  const isExcedente = estadoLower === "excedente";
  const isVencido = estadoLower === "vencido";

  return (
    <div
      className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 ${
        !isCompletado && onApply && canManagePagos
          ? "cursor-pointer hover:bg-gray-50/80 -mx-2 px-2 rounded-lg transition-colors"
          : ""
      }`}
      onClick={!isCompletado && onApply && canManagePagos ? onApply : undefined}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isCompletado
            ? "bg-emerald-50"
            : isParcial
              ? "bg-blue-50"
              : isExcedente
                ? "bg-purple-50"
                : isVencido
                  ? "bg-red-50"
                  : "bg-amber-50"
        }`}
      >
        {isCompletado ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        ) : isParcial ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        ) : isExcedente ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
        ) : (
          <Clock
            className={`w-3.5 h-3.5 ${isVencido ? "text-red-500" : "text-amber-500"}`}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-800 truncate">
          {pago.concepto ?? pago.tipo_pago_r}
        </p>
        <p className="text-xs text-gray-400">
          {isResuelto && pago.fecha_pago
            ? `Pagado el ${fmtDate(pago.fecha_pago)}`
            : `Vence el ${fmtDate(pago.fecha_vencimiento)}`}
          {pago.metodo_pago_r && ` · ${pago.metodo_pago_r}`}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-900">
            {fmtMXN(pago.monto)}
          </p>
          <span
            className={`text-xs font-medium ${
              isCompletado
                ? "text-emerald-600"
                : isParcial
                  ? "text-blue-600"
                  : isExcedente
                    ? "text-purple-600"
                    : isVencido
                      ? "text-red-500"
                      : "text-amber-500"
            }`}
          >
            {isCompletado
              ? "Pagado"
              : isParcial
                ? "Parcial"
                : isExcedente
                  ? "Excedente"
                  : isVencido
                    ? "Vencido"
                    : "Pendiente"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!isCompletado && onApply && canManagePagos && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <DollarSign className="w-3 h-3" />
              Aplicar
            </button>
          )}

          {isResuelto && canManagePagos && (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onDescargarRecibo}
                disabled={isDownloadingRecibo}
                title="Descargar recibo de pago en PDF"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] hover:bg-[#E0EDFE] rounded-lg transition-colors disabled:opacity-50"
              >
                {isDownloadingRecibo ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <FileText className="w-3 h-3" />
                )}
                Recibo
              </button>

              <button
                type="button"
                onClick={onRegenerarRecibo}
                disabled={isRegeneratingRecibo}
                title="Regenerar recibo (forzar actualización)"
                className="p-1.5 text-gray-400 hover:text-[#0056D2] hover:bg-[#F0F6FF] rounded-lg transition-colors disabled:opacity-50"
              >
                <RotateCw
                  className={`w-3.5 h-3.5 ${
                    isRegeneratingRecibo ? "animate-spin text-[#0056D2]" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Inscripciones tab ────────────────────────────────────────────────

function InscripcionesTab({ uuid }: { uuid: string }) {
  const { data: user } = useRetrieveUserQuery();
  const canManagePagos =
    user?.roles_list?.some((r) =>
      ["Administrador", "Tutor"].includes(r.nombre),
    ) ?? false;

  const { data: inscripciones, isLoading } =
    useGetInscripcionesEstudianteQuery(uuid);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [comprobantesId, setComprobantesId] = useState<number | null>(null);
  const [pagoModal, setPagoModal] = useState<{
    pago: PagoInscripcion;
    inscripcionId: number;
  } | null>(null);

  const [descargarRecibo] = useDescargarReciboPagoMutation();
  const [regenerarRecibo] = useRegenerarReciboPagoMutation();
  const [descargarConsolidado] = useDescargarReciboConsolidadoMutation();

  const [downloadingPagoId, setDownloadingPagoId] = useState<number | null>(
    null,
  );
  const [regeneratingPagoId, setRegeneratingPagoId] = useState<number | null>(
    null,
  );
  const [loadingConsolidadoId, setLoadingConsolidadoId] = useState<
    number | null
  >(null);

  const handleDescargarRecibo = async (
    inscripcionId: number,
    pagoId: number,
  ) => {
    setDownloadingPagoId(pagoId);
    try {
      const blob = await descargarRecibo({ inscripcionId, pagoId }).unwrap();
      openOrDownloadBlob(blob, `recibo-pago-${pagoId}.pdf`);
    } catch (err: unknown) {
      const data = (err as { data?: { detail?: string; error?: string } })
        ?.data;
      const msg =
        data?.detail || data?.error || "No se pudo descargar el recibo.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setDownloadingPagoId(null);
    }
  };

  const handleRegenerarRecibo = async (
    inscripcionId: number,
    pagoId: number,
  ) => {
    setRegeneratingPagoId(pagoId);
    try {
      const blob = await regenerarRecibo({ inscripcionId, pagoId }).unwrap();
      openOrDownloadBlob(blob, `recibo-pago-${pagoId}.pdf`);
      Swal.fire({
        icon: "success",
        title: "Recibo regenerado",
        text: "El comprobante fue actualizado correctamente.",
      });
    } catch (err: unknown) {
      const data = (err as { data?: { detail?: string; error?: string } })
        ?.data;
      const msg =
        data?.detail || data?.error || "No se pudo regenerar el recibo.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setRegeneratingPagoId(null);
    }
  };

  const handleDescargarConsolidado = async (inscripcionId: number) => {
    setLoadingConsolidadoId(inscripcionId);
    try {
      const blob = await descargarConsolidado({ inscripcionId }).unwrap();
      openOrDownloadBlob(
        blob,
        `estado-de-cuenta-inscripcion-${inscripcionId}.pdf`,
      );
    } catch (err: unknown) {
      const data = (err as { data?: { detail?: string; error?: string } })
        ?.data;
      const msg =
        data?.detail ||
        data?.error ||
        "No se pudo descargar el estado de cuenta.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setLoadingConsolidadoId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-5 animate-pulse space-y-3"
          >
            <div className="h-4 w-48 bg-gray-100 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!inscripciones?.length) {
    return (
      <div className="border border-gray-200 rounded-xl py-16 text-center">
        <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500">
          Sin inscripciones registradas
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Usa el botón &quot;Inscribir&quot; para agregar al estudiante a un
          programa
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Modal show={!!pagoModal} onClose={() => setPagoModal(null)}>
        {pagoModal && (
          <AplicarPagoModal
            pago={pagoModal.pago}
            inscripcionId={pagoModal.inscripcionId}
            estudianteId={uuid}
            onClose={() => setPagoModal(null)}
            onPaymentSuccess={(pagoId) =>
              handleDescargarRecibo(pagoModal.inscripcionId, pagoId)
            }
          />
        )}
      </Modal>

      {inscripciones.map((ins) => {
        const total = ins.pagos.reduce(
          (sum, p) => sum + parseFloat(p.monto),
          0,
        );
        const pagado = ins.pagos
          .filter((p) => p.estado === "completado")
          .reduce((sum, p) => sum + parseFloat(p.monto), 0);
        const pendiente = total - pagado;
        const pct =
          total > 0 ? Math.min(100, Math.round((pagado / total) * 100)) : 0;
        const pagosOpen = expandedId === ins.id;
        const comprobantesOpen = comprobantesId === ins.id;

        return (
          <div
            key={ins.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-[#0056D2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {ins.campania_obj?.programa_nombre ?? "—"}
                  </p>
                  <p className="text-xs text-[#0056D2] font-medium mt-0.5">
                    {ins.campania_obj?.nombre ?? "Sin campaña"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Inscrito el {fmtDate(ins.fecha_inscripcion)}
                  </p>
                </div>
              </div>
            </div>

            {/* Montos */}
            <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Total</p>
                <p className="text-sm font-semibold text-gray-900">
                  {fmtMXN(String(total))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Pagado</p>
                <p className="text-sm font-semibold text-emerald-600">
                  {fmtMXN(String(pagado))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Pendiente</p>
                <p className="text-sm font-semibold text-amber-600">
                  {fmtMXN(String(pendiente))}
                </p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Progreso de pago</span>
                <span className="font-medium">{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0056D2] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="px-5 py-3 flex items-center gap-4 border-b border-gray-100 flex-wrap">
              <button
                type="button"
                onClick={() => setExpandedId(pagosOpen ? null : ins.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {pagosOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                {pagosOpen
                  ? "Ocultar pagos"
                  : `Ver pagos (${ins.pagos.length})`}
              </button>
              <span className="text-gray-200">|</span>
              <button
                type="button"
                onClick={() =>
                  setComprobantesId(comprobantesOpen ? null : ins.id)
                }
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {comprobantesOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                {comprobantesOpen ? "Ocultar comprobantes" : "Ver comprobantes"}
              </button>
              {canManagePagos && (
                <>
                  <span className="text-gray-200">|</span>
                  <button
                    type="button"
                    onClick={() => handleDescargarConsolidado(ins.id)}
                    disabled={loadingConsolidadoId === ins.id}
                    title="Descargar estado de cuenta consolidado en PDF"
                    className="flex items-center gap-1.5 text-xs font-medium text-[#0056D2] hover:text-[#00419e] transition-colors disabled:opacity-50"
                  >
                    {loadingConsolidadoId === ins.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    Estado de cuenta
                  </button>
                </>
              )}
            </div>

            {/* Lista de pagos */}
            {pagosOpen && (
              <div className="px-5 py-2">
                {ins.pagos.map((p) => (
                  <PagoRow
                    key={p.id}
                    pago={p}
                    canManagePagos={canManagePagos}
                    onApply={
                      p.estado !== "completado"
                        ? () => setPagoModal({ pago: p, inscripcionId: ins.id })
                        : undefined
                    }
                    onDescargarRecibo={() =>
                      handleDescargarRecibo(ins.id, p.id)
                    }
                    onRegenerarRecibo={() =>
                      handleRegenerarRecibo(ins.id, p.id)
                    }
                    isDownloadingRecibo={downloadingPagoId === p.id}
                    isRegeneratingRecibo={regeneratingPagoId === p.id}
                  />
                ))}
              </div>
            )}

            {/* Comprobantes */}
            {comprobantesOpen && (
              <div className="px-5 pb-4">
                <ComprobantesPanel inscripcionId={ins.id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────

type Tab = "info" | "inscripciones";

export default function EstudianteEditPage({ uuid, initialRef }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(
    initialRef ? "inscripciones" : "info",
  );

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    generos,
    nivelEducativo,
    instituciones,
    estados,
    localidades,
    disabled,
    setDisabled,
    isAdmin,
  } = useAlumnoEditForm(uuid);

  const handleEdit = () => {
    setActiveTab("info");
    setDisabled((prev) => !prev);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "info", label: "Información personal" },
    { key: "inscripciones", label: "Inscripciones" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Profile header card */}
      <ProfileHeader
        uuid={uuid}
        disabled={disabled}
        onEdit={handleEdit}
        onInscribir={() => setOpen(true)}
      />

      <Modal show={open} onClose={() => setOpen(false)}>
        <StepEstudiante estudianteId={uuid} onClose={(v) => setOpen(v)} />
      </Modal>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "inscripciones" ? (
            <InscripcionesTab uuid={uuid} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Editing banner */}
              {!disabled && (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  <PencilIcon className="w-4 h-4 flex-shrink-0" />
                  Modo edición activo — los cambios se guardan al presionar{" "}
                  <strong>Guardar cambios</strong>
                </div>
              )}

              {/* Personal */}
              <div>
                <SectionHeader
                  icon={User}
                  title="Información Personal"
                  description="Datos de identificación del estudiante"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <Field
                    label="Nombre"
                    required
                    error={errors.user?.nombre?.message}
                  >
                    <input
                      disabled={disabled}
                      {...register("user.nombre", {
                        required: "El nombre es requerido",
                      })}
                      className={inputClass}
                    />
                  </Field>
                  <Field
                    label="Apellido Paterno"
                    required
                    error={errors.user?.apellido_paterno?.message}
                  >
                    <input
                      disabled={disabled}
                      {...register("user.apellido_paterno", {
                        required: "El apellido paterno es requerido",
                      })}
                      className={inputClass}
                    />
                  </Field>
                  <Field
                    label="Apellido Materno"
                    required
                    error={errors.user?.apellido_materno?.message}
                  >
                    <input
                      disabled={disabled}
                      {...register("user.apellido_materno", {
                        required: "El apellido materno es requerido",
                      })}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                  <Field
                    label="Género"
                    required
                    error={errors.user?.genero?.message}
                  >
                    <select
                      disabled={disabled}
                      {...register("user.genero", {
                        required: "El género es requerido",
                      })}
                      className={selectClass}
                    >
                      <option value="">Seleccionar</option>
                      {generos?.results.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Fecha de Nacimiento"
                    required
                    error={errors.user?.fecha_nacimiento?.message}
                  >
                    <input
                      disabled={disabled}
                      type="date"
                      {...register("user.fecha_nacimiento", {
                        required: "La fecha de nacimiento es requerida",
                      })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Edad" error={errors.user?.edad?.message}>
                    <div className="relative">
                      <input
                        disabled
                        type="number"
                        {...register("user.edad", {
                          required: "La edad es requerida",
                          min: 1,
                        })}
                        className={inputClass}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        años
                      </span>
                    </div>
                  </Field>
                </div>
              </div>

              {/* Contact */}
              <div>
                <SectionHeader
                  icon={Mail}
                  title="Información de Contacto"
                  description="Medios para comunicarse con el estudiante"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field
                    label="Email"
                    required
                    error={errors.user?.email?.message}
                  >
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        disabled={disabled}
                        type="email"
                        {...register("user.email", {
                          required: "El email es requerido",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email inválido",
                          },
                        })}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>
                  <Field
                    label="Teléfono"
                    required
                    error={errors.user?.telefono?.message}
                  >
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        disabled={disabled}
                        type="tel"
                        {...register("user.telefono", {
                          required: "El teléfono es requerido",
                        })}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Academic */}
              <div>
                <SectionHeader
                  icon={BookOpen}
                  title="Información Académica"
                  description="Datos de ingreso y trayectoria educativa"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field
                    label="Especialidad"
                    required
                    error={errors.especialidad?.message}
                  >
                    <input
                      disabled={disabled}
                      {...register("especialidad", {
                        required: "La especialidad es requerida",
                      })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Fecha de Ingreso">
                    <input
                      disabled={disabled}
                      type="date"
                      {...register("fecha_ingreso")}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Nivel Educativo">
                    <select
                      disabled={disabled}
                      {...register("nivel_educativo")}
                      className={selectClass}
                    >
                      <option value="">Seleccionar</option>
                      {nivelEducativo?.map((niv) => (
                        <option key={niv.id} value={niv.id}>
                          {niv.nombre}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {isAdmin && (
                    <Field label="Institución">
                      <select
                        disabled={disabled}
                        {...register("institucion")}
                        className={selectClass}
                      >
                        <option value="">Seleccionar</option>
                        {instituciones?.map((ins) => (
                          <option key={ins.id} value={ins.id}>
                            {ins.nombre}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <SectionHeader
                  icon={MapPin}
                  title="Ubicación"
                  description="Estado y ciudad de residencia"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Estado">
                    <select
                      disabled={disabled}
                      {...register("estado_pais")}
                      className={selectClass}
                    >
                      <option value="">Seleccionar estado</option>
                      {estados?.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Ciudad">
                    <select
                      disabled={disabled}
                      {...register("ciudad")}
                      className={selectClass}
                    >
                      <option value="">
                        {estados
                          ? "Seleccionar ciudad"
                          : "Selecciona un estado primero"}
                      </option>
                      {localidades?.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Sticky save bar */}
              {!disabled && (
                <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
