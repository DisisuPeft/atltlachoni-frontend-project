"use client";

import {
  useGetMaterialesProgramaQuery,
  useProgramaEstudianteQuery,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { VideoPlayer } from "@/app/components/plataforma/video-player";
import { Loader2, AlertCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

function VideoStatus({ hls_status, materialId }: { hls_status: "pending" | "processing" | "failed" | null; materialId: number }) {
  if (hls_status === "failed") {
    return (
      <div className="aspect-video w-full bg-gray-950 rounded-xl flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Error al procesar el video</span>
        </div>
        <a
          href={`${UPLOAD_HOST}/api/control-escolar/materiales/${materialId}/stream/`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-xs hover:bg-gray-700 transition-colors"
        >
          Ver video de respaldo
        </a>
      </div>
    );
  }
  return (
    <div className="aspect-video w-full bg-gray-950 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="text-sm">{hls_status === "processing" ? "Preparando video…" : "En cola…"}</p>
    </div>
  );
}

interface Props {
  programaId: string;
  slug: string;
}

export default function BienvenidaView({ programaId, slug }: Props) {
  const { data: programa } = useProgramaEstudianteQuery(programaId);
  const { data: materiales } = useGetMaterialesProgramaQuery(programaId);

  const videoMaterial = materiales?.results?.find(
    (m) => m.file_type === "video" && m.modulo === null,
  );

  const primerModuloId = programa?.modulos_obj?.[0]?.id;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <div>
        <p className="text-xs font-semibold text-[#0056D2] uppercase tracking-wide">
          Bienvenida
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {programa?.nombre}
        </h1>
        {programa?.descripcion && (
          <p className="text-sm text-gray-500 mt-1">{programa.descripcion}</p>
        )}
      </div>

      {videoMaterial ? (
        videoMaterial.hls_status === "ready" ? (
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
            <VideoPlayer materialId={videoMaterial.id} />
          </div>
        ) : (
          <VideoStatus
            hls_status={videoMaterial.hls_status as "pending" | "processing" | "failed" | null}
            materialId={videoMaterial.id}
          />
        )
      ) : (
        <div className="aspect-video w-full bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
          <PlayCircle className="w-10 h-10" />
          <p className="text-sm">Video de presentación no disponible</p>
        </div>
      )}

      {videoMaterial?.description && (
        <p className="text-sm text-gray-600">{videoMaterial.description}</p>
      )}

      {primerModuloId && (
        <div className="flex justify-end">
          <Link
            href={`/plataforma/${slug}/${programaId}/modulo/${primerModuloId}`}
            className="px-6 py-2.5 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5] transition-colors"
          >
            Comenzar →
          </Link>
        </div>
      )}
    </div>
  );
}
