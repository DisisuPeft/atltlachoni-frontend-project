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
  ImageIcon,
  Download,
  Loader2,
  BookOpen,
  Clock,
  ListChecks,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import ExamenesView from "@/app/components/plataforma/examenes-view";
import ActividadesAlumnoView from "@/app/components/plataforma/actividades-alumno-view";
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

// ── File type visual system ──────────────────────────────────────────────
// Un solo mapeo color+ícono por tipo de archivo, reusado en la insignia y en
// el ícono de cada fila del acordeón — así el alumno reconoce el tipo de
// contenido de un vistazo, sin tener que leer.

const FILE_TYPE_META: Record<
  string,
  { label: string; badge: string; chip: string; icon: typeof FileText }
> = {
  video: {
    label: "Video",
    badge: "bg-blue-100 text-blue-700",
    chip: "bg-blue-50 text-blue-500",
    icon: PlayCircle,
  },
  document: {
    label: "Documento",
    badge: "bg-orange-100 text-orange-700",
    chip: "bg-orange-50 text-orange-500",
    icon: FileText,
  },
  pdf: {
    label: "PDF",
    badge: "bg-red-100 text-red-700",
    chip: "bg-red-50 text-red-500",
    icon: FileText,
  },
  image: {
    label: "Imagen",
    badge: "bg-green-100 text-green-700",
    chip: "bg-green-50 text-green-500",
    icon: ImageIcon,
  },
  audio: {
    label: "Audio",
    badge: "bg-purple-100 text-purple-700",
    chip: "bg-purple-50 text-purple-500",
    icon: Music,
  },
};

function fileTypeMeta(fileType: string) {
  return (
    FILE_TYPE_META[fileType] ?? {
      label: fileType,
      badge: "bg-gray-100 text-gray-600",
      chip: "bg-gray-100 text-gray-400",
      icon: File,
    }
  );
}

function FileTypeBadge({ fileType }: { fileType: string }) {
  const meta = fileTypeMeta(fileType);
  return (
    <span
      className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}
    >
      {meta.label}
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
            const meta = fileTypeMeta(material.file_type);
            const Icon = meta.icon;
            return (
              <button
                key={material.id}
                type="button"
                onClick={() => onSelect(material)}
                title={`Ver ${meta.label.toLowerCase()}: ${material.original_name}`}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  active
                    ? "bg-blue-50 border-l-[3px] border-[#0056D2] pl-[17px]"
                    : "hover:bg-gray-50 border-l-[3px] border-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    active ? "bg-[#0056D2] text-white" : meta.chip
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`flex-1 text-sm truncate ${
                    active ? "text-[#0056D2] font-medium" : "text-gray-700"
                  }`}
                >
                  {material.original_name}
                </span>
                {active ? (
                  <span className="shrink-0 text-[10px] font-semibold text-[#0056D2] bg-blue-100 px-2 py-0.5 rounded-full">
                    Viendo
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
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

type Tab = "inicio" | "actividades" | "examenes";

// Cada tab tiene su propio color de acento — así el alumno siempre sabe en
// qué sección está con solo mirar el color, sin depender del texto.
const TABS: {
  key: Tab;
  label: string;
  icon: React.ReactNode;
  active: string;
}[] = [
  {
    key: "inicio",
    label: "Inicio",
    icon: <BookOpen className="w-4 h-4" />,
    active: "border-[#0056D2] text-[#0056D2]",
  },
  {
    key: "actividades",
    label: "Actividades",
    icon: <ListChecks className="w-4 h-4" />,
    active: "border-amber-500 text-amber-600",
  },
  {
    key: "examenes",
    label: "Exámenes",
    icon: <GraduationCap className="w-4 h-4" />,
    active: "border-violet-500 text-violet-600",
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

  // El video más reciente que trae el backend (último de la lista, en el
  // orden en que ya vienen los materiales) — es el que abre "Continuar".
  const lastVideo = useMemo(() => {
    const videos: Material[] = [];
    for (const g of grupos) {
      for (const m of g.materiales) {
        if (m.file_type === "video") videos.push(m);
      }
    }
    return videos[videos.length - 1];
  }, [grupos]);

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
    const target = lastVideo ?? videoMaterial ?? moduloGroups[0]?.materiales[0];
    if (target) {
      handleSelect(target);
      const owningGroup = grupos.find((g) =>
        g.materiales.some((m) => m.id === target.id),
      );
      if (owningGroup) {
        setOpenSet((prev) => new Set(prev).add(groupKey(owningGroup)));
      }
    } else if (moduloGroups[0]) {
      setOpenSet(new Set([groupKey(moduloGroups[0])]));
    }
  };

  return (
    <div>
      {/* ── Tab strip ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex max-w-4xl mx-auto">
          {TABS.map(({ key, label, icon, active }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? active
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
              Mis {programa?.tipo_nombre ? `${programa.tipo_nombre}s` : "programas"}
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
                  Continuar {programa?.tipo_nombre ?? "programa"}
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-gray-900">
                    {selectedMaterial.original_name}
                  </h2>
                  <FileTypeBadge fileType={selectedMaterial.file_type} />
                </div>
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
                Contenido del {programa?.tipo_nombre ?? "programa"}
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
                  className="flex items-center gap-1 text-xs text-[#0056D2] hover:underline font-medium"
                >
                  {allExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
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

      {/* ── Actividades ───────────────────────────────────────────────── */}
      {tab === "actividades" && <ActividadesAlumnoView programaId={programaId} />}

      {/* ── Exámenes ─────────────────────────────────────────────────── */}
      {tab === "examenes" && <ExamenesView programaId={programaId} />}
    </div>
  );
}