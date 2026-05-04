"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  useGetMaterialesProgramaQuery,
  useDeleteMaterialMutation,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { useMaterialUpload } from "@/hooks";
import {
  type ModuloEducativoForm,
  type Material,
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
  Loader2,
  FolderOpen,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const TYPE_META: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  video: {
    label: "Video",
    color: "bg-blue-100 text-blue-700",
    icon: <Film className="w-4 h-4 text-blue-500" />,
  },
  image: {
    label: "Imagen",
    color: "bg-green-100 text-green-700",
    icon: <ImageIcon className="w-4 h-4 text-green-500" />,
  },
  document: {
    label: "Documento",
    color: "bg-gray-100 text-gray-600",
    icon: <FileText className="w-4 h-4 text-gray-500" />,
  },
  pdf: {
    label: "PDF",
    color: "bg-red-100 text-red-700",
    icon: <FileText className="w-4 h-4 text-red-500" />,
  },
  audio: {
    label: "Audio",
    color: "bg-purple-100 text-purple-700",
    icon: <Music className="w-4 h-4 text-purple-500" />,
  },
};

function fileIcon(fileType: string) {
  return TYPE_META[fileType]?.icon ?? <File className="w-4 h-4 text-gray-400" />;
}
function typeBadge(fileType: string) {
  const meta = TYPE_META[fileType];
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        meta?.color ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {meta?.label ?? fileType}
    </span>
  );
}

// ── Inline uploader per section ────────────────────────────────────────────

const TIPOS_ACEPTADOS = [
  "video/*",
  "application/pdf",
  "image/*",
  "audio/*",
  ".doc,.docx,.ppt,.pptx,.xls,.xlsx",
].join(",");
const MAX_MB = 500;

interface SectionUploaderProps {
  programaId: string;
  moduloId?: number;
  onSuccess: () => void;
}

function SectionUploader({ programaId, moduloId, onSuccess }: SectionUploaderProps) {
  const { upload, isUploading, progress, isSuccess, error, reset } =
    useMaterialUpload();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (f.size > MAX_MB * 1024 * 1024) {
        setLocalError(`El archivo supera el límite de ${MAX_MB}MB`);
        return;
      }
      setLocalError(null);
      reset();
      setFile(f);
    },
    [reset],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    await upload(file, {
      programa: programaId,
      modulo: moduloId,
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
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <p className="text-xs text-gray-500">
            Arrastra aquí o <span className="text-blue-600 font-medium">selecciona</span> · Máx. {MAX_MB}MB
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
            <span className="text-sm font-medium text-gray-800 truncate max-w-[60%]">
              {file.name}
            </span>
            <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
          </div>
          {isUploading && (
            <div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-1">{progress}%</p>
            </div>
          )}
          {!isUploading && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
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

// ── Material row ───────────────────────────────────────────────────────────

function MaterialRow({
  material,
  onDelete,
}: {
  material: Material;
  onDelete: (id: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 group">
      <span className="shrink-0">{fileIcon(material.file_type)}</span>
      <span className="flex-1 text-sm text-gray-800 truncate min-w-0">
        {material.original_name}
      </span>
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

// ── Section accordion ──────────────────────────────────────────────────────

function MaterialSection({
  title,
  materials,
  programaId,
  moduloId,
  onDelete,
  onUploadSuccess,
  defaultOpen = true,
}: {
  title: string;
  materials: Material[];
  programaId: string;
  moduloId?: number;
  onDelete: (id: number) => void;
  onUploadSuccess: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          {open ? (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          )}
          <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5 ml-1">
            {materials.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => { setOpen(true); setUploading((u) => !u); }}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          Subir
        </button>
      </div>

      {open && (
        <div>
          {/* Uploader */}
          {uploading && (
            <div className="px-4 pt-3 pb-1">
              <SectionUploader
                programaId={programaId}
                moduloId={moduloId}
                onSuccess={() => { setUploading(false); onUploadSuccess(); }}
              />
            </div>
          )}

          {/* Material list */}
          {materials.length === 0 && !uploading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Sin materiales en esta sección
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {materials.map((m) => (
                <MaterialRow key={m.id} material={m} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

const TIPO_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "image", label: "Imagen" },
  { value: "document", label: "Documento" },
  { value: "audio", label: "Audio" },
];

interface Props {
  programaId: string;
  modulos: ModuloEducativoForm[];
}

export default function ProgramMaterialesTab({ programaId, modulos }: Props) {
  const dispatch = useAppDispatch();
  const [filterTipo, setFilterTipo] = useState("all");
  const [deleting, setDeleting] = useState<number | null>(null);

  const {
    data: materialesData,
    isLoading,
    refetch,
  } = useGetMaterialesProgramaQuery(programaId);

  const [deleteMaterial] = useDeleteMaterialMutation();

  const allMateriales = materialesData?.results ?? [];

  const filtered = useMemo(
    () =>
      filterTipo === "all"
        ? allMateriales
        : allMateriales.filter((m) => m.file_type === filterTipo),
    [allMateriales, filterTipo],
  );

  // Group by modulo_id: null → "programa", number → module key
  const grouped = useMemo(() => {
    const map: Record<string, Material[]> = { programa: [] };
    modulos.forEach((m) => { if (m.id) map[String(m.id)] = []; });
    filtered.forEach((m) => {
      const key = m.modulo !== null ? String(m.modulo) : "programa";
      if (!map[key]) map[key] = [];
      map[key].push(m);
    });
    return map;
  }, [filtered, modulos]);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteMaterial(id).unwrap();
      refetch();
      dispatch(setAlert({ type: "success", message: "Material eliminado" }));
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al eliminar el material" }));
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading)
    return (
      <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Cargando materiales...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {TIPO_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilterTipo(f.value)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
              filterTipo === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="text-xs text-gray-400 self-center ml-auto">
          {filtered.length} archivo{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Section: program-level (bienvenida) */}
      <MaterialSection
        title="Bienvenida / Generales"
        materials={grouped["programa"] ?? []}
        programaId={programaId}
        onDelete={handleDelete}
        onUploadSuccess={refetch}
        defaultOpen
      />

      {/* Section per module */}
      {modulos.map((modulo, i) => (
        <MaterialSection
          key={modulo.id ?? i}
          title={modulo.nombre ? `Módulo ${i + 1}: ${modulo.nombre}` : `Módulo ${i + 1}`}
          materials={grouped[String(modulo.id)] ?? []}
          programaId={programaId}
          moduloId={modulo.id as number | undefined}
          onDelete={handleDelete}
          onUploadSuccess={refetch}
          defaultOpen={i === 0}
        />
      ))}

      {deleting !== null && (
        <div className="fixed inset-0 bg-black/10 pointer-events-none" />
      )}
    </div>
  );
}