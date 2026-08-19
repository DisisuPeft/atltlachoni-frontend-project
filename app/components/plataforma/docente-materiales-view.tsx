"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  useGetMaterialesProgramaQuery,
  useDeleteMaterialMutation,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { useGetMisProgramasDocenteQuery } from "@/redux/features/control-escolar/maestrosApiSlice";
import { useMaterialUpload } from "@/hooks";
import {
  type Material,
  type ModuloConMateriales,
} from "@/redux/features/types/control-escolar/type";
import {
  Film,
  FileText,
  ImageIcon,
  Music,
  File,
  Trash2,
  ChevronDown,
  ChevronRight,
  Upload,
  AlertCircle,
  Check,
  FolderOpen,
  X,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Modal } from "@/app/components/common/modal";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import MaterialPreviewModal from "@/app/components/control-escolar/materiales/material-preview-modal";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const TYPE_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  video:    { label: "Video",     color: "bg-blue-100 text-blue-700",   icon: <Film      className="w-4 h-4 text-blue-500"   /> },
  image:    { label: "Imagen",    color: "bg-green-100 text-green-700", icon: <ImageIcon className="w-4 h-4 text-green-500"  /> },
  document: { label: "Documento", color: "bg-gray-100 text-gray-600",   icon: <FileText  className="w-4 h-4 text-gray-500"   /> },
  pdf:      { label: "PDF",       color: "bg-red-100 text-red-700",     icon: <FileText  className="w-4 h-4 text-red-500"    /> },
  audio:    { label: "Audio",     color: "bg-purple-100 text-purple-700", icon: <Music   className="w-4 h-4 text-purple-500" /> },
};

function fileIcon(fileType: string) {
  return TYPE_META[fileType]?.icon ?? <File className="w-4 h-4 text-gray-400" />;
}

function typeBadge(fileType: string) {
  const meta = TYPE_META[fileType];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta?.color ?? "bg-gray-100 text-gray-500"}`}>
      {meta?.label ?? fileType}
    </span>
  );
}

const TIPO_FILTERS = [
  { value: "all",      label: "Todos"     },
  { value: "video",    label: "Video"     },
  { value: "pdf",      label: "PDF"       },
  { value: "image",    label: "Imagen"    },
  { value: "document", label: "Documento" },
  { value: "audio",    label: "Audio"     },
];

const TIPOS_ACEPTADOS = [
  "video/*", "application/pdf", "image/*", "audio/*",
  ".doc,.docx,.ppt,.pptx,.xls,.xlsx",
].join(",");
const MAX_MB = 1000;

// ── SectionUploader ────────────────────────────────────────────────────────

interface SectionUploaderProps {
  programaRef: string;
  moduloId?: number | null;
  onSuccess: () => void;
}

function SectionUploader({ programaRef, moduloId, onSuccess }: SectionUploaderProps) {
  const { upload, isUploading, progress, isSuccess, error, reset } = useMaterialUpload();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_MB * 1024 * 1024) {
      setLocalError(`El archivo supera el límite de ${MAX_MB}MB`);
      return;
    }
    setLocalError(null);
    reset();
    setFile(f);
  }, [reset]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    await upload(file, {
      programa: programaRef,
      modulo: moduloId ?? undefined,
    });
    setFile(null);
    onSuccess();
    setTimeout(reset, 2000);
  };

  if (isSuccess)
    return (
      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        <Check className="w-4 h-4" />
        Archivo subido correctamente
      </div>
    );

  return (
    <div className="space-y-3">
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors text-center ${
            dragOver ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
          }`}
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <p className="text-xs text-gray-500">
            Arrastra aquí o <span className="text-purple-600 font-medium">selecciona</span> · Máx. {MAX_MB}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={TIPOS_ACEPTADOS}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {file && (
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800 truncate max-w-[60%]">{file.name}</span>
            <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
          </div>
          {isUploading && (
            <div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-purple-600 mt-1">{progress}%</p>
            </div>
          )}
          {!isUploading && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-purple-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Subir
              </button>
              <button
                type="button"
                onClick={() => { setFile(null); reset(); }}
                className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      {(localError || error) && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {localError || error}
        </div>
      )}
    </div>
  );
}

// ── MaterialRow ────────────────────────────────────────────────────────────

function MaterialRow({
  material,
  onDelete,
  onPreview,
}: {
  material: Material;
  onDelete: (id: number) => void;
  onPreview: (material: Material) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 group">
      <button
        type="button"
        onClick={() => onPreview(material)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
        title={`Ver ${material.original_name}`}
      >
        <span className="shrink-0">{fileIcon(material.file_type)}</span>
        <span className="flex-1 text-sm text-gray-800 truncate min-w-0 group-hover:text-purple-600 group-hover:underline">
          {material.original_name}
        </span>
      </button>
      {typeBadge(material.file_type)}
      <span className="text-xs text-gray-400 shrink-0">{formatBytes(material.size)}</span>

      {confirming ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-red-600">¿Eliminar?</span>
          <button
            type="button"
            onClick={() => onDelete(material.id)}
            className="text-xs px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-xs px-2 py-0.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
          >
            No
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────

export default function DocenteMaterialesView() {
  const { data: programasData, isLoading: loadingProgramas } = useGetMisProgramasDocenteQuery();
  const programas = programasData?.programas ?? [];

  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const activeRef = selectedRef ?? programas[0]?.ref ?? null;

  const [filterTipo, setFilterTipo] = useState("all");
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const [uploadModal, setUploadModal] = useState<{
    modulo: ModuloConMateriales;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState<Material | null>(null);

  const { data: modulos, refetch } = useGetMaterialesProgramaQuery(activeRef!, {
    skip: !activeRef,
  });

  const [deleteMaterial] = useDeleteMaterialMutation();

  const applyFilter = useCallback(
    (materials: Material[]) =>
      filterTipo === "all" ? materials : materials.filter((m) => m.file_type === filterTipo),
    [filterTipo],
  );

  const filteredCount = useMemo(
    () => (modulos ?? []).reduce((sum, mod) => sum + applyFilter(mod.materiales).length, 0),
    [modulos, applyFilter],
  );

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteMaterial(id).unwrap();
      refetch();
      sweetAlert("success", "Material eliminado.", "Listo");
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "Error al eliminar el material.", "Error");
    } finally {
      setDeleting(null);
    }
  };

  // ── Empty / loading states ───────────────────────────────────────────────

  if (loadingProgramas) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (programas.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-gray-100 rounded-xl p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-purple-400" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Sin programas asignados</p>
          <p className="text-sm text-gray-400">Contacta al administrador para que te asigne a un programa.</p>
        </div>
      </div>
    );
  }

  // ── View ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis materiales</h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona los materiales de tus programas asignados</p>
      </div>

      {/* Program selector */}
      {programas.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {programas.map((p) => (
            <button
              key={p.ref}
              type="button"
              onClick={() => {
                setSelectedRef(p.ref);
                setOpenStates({});
              }}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors border ${
                activeRef === p.ref
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              {p.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Active program name (when only one) */}
      {programas.length === 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <span className="font-medium">{programas[0].nombre}</span>
        </div>
      )}

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {TIPO_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilterTipo(f.value)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
              filterTipo === f.value
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="text-xs text-gray-400 self-center ml-auto">
          {filteredCount} archivo{filteredCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Modules + materials */}
      {(modulos ?? []).map((modulo, i) => {
        const k = String(modulo.modulo_id ?? "general");
        const isOpen = openStates[k] ?? i === 0;
        const materials = applyFilter(modulo.materiales);
        const label = modulo.modulo_nombre ?? "General";

        return (
          <div key={k} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpenStates((p) => ({ ...p, [k]: !isOpen }))}
                className="flex items-center gap-2 flex-1 text-left"
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <FolderOpen className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-700">
                  {modulo.modulo_id ? `Módulo ${i + 1}: ` : ""}{label}
                </span>
                <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5 ml-1">
                  {materials.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setUploadModal({ modulo })}
                className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir
              </button>
            </div>

            {isOpen && (
              <div>
                {materials.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    Sin materiales en esta sección
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {materials.map((m) => (
                      <MaterialRow
                        key={m.id}
                        material={m}
                        onDelete={handleDelete}
                        onPreview={setPreviewing}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {deleting !== null && <div className="fixed inset-0 bg-black/10 pointer-events-none" />}

      {/* Upload modal */}
      <Modal show={uploadModal !== null} onClose={() => setUploadModal(null)} maxWidth="md">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Subir material</h3>
              {uploadModal && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {uploadModal.modulo.modulo_nombre ?? "General"}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setUploadModal(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {uploadModal && activeRef && (
            <SectionUploader
              programaRef={activeRef}
              moduloId={uploadModal.modulo.modulo_id}
              onSuccess={() => { refetch(); setUploadModal(null); }}
            />
          )}
        </div>
      </Modal>

      {previewing && (
        <MaterialPreviewModal
          material={previewing}
          programaId={activeRef ?? undefined}
          onClose={() => setPreviewing(null)}
          hideVideoDownload
        />
      )}
    </div>
  );
}