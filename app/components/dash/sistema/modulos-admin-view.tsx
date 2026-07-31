"use client";

import { useState, useCallback } from "react";
import {
  useGetModulosAdminQuery,
  useCreateModuloMutation,
  useUpdateModuloMutation,
  useDeleteModuloMutation,
  ModuloAdmin,
} from "@/redux/features/sistema/modulosAdminApiSlice";
import { useGetPermisosQuery } from "@/redux/features/auth/permisosApiSlice";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  Plus,
  Save,
  Trash2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Shield,
  Search,
  X,
  Layers,
  Link2,
  Hash,
  Lock,
  CheckSquare,
  Square,
  AlertCircle,
  LayoutDashboard,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Swal from "sweetalert2";

// ── Types ──────────────────────────────────────────────────────────────────

interface TabForm {
  id?: number;
  nombre: string;
  href: string;
  orden: number;
  permisos_ids: number[];
}

interface ModuloForm {
  nombre: string;
  href: string;
  orden: number;
  status: number;
  permisos_ids: number[];
  tabs: TabForm[];
}

// ── Utils ──────────────────────────────────────────────────────────────────

function emptyTab(orden: number): TabForm {
  return { nombre: "", href: "", orden, permisos_ids: [] };
}

function emptyForm(): ModuloForm {
  return { nombre: "", href: "", orden: 1, status: 1, permisos_ids: [], tabs: [] };
}

function formFromModulo(m: ModuloAdmin): ModuloForm {
  return {
    nombre: m.nombre,
    href: m.href,
    orden: m.orden,
    status: m.status ?? 1,
    permisos_ids: m.permisos_ids ?? [],
    tabs: m.pestanias.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      href: p.href,
      orden: p.orden,
      permisos_ids: p.permisos_ids,
    })),
  };
}

// ── PermisoPicker ──────────────────────────────────────────────────────────

function PermisoPicker({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetPermisosQuery({ q, page });
  const permisos = data?.results ?? [];
  const total = data?.count ?? 0;
  const hasPrev = !!data?.previous;
  const hasNext = !!data?.next;

  const toggle = (id: number) =>
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );

  const handleSearch = (value: string) => {
    setQ(value);
    setPage(1);
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Search */}
      <div className="p-2.5 border-b border-gray-100 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors"
            placeholder="Buscar por nombre, modelo o codename..."
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Cargando permisos...</span>
          </div>
        ) : permisos.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            Sin resultados{q ? ` para "${q}"` : ""}
          </p>
        ) : (
          permisos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                selected.includes(p.id) ? "bg-[#F0F6FF]" : "hover:bg-gray-50"
              }`}
            >
              {selected.includes(p.id) ? (
                <CheckSquare className="w-4 h-4 text-[#0056D2] shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-gray-300 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {p.name}
                </p>
                <p className="text-[11px] text-gray-400 font-mono truncate">
                  {p.content_type_detail.app_label}.
                  {p.content_type_detail.model} · {p.codename}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      {(hasPrev || hasNext) && (
        <div className="px-3.5 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrev || isFetching}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Anterior
          </button>
          <span className="text-xs text-gray-500">
            Pág. <span className="font-semibold text-gray-700">{page}</span>
            {total > 0 && <> · {total} total</>}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext || isFetching}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer: selected count */}
      <div className="px-3.5 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        {selected.length > 0 ? (
          <>
            <span className="text-xs text-[#0056D2] font-semibold">
              {selected.length} permiso{selected.length !== 1 ? "s" : ""}{" "}
              seleccionado{selected.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Quitar todos
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-400">
            Ningún permiso seleccionado
          </span>
        )}
      </div>
    </div>
  );
}

// ── TabRow ─────────────────────────────────────────────────────────────────
// Rediseñado: layout vertical en card, evita que inputs se oculten entre sí

function TabRow({
  tab,
  idx,
  onChange,
  onRemove,
  canRemove,
  hasError,
}: {
  tab: TabForm;
  idx: number;
  onChange: (t: TabForm) => void;
  onRemove: () => void;
  canRemove: boolean;
  hasError?: boolean;
}) {
  const [showPermisos, setShowPermisos] = useState(false);

  const inputBase =
    "w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-1 transition-colors";
  const inputNormal = `${inputBase} border-gray-200 focus:border-[#0056D2] focus:ring-[#0056D2]`;
  const inputError = `${inputBase} border-red-300 focus:border-red-400 focus:ring-red-200`;

  return (
    <div
      className={`rounded-xl border overflow-hidden shadow-sm ${
        hasError ? "border-red-200" : "border-gray-200"
      }`}
    >
      {/* ── Card header ── */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border-b border-gray-100">
        {/* Tab number badge */}
        <span className="w-6 h-6 rounded-lg bg-[#0056D2]/10 text-[#0056D2] text-xs font-bold flex items-center justify-center shrink-0 select-none">
          {idx + 1}
        </span>

        {/* Name — full width */}
        <input
          className={`flex-1 min-w-0 ${!tab.nombre && hasError ? inputError : inputNormal}`}
          placeholder="Nombre de la pestaña *"
          value={tab.nombre}
          onChange={(e) => onChange({ ...tab, nombre: e.target.value })}
        />

        {/* Permisos toggle */}
        <button
          type="button"
          onClick={() => setShowPermisos((v) => !v)}
          title="Configurar permisos"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
            showPermisos
              ? "bg-[#0056D2] text-white border-[#0056D2]"
              : tab.permisos_ids.length > 0
                ? "bg-[#F0F6FF] text-[#0056D2] border-[#0056D2]/30"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#0056D2]/40 hover:text-[#0056D2]"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          {tab.permisos_ids.length > 0 && (
            <span className="font-bold">{tab.permisos_ids.length}</span>
          )}
          {showPermisos ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>

        {/* Delete */}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Eliminar pestaña"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Card body: href + orden ── */}
      <div className="px-3 py-3 bg-white grid grid-cols-[1fr,90px] gap-3">
        {/* Href */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            Ruta (href) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono select-none pointer-events-none">
              /
            </span>
            <input
              className={`${!tab.href && hasError ? inputError : inputNormal} pl-6 font-mono text-sm`}
              placeholder="ruta"
              value={tab.href.replace(/^\//, "")}
              onChange={(e) =>
                onChange({ ...tab, href: `/${e.target.value}` })
              }
            />
          </div>
        </div>

        {/* Orden */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Hash className="w-3 h-3" />
            Orden
          </label>
          <input
            type="number"
            className={`${inputNormal} text-center`}
            placeholder="1"
            min={1}
            value={tab.orden}
            onChange={(e) =>
              onChange({ ...tab, orden: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* ── Permisos expandable ── */}
      {showPermisos && (
        <div className="px-3 pb-3 bg-white border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 pt-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Permisos requeridos para esta pestaña
          </p>
          <PermisoPicker
            selected={tab.permisos_ids}
            onChange={(ids) => onChange({ ...tab, permisos_ids: ids })}
          />
        </div>
      )}
    </div>
  );
}

// ── ModuloEditor ───────────────────────────────────────────────────────────

function ModuloEditor({
  initial,
  editingId,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: ModuloForm;
  editingId: number | null;
  onSave: (form: ModuloForm) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<ModuloForm>(initial);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    nombre: !form.nombre.trim(),
    href: !form.href.trim(),
    tabs: form.tabs.map((t) => ({
      nombre: !t.nombre.trim(),
      href: !t.href.trim(),
    })),
  };

  const hasErrors = errors.nombre || errors.href;

  const updateTab = useCallback(
    (idx: number, tab: TabForm) =>
      setForm((f) => {
        const tabs = [...f.tabs];
        tabs[idx] = tab;
        return { ...f, tabs };
      }),
    [],
  );

  const removeTab = useCallback(
    (idx: number) =>
      setForm((f) => ({ ...f, tabs: f.tabs.filter((_, i) => i !== idx) })),
    [],
  );

  const addTab = () =>
    setForm((f) => ({
      ...f,
      tabs: [...f.tabs, emptyTab(f.tabs.length + 1)],
    }));

  const handleSave = async () => {
    setSubmitted(true);
    if (hasErrors) return;
    await onSave(form);
  };

  const inputCls =
    "w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 transition-colors bg-white";
  const inputNormal = `${inputCls} border-gray-200 focus:border-[#0056D2] focus:ring-[#0056D2]`;
  const inputError = `${inputCls} border-red-300 focus:border-red-400 focus:ring-red-200`;

  return (
    <div className="space-y-5">
      {/* ── Editor header ── */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {editingId ? "Editar módulo" : "Nuevo módulo"}
          </h2>
          {editingId && (
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              ID: {editingId}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-3.5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-xl hover:bg-[#004BB5] transition-colors disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {submitted && hasErrors && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Completa los campos obligatorios antes de guardar.
        </div>
      )}

      {/* ── Module fields ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" />
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Datos del módulo
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Nombre + Status toggle */}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                className={submitted && errors.nombre ? inputError : inputNormal}
                placeholder="Ej. CRM"
                value={form.nombre}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nombre: e.target.value }))
                }
              />
            </div>
            {/* Status toggle */}
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, status: f.status === 1 ? 0 : 1 }))
              }
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors shrink-0 ${
                form.status === 1
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-gray-100 border-gray-200 text-gray-400"
              }`}
              title={form.status === 1 ? "Módulo activo — clic para desactivar" : "Módulo inactivo — clic para activar"}
            >
              {form.status === 1 ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
              {form.status === 1 ? "Activo" : "Inactivo"}
            </button>
          </div>

          {/* Href + Orden — side by side */}
          <div className="grid grid-cols-[1fr,100px] gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Ruta (href) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  className={`${submitted && errors.href ? inputError : inputNormal} pl-9 font-mono`}
                  placeholder="/dashboard/crm"
                  value={form.href}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, href: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Orden
              </label>
              <input
                type="number"
                min={1}
                className={`${inputNormal} text-center`}
                value={form.orden}
                onChange={(e) =>
                  setForm((f) => ({ ...f, orden: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* Permisos del módulo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Permisos del módulo
              <span className="text-gray-400 font-normal">(para módulos sin pestañas)</span>
            </label>
            <PermisoPicker
              selected={form.permisos_ids}
              onChange={(ids) => setForm((f) => ({ ...f, permisos_ids: ids }))}
            />
          </div>
        </div>
      </div>

      {/* ── Tabs section ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pestañas
              <span className="ml-1.5 px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-md font-mono">
                {form.tabs.length}
              </span>
            </h3>
          </div>
          <button
            type="button"
            onClick={addTab}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] border border-[#0056D2]/30 rounded-lg bg-[#F0F6FF] hover:bg-[#E5EFFC] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir pestaña
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            Las pestañas son opcionales. Haz clic en el escudo para configurar permisos.
          </p>

          {form.tabs.map((tab, idx) => (
            <TabRow
              key={tab.id ?? `new-${idx}`}
              tab={tab}
              idx={idx}
              onChange={(t) => updateTab(idx, t)}
              onRemove={() => removeTab(idx)}
              canRemove={true}
              hasError={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ModuleCard ─────────────────────────────────────────────────────────────

function ModuleCard({
  modulo,
  isActive,
  onSelect,
  onDelete,
}: {
  modulo: ModuloAdmin;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const totalPermisos = modulo.pestanias.reduce(
    (acc, p) => acc + p.permisos_ids.length,
    0,
  );

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl border p-4 cursor-pointer transition-all ${
        isActive
          ? "border-[#0056D2] bg-[#F0F6FF] shadow-sm"
          : "border-gray-200 bg-white hover:border-[#0056D2]/40 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {modulo.nombre}
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md font-mono shrink-0">
              #{modulo.orden}
            </span>
            {modulo.status === 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-500 uppercase tracking-wide shrink-0">
                Inactivo
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
            {modulo.href}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
          title="Eliminar módulo"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
        {modulo.pestanias.length === 0 ? (
          <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
            Módulo plano (sin pestañas)
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Layers className="w-3 h-3" />
            {modulo.pestanias.length}{" "}
            {modulo.pestanias.length === 1 ? "pestaña" : "pestañas"}
          </span>
        )}
        {totalPermisos > 0 && (
          <span className="flex items-center gap-1 text-xs text-[#0056D2]/70">
            <Shield className="w-3 h-3" />
            {totalPermisos} permisos en tabs
          </span>
        )}
        {(modulo.permisos_ids?.length ?? 0) > 0 && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <Shield className="w-3 h-3" />
            {modulo.permisos_ids.length} permisos propios
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────

type PanelMode = "idle" | "create" | "edit";

export default function ModulosAdminView() {
  const { data: verify } = useVerifyUserQuery();
  const isSuperUser = verify?.superuser === true;

  const {
    data: modulosData,
    isLoading,
    refetch,
  } = useGetModulosAdminQuery();
  const modulos = modulosData?.results ?? [];

  const [createModulo, { isLoading: isCreating }] = useCreateModuloMutation();
  const [updateModulo, { isLoading: isUpdating }] = useUpdateModuloMutation();
  const [deleteModulo] = useDeleteModuloMutation();

  const isSaving = isCreating || isUpdating;

  const [mode, setMode] = useState<PanelMode>("idle");
  const [editingModulo, setEditingModulo] = useState<ModuloAdmin | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  const openCreate = () => {
    setEditingModulo(null);
    setMode("create");
    setEditorKey((k) => k + 1);
  };

  const openEdit = (m: ModuloAdmin) => {
    setEditingModulo(m);
    setMode("edit");
    setEditorKey((k) => k + 1);
  };

  const closePanel = () => {
    setMode("idle");
    setEditingModulo(null);
  };

  const handleSave = async (form: ModuloForm) => {
    try {
      const payload = {
        nombre: form.nombre,
        href: form.href,
        orden: form.orden,
        status: form.status,
        permisos_ids: form.permisos_ids,
        pestanias: form.tabs.map((t) => ({
          ...(t.id !== undefined ? { id: t.id } : {}),
          nombre: t.nombre,
          href: t.href,
          orden: t.orden,
          permisos_ids: t.permisos_ids,
        })),
      };

      if (mode === "create") {
        await createModulo(payload).unwrap();
      } else if (editingModulo) {
        await updateModulo({ id: editingModulo.id, body: payload }).unwrap();
      }

      await refetch();
      closePanel();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Verifica los datos e intenta de nuevo.",
        confirmButtonColor: "#0056D2",
      });
    }
  };

  const handleDelete = async (m: ModuloAdmin) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `¿Eliminar "${m.nombre}"?`,
      text: "Se eliminarán todas sus pestañas y configuración de permisos. Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteModulo(m.id).unwrap();
      if (editingModulo?.id === m.id) closePanel();
      await refetch();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar el módulo",
        confirmButtonColor: "#0056D2",
      });
    }
  };

  if (verify !== undefined && !isSuperUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <Lock className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Acceso restringido
        </h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Solo los administradores del sistema pueden gestionar módulos y
          permisos.
        </p>
      </div>
    );
  }

  const sorted = [...modulos].sort((a, b) => a.orden - b.orden);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0056D2]/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Módulos y permisos
            </h1>
            <p className="text-sm text-gray-400">
              Gestiona los módulos del sistema, sus pestañas y permisos de acceso.
            </p>
          </div>
        </div>
      </div>

      {/* ── Split layout — paneles con scroll propio, sin sticky ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Left: lista de módulos (ancho fijo, scroll propio) ── */}
        <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-3">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-xl hover:bg-[#004BB5] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo módulo
          </button>

          {/* Lista con max-height para scroll propio */}
          <div className="max-h-[72vh] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Sin módulos creados</p>
                <p className="text-xs text-gray-300 mt-1">
                  Crea el primero con el botón de arriba
                </p>
              </div>
            ) : (
              <div className="space-y-2 pb-4">
                {sorted.map((m) => (
                  <ModuleCard
                    key={m.id}
                    modulo={m}
                    isActive={editingModulo?.id === m.id}
                    onSelect={() => openEdit(m)}
                    onDelete={() => handleDelete(m)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: editor (flujo normal, crece con el contenido) ── */}
        <div className="flex-1 min-w-0">
          {mode === "idle" ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <Layers className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Selecciona un módulo para editar
              </p>
              <p className="text-xs text-gray-400 mt-1">
                o crea uno nuevo con el botón de la izquierda
              </p>
            </div>
          ) : (
            <ModuloEditor
              key={editorKey}
              initial={
                mode === "edit" && editingModulo
                  ? formFromModulo(editingModulo)
                  : emptyForm()
              }
              editingId={editingModulo?.id ?? null}
              onSave={handleSave}
              onCancel={closePanel}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}