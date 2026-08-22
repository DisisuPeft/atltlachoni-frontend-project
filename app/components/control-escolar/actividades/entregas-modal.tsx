"use client";

import { useState } from "react";
import {
  useGetEntregasActividadQuery,
  useCalificarEntregaMutation,
} from "@/redux/features/control-escolar/actividadesApiSlice";
import type {
  Actividad,
  EntregaActividad,
} from "@/redux/features/types/control-escolar/type";
import { Modal } from "@/app/components/common/modal";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import {
  X,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
} from "lucide-react";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CalificarForm({
  entrega,
  calificacionMaxima,
}: {
  entrega: EntregaActividad;
  calificacionMaxima: string;
}) {
  const [calificar, { isLoading }] = useCalificarEntregaMutation();
  const [calificacion, setCalificacion] = useState(
    entrega.calificacion !== null ? String(entrega.calificacion) : "",
  );
  const [retro, setRetro] = useState(entrega.retroalimentacion ?? "");
  const maxNum = Number(calificacionMaxima);

  const handleSubmit = async () => {
    const value = Number(calificacion);
    if (Number.isNaN(value) || value < 0 || value > maxNum) {
      sweetAlert(
        "error",
        `La calificación debe estar entre 0 y ${calificacionMaxima}.`,
        "Error",
      );
      return;
    }
    try {
      await calificar({
        id: entrega.id,
        actividad: entrega.actividad,
        body: { calificacion: value, retroalimentacion: retro || undefined },
      }).unwrap();
      sweetAlert("success", "Calificación guardada.", "Listo");
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "No se pudo guardar la calificación.", "Error");
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={maxNum}
          step="0.1"
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
          placeholder={`0 - ${calificacionMaxima}`}
          className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
        />
        <span className="text-xs text-gray-400">/ {calificacionMaxima}</span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !calificacion}
          className="ml-auto flex items-center gap-1.5 text-xs font-medium text-white bg-[#0056D2] px-3 py-1.5 rounded-lg hover:bg-[#004BB5] disabled:opacity-50 transition-colors"
        >
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {entrega.esta_calificada ? "Actualizar" : "Calificar"}
        </button>
      </div>
      <textarea
        value={retro}
        onChange={(e) => setRetro(e.target.value)}
        placeholder="Retroalimentación (opcional)"
        rows={2}
        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
      />
    </div>
  );
}

function EntregaRow({
  entrega,
  calificacionMaxima,
}: {
  entrega: EntregaActividad;
  calificacionMaxima: string;
}) {
  const [showCalificar, setShowCalificar] = useState(false);
  const fileUrl = entrega.download_url
    ? `${UPLOAD_HOST}${entrega.download_url}`
    : null;

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#0056D2]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {entrega.estudiante_nombre ?? `Estudiante #${entrega.estudiante}`}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0056D2] hover:underline"
              >
                <Download className="w-3 h-3" />
                {entrega.original_name}
              </a>
            ) : (
              <span className="text-xs text-gray-500">{entrega.original_name}</span>
            )}
            <span className="text-xs text-gray-400">
              {formatBytes(entrega.size)}
            </span>
            {entrega.entregado_tarde && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                Tarde
              </span>
            )}
          </div>
          {entrega.comentario && (
            <p className="text-xs text-gray-500 mt-1.5">{entrega.comentario}</p>
          )}
        </div>
        {entrega.esta_calificada && (
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {entrega.calificacion}/{calificacionMaxima}
          </span>
        )}
      </div>

      {entrega.esta_calificada && entrega.retroalimentacion && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mt-2">
          {entrega.retroalimentacion}
        </p>
      )}

      {showCalificar ? (
        <CalificarForm entrega={entrega} calificacionMaxima={calificacionMaxima} />
      ) : (
        <button
          type="button"
          onClick={() => setShowCalificar(true)}
          className="text-xs text-[#0056D2] hover:underline font-medium mt-2"
        >
          {entrega.esta_calificada ? "Editar calificación" : "Calificar"}
        </button>
      )}
    </div>
  );
}

interface Props {
  actividad: Actividad;
  onClose: () => void;
}

export default function EntregasModal({ actividad, onClose }: Props) {
  const { data, isLoading } = useGetEntregasActividadQuery({
    actividad: actividad.id,
  });
  const entregas = data ?? [];

  return (
    <Modal show maxWidth="lg" onClose={onClose}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Entregas — {actividad.nombre}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {entregas.length} entrega{entregas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-10">
            <Loader2 className="w-4 h-4 animate-spin" />
            Cargando entregas…
          </div>
        ) : entregas.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-center py-10">
            <AlertTriangle className="w-6 h-6 text-gray-300" />
            <p className="text-sm text-gray-400">
              Nadie ha entregado esta actividad todavía.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {entregas.map((e) => (
              <EntregaRow
                key={e.id}
                entrega={e}
                calificacionMaxima={actividad.calificacion_maxima}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
