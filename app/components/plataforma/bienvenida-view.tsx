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
  ChevronUp,
  FileText,
  Music,
  File,
  Download,
  Loader2,
  BookOpen,
  Clock,
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Circle,
} from "lucide-react";
import ExamenesView from "@/app/components/plataforma/examenes-view";
import Link from "next/link";
import Image from "next/image";
import {
  Material,
  ModuloConMateriales,
} from "@/redux/features/types/control-escolar/type";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;
const API_HOST = process.env.NEXT_PUBLIC_HOST;

// ── Helpers ────────────────────────────────────────────────────────────────

function isDocument(material: Material) {
  return (
    material.file_type === "document" ||
    material.file_extension === "pdf" ||
    material.mime_type === "application/pdf"
  );
}

function groupKey(g: ModuloConMateriales) {
  return g.modulo_id === null ? "null" : String(g.modulo_id);
}

// ── PDF viewer ─────────────────────────────────────────────────────────────

function PdfViewer({
  material,
  programaId,
}: {
  material: Material;
  programaId: string;
}) {
  const previewUrl = material.preview_url
    ? `${API_HOST}${material.preview_url}?programa=${programaId}`
    : null;
  const downloadUrl = material.download_url
    ? `${API_HOST}${material.download_url}?programa=${programaId}`
    : `${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/stream/?programa=${programaId}`;

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
        {isDocument(material) && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar
          </a>
        )}
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

// ── Material viewer ────────────────────────────────────────────────────────

function MaterialViewer({
  material,
  programaId,
}: {
  material: Material;
  programaId: string;
}) {
  const streamUrl = `${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/stream/?programa=${programaId}`;

  if (material.file_type === "video") {
    if (material.hls_status === "ready") {
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
          <VideoPlayer materialId={material.id} programaId={programaId} />
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

  if (isDocument(material)) {
    return <PdfViewer material={material} programaId={programaId} />;
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

// ── File type badge ────────────────────────────────────────────────────────

function FileTypeBadge({ fileType }: { fileType: string }) {
  const map: Record<string, { label: string; className: string }> = {
    video: { label: "Video", className: "bg-blue-100 text-blue-700" },
    document: { label: "Documento", className: "bg-orange-100 text-orange-700" },
    pdf: { label: "PDF", className: "bg-red-100 text-red-700" },
    image: { label: "Imagen", className: "bg-green-100 text-green-700" },
    audio: { label: "Audio", className: "bg-purple-100 text-purple-700" },
  };
  const config = map[fileType] ?? {
    label: fileType,
    className: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// ── Module accordion ───────────────────────────────────────────────────────

function ModuloAccordion({
  group,
  index,
  isOpen,
  onToggle,
  selectedId,
  onSelect,
}: {
  group: ModuloConMateriales;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  selectedId: number | null;
  onSelect: (m: Material) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-[#0056D2]/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-[#0056D2]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">
            {group.modulo_nombre ??
              (group.modulo_id === null ? "General" : `Módulo ${index + 1}`)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {group.materiales.length}{" "}
            {group.materiales.length === 1 ? "tema" : "temas"}
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {/* Items */}
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
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                  active
                    ? "bg-blue-50 border-l-[3px] border-[#0056D2]"
                    : "hover:bg-gray-50"
                }`}
              >
                {active ? (
                  <PlayCircle className="w-5 h-5 text-[#0056D2] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-200 shrink-0" />
                )}
                <span
                  className={`flex-1 text-sm truncate ${
                    active ? "text-[#0056D2] font-medium" : "text-gray-700"
                  }`}
                >
                  {material.original_name}
                </span>
                <FileTypeBadge fileType={material.file_type} />
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
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

type Tab = "inicio" | "examenes";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "inicio", label: "Inicio", icon: <BookOpen className="w-4 h-4" /> },
  {
    key: "examenes",
    label: "Exámenes",
    icon: <ClipboardList className="w-4 h-4" />,
  },
];

export default function BienvenidaView({ programaId }: Props) {
  const [tab, setTab] = useState<Tab>("inicio");

  const { data: programa } = useProgramaEstudianteQuery(programaId);
  const { data: grupos = [], isLoading: materialesLoading } =
    useGetMaterialesProgramaQuery(programaId);

  const nullGroup = grupos.find((g) => g.modulo_id === null);
  const videoMaterial = nullGroup?.materiales.find(
    (m) => m.file_type === "video",
  );

  const moduloGroups = useMemo<ModuloConMateriales[]>(() => {
    return grupos
      .map((g) => {
        if (g.modulo_id === null && videoMaterial) {
          return {
            ...g,
            materiales: g.materiales.filter((m) => m.id !== videoMaterial.id),
          };
        }
        return g;
      })
      .filter((g) => g.materiales.length > 0);
  }, [grupos, videoMaterial]);

  const totalMateriales = moduloGroups.reduce(
    (acc, g) => acc + g.materiales.length,
    0,
  );

  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );

  const allExpanded =
    moduloGroups.length > 0 && openSet.size === moduloGroups.length;

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
    document
      .getElementById("plataforma-main")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinuar = () => {
    const first = videoMaterial ?? moduloGroups[0]?.materiales[0];
    if (first) {
      handleSelect(first);
    } else if (moduloGroups[0]) {
      setOpenSet(new Set([groupKey(moduloGroups[0])]));
    }
  };

  return (
    <div>
      {/* ── Tab strip ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex max-w-4xl mx-auto">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Inicio ────────────────────────────────────────────────────── */}
      {tab === "inicio" && (
        <div className="max-w-4xl mx-auto px-6 pb-12">
          {/* Back nav */}
          <div className="pt-5 mb-5">
            <Link
              href="/plataforma/educacion"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Mis cursos
            </Link>
          </div>

          {/* ── Program hero ─────────────────────────────────────────── */}
          <div className="rounded-2xl overflow-hidden mb-8 relative bg-gradient-to-br from-[#0f1f65] to-[#1a4ba0]">
            {programa?.banner_url && (
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={programa.banner_url}
                  alt=""
                  fill
                  className="object-cover opacity-20"
                />
              </div>
            )}
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1.5 bg-green-400/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    <PlayCircle className="w-3.5 h-3.5" />
                    En progreso
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                    {programa?.nombre ?? "Cargando…"}
                  </h1>
                  {programa?.descripcion && (
                    <p className="text-sm text-white/70 leading-relaxed mb-5 line-clamp-3">
                      {programa.descripcion}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/60 text-xs">
                    {!!programa?.duracion_horas && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {programa.duracion_horas}h de contenido
                      </span>
                    )}
                    {moduloGroups.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {moduloGroups.length}{" "}
                        {moduloGroups.length === 1 ? "módulo" : "módulos"}
                      </span>
                    )}
                    {totalMateriales > 0 && (
                      <span>
                        {totalMateriales}{" "}
                        {totalMateriales === 1 ? "tema" : "temas"}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinuar}
                  className="shrink-0 inline-flex items-center gap-2 bg-white text-[#0056D2] font-semibold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <PlayCircle className="w-4 h-4" />
                  Continuar curso
                </button>
              </div>
            </div>
          </div>

          {/* ── Viewer ───────────────────────────────────────────────── */}
          {selectedMaterial ? (
            <div className="mb-8 space-y-3">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedMaterial(null)}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Volver a la bienvenida
                </button>
                <h2 className="font-semibold text-gray-900">
                  {selectedMaterial.original_name}
                </h2>
                {selectedMaterial.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedMaterial.description}
                  </p>
                )}
              </div>
              <MaterialViewer
                material={selectedMaterial}
                programaId={programaId}
              />
            </div>
          ) : videoMaterial ? (
            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Presentación
              </p>
              <MaterialViewer
                material={videoMaterial}
                programaId={programaId}
              />
            </div>
          ) : null}

          {/* ── Course content accordion ──────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Contenido del curso
              </h2>
              {moduloGroups.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenSet(
                      allExpanded
                        ? new Set()
                        : new Set(moduloGroups.map(groupKey)),
                    )
                  }
                  className="text-xs text-[#0056D2] hover:underline font-medium"
                >
                  {allExpanded ? "Colapsar todo" : "Expandir todo"}
                </button>
              )}
            </div>

            {materialesLoading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-12">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando materiales…
              </div>
            ) : moduloGroups.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No hay materiales disponibles.
              </p>
            ) : (
              <div className="space-y-3">
                {moduloGroups.map((group, i) => (
                  <ModuloAccordion
                    key={groupKey(group)}
                    group={group}
                    index={i}
                    isOpen={openSet.has(groupKey(group))}
                    onToggle={() => toggleGroup(groupKey(group))}
                    selectedId={selectedMaterial?.id ?? null}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Exámenes ─────────────────────────────────────────────────── */}
      {tab === "examenes" && <ExamenesView programaId={programaId} />}
    </div>
  );
}