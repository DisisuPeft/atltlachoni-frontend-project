"use client";

import { useState } from "react";
import {
  useMakeInscriptionMutation,
  useSubirComprobanteInscripcionMutation,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { InscripcionBody } from "@/redux/features/types/control-escolar/type";
import {
  DollarSign,
  CalendarDays,
  Tag,
  AlertCircle,
  Loader2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Upload,
  FileCheck2,
  Landmark,
  Hash,
} from "lucide-react";
import Swal from "sweetalert2";

// ── Shared styles ──────────────────────────────────────────────────────

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white";

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </p>
  );
}

// ── Props ──────────────────────────────────────────────────────────────

export interface Props {
  estudianteId?: string;
  campania?: string;
  setClose: (value: boolean) => void;
}

// ── Component ──────────────────────────────────────────────────────────

export default function CourseEnrollment({ estudianteId, campania, setClose }: Props) {
  const [makeInscription, { isLoading: isInscribing }] = useMakeInscriptionMutation();
  const [subirComprobante, { isLoading: isUploading }] = useSubirComprobanteInscripcionMutation();

  const isLoading = isInscribing || isUploading;

  const [form, setForm] = useState<InscripcionBody>({
    monto_inicial: 0,
    fecha_primera_mensualidad: "",
    notas: "",
  });

  const [precioCustom, setPrecioCustom] = useState(false);
  const [customPrices, setCustomPrices] = useState({
    costo_inscripcion: "" as string | number,
    costo_mensualidad: "" as string | number,
    costo_documentacion: "" as string | number,
  });
  const [razon, setRazon] = useState("");

  // Comprobante (opcional)
  const [archivo, setArchivo] = useState<File | null>(null);
  const [comprobanteData, setComprobanteData] = useState({
    monto_visible: "",
    banco_origen: "",
    referencia: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.monto_inicial < 0) errs.monto_inicial = "No puede ser negativo";
    if (!form.fecha_primera_mensualidad) errs.fecha_primera_mensualidad = "Requerida";
    if (precioCustom && !razon.trim()) errs.razon = "Indica el motivo del precio personalizado";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const body: InscripcionBody = {
      monto_inicial: form.monto_inicial,
      fecha_primera_mensualidad: form.fecha_primera_mensualidad,
      notas: form.notas || undefined,
    };

    if (precioCustom) {
      body.tieme_precio_custom = {
        costo_inscripcion: customPrices.costo_inscripcion !== "" ? Number(customPrices.costo_inscripcion) : undefined,
        costo_mensualidad: customPrices.costo_mensualidad !== "" ? Number(customPrices.costo_mensualidad) : undefined,
        costo_documentacion: customPrices.costo_documentacion !== "" ? Number(customPrices.costo_documentacion) : undefined,
      };
      body.razon_precio_custom = razon;
    }

    try {
      const res = await makeInscription({ campania, estudianteId, formData: body }).unwrap();

      // Si hay comprobante, subirlo con el id de la inscripción recién creada
      if (archivo && res.id) {
        const fd = new FormData();
        fd.append("archivo", archivo);
        if (comprobanteData.monto_visible) fd.append("monto_visible", comprobanteData.monto_visible);
        if (comprobanteData.banco_origen) fd.append("banco_origen", comprobanteData.banco_origen);
        if (comprobanteData.referencia) fd.append("referencia", comprobanteData.referencia);

        try {
          await subirComprobante({ inscripcionId: res.id, formData: fd }).unwrap();
        } catch {
          // Inscripción exitosa pero comprobante falló — notificar sin bloquear
          await Swal.fire({
            icon: "warning",
            title: "Inscripción creada",
            text: `${res.message}. Sin embargo, no se pudo subir el comprobante — puedes intentarlo desde el perfil del alumno.`,
            timer: 4000,
            showConfirmButton: false,
          });
          setClose(false);
          return;
        }
      }

      setClose(false);
      await Swal.fire({
        icon: "success",
        title: "Inscripción exitosa",
        text: res.message ?? "El alumno fue inscrito correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const msg = (err as { data?: { detail?: string } })?.data?.detail ?? "No se pudo completar la inscripción.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Modal header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-4.5 h-4.5 text-[#0056D2]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Nueva inscripción</h3>
          <p className="text-xs text-gray-400">
            El sistema genera los pagos automáticamente al confirmar
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Monto inicial + fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel label="Pago inicial" />
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                className={`${inputClass} pl-9`}
                value={form.monto_inicial === 0 ? "" : form.monto_inicial}
                onChange={(e) => setForm((f) => ({ ...f, monto_inicial: Number(e.target.value) }))}
                placeholder="0.00 — puede ser $0"
              />
            </div>
            <p className="text-xs text-gray-400">Flexible — no requiere mínimo</p>
            <FieldError msg={errors.monto_inicial} />
          </div>

          <div className="space-y-1.5">
            <FieldLabel label="Primera mensualidad" required />
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                className={`${inputClass} pl-9`}
                value={form.fecha_primera_mensualidad}
                onChange={(e) => setForm((f) => ({ ...f, fecha_primera_mensualidad: e.target.value }))}
              />
            </div>
            <FieldError msg={errors.fecha_primera_mensualidad} />
          </div>
        </div>

        {/* Precio personalizado toggle */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setPrecioCustom((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Precio personalizado / descuento
              </span>
              {precioCustom && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0F6FF] text-[#0056D2] font-medium">
                  Activo
                </span>
              )}
            </div>
            {precioCustom
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>

          {precioCustom && (
            <div className="p-4 space-y-4 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-400">
                Si se omite un campo, el sistema usa el precio del programa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(["costo_inscripcion", "costo_mensualidad", "costo_documentacion"] as const).map((key) => {
                  const labels: Record<string, string> = {
                    costo_inscripcion: "Inscripción",
                    costo_mensualidad: "Mensualidad",
                    costo_documentacion: "Documentación",
                  };
                  return (
                    <div key={key} className="space-y-1.5">
                      <FieldLabel label={labels[key]} />
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`${inputClass} pl-9`}
                          value={customPrices[key]}
                          onChange={(e) =>
                            setCustomPrices((p) => ({ ...p, [key]: e.target.value }))
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <FieldLabel label="Motivo del precio personalizado" required />
                <input
                  className={inputClass}
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                  placeholder="Ej. Beca excelencia, Promoción verano, Acuerdo especial..."
                />
                <FieldError msg={errors.razon} />
              </div>
            </div>
          )}
        </div>

        {/* Comprobante de pago (opcional) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50">
            <FileCheck2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 flex-1">
              Comprobante de pago
            </span>
            <span className="text-xs text-gray-400">Opcional</span>
          </div>

          <div className="p-4 space-y-3 border-t border-gray-200 bg-white">
            {/* File picker */}
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#0056D2]/50 hover:bg-[#F0F6FF]/30 transition-colors">
              {archivo ? (
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-gray-700 font-medium">{archivo.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-300" />
                  <span className="text-xs text-gray-400">PDF, imagen u otro comprobante</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              />
            </label>

            {/* Metadata opcional */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Monto visible
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputClass}
                  placeholder="0.00"
                  value={comprobanteData.monto_visible}
                  onChange={(e) => setComprobanteData((c) => ({ ...c, monto_visible: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> Banco emisor
                </label>
                <input
                  className={inputClass}
                  placeholder="BBVA, HSBC..."
                  value={comprobanteData.banco_origen}
                  onChange={(e) => setComprobanteData((c) => ({ ...c, banco_origen: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Referencia / folio
                </label>
                <input
                  className={inputClass}
                  placeholder="TXN-123456"
                  value={comprobanteData.referencia}
                  onChange={(e) => setComprobanteData((c) => ({ ...c, referencia: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="space-y-1.5">
          <FieldLabel label="Notas (opcional)" />
          <textarea
            rows={2}
            className={inputClass}
            value={form.notas}
            onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
            placeholder="Observaciones sobre el pago inicial, acuerdos, etc."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setClose(false)}
          className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <GraduationCap className="w-4 h-4" />
          }
          {isInscribing
            ? "Inscribiendo..."
            : isUploading
            ? "Subiendo comprobante..."
            : "Confirmar inscripción"
          }
        </button>
      </div>
    </form>
  );
}