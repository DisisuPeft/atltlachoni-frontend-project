"use client";

import { useState } from "react";
import {
  useGetCampaniaAnunciosMetaQuery,
  useCreateCampaniaAnuncioMetaMutation,
  useUpdateCampaniaAnuncioMetaMutation,
  useDeleteCampaniaAnuncioMetaMutation,
} from "@/redux/features/control-escolar/campaniasApiSlice";
import type {
  CampaniaAnuncioMeta,
  NivelAnuncioMeta,
  PresupuestoTipoAnuncioMeta,
} from "@/redux/features/types/control-escolar/type";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { getApiErrorMessage } from "@/redux/utils/api-error";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────

const nivelLabel: Record<NivelAnuncioMeta, string> = {
  campaign: "Campaña",
  adset: "Conjunto de anuncios",
  ad: "Anuncio",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const inputClass =
  "px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056D2] bg-white";

// ── Form (crear / editar) ───────────────────────────────────────────

interface FormValues {
  identificador: string;
  nivel: NivelAnuncioMeta;
  presupuesto_monto: string;
  presupuesto_tipo: PresupuestoTipoAnuncioMeta | "";
  status: boolean;
}

const emptyForm: FormValues = {
  identificador: "",
  nivel: "ad",
  presupuesto_monto: "",
  presupuesto_tipo: "",
  status: true,
};

interface AnuncioFormProps {
  campaniaId: number;
  initial?: CampaniaAnuncioMeta;
  onSuccess: () => void;
  onCancel: () => void;
}

function AnuncioForm({
  campaniaId,
  initial,
  onSuccess,
  onCancel,
}: AnuncioFormProps) {
  const dispatch = useAppDispatch();
  const [create] = useCreateCampaniaAnuncioMetaMutation();
  const [update] = useUpdateCampaniaAnuncioMetaMutation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState<FormValues>(
    initial
      ? {
          identificador: initial.identificador,
          nivel: initial.nivel,
          presupuesto_monto: initial.presupuesto_monto ?? "",
          presupuesto_tipo: initial.presupuesto_tipo ?? "",
          status: initial.status === 1,
        }
      : emptyForm,
  );

  const set = <K extends keyof FormValues>(field: K, val: FormValues[K]) =>
    setValues((v) => ({ ...v, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.identificador.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const body = {
        campania: campaniaId,
        identificador: values.identificador.trim(),
        nivel: values.nivel,
        presupuesto_monto: values.presupuesto_monto
          ? Number(values.presupuesto_monto)
          : null,
        presupuesto_tipo: values.presupuesto_tipo || null,
        status: values.status ? 1 : 0,
      };
      if (initial) {
        await update({ id: initial.id, ...body }).unwrap();
        dispatch(
          setAlert({ type: "success", message: "Configuración actualizada" }),
        );
      } else {
        await create(body).unwrap();
        dispatch(
          setAlert({ type: "success", message: "Anuncio vinculado" }),
        );
      }
      onSuccess();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "No se pudo guardar la configuración."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#0056D2]/20 rounded-lg p-4 bg-[#F0F6FF] space-y-3"
    >
      <p className="text-sm font-semibold text-[#0056D2]">
        {initial ? "Editar configuración" : "Vincular anuncio de Meta Ads"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">
            Identificador (Meta Ads) *
          </label>
          <input
            type="text"
            value={values.identificador}
            onChange={(e) => set("identificador", e.target.value)}
            required
            placeholder="Ej. 120249485683410115"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Nivel</label>
          <select
            value={values.nivel}
            onChange={(e) => set("nivel", e.target.value as NivelAnuncioMeta)}
            className={inputClass}
          >
            <option value="ad">Anuncio</option>
            <option value="adset">Conjunto de anuncios</option>
            <option value="campaign">Campaña</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            Presupuesto (opcional)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.presupuesto_monto}
            onChange={(e) => set("presupuesto_monto", e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            Tipo de presupuesto
          </label>
          <select
            value={values.presupuesto_tipo}
            onChange={(e) =>
              set(
                "presupuesto_tipo",
                e.target.value as PresupuestoTipoAnuncioMeta | "",
              )
            }
            className={inputClass}
          >
            <option value="">Sin especificar</option>
            <option value="diario">Diario</option>
            <option value="total">Total</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.status}
            onChange={(e) => set("status", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#0056D2] focus:ring-[#0056D2]"
          />
          Activo (se usa para resolver leads nuevos)
        </label>
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          {error}
        </p>
      )}

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
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[#0056D2] text-white rounded-lg hover:bg-[#004BB5] disabled:opacity-60 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          {initial ? "Actualizar" : "Vincular"}
        </button>
      </div>
    </form>
  );
}

// ── Row ──────────────────────────────────────────────────────────────

function AnuncioRow({
  anuncio,
  campaniaId,
  onRefetch,
}: {
  anuncio: CampaniaAnuncioMeta;
  campaniaId: number;
  onRefetch: () => void;
}) {
  const dispatch = useAppDispatch();
  const [deleteAnuncio, { isLoading: deleting }] =
    useDeleteCampaniaAnuncioMetaMutation();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAnuncio(anuncio.id).unwrap();
      onRefetch();
      dispatch(setAlert({ type: "success", message: "Anuncio desvinculado" }));
    } catch (err) {
      dispatch(
        setAlert({
          type: "error",
          message: getApiErrorMessage(err, "No se pudo desvincular el anuncio."),
        }),
      );
    } finally {
      setConfirming(false);
    }
  };

  if (editing)
    return (
      <div className="px-4 py-3">
        <AnuncioForm
          campaniaId={campaniaId}
          initial={anuncio}
          onSuccess={() => {
            setEditing(false);
            onRefetch();
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 group">
      <Megaphone className="w-4 h-4 mt-0.5 shrink-0 text-[#0056D2]" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {anuncio.identificador}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
            {nivelLabel[anuncio.nivel]}
          </span>
          {anuncio.presupuesto_monto && (
            <span className="text-xs text-gray-400">
              · ${Number(anuncio.presupuesto_monto).toLocaleString("es-MX")}
              {anuncio.presupuesto_tipo === "diario" ? "/día" : ""}
            </span>
          )}
          <span className="text-xs text-gray-400">
            · desde {formatFecha(anuncio.created_at)}
          </span>
        </div>
      </div>
      <span
        className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
          anuncio.status === 1
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {anuncio.status === 1 ? "Activo" : "Inactivo"}
      </span>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="p-1.5 rounded text-gray-400 hover:text-[#0056D2] hover:bg-[#F0F6FF] transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {confirming ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-600">¿Quitar?</span>
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

// ── Main ─────────────────────────────────────────────────────────────

interface Props {
  campaniaId: number;
}

export default function CampaniaAnunciosMetaTab({ campaniaId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, refetch } = useGetCampaniaAnunciosMetaQuery({
    campania: campaniaId,
  });

  const anuncios = data?.results ?? [];

  if (isLoading)
    return (
      <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Cargando anuncios vinculados...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            {anuncios.length} anuncio{anuncios.length !== 1 ? "s" : ""} de Meta
            Ads vinculado{anuncios.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Los leads que entren por WhatsApp desde uno de estos anuncios se
            asignan automáticamente a esta campaña. No aplica retroactivo a
            leads ya existentes.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#0056D2] text-white rounded-lg hover:bg-[#004BB5] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Vincular anuncio
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <AnuncioForm
          campaniaId={campaniaId}
          onSuccess={() => {
            setShowForm(false);
            refetch();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {anuncios.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Sin anuncios de Meta Ads vinculados a esta campaña.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {anuncios.map((a) => (
              <AnuncioRow
                key={a.id}
                anuncio={a}
                campaniaId={campaniaId}
                onRefetch={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
