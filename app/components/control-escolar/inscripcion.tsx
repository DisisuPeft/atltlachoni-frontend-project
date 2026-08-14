"use client";

import { useState } from "react";
import { useMakeInscriptionMutation } from "@/redux/features/control-escolar/alumnosApiSlice";
import { InscripcionBody } from "@/redux/features/types/control-escolar/type";
import {
  DollarSign,
  CalendarDays,
  // Tag,
  AlertCircle,
  Loader2,
  GraduationCap,
  Hash,
} from "lucide-react";
import Swal from "sweetalert2";

// ── Shared styles ──────────────────────────────────────────────────────

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white";

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
  onBack?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────

export default function CourseEnrollment({
  estudianteId,
  campania,
  setClose,
  onBack,
}: Props) {
  const [makeInscription, { isLoading }] = useMakeInscriptionMutation();

  const [form, setForm] = useState({
    monto_inicial: "" as string | number,
    fecha_pago_inicial: "",
    fecha_primera_mensualidad: "",
    numero_parcialidades: "" as string | number,
    notas: "",
  });

  const [precios, setPrecios] = useState({
    costo_inscripcion: "" as string | number,
    costo_mensualidad: "" as string | number,
    costo_documentacion: "" as string | number,
    notas_precio_custom: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.monto_inicial !== "" && Number(form.monto_inicial) < 0)
      errs.monto_inicial = "No puede ser negativo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const body: InscripcionBody = {};

    if (form.monto_inicial !== "")
      body.monto_inicial = Number(form.monto_inicial);
    if (form.fecha_pago_inicial)
      body.fecha_pago_inicial = form.fecha_pago_inicial;
    if (form.fecha_primera_mensualidad)
      body.fecha_primera_mensualidad = form.fecha_primera_mensualidad;
    if (form.numero_parcialidades !== "")
      body.numero_parcialidades = parseInt(
        String(form.numero_parcialidades),
        10,
      );
    if (form.notas.trim()) body.notas = form.notas.trim();
    if (precios.costo_inscripcion !== "")
      body.costo_inscripcion = Number(precios.costo_inscripcion);
    if (precios.costo_mensualidad !== "")
      body.costo_mensualidad = Number(precios.costo_mensualidad);
    if (precios.costo_documentacion !== "")
      body.costo_documentacion = Number(precios.costo_documentacion);
    if (precios.notas_precio_custom.trim())
      body.notas_precio_custom = precios.notas_precio_custom.trim();

    try {
      const res = await makeInscription({
        campania,
        estudianteId,
        formData: body,
      }).unwrap();

      if (onBack) {
        onBack();
      } else {
        setClose(false);
      }
      await Swal.fire({
        icon: "success",
        title: "Inscripción exitosa",
        text: res.message ?? "El alumno fue inscrito correctamente.",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const msg =
        (err as { data?: { detail?: string } })?.data?.detail ??
        "No se pudo completar la inscripción.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Modal header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
            title="Cambiar campaña"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-4.5 h-4.5 text-[#0056D2]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Nueva inscripción
          </h3>
          <p className="text-xs text-gray-400">
            El sistema genera los pagos automáticamente al confirmar
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Pago inicial + fecha del pago */}
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
                value={form.monto_inicial}
                onChange={(e) =>
                  setForm((f) => ({ ...f, monto_inicial: e.target.value }))
                }
                placeholder="0.00 — puede ser $0"
              />
            </div>
            <p className="text-xs text-gray-400">
              Flexible — no requiere mínimo
            </p>
            <FieldError msg={errors.monto_inicial} />
          </div>

          <div className="space-y-1.5">
            <FieldLabel label="Fecha del pago inicial" />
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                className={`${inputClass} pl-9`}
                value={form.fecha_pago_inicial}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fecha_pago_inicial: e.target.value }))
                }
              />
            </div>
            <p className="text-xs text-gray-400">
              Si no se indica, se usa la fecha de hoy
            </p>
          </div>
        </div>

        {/* Primera mensualidad + parcialidades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel label="Primera mensualidad" />
            <div className="relative">
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
            <p className="text-xs text-gray-400">
              Si no se indica, usa el día 1 del mes siguiente
            </p>
            <FieldError msg={errors.fecha_primera_mensualidad} />
          </div>

          <div className="space-y-1.5">
            <FieldLabel label="Número de parcialidades" />
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                min="1"
                step="1"
                className={`${inputClass} pl-9`}
                value={form.numero_parcialidades}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    numero_parcialidades: e.target.value,
                  }))
                }
                placeholder="Ej. 10"
              />
            </div>
            <p className="text-xs text-gray-400">
              Si no se indica, usa la duración del programa
            </p>
          </div>
        </div>

        {/* Precios acordados por concepto */}
        <div className="space-y-1.5">
          <FieldLabel label="Precios acordados (opcional, por concepto)" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                className={`${inputClass} pl-9`}
                value={precios.costo_inscripcion}
                onChange={(e) =>
                  setPrecios((p) => ({ ...p, costo_inscripcion: e.target.value }))
                }
                placeholder="Costo inscripción"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                className={`${inputClass} pl-9`}
                value={precios.costo_mensualidad}
                onChange={(e) =>
                  setPrecios((p) => ({ ...p, costo_mensualidad: e.target.value }))
                }
                placeholder="Costo mensualidad"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                className={`${inputClass} pl-9`}
                value={precios.costo_documentacion}
                onChange={(e) =>
                  setPrecios((p) => ({ ...p, costo_documentacion: e.target.value }))
                }
                placeholder="Costo documentación"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Un concepto en $0 es válido (ej. beca). Si se deja vacío, usa el precio del programa.
          </p>
        </div>

        {/* Notas del precio personalizado */}
        <div className="space-y-1.5">
          <FieldLabel label="Notas del precio (opcional)" />
          <input
            type="text"
            className={inputClass}
            value={precios.notas_precio_custom}
            onChange={(e) =>
              setPrecios((p) => ({ ...p, notas_precio_custom: e.target.value }))
            }
            placeholder='Ej. "Beca del 47%"'
          />
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
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GraduationCap className="w-4 h-4" />
          )}
          {isLoading ? "Inscribiendo..." : "Confirmar inscripción"}
        </button>
      </div>
    </form>
  );
}
