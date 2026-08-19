"use client";

import { useCallback, useRef, useState } from "react";
import {
  useGetActividadesQuery,
  useGetEntregasActividadQuery,
  useSubirEntregaActividadMutation,
} from "@/redux/features/control-escolar/actividadesApiSlice";
import type { Actividad } from "@/redux/features/types/control-escolar/type";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import {
  ClipboardList,
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;
const MAX_MB = 200;
const TIPOS_ACEPTADOS = [
  "video/*",
  "application/pdf",
  "image/*",
  "audio/*",
  ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar",
].join(",");

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EntregaForm({
  actividad,
  reemplazar,
}: {
  actividad: Actividad;
  reemplazar: boolean;
}) {
  const [subirEntrega, { isLoading }] = useSubirEntregaActividadMutation();
  const [file, setFile] = useState<File | null>(null);
  const [comentario, setComentario] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_MB * 1024 * 1024) {
      setLocalError(`El archivo supera el límite de ${MAX_MB}MB`);
      return;
    }
    setLocalError(null);
    setFile(f);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("actividad", String(actividad.id));
    formData.append("file", file);
    if (comentario) formData.append("comentario", comentario);

    try {
      await subirEntrega(formData).unwrap();
      sweetAlert("success", "Entrega enviada correctamente.", "Listo");
      setFile(null);
      setComentario("");
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "No se pudo enviar la entrega.", "Error");
    }
  };

  return (
    <div className="space-y-3">
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors text-center ${
            dragOver
              ? "border-[#0056D2] bg-blue-50"
              : "border-gray-200 hover:border-[#0056D2] hover:bg-blue-50"
          }`}
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <p className="text-xs text-gray-500">
            Arrastra aquí o{" "}
            <span className="text-[#0056D2] font-medium">selecciona</span> ·
            Máx. {MAX_MB}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={TIPOS_ACEPTADOS}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800 truncate max-w-[60%]">
              {file.name}
            </span>
            <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
          </div>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comentario (opcional)"
            rows={2}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#0056D2] text-white text-xs font-medium py-1.5 rounded-lg hover:bg-[#004BB5] disabled:opacity-50 transition-colors"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {reemplazar ? "Reemplazar entrega" : "Entregar tarea"}
            </button>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={isLoading}
              className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {localError && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {localError}
        </div>
      )}
    </div>
  );
}

function ActividadCard({ actividad }: { actividad: Actividad }) {
  const { data, isLoading } = useGetEntregasActividadQuery({
    actividad: actividad.id,
  });
  const entrega = data?.results?.[0];

  const vencida =
    !!actividad.fecha_limite && new Date(actividad.fecha_limite) < new Date();

  const fileUrl = entrega?.download_url
    ? `${UPLOAD_HOST}${entrega.download_url}`
    : null;

  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#F0F6FF] flex items-center justify-center shrink-0">
          <ClipboardList className="w-4 h-4 text-[#0056D2]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{actividad.nombre}</p>
          {actividad.descripcion && (
            <p className="text-sm text-gray-500 mt-0.5">{actividad.descripcion}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {actividad.fecha_limite && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  vencida
                    ? actividad.permite_entrega_tardia
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Clock className="w-3 h-3" />
                {vencida ? "Venció el" : "Entrega antes del"}{" "}
                {formatFecha(actividad.fecha_limite)}
              </span>
            )}
            <span className="text-[10px] text-gray-400">
              Calificación máxima: {actividad.calificacion_maxima}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Cargando tu entrega…
        </div>
      ) : entrega ? (
        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400 shrink-0" />
              {fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-[#0056D2] hover:underline truncate"
                >
                  {entrega.original_name}
                </a>
              ) : (
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {entrega.original_name}
                </span>
              )}
              {entrega.entregado_tarde && (
                <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                  Tardía
                </span>
              )}
            </div>
            {entrega.comentario && (
              <p className="text-xs text-gray-500 mt-2">{entrega.comentario}</p>
            )}
          </div>

          {entrega.esta_calificada ? (
            <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Calificación: {entrega.calificacion}/{actividad.calificacion_maxima}
                </p>
                {entrega.retroalimentacion && (
                  <p className="text-xs text-emerald-700 mt-1">
                    {entrega.retroalimentacion}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <EntregaForm actividad={actividad} reemplazar />
          )}
        </div>
      ) : (
        <EntregaForm actividad={actividad} reemplazar={false} />
      )}
    </div>
  );
}

interface Props {
  programaId: string;
}

export default function ActividadesAlumnoView({ programaId }: Props) {
  const { data, isLoading } = useGetActividadesQuery({ programa: programaId });
  const actividades = data?.results ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-12">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando actividades…
        </div>
      ) : actividades.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No hay actividades disponibles todavía.</p>
        </div>
      ) : (
        actividades.map((a) => <ActividadCard key={a.id} actividad={a} />)
      )}
    </div>
  );
}
