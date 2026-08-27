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
  X,
} from "lucide-react";
import ExamenesView from "@/app/components/plataforma/examenes-view";
import ActividadesAlumnoView from "@/app/components/plataforma/actividades-alumno-view";
import Link from "next/link";
import Image from "next/image";
import {
  Material,
  ModuloConMateriales,
} from "@/redux/features/types/control-escolar/type";
import { isMaterialVisible } from "@/app/utils/plataforma/materiales";

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
      <div className="flex flex-col gap-3 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-base text-gray-600">
          <FileText className="w-4 h-4 text-red-500 shrink-0" />
          <span className="truncate">{material.original_name}</span>
        </div>
        {isDocument(material) && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors sm:w-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar
          </a>
        )}
      </div>
      <iframe
        src={previewUrl}
        className="h-[60vh] min-h-[360px] w-full sm:h-[70vh]"
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
          {material.hls_status === "processing"
            ? "Preparando video…"
            : "En cola…"}
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
      <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
        <Music className="w-10 h-10 text-purple-400" />
        <p className="break-words text-center text-base font-medium text-gray-700">
          {material.original_name}
        </p>
        <audio controls src={streamUrl} className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-8">
      <File className="w-10 h-10 text-gray-400" />
      <p className="break-words text-center text-base font-medium text-gray-700">
        {material.original_name}
      </p>
      <a
        href={streamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#0056D2] px-4 text-base font-semibold text-white hover:bg-[#004BB5] transition-colors"
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
  selectedId,
  onSelect,
}: {
  group: ModuloConMateriales;
  index: number;
  selectedId: number | null;
  onSelect: (m: Material) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#D8C9B5] bg-white shadow-sm">
      <div className="flex min-h-16 items-center gap-3 border-b border-[#E7DCCC] bg-[#E5F1EB] px-4 py-4 sm:gap-4 sm:px-6">
        <div className="w-9 h-9 rounded-lg bg-[#0056D2]/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-[#0056D2]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#123B4A]">
            {group.modulo_nombre ??
              (group.modulo_id === null
                ? "Recursos generales"
                : `Módulo ${index + 1}`)}
          </h3>
          <p className="mt-0.5 text-base text-[#315563]">
            {group.materiales.length}{" "}
            {group.materiales.length === 1
              ? "recurso disponible"
              : "recursos disponibles"}
          </p>
        </div>
      </div>

      {/* Items */}
      {
        <div className="divide-y divide-[#E7DCCC]">
          {group.materiales.length === 0 && (
            <p className="px-5 py-5 text-base text-[#315563]">
              No hay recursos en este módulo.
            </p>
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
                className={`group flex min-h-20 w-full flex-col items-stretch gap-3 px-4 py-4 text-left transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C75B39] sm:flex-row sm:items-center sm:gap-4 sm:px-6 ${
                  active
                    ? "bg-[#FFF8EE] border-l-[4px] border-[#C75B39] pl-4"
                    : "hover:bg-[#FFF8EE] border-l-[4px] border-transparent"
                }`}
              >
                <div
                  className={`flex h-12 w-12 self-start rounded-xl items-center justify-center shrink-0 ${
                    active
                      ? "bg-[#C75B39] text-white"
                      : "bg-[#E5F1EB] text-[#123B4A]"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </div>
                <span
                  className={`w-full flex-1 break-words text-lg font-semibold leading-snug ${
                    active ? "text-[#123B4A]" : "text-[#172B36]"
                  }`}
                >
                  {material.original_name}
                </span>
                {active ? (
                  <span className="self-start rounded-full bg-[#E5F1EB] px-3 py-1 text-sm font-semibold text-[#176B52] sm:shrink-0 sm:self-auto">
                    En pantalla
                  </span>
                ) : (
                  <span className="flex min-h-11 w-full items-center justify-center gap-1 rounded-lg bg-[#123B4A] px-3 text-base font-semibold text-white sm:w-auto sm:shrink-0">
                    Abrir <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      }
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
  const { data: gruposRaw = [], isLoading: materialesLoading } =
    useGetMaterialesProgramaQuery(programaId);

  const grupos = useMemo<ModuloConMateriales[]>(
    () =>
      gruposRaw.map((g) => ({
        ...g,
        materiales: g.materiales.filter(isMaterialVisible),
      })),
    [gruposRaw],
  );

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

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );

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
    }
  };

  return (
    <div className="min-h-full bg-[#FFF]">
      {/* ── Inicio ────────────────────────────────────────────────────── */}
      {tab === "inicio" && (
        <div className="mx-auto max-w-4xl px-3 pb-12 sm:px-6">
          {/* Back nav */}
          <div className="pt-5">
            <Link
              href="/plataforma/educacion"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#123B4A] bg-white px-4 text-center text-base font-semibold text-[#123B4A] shadow-sm transition-colors hover:bg-[#E5F1EB] focus-visible:outline-4 focus-visible:outline-[#C75B39] sm:w-auto"
            >
              <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              Volver a mis{" "}
              {programa?.tipo_nombre ? `${programa.tipo_nombre}s` : "programas"}
            </Link>
          </div>

          {/* ── Program hero ─────────────────────────────────────────── */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#123B4A] shadow-lg">
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
            {/* <div className="relative p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="flex-1 min-w-0">
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#E5F1EB] px-3 py-1 text-sm font-semibold text-[#176B52]">
                    <PlayCircle className="w-3.5 h-3.5" />
                    Comienza aquí
                  </span>
                  <h1 className="mb-2 font-heading text-3xl font-semibold leading-snug text-white md:text-4xl">
                    {programa?.nombre ?? "Cargando…"}
                  </h1> */}
            {/* {programa?.descripcion && (
                    <p className="mb-5 text-lg leading-relaxed text-[#E5F1EB] line-clamp-3">
                      {programa.descripcion}
                    </p>
                  )} */}
            {/* <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-[#E5F1EB]">
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
                  </div> */}
            {/* </div>

                <button
                  type="button"
                  onClick={handleContinuar}
                  className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#C75B39] px-5 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-[#A9452B] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#F4B49E]"
                >
                  <PlayCircle className="w-4 h-4" />
                  Abrir recurso principal
                </button>
              </div>
            </div> */}
          </div>

          {/* ── Viewer ───────────────────────────────────────────────── */}
          {selectedMaterial ? (
            <div className="mb-8 space-y-3">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedMaterial(null)}
                  aria-label={`Cerrar recurso: ${selectedMaterial.original_name}`}
                  className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#123B4A] bg-white px-3 text-base font-semibold text-[#123B4A] transition-colors hover:bg-[#E5F1EB] focus-visible:outline-4 focus-visible:outline-[#C75B39]"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                  Cerrar recurso
                </button>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="break-words text-xl font-semibold text-gray-900 sm:text-2xl">
                    {selectedMaterial.original_name}
                  </h2>
                  <FileTypeBadge fileType={selectedMaterial.file_type} />
                </div>
                {selectedMaterial.description && (
                  <p className="mt-1 break-words text-base text-gray-500">
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
          <section aria-labelledby="contenido-curso">
            <div className="mb-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#176B52]">
                  Siguiente paso
                </p>
                <h2
                  id="contenido-curso"
                  className="font-heading text-2xl font-semibold text-[#123B4A]"
                >
                  Recursos del {programa?.tipo_nombre ?? "programa"}
                </h2>
                <p className="mt-1 text-base text-[#315563]">
                  Elige un módulo y abre el recurso que necesitas.
                </p>
              </div>
            </div>

            {materialesLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-base text-[#315563]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando materiales…
              </div>
            ) : moduloGroups.length === 0 ? (
              <p className="py-10 text-center text-base text-[#315563]">
                Aún no hay recursos disponibles.
              </p>
            ) : (
              <div className="space-y-3">
                {moduloGroups.map((group, i) => (
                  <ModuloAccordion
                    key={groupKey(group)}
                    group={group}
                    index={i}
                    selectedId={selectedMaterial?.id ?? null}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </section>

          <section
            aria-labelledby="herramientas-curso"
            className="mt-8 border-t border-[#D8C9B5] pt-6"
          >
            <h2
              id="herramientas-curso"
              className="font-heading text-xl font-semibold text-[#123B4A]"
            >
              Otras herramientas del curso
            </h2>
            <p className="mt-1 text-base text-[#315563]">
              Úsalas cuando necesites entregar actividades o consultar tus
              exámenes.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {TABS.filter(({ key }) => key !== "inicio").map(
                ({ key, label, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#123B4A] bg-white px-4 text-base font-semibold text-[#123B4A] transition-colors hover:bg-[#E5F1EB] focus-visible:outline-4 focus-visible:outline-[#C75B39]"
                  >
                    {icon}
                    Ver {label.toLowerCase()}
                  </button>
                ),
              )}
            </div>
          </section>
        </div>
      )}

      {/* ── Actividades ───────────────────────────────────────────────── */}
      {tab === "actividades" && (
        <>
          <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6">
            <button
              type="button"
              onClick={() => setTab("inicio")}
              className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-[#123B4A] focus-visible:outline-4 focus-visible:outline-[#C75B39]"
            >
              <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              Volver al curso
            </button>
          </div>
          <ActividadesAlumnoView programaId={programaId} />
        </>
      )}

      {/* ── Exámenes ─────────────────────────────────────────────────── */}
      {tab === "examenes" && (
        <>
          <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6">
            <button
              type="button"
              onClick={() => setTab("inicio")}
              className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-[#123B4A] focus-visible:outline-4 focus-visible:outline-[#C75B39]"
            >
              <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              Volver al curso
            </button>
          </div>
          <ExamenesView programaId={programaId} />
        </>
      )}
    </div>
  );
}
