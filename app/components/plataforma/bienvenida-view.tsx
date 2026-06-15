"use client";

import { useState, useMemo } from "react";
import {
  useGetMaterialesProgramaQuery,
  useProgramaEstudianteQuery,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { VideoPlayer } from "@/app/components/plataforma/video-player";
import {
  AlertCircle,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Film,
  FileText,
  ImageIcon,
  Music,
  File,
  Download,
  Loader2,
  Folder,
} from "lucide-react";
import { Material } from "@/redux/features/types/control-escolar/type";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;
const API_HOST = process.env.NEXT_PUBLIC_HOST;

// ── PDF viewer ─────────────────────────────────────────────────────────────

function isPdf(material: Material) {
  return (
    material.file_type === "pdf" ||
    material.file_extension === "pdf" ||
    material.mime_type === "application/pdf"
  );
}

function PdfViewer({ material }: { material: Material }) {
  const previewUrl = material.preview_url
    ? `${API_HOST}${material.preview_url}`
    : null;
  const downloadUrl = material.download_url
    ? `${API_HOST}${material.download_url}`
    : `${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/stream/`;

  if (!previewUrl) {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center gap-4">
        <FileText className="w-10 h-10 text-gray-400" />
        <p className="text-sm text-gray-500">Vista previa no disponible.</p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5] transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar PDF
        </a>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
          <FileText className="w-4 h-4 text-red-500 shrink-0" />
          <span className="truncate">{material.original_name}</span>
        </div>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Descargar
        </a>
      </div>
      <iframe
        src={previewUrl}
        className="w-full"
        style={{ height: "70vh" }}
        title={material.original_name}
      />
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function materialIcon(fileType: string, className = "w-4 h-4 shrink-0") {
  switch (fileType) {
    case "video":
      return <Film className={`${className} text-blue-500`} />;
    case "pdf":
      return <FileText className={`${className} text-red-500`} />;
    case "image":
      return <ImageIcon className={`${className} text-green-500`} />;
    case "audio":
      return <Music className={`${className} text-purple-500`} />;
    default:
      return <File className={`${className} text-gray-400`} />;
  }
}

// ── Content viewer ─────────────────────────────────────────────────────────

function MaterialViewer({ material }: { material: Material }) {
  const streamUrl = `${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/stream/`;

  if (material.file_type === "video") {
    if (material.hls_status === "ready") {
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
          <VideoPlayer materialId={material.id} />
        </div>
      );
    }
    if (material.hls_status === "failed") {
      return (
        <div className="aspect-video w-full bg-gray-950 rounded-xl flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Error al procesar el video</span>
          </div>
          <a
            href={streamUrl}
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
        <p className="text-sm">
          {material.hls_status === "processing" ? "Preparando video…" : "En cola…"}
        </p>
      </div>
    );
  }

  if (isPdf(material)) {
    return <PdfViewer material={material} />;
  }

  if (material.file_type === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={streamUrl}
        alt={material.original_name}
        className="w-full rounded-xl object-contain max-h-[70vh] bg-gray-100"
      />
    );
  }

  if (material.file_type === "audio") {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4">
        <Music className="w-10 h-10 text-purple-400" />
        <p className="text-sm font-medium text-gray-700">{material.original_name}</p>
        <audio controls src={streamUrl} className="w-full" />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center gap-4">
      <File className="w-10 h-10 text-gray-400" />
      <p className="text-sm font-medium text-gray-700 text-center">
        {material.original_name}
      </p>
      <a
        href={streamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5] transition-colors"
      >
        <Download className="w-4 h-4" />
        Descargar archivo
      </a>
    </div>
  );
}

// ── Bienvenida video placeholder ───────────────────────────────────────────

function BienvenidaVideo({ material }: { material: Material | undefined }) {
  if (!material) {
    return (
      <div className="aspect-video w-full bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
        <PlayCircle className="w-10 h-10" />
        <p className="text-sm">Video de presentación no disponible</p>
      </div>
    );
  }
  return <MaterialViewer material={material} />;
}

// ── Campaign group type ─────────────────────────────────────────────────────

interface CampaniaGroup {
  campania_id: number | null;
  campania_nombre: string | null;
  materiales: Material[];
}

function groupKey(g: CampaniaGroup) {
  return String(g.campania_id);
}

// ── Campaign accordion ─────────────────────────────────────────────────────

function CampaniaAccordion({
  group,
  isOpen,
  onToggle,
  selectedId,
  onSelect,
}: {
  group: CampaniaGroup;
  isOpen: boolean;
  onToggle: () => void;
  selectedId: number | null;
  onSelect: (m: Material) => void;
}) {
  const label =
    group.campania_nombre ??
    (group.campania_id === null ? "General" : `Campaña #${group.campania_id}`);

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
        <span className="text-sm font-semibold text-gray-800 flex-1">{label}</span>
        <span className="text-xs text-gray-400 shrink-0">
          {group.materiales.length} archivo
          {group.materiales.length !== 1 ? "s" : ""}
        </span>
      </button>

      {isOpen && (
        <div className="divide-y divide-gray-100">
          {group.materiales.length === 0 && (
            <p className="px-5 py-4 text-sm text-gray-400">Sin archivos.</p>
          )}
          {group.materiales.map((material) => {
            const active = material.id === selectedId;
            return (
              <button
                key={material.id}
                type="button"
                onClick={() => onSelect(material)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  active
                    ? "bg-blue-50 border-l-2 border-[#0056D2]"
                    : "hover:bg-gray-50"
                }`}
              >
                {materialIcon(material.file_type)}
                <span
                  className={`text-sm flex-1 truncate ${
                    active ? "text-[#0056D2] font-medium" : "text-gray-700"
                  }`}
                >
                  {material.original_name}
                </span>
                {material.description && (
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:block truncate max-w-[180px]">
                    {material.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────

interface Props {
  programaId: string;
  slug: string;
}

export default function BienvenidaView({ programaId }: Props) {
  const { data: programa } = useProgramaEstudianteQuery(programaId);
  const { data: materialesData, isLoading: materialesLoading } =
    useGetMaterialesProgramaQuery(programaId);

  const allMateriales = useMemo(
    () => materialesData?.results ?? [],
    [materialesData],
  );

  // Bienvenida video: first video without campania and without modulo
  const videoMaterial = allMateriales.find(
    (m) => m.file_type === "video" && m.modulo === null && m.campania_id === null,
  );

  // Group remaining materials by campaign; null → "General"
  const campGroups = useMemo<CampaniaGroup[]>(() => {
    const map = new Map<number | null, CampaniaGroup>();
    for (const m of allMateriales) {
      // Exclude the bienvenida video from the accordion list
      if (videoMaterial && m.id === videoMaterial.id) continue;
      const key = m.campania_id;
      if (!map.has(key)) {
        map.set(key, {
          campania_id: key,
          campania_nombre: m.campania_nombre,
          materiales: [],
        });
      }
      map.get(key)!.materiales.push(m);
    }
    const entries = Array.from(map.values());
    // General (null) first, then by id
    return entries.sort((a, b) => {
      if (a.campania_id === null) return -1;
      if (b.campania_id === null) return 1;
      return a.campania_id - b.campania_id;
    });
  }, [allMateriales, videoMaterial]);

  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const allExpanded = campGroups.length > 0 && openSet.size === campGroups.length;

  const toggleExpand = () => {
    setOpenSet(allExpanded ? new Set() : new Set(campGroups.map(groupKey)));
  };

  const toggleGroup = (key: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSelect = (material: Material) => {
    setSelectedMaterial(material);
    document.getElementById("plataforma-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">

      {/* ── Visor principal ── */}
      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-[#0056D2] uppercase tracking-wide">
            {selectedMaterial ? "Archivo" : "Bienvenida"}
          </p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5 truncate">
            {selectedMaterial ? selectedMaterial.original_name : programa?.nombre}
          </h1>
          {(selectedMaterial?.description ?? programa?.descripcion) && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedMaterial?.description ?? programa?.descripcion}
            </p>
          )}
        </div>

        {selectedMaterial ? (
          <MaterialViewer material={selectedMaterial} />
        ) : (
          <BienvenidaVideo material={videoMaterial} />
        )}

        {selectedMaterial && (
          <button
            type="button"
            onClick={() => setSelectedMaterial(null)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Volver a la bienvenida
          </button>
        )}
      </section>

      {/* ── Materiales por campaña ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Materiales</h2>
          {campGroups.length > 0 && (
            <button
              type="button"
              onClick={toggleExpand}
              className="text-xs text-[#0056D2] hover:underline font-medium"
            >
              {allExpanded ? "Colapsar todo" : "Expandir todo"}
            </button>
          )}
        </div>

        {materialesLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            Cargando materiales…
          </div>
        ) : campGroups.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No hay materiales disponibles.
          </p>
        ) : (
          <div className="space-y-3">
            {campGroups.map((group) => (
              <CampaniaAccordion
                key={groupKey(group)}
                group={group}
                isOpen={openSet.has(groupKey(group))}
                onToggle={() => toggleGroup(groupKey(group))}
                selectedId={selectedMaterial?.id ?? null}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}