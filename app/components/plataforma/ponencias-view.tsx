"use client";

import { useState, useMemo } from "react";
import { useGetPonenciasQuery } from "@/redux/features/control-escolar/ponenciasApiSlice";
import { Ponencia } from "@/redux/features/types/control-escolar/type";
import {
  Film,
  FileText,
  ImageIcon,
  Music,
  File,
  Download,
  Loader2,
  PlayCircle,
  X,
} from "lucide-react";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;
const API_HOST = process.env.NEXT_PUBLIC_HOST;

// ── Helpers ────────────────────────────────────────────────────────────────

function isPdf(p: Ponencia) {
  return (
    p.file_type === "pdf" ||
    p.file_extension === "pdf" ||
    p.mime_type === "application/pdf"
  );
}

function typeIcon(p: Ponencia, cls = "w-5 h-5 shrink-0") {
  if (p.file_type === "video")
    return <Film className={`${cls} text-blue-500`} />;
  if (isPdf(p)) return <FileText className={`${cls} text-red-500`} />;
  if (p.file_type === "image")
    return <ImageIcon className={`${cls} text-green-500`} />;
  if (p.file_type === "audio")
    return <Music className={`${cls} text-purple-500`} />;
  return <File className={`${cls} text-gray-400`} />;
}

// ── Viewer ─────────────────────────────────────────────────────────────────

function PonenciaViewer({
  ponencia,
  onClose,
}: {
  ponencia: Ponencia;
  onClose: () => void;
}) {
  const hlsUrl = `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponencia.id}/hls/`;
  const streamUrl = `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponencia.id}/stream/`;
  const previewUrl = ponencia.preview_url
    ? `${API_HOST}${ponencia.preview_url}`
    : null;
  const downloadUrl = ponencia.download_url
    ? `${API_HOST}${ponencia.download_url}`
    : `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponencia.id}/download/`;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          {typeIcon(ponencia)}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {ponencia.titulo}
            </p>
            <p className="text-xs text-gray-400 capitalize">{ponencia.tipo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Descargar
          </a> */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {ponencia.file_type === "video" &&
        (ponencia.hls_status === "ready" ? (
          <video
            controls
            autoPlay
            className="w-full bg-black"
            style={{ maxHeight: "65vh" }}
            src={hlsUrl}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 bg-gray-950 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">
              {ponencia.hls_status === "processing"
                ? "Preparando video…"
                : "En cola…"}
            </p>
          </div>
        ))}

      {isPdf(ponencia) && previewUrl && (
        <iframe
          src={previewUrl}
          className="w-full"
          style={{ height: "70vh" }}
          title={ponencia.titulo}
        />
      )}

      {isPdf(ponencia) && !previewUrl && (
        <div className="flex flex-col items-center gap-4 py-12">
          <FileText className="w-10 h-10 text-gray-300" />
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5]"
          >
            <Download className="w-4 h-4" /> Descargar PDF
          </a>
        </div>
      )}

      {ponencia.file_type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={streamUrl}
          alt={ponencia.titulo}
          className="w-full object-contain max-h-[70vh] bg-gray-100"
        />
      )}

      {ponencia.file_type === "audio" && (
        <div className="flex flex-col items-center gap-4 p-8 bg-gray-50">
          <Music className="w-10 h-10 text-purple-400" />
          <p className="text-sm font-medium text-gray-700">{ponencia.titulo}</p>
          <audio controls src={streamUrl} className="w-full max-w-lg" />
        </div>
      )}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

function PonenciaCard({
  ponencia,
  isSelected,
  onSelect,
}: {
  ponencia: Ponencia;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isSelected
          ? "border-[#0056D2] bg-blue-50"
          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}
      >
        {typeIcon(ponencia, "w-4 h-4 shrink-0")}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${isSelected ? "text-[#0056D2]" : "text-gray-800"}`}
        >
          {ponencia.titulo}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">
          {ponencia.tipo} · {ponencia.size_formatted}
        </p>
      </div>
      <PlayCircle
        className={`w-5 h-5 shrink-0 ${isSelected ? "text-[#0056D2]" : "text-gray-300"}`}
      />
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function PonenciasView() {
  const [filterTipo, setFilterTipo] = useState("");
  const [selected, setSelected] = useState<Ponencia | null>(null);

  const { data, isLoading } = useGetPonenciasQuery(
    filterTipo ? { tipo: filterTipo } : undefined,
  );

  const ponencias = useMemo(() => data?.results ?? [], [data?.results]);

  const tipos = useMemo(
    () => Array.from(new Set(ponencias.map((p) => p.tipo))).sort(),
    [ponencias],
  );

  const handleSelect = (p: Ponencia) => {
    const isDeselect = selected?.id === p.id;
    setSelected(isDeselect ? null : p);
    if (!isDeselect) {
      document.getElementById("plataforma-main")?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <div>
        <p className="text-xs font-semibold text-[#0056D2] uppercase tracking-wide">
          Plataforma
        </p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">Ponencias</h1>
        <p className="text-sm text-gray-500 mt-1">
          Conferencias, webinars y material de apoyo
        </p>
      </div>

      {/* Viewer */}
      {selected && (
        <PonenciaViewer ponencia={selected} onClose={() => setSelected(null)} />
      )}

      {/* Tipo filters */}
      {tipos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterTipo("")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              filterTipo === ""
                ? "bg-[#0056D2] text-white border-[#0056D2]"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
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
                filterTipo === t
                  ? "bg-[#0056D2] text-white border-[#0056D2]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando ponencias…</span>
        </div>
      )}

      {!isLoading && ponencias.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <PlayCircle className="w-10 h-10" />
          <p className="text-sm">No hay ponencias disponibles</p>
        </div>
      )}

      {!isLoading && ponencias.length > 0 && (
        <div className="space-y-2">
          {ponencias.map((p) => (
            <PonenciaCard
              key={p.id}
              ponencia={p}
              isSelected={selected?.id === p.id}
              onSelect={() => handleSelect(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
