"use client";

import { useState } from "react";
import {
  useGetEnlacesClaseQuery,
  useCreateEnlaceClaseMutation,
  useUpdateEnlaceClaseMutation,
  useDeleteEnlaceClaseMutation,
} from "@/redux/features/control-escolar/comunidadApiSlice";
import { type EnlaceClase } from "@/redux/features/types/control-escolar/type";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import {
  Video,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Form ──────────────────────────────────────────────────────────────────

interface FormValues {
  titulo: string;
  link: string;
  fecha_imparticion: string;
  descripcion: string;
  password_platform: string;
}

const emptyForm: FormValues = {
  titulo: "",
  link: "",
  fecha_imparticion: "",
  descripcion: "",
  password_platform: "",
};

function toLocalDatetime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface EnlaceFormProps {
  programaId: string;
  initial?: EnlaceClase;
  onSuccess: () => void;
  onCancel: () => void;
}

function EnlaceForm({ programaId, initial, onSuccess, onCancel }: EnlaceFormProps) {
  const dispatch = useAppDispatch();
  const [create] = useCreateEnlaceClaseMutation();
  const [update] = useUpdateEnlaceClaseMutation();
  const [saving, setSaving] = useState(false);

  const [values, setValues] = useState<FormValues>(
    initial
      ? {
          titulo: initial.titulo,
          link: initial.link,
          fecha_imparticion: toLocalDatetime(initial.fecha_imparticion),
          descripcion: initial.descripcion ?? "",
          password_platform: initial.password_platform ?? "",
        }
      : emptyForm,
  );

  const set = (field: keyof FormValues, val: string) =>
    setValues((v) => ({ ...v, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.titulo || !values.link || !values.fecha_imparticion) return;
    setSaving(true);
    try {
      const body = {
        programa: programaId,
        titulo: values.titulo,
        link: values.link,
        fecha_imparticion: new Date(values.fecha_imparticion).toISOString(),
        descripcion: values.descripcion || null,
        password_platform: values.password_platform || null,
      };
      if (initial) {
        await update({ id: initial.id, ...body }).unwrap();
        dispatch(setAlert({ type: "success", message: "Enlace actualizado" }));
      } else {
        await create(body).unwrap();
        dispatch(setAlert({ type: "success", message: "Enlace creado" }));
      }
      onSuccess();
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al guardar el enlace" }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
      <p className="text-sm font-semibold text-blue-800">
        {initial ? "Editar enlace" : "Nueva clase en vivo"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Título *</label>
          <input
            type="text"
            value={values.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            required
            placeholder="Ej. Clase 1 — Módulo Nutrición"
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Fecha y hora *</label>
          <input
            type="datetime-local"
            value={values.fecha_imparticion}
            onChange={(e) => set("fecha_imparticion", e.target.value)}
            required
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">Enlace de acceso *</label>
          <input
            type="url"
            value={values.link}
            onChange={(e) => set("link", e.target.value)}
            required
            placeholder="https://zoom.us/j/..."
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Contraseña (opcional)</label>
          <input
            type="text"
            value={values.password_platform}
            onChange={(e) => set("password_platform", e.target.value)}
            placeholder="Password de la sala"
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Descripción (opcional)</label>
          <input
            type="text"
            value={values.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            placeholder="Tema a tratar..."
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          {initial ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

function EnlaceRow({
  enlace,
  programaId,
  onRefetch,
}: {
  enlace: EnlaceClase;
  programaId: string;
  onRefetch: () => void;
}) {
  const dispatch = useAppDispatch();
  const [deleteEnlace] = useDeleteEnlaceClaseMutation();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEnlace(enlace.id).unwrap();
      onRefetch();
      dispatch(setAlert({ type: "success", message: "Enlace eliminado" }));
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al eliminar el enlace" }));
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (editing)
    return (
      <div className="px-4 py-3">
        <EnlaceForm
          programaId={programaId}
          initial={enlace}
          onSuccess={() => { setEditing(false); onRefetch(); }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 group">
      <Video className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{enlace.titulo}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-gray-400">{formatFecha(enlace.fecha_imparticion)}</span>
          {enlace.plataforma_detail && (
            <span className="text-xs text-gray-400">· {enlace.plataforma_detail.nombre}</span>
          )}
          {enlace.password_platform && (
            <span className="text-xs text-gray-400">· 🔒 {enlace.password_platform}</span>
          )}
        </div>
        {enlace.descripcion && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{enlace.descripcion}</p>
        )}
      </div>
      <a
        href={enlace.link}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {confirming ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-600">¿Eliminar?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
            >
              Sí
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-xs px-2 py-0.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

interface Props {
  programaId: string;
}

export default function ProgramEnlacesTab({ programaId }: Props) {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, refetch } = useGetEnlacesClaseQuery({ programa: programaId });

  const enlaces = data?.results ?? [];

  if (isLoading)
    return (
      <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Cargando clases...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {enlaces.length} clase{enlaces.length !== 1 ? "s" : ""} programada{enlaces.length !== 1 ? "s" : ""}
        </p>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva clase
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <EnlaceForm
          programaId={programaId}
          onSuccess={() => { setShowForm(false); refetch(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {enlaces.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            No hay clases en vivo registradas para este programa.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enlaces.map((e) => (
              <EnlaceRow key={e.id} enlace={e} programaId={programaId} onRefetch={refetch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}