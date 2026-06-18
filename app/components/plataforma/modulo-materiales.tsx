"use client";

import { useState } from "react";
import { useGetMaterialesModuloQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { Material } from "@/redux/features/types/control-escolar/type";
import { VideoPlayer } from "@/app/components/plataforma/video-player";
import {
  FileText,
  File,
  Camera,
  Loader2,
  Video,
  Play,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

interface Props {
  moduloId: number;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

// ── Video HLS status placeholder ──────────────────────────────────────

function VideoStatusPlaceholder({
  status,
  materialId,
}: {
  status: "pending" | "processing" | "failed" | null;
  materialId: number;
}) {
  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 bg-gray-950 rounded-b-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">
            Error al procesar el video
          </span>
        </div>
        <a
          href={`${UPLOAD_HOST}/api/control-escolar/materiales/${materialId}/stream/`}
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

// ── Material row ─────────────────────────────────────────────────────

function MaterialRow({ material }: { material: Material }) {
  const [expanded, setExpanded] = useState(false);
  const isVideo = material.file_type === "video";

  const icon = isVideo ? (
    <Video className="w-5 h-5 text-[#0056D2]" />
  ) : material.mime_type.startsWith("image/") ? (
    <Camera className="w-5 h-5 text-[#0056D2]" />
  ) : material.mime_type === "application/pdf" ? (
    <FileText className="w-5 h-5 text-[#0056D2]" />
  ) : (
    <File className="w-5 h-5 text-[#0056D2]" />
  );

  if (isVideo) {
    const hlsReady = material.hls_status === "ready";

    return (
      <div className="border-b last:border-b-0 border-gray-100">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 truncate">
              {material.original_name}
            </p>
            {material.description && (
              <p className="text-xs text-gray-400 truncate">
                {material.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400">
              {formatBytes(material.size)}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0F6FF] text-[#0056D2] text-xs font-medium">
              <Play className="w-3 h-3" />
              Ver
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="bg-black rounded-b-lg overflow-hidden">
            {hlsReady ? (
              <VideoPlayer materialId={material.id} />
            ) : (
              <VideoStatusPlaceholder
                status={
                  material.hls_status as
                    | "pending"
                    | "processing"
                    | "failed"
                    | null
                }
                materialId={material.id}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={`${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/preview/`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
    >
      <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 truncate">
          {material.original_name}
        </p>
        {material.description && (
          <p className="text-xs text-gray-400 truncate">
            {material.description}
          </p>
        )}
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {formatBytes(material.size)}
      </span>
    </a>
  );
}

// ── Main component ───────────────────────────────────────────────────

export default function ModuloMateriales({ moduloId }: Props) {
  const { data: materiales, isLoading } = useGetMaterialesModuloQuery(moduloId);

  if (isLoading)
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );

  if (!materiales?.count) return null;

  return (
    <div className="px-6 pb-6 mt-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Materiales
      </p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {materiales.results.map((material) => (
          <MaterialRow key={material.id} material={material} />
        ))}
      </div>
    </div>
  );
}
