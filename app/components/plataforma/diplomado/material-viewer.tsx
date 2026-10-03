"use client";

import type { Material } from "@/redux/features/types/control-escolar/type";
import { VideoPlayer } from "@/app/components/plataforma/video-player";
import { AlertCircle, Download, File, FileText, Loader2, Music } from "lucide-react";
import { downloadUrl, isPdf, previewUrl, streamUrl } from "./materiales";

// ── Visor de documentos ────────────────────────────────────────────────────

function DocumentoViewer({
  material,
  programaId,
}: {
  material: Material;
  programaId: string;
}) {
  const preview = previewUrl(material, programaId);
  const download = downloadUrl(material, programaId);

  if (!preview) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-8">
        <FileText className="h-10 w-10 text-slate-400" />
        <p className="text-sm text-slate-500">Vista previa no disponible.</p>
        <a
          href={download}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Download className="h-4 w-4" />
          Descargar {isPdf(material) ? "PDF" : "archivo"}
        </a>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200">
      <div className="flex flex-col gap-3 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
          <FileText className="h-4 w-4 shrink-0 text-rose-500" />
          <span className="truncate">{material.original_name}</span>
        </div>
        <a
          href={download}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto"
        >
          <Download className="h-3.5 w-3.5" />
          Descargar
        </a>
      </div>
      <iframe
        src={preview}
        className="h-[60vh] min-h-[360px] w-full sm:h-[70vh]"
        title={material.original_name}
      />
    </div>
  );
}

// ── Visor general ──────────────────────────────────────────────────────────
// El estado del video (hls_status) es el único estado real de un material.

export function MaterialViewer({
  material,
  programaId,
}: {
  material: Material;
  programaId: string;
}) {
  const stream = streamUrl(material, programaId);

  if (material.file_type === "video") {
    if (material.hls_status === "ready") {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          <VideoPlayer
            materialId={material.id}
            programaId={programaId}
            className="h-full object-contain"
          />
        </div>
      );
    }
    if (material.hls_status === "failed") {
      return (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-slate-900">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">No se pudo procesar el video</span>
          </div>
          <a
            href={stream}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-white/20"
          >
            Ver video de respaldo
          </a>
        </div>
      );
    }
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-slate-900 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">
          {material.hls_status === "processing"
            ? "Preparando video…"
            : "Video en cola de procesamiento…"}
        </p>
      </div>
    );
  }

  if (material.file_type === "document" || isPdf(material)) {
    return <DocumentoViewer material={material} programaId={programaId} />;
  }

  if (material.file_type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={stream}
        alt={material.original_name}
        className="max-h-[70vh] w-full rounded-xl bg-slate-100 object-contain"
      />
    );
  }

  if (material.file_type === "audio") {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <Music className="h-10 w-10 text-indigo-400" />
        <p className="break-words text-center text-sm font-medium text-slate-700">
          {material.original_name}
        </p>
        <audio controls src={stream} className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-8">
      <File className="h-10 w-10 text-slate-400" />
      <p className="break-words text-center text-sm font-medium text-slate-700">
        {material.original_name}
      </p>
      <a
        href={stream}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        <Download className="h-4 w-4" />
        Descargar archivo
      </a>
    </div>
  );
}
