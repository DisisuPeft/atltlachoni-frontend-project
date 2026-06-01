"use client";

import { useState, useRef, useCallback } from "react";
import {
  useGetPonenciasQuery,
  useDeletePonenciaMutation,
} from "@/redux/features/control-escolar/ponenciasApiSlice";
import { usePonenciaUpload } from "@/hooks";
import { Ponencia } from "@/redux/features/types/control-escolar/type";
import {
  Upload,
  Trash2,
  Film,
  FileText,
  ImageIcon,
  Music,
  File,
  Download,
  Loader2,
  Check,
  AlertCircle,
  PlayCircle,
  ChevronDown,
  X,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;
const API_HOST = process.env.NEXT_PUBLIC_HOST;
const MAX_MB = 1000;

// ── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function isPdf(p: Ponencia) {
  return p.file_type === "pdf" || p.file_extension === "pdf" || p.mime_type === "application/pdf";
}

function typeIcon(p: Ponencia, cls = "w-5 h-5 shrink-0") {
  if (p.file_type === "video") return <Film className={`${cls} text-blue-500`} />;
  if (isPdf(p)) return <FileText className={`${cls} text-red-500`} />;
  if (p.file_type === "image") return <ImageIcon className={`${cls} text-green-500`} />;
  if (p.file_type === "audio") return <Music className={`${cls} text-purple-500`} />;
  return <File className={`${cls} text-gray-400`} />;
}

function tipoBadge(tipo: string) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
      {tipo}
    </span>
  );
}

// ── Inline viewer ──────────────────────────────────────────────────────────

function PonenciaViewer({ ponencia, onClose }: { ponencia: Ponencia; onClose: () => void }) {
  const streamUrl = `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponencia.id}/stream/`;
  const hlsUrl = `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponencia.id}/hls/`;
  const previewUrl = ponencia.preview_url ? `${API_HOST}${ponencia.preview_url}` : null;
  const downloadUrl = ponencia.download_url
    ? `${API_HOST}${ponencia.download_url}`
    : `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponencia.id}/download/`;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          {typeIcon(ponencia)}
          <span className="text-sm font-semibold text-gray-800 truncate">{ponencia.titulo}</span>
          {tipoBadge(ponencia.tipo)}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Descargar
          </a>
          <button type="button" onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {ponencia.file_type === "video" && (
        ponencia.hls_status === "ready" ? (
          <video
            controls
            autoPlay
            className="w-full bg-black"
            style={{ maxHeight: "60vh" }}
            src={hlsUrl}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400 bg-gray-950">
            <Loader2 className="w-7 h-7 animate-spin" />
            <p className="text-sm">
              {ponencia.hls_status === "processing" ? "Procesando video…" : "Video en cola…"}
            </p>
          </div>
        )
      )}

      {isPdf(ponencia) && previewUrl && (
        <iframe src={previewUrl} className="w-full" style={{ height: "65vh" }} title={ponencia.titulo} />
      )}

      {isPdf(ponencia) && !previewUrl && (
        <div className="flex flex-col items-center gap-3 py-10">
          <FileText className="w-10 h-10 text-gray-300" />
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5]">
            <Download className="w-4 h-4" /> Descargar PDF
          </a>
        </div>
      )}

      {ponencia.file_type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={streamUrl} alt={ponencia.titulo} className="w-full object-contain max-h-[65vh] bg-gray-100" />
      )}

      {ponencia.file_type === "audio" && (
        <div className="flex flex-col items-center gap-4 p-8 bg-gray-50">
          <Music className="w-10 h-10 text-purple-400" />
          <audio controls src={streamUrl} className="w-full max-w-lg" />
        </div>
      )}
    </div>
  );
}

// ── Upload form ────────────────────────────────────────────────────────────

const TIPOS_ACEPTADOS = ["video/*", "application/pdf", "image/*", "audio/*"].join(",");

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const { upload, isUploading, progress, isSuccess, error, reset } = usePonenciaUpload();
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_MB * 1024 * 1024) {
      setLocalError(`El archivo supera el límite de ${MAX_MB}MB`);
      return;
    }
    setLocalError(null);
    reset();
    setFile(f);
    if (!titulo) setTitulo(f.name.replace(/\.[^.]+$/, ""));
  }, [reset, titulo]);

  const handleSubmit = async () => {
    if (!file || !titulo.trim() || !tipo.trim()) {
      setLocalError("Completa título y tipo antes de subir");
      return;
    }
    setLocalError(null);
    await upload(file, { titulo, tipo });
    setFile(null);
    setTitulo("");
    setTipo("");
    onSuccess();
    setTimeout(reset, 2500);
  };

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <Check className="w-4 h-4 shrink-0" />
        Ponencia subida correctamente
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Introducción a la nutrición"
            className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Ej. webinar, conferencia, taller…"
            className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2]"
          />
        </div>
      </div>

      {!file ? (
        <div
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"}`}
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <p className="text-sm text-gray-500">
            Arrastra aquí o <span className="text-blue-600 font-medium">selecciona</span>
          </p>
          <p className="text-xs text-gray-400">Video, PDF, imagen, audio · Máx. {MAX_MB}MB</p>
          <input ref={inputRef} type="file" accept={TIPOS_ACEPTADOS} className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800 truncate max-w-[60%]">{file.name}</span>
            <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
          </div>
          {isUploading && (
            <div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-blue-600 mt-1">{progress}%</p>
            </div>
          )}
          {!isUploading && (
            <div className="flex gap-2">
              <button type="button" onClick={handleSubmit}
                className="flex-1 bg-[#0056D2] text-white text-sm font-medium py-2 rounded-lg hover:bg-[#004BB5] transition-colors">
                Subir ponencia
              </button>
              <button type="button" onClick={() => { setFile(null); reset(); }}
                className="px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      {(localError ?? error) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {localError ?? error}
        </div>
      )}
    </div>
  );
}

// ── Ponencia card ──────────────────────────────────────────────────────────

function PonenciaRow({
  ponencia,
  isSelected,
  onSelect,
  onDelete,
}: {
  ponencia: Ponencia;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-colors group ${isSelected ? "bg-blue-50 border-l-2 border-[#0056D2]" : "hover:bg-gray-50"}`}>
      <button type="button" onClick={onSelect} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        {typeIcon(ponencia)}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isSelected ? "text-[#0056D2]" : "text-gray-800"}`}>
            {ponencia.titulo}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{ponencia.original_name} · {ponencia.size_formatted}</p>
        </div>
        {tipoBadge(ponencia.tipo)}
        <PlayCircle className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#0056D2]" : "text-gray-300 group-hover:text-gray-400"}`} />
      </button>

      {confirming ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-red-600">¿Eliminar?</span>
          <button type="button" onClick={() => onDelete(ponencia.id)}
            className="text-xs px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700">Sí</button>
          <button type="button" onClick={() => setConfirming(false)}
            className="text-xs px-2 py-0.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">No</button>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)}
          className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────

export default function PonenciasAdminView() {
  const dispatch = useAppDispatch();
  const [filterTipo, setFilterTipo] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState<Ponencia | null>(null);

  const { data, isLoading, refetch } = useGetPonenciasQuery(
    filterTipo ? { tipo: filterTipo } : undefined,
  );
  const [deletePonencia] = useDeletePonenciaMutation();

  const ponencias = data?.results ?? [];

  const tipos = Array.from(new Set(ponencias.map((p) => p.tipo))).sort();

  const handleDelete = async (id: number) => {
    try {
      await deletePonencia(id).unwrap();
      if (selected?.id === id) setSelected(null);
      refetch();
      dispatch(setAlert({ type: "success", message: "Ponencia eliminada" }));
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al eliminar la ponencia" }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ponencias</h1>
          <p className="text-sm text-gray-500 mt-0.5">Material independiente de programas</p>
        </div>
        <button
          type="button"
          onClick={() => setShowUpload((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-semibold rounded-lg hover:bg-[#004BB5] transition-colors"
        >
          <Upload className="w-4 h-4" />
          {showUpload ? "Cancelar" : "Nueva ponencia"}
        </button>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <p className="text-sm font-semibold text-gray-700 mb-4">Subir nueva ponencia</p>
          <UploadForm onSuccess={() => { setShowUpload(false); refetch(); }} />
        </div>
      )}

      {/* Viewer */}
      {selected && (
        <PonenciaViewer ponencia={selected} onClose={() => setSelected(null)} />
      )}

      {/* Filter + list */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        {/* Filter bar */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterTipo("")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              filterTipo === "" ? "bg-[#0056D2] text-white border-[#0056D2]" : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
            }`}
          >
            Todos
          </button>
          {tipos.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterTipo(t === filterTipo ? "" : t)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors capitalize ${
                filterTipo === t ? "bg-[#0056D2] text-white border-[#0056D2]" : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {t}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">
            {ponencias.length} ponencia{ponencias.length !== 1 ? "s" : ""}
          </span>
          {filterTipo && (
            <button type="button" onClick={() => setFilterTipo("")}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <ChevronDown className="w-3 h-3 rotate-90" /> Limpiar
            </button>
          )}
        </div>

        {/* List */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando ponencias…</span>
          </div>
        )}

        {!isLoading && ponencias.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
            <Film className="w-10 h-10" />
            <p className="text-sm">No hay ponencias registradas</p>
          </div>
        )}

        {!isLoading && (
          <div className="divide-y divide-gray-100">
            {ponencias.map((p) => (
              <PonenciaRow
                key={p.id}
                ponencia={p}
                isSelected={selected?.id === p.id}
                onSelect={() => setSelected(selected?.id === p.id ? null : p)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}