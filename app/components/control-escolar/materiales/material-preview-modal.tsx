"use client";

import { useEffect, useState } from "react";
import type { Material } from "@/redux/features/types/control-escolar/type";
import { Modal } from "@/app/components/common/modal";
import { VideoPlayer } from "@/app/components/plataforma/video-player";
import {
  X,
  Download,
  Loader2,
  AlertCircle,
  File as FileIcon,
  Music,
} from "lucide-react";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

function isDocument(material: Material) {
  return (
    material.file_type === "document" ||
    material.file_extension === "pdf" ||
    material.mime_type === "application/pdf"
  );
}

// Trae el archivo autenticado (misma sesión/cookies que el resto de la API)
// y lo convierte en un object URL para poder mostrarlo en <iframe>/<img>.
function useAuthedBlobUrl(url: string | null) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    const fetchPreview = async () => {
      setLoading(true);
      setError(null);
      setBlobUrl(null);
      try {
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "No tienes acceso a este archivo."
              : "No se pudo cargar la previsualización.",
          );
        }
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Error al cargar el archivo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return { url: blobUrl, loading, error };
}

interface Props {
  material: Material;
  programaId?: string;
  onClose: () => void;
  hideVideoDownload?: boolean;
}

export default function MaterialPreviewModal({
  material,
  programaId,
  onClose,
  hideVideoDownload = false,
}: Props) {
  const qs = programaId ? `?programa=${programaId}` : "";
  const previewEndpoint = material.preview_url
    ? `${UPLOAD_HOST}${material.preview_url}${qs}`
    : null;
  const downloadEndpoint = material.download_url
    ? `${UPLOAD_HOST}${material.download_url}${qs}`
    : `${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/stream/${qs}`;

  const document_ = isDocument(material);
  const isImage = material.file_type === "image";
  const isVideo = material.file_type === "video";
  const canPreviewInline = (document_ && !!previewEndpoint) || isImage;

  const { url: blobUrl, loading, error } = useAuthedBlobUrl(
    canPreviewInline ? (document_ ? previewEndpoint : downloadEndpoint) : null,
  );

  return (
    <Modal show onClose={onClose} maxWidth="xl">
      <div className="flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <p className="text-sm font-semibold text-gray-900 truncate pr-4">
            {material.original_name}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {!(isVideo && hideVideoDownload) && (
              <a
                href={downloadEndpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto bg-gray-50">
          {isVideo ? (
            material.hls_status === "ready" ? (
              <VideoPlayer materialId={material.id} programaId={programaId} />
            ) : material.hls_status === "failed" ? (
              <div className="aspect-video w-full bg-gray-950 rounded-xl flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">Error al procesar el video</span>
                </div>
                <a
                  href={downloadEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-xs hover:bg-gray-700 transition-colors"
                >
                  Ver video de respaldo
                </a>
              </div>
            ) : (
              <div className="aspect-video w-full bg-gray-950 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm">
                  {material.hls_status === "processing"
                    ? "Preparando video…"
                    : "En cola…"}
                </p>
              </div>
            )
          ) : canPreviewInline ? (
            loading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-16">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando previsualización…
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-2 text-center py-16">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blobUrl ?? ""}
                alt={material.original_name}
                className="w-full rounded-xl object-contain max-h-[70vh] bg-white"
              />
            ) : (
              <iframe
                src={blobUrl ?? ""}
                className="w-full rounded-xl border border-gray-200 bg-white"
                style={{ height: "70vh" }}
                title={material.original_name}
              />
            )
          ) : material.file_type === "audio" ? (
            <div className="w-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4">
              <Music className="w-10 h-10 text-purple-400" />
              <p className="text-sm font-medium text-gray-700">
                {material.original_name}
              </p>
              <audio controls src={downloadEndpoint} className="w-full" />
            </div>
          ) : (
            <div className="w-full bg-white border border-gray-200 rounded-xl p-10 flex flex-col items-center gap-4">
              <FileIcon className="w-10 h-10 text-gray-400" />
              <p className="text-sm text-gray-500 text-center">
                Sin previsualización disponible para este tipo de archivo.
              </p>
              <a
                href={downloadEndpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5] transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
