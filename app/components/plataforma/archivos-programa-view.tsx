"use client";

import { useMemo, useState } from "react";
import { useGetMaterialesProgramaQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { Material, ModuloConMateriales } from "@/redux/features/types/control-escolar/type";
import { VideoPlayer } from "@/app/components/plataforma/video-player";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Download,
  File,
  FileText,
  Film,
  Folder,
  ImageIcon,
  Loader2,
  Music,
  Play,
} from "lucide-react";

interface Props {
  programaId: string;
}

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;
const API_HOST = process.env.NEXT_PUBLIC_HOST;

function groupKey(g: ModuloConMateriales) {
  return g.modulo_id === null ? "null" : String(g.modulo_id);
}

// ── Icons ─────────────────────────────────────────────────────────────────

function materialIcon(fileType: string, className = "w-5 h-5") {
  switch (fileType) {
    case "video":    return <Film className={`${className} text-blue-500`} />;
    case "document": return <FileText className={`${className} text-red-500`} />;
    case "image":    return <ImageIcon className={`${className} text-green-500`} />;
    case "audio":    return <Music className={`${className} text-purple-500`} />;
    default:         return <File className={`${className} text-gray-400`} />;
  }
}

// ── Video status placeholder ───────────────────────────────────────────────

function VideoStatusPlaceholder({
  status,
  materialId,
  programaId,
}: {
  status: string | null;
  materialId: number;
  programaId: string;
}) {
  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 bg-gray-950 rounded-b-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">Error al procesar el video</span>
        </div>
        <a
          href={`${UPLOAD_HOST}/api/control-escolar/materiales/${materialId}/stream/?programa=${programaId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-xs hover:bg-gray-700 transition-colors"
        >
          <Play className="w-3 h-3" />
          Ver video de respaldo
        </a>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 py-8 bg-gray-950 rounded-b-lg">
      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      <span className="text-sm text-gray-400">
        {status === "processing" ? "Preparando video…" : "En cola…"}
      </span>
    </div>
  );
}

// ── Material row ──────────────────────────────────────────────────────────

function MaterialRow({ material, programaId }: { material: Material; programaId: string }) {
  const [expanded, setExpanded] = useState(false);

  const downloadHref = material.download_url
    ? `${API_HOST}${material.download_url}?programa=${programaId}`
    : `${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/stream/?programa=${programaId}`;

  const previewHref = material.preview_url
    ? `${API_HOST}${material.preview_url}?programa=${programaId}`
    : null;

  if (material.file_type === "video") {
    const hlsReady = material.hls_status === "ready";
    return (
      <div className="border-b last:border-b-0 border-gray-100">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            {materialIcon(material.file_type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 truncate">{material.original_name}</p>
            {material.description && (
              <p className="text-xs text-gray-400 truncate">{material.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400">{material.size_formatted}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0F6FF] text-[#0056D2] text-xs font-medium">
              <Play className="w-3 h-3" />
              Ver
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </button>
        {expanded && (
          <div className="bg-black rounded-b-lg overflow-hidden">
            {hlsReady ? (
              <VideoPlayer materialId={material.id} programaId={programaId} />
            ) : (
              <VideoStatusPlaceholder status={material.hls_status} materialId={material.id} programaId={programaId} />
            )}
          </div>
        )}
      </div>
    );
  }

  if (material.file_type === "document" && previewHref) {
    return (
      <a
        href={previewHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
      >
        <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
          {materialIcon(material.file_type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 truncate">{material.original_name}</p>
          {material.description && (
            <p className="text-xs text-gray-400 truncate">{material.description}</p>
          )}
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{material.size_formatted}</span>
      </a>
    );
  }

  return (
    <a
      href={downloadHref}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
    >
      <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
        {materialIcon(material.file_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 truncate">{material.original_name}</p>
        {material.description && (
          <p className="text-xs text-gray-400 truncate">{material.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-gray-400">{material.size_formatted}</span>
        <Download className="w-4 h-4 text-gray-400" />
      </div>
    </a>
  );
}

// ── Módulo accordion ──────────────────────────────────────────────────────

function ModuloAccordion({
  group,
  isOpen,
  onToggle,
  programaId,
}: {
  group: ModuloConMateriales;
  isOpen: boolean;
  onToggle: () => void;
  programaId: string;
}) {
  const nombre = group.modulo_nombre ?? "General";
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-gray-400 shrink-0">
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
        <Folder className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="text-sm font-semibold text-gray-800 flex-1">{nombre}</span>
        <span className="text-xs text-gray-400 shrink-0">
          {group.materiales.length} archivo
          {group.materiales.length !== 1 ? "s" : ""}
        </span>
      </button>

      {isOpen && (
        <div className="divide-y divide-gray-100">
          {group.materiales.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">Sin archivos.</p>
          ) : (
            group.materiales.map((material) => (
              <MaterialRow key={material.id} material={material} programaId={programaId} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────

export default function ArchivosProgramaView({ programaId }: Props) {
  const { data, isLoading } = useGetMaterialesProgramaQuery(programaId);

  const grupos = useMemo(() => data ?? [], [data]);

  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const allExpanded = grupos.length > 0 && openSet.size === grupos.length;

  const toggleAll = () => {
    setOpenSet(allExpanded ? new Set() : new Set(grupos.map(groupKey)));
  };

  const toggleGroup = (key: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Archivos del programa</h1>
        {grupos.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs text-[#0056D2] hover:underline font-medium"
          >
            {allExpanded ? "Colapsar todo" : "Expandir todo"}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {!isLoading && grupos.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-10">
          No hay archivos disponibles para este programa.
        </p>
      )}

      <div className="space-y-3">
        {grupos.map((group) => (
          <ModuloAccordion
            key={groupKey(group)}
            group={group}
            isOpen={openSet.has(groupKey(group))}
            onToggle={() => toggleGroup(groupKey(group))}
            programaId={programaId}
          />
        ))}
      </div>
    </div>
  );
}