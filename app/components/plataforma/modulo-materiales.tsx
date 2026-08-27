"use client";

import { useState } from "react";
import { useGetMaterialesModuloQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { Material } from "@/redux/features/types/control-escolar/type";
import { VideoPlayer } from "@/app/components/plataforma/video-player";
import { AlertCircle, Camera, ChevronDown, ChevronUp, File, FileText, FolderOpen, Loader2, Play, Video } from "lucide-react";

interface Props { moduloId: number; }

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

function VideoStatusPlaceholder({ status, materialId }: { status: Material["hls_status"]; materialId: number }) {
  if (status === "failed") return <div className="flex flex-col items-center justify-center gap-4 bg-[#123B4A] px-5 py-8 text-center"><div className="flex items-center gap-2 text-base font-medium text-[#FFD9CC]"><AlertCircle aria-hidden="true" className="h-5 w-5" />El video no pudo prepararse.</div><a href={`${UPLOAD_HOST}/api/control-escolar/materiales/${materialId}/stream/`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-base font-semibold text-[#123B4A] hover:bg-[#FFF8EE] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#F4B49E]"><Play aria-hidden="true" className="h-5 w-5" />Abrir video de respaldo</a></div>;
  return <div className="flex items-center justify-center gap-3 bg-[#123B4A] px-5 py-8 text-base text-white"><Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />{status === "processing" ? "Estamos preparando el video…" : "El video está en espera…"}</div>;
}

function MaterialIcon({ material }: { material: Material }) {
  const iconClass = "h-6 w-6 text-[#123B4A]";
  if (material.file_type === "video") return <Video aria-hidden="true" className={iconClass} />;
  if (material.mime_type.startsWith("image/")) return <Camera aria-hidden="true" className={iconClass} />;
  if (material.mime_type === "application/pdf") return <FileText aria-hidden="true" className={iconClass} />;
  return <File aria-hidden="true" className={iconClass} />;
}

function MaterialRow({ material }: { material: Material }) {
  const [expanded, setExpanded] = useState(false);
  const isVideo = material.file_type === "video";
  const action = isVideo ? "Ver video" : "Abrir recurso";
  const details = <><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E5F1EB]"><MaterialIcon material={material} /></span><span className="min-w-0 flex-1"><span className="block break-words text-lg font-semibold leading-snug text-[#172B36]">{material.original_name}</span><span className="mt-1 flex flex-wrap gap-x-2 text-base text-[#315563]"><span>{isVideo ? "Video" : "Material de lectura"}</span><span aria-hidden="true">·</span><span>{formatBytes(material.size)}</span></span>{material.description && <span className="mt-1 block text-base leading-snug text-[#315563]">{material.description}</span>}</span></>;

  if (isVideo) {
    const hlsReady = material.hls_status === "ready";
    return <div className="border-b border-[#E7DCCC] last:border-b-0"><button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="group flex w-full min-h-20 items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FFF8EE] focus-visible:relative focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C75B39] sm:px-6">{details}<span className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#C75B39] px-3 text-base font-semibold text-white group-hover:bg-[#A9452B]"><Play aria-hidden="true" className="h-5 w-5" /><span>{expanded ? "Cerrar" : action}</span>{expanded ? <ChevronUp aria-hidden="true" className="h-5 w-5" /> : <ChevronDown aria-hidden="true" className="h-5 w-5" />}</span></button>{expanded && <div className="overflow-hidden border-t border-[#E7DCCC] bg-[#123B4A]">{hlsReady ? <VideoPlayer materialId={material.id} /> : <VideoStatusPlaceholder status={material.hls_status} materialId={material.id} />}</div>}</div>;
  }

  return <a href={`${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/preview/`} target="_blank" rel="noopener noreferrer" className="group flex min-h-20 items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FFF8EE] focus-visible:relative focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C75B39] sm:px-6">{details}<span className="flex min-h-11 shrink-0 items-center rounded-lg bg-[#C75B39] px-3 text-base font-semibold text-white group-hover:bg-[#A9452B]">{action}</span></a>;
}

export default function ModuloMateriales({ moduloId }: Props) {
  const { data: materiales, isLoading } = useGetMaterialesModuloQuery(moduloId);
  if (isLoading) return <section aria-label="Cargando recursos" className="flex justify-center rounded-2xl border border-[#D8C9B5] bg-white py-10"><Loader2 aria-label="Cargando recursos" className="h-7 w-7 animate-spin text-[#123B4A]" /></section>;
  if (!materiales?.count) return null;
  return <section aria-labelledby="recursos-title" className="overflow-hidden rounded-2xl border-2 border-[#C75B39] bg-white shadow-md"><div className="bg-[#123B4A] px-5 py-5 text-white sm:px-6"><p className="flex items-center gap-2 text-base font-semibold text-[#F4B49E]"><FolderOpen aria-hidden="true" className="h-5 w-5" />Empieza aquí</p><h2 id="recursos-title" className="mt-1 font-heading text-2xl font-semibold">Recursos de esta lección</h2><p className="mt-1 text-base text-[#E5F1EB]">Abre el material que necesitas para continuar.</p></div><div>{materiales.results.map((material) => <MaterialRow key={material.id} material={material} />)}</div></section>;
}
