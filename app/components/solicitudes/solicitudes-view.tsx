"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  useGetSolicitudesQuery,
  useCambiarEstadoSolicitudMutation,
  useDeleteSolicitudMutation,
} from "@/redux/features/solicitudes/solicitudesApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import type { EstadoSolicitud, Solicitud, SolicitudArchivo } from "@/redux/features/types/solicitudes/types";
import { Modal } from "../common/modal";
import {
  Inbox,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Paperclip,
  Trash2,
  X,
  Loader2,
  User,
  Tag,
  Building2,
  Eye,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";
import Swal from "sweetalert2";

const PAGE_SIZE = 12;

// ── Estado helpers ────────────────────────────────────────────────────

const ESTADOS: { value: EstadoSolicitud | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "nuevo", label: "Nuevo" },
  { value: "seguimiento", label: "En seguimiento" },
  { value: "resuelto", label: "Resuelto" },
];

const estadoBadge: Record<
  EstadoSolicitud,
  { label: string; className: string }
> = {
  nuevo: {
    label: "Nuevo",
    className:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  seguimiento: {
    label: "En seguimiento",
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  resuelto: {
    label: "Resuelto",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
};

function EstadoBadge({ estado }: { estado: EstadoSolicitud }) {
  const { label, className } = estadoBadge[estado] ?? estadoBadge.nuevo;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

// ── Status changer ────────────────────────────────────────────────────

function EstadoSelector({
  solicitud,
  onDone,
}: {
  solicitud: Solicitud;
  onDone: () => void;
}) {
  const [cambiar, { isLoading }] = useCambiarEstadoSolicitudMutation();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const estado = e.target.value as EstadoSolicitud;
    try {
      await cambiar({ uuid: solicitud.uuid, estado }).unwrap();
      onDone();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado." });
    }
  };

  return (
    <div className="relative">
      <select
        defaultValue={solicitud.estado}
        onChange={handleChange}
        disabled={isLoading}
        className="text-xs border border-gray-200 rounded-md py-1.5 pl-2.5 pr-7 bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] disabled:opacity-60 transition-colors appearance-none cursor-pointer"
      >
        {ESTADOS.filter((e) => e.value !== "todos").map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
      {isLoading && (
        <Loader2 className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-gray-400 pointer-events-none" />
      )}
    </div>
  );
}

// ── File preview helpers ──────────────────────────────────────────────

function archivoIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />;
  if (mimeType === "application/pdf") return <FileText className="w-4 h-4 text-gray-400 shrink-0" />;
  return <File className="w-4 h-4 text-gray-400 shrink-0" />;
}

function canPreview(mimeType: string) {
  return mimeType.startsWith("image/") || mimeType === "application/pdf";
}

function ArchivoPreview({ archivo, host, onClose }: { archivo: SolicitudArchivo; host: string; onClose: () => void }) {
  const url = `${host}${archivo.download_url}`;
  const isImage = archivo.mime_type.startsWith("image/");
  const isPdf = archivo.mime_type === "application/pdf";

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
        <span className="text-xs font-medium text-gray-600 truncate">{archivo.original_name}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          title="Cerrar vista previa"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-2">
        {isImage && (
          <div className="relative w-full rounded overflow-hidden" style={{ height: "min(55vh, 600px)" }}>
            <Image
              src={url}
              alt={archivo.original_name}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        )}
        {isPdf && (
          <iframe
            src={url}
            title={archivo.original_name}
            className="w-full rounded"
            style={{ height: "55vh", border: "none" }}
          />
        )}
        {!isImage && !isPdf && (
          <p className="text-xs text-gray-500 text-center py-6">
            No se puede previsualizar este tipo de archivo.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Detail modal ──────────────────────────────────────────────────────

function DetailModal({
  solicitud,
  isAdmin,
  onClose,
  onRefetch,
}: {
  solicitud: Solicitud;
  isAdmin: boolean;
  onClose: () => void;
  onRefetch: () => void;
}) {
  const host = process.env.NEXT_PUBLIC_HOST ?? "";
  const [previewFile, setPreviewFile] = useState<SolicitudArchivo | null>(null);

  const togglePreview = (archivo: SolicitudArchivo) => {
    setPreviewFile((prev) => (prev?.id === archivo.id ? null : archivo));
  };

  return (
    <Modal show onClose={onClose} maxWidth={previewFile ? "2xl" : "lg"}>
      <div className="flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <EstadoBadge estado={solicitud.estado} />
              {solicitud.area_responsable_nombre && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Building2 className="w-3 h-3" />
                  {solicitud.area_responsable_nombre}
                </span>
              )}
            </div>
            <h2 className="text-base font-semibold text-gray-900 mt-2 leading-snug">
              {solicitud.titulo}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{solicitud.solicitante_nombre}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Tag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{solicitud.tipo_nombre}</span>
            </div>
          </div>

          {/* Description */}
          {solicitud.descripcion && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Descripción
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {solicitud.descripcion}
              </p>
            </div>
          )}

          {/* Files */}
          {solicitud.archivos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Archivos adjuntos ({solicitud.archivos.length})
              </p>
              <ul className="space-y-2">
                {solicitud.archivos.map((archivo: SolicitudArchivo) => (
                  <li key={archivo.id}>
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg">
                      {archivoIcon(archivo.mime_type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">
                          {archivo.original_name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {archivo.size_formatted}
                        </p>
                      </div>
                      {canPreview(archivo.mime_type) && (
                        <button
                          type="button"
                          onClick={() => togglePreview(archivo)}
                          className={`p-1.5 rounded-md transition-colors ${
                            previewFile?.id === archivo.id
                              ? "text-[#0056D2] bg-blue-50"
                              : "text-gray-400 hover:text-[#0056D2] hover:bg-blue-50"
                          }`}
                          title="Vista previa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <a
                        href={`${host}${archivo.download_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-gray-400 hover:text-[#0056D2] hover:bg-blue-50 transition-colors"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                    {previewFile?.id === archivo.id && (
                      <ArchivoPreview
                        archivo={archivo}
                        host={host}
                        onClose={() => setPreviewFile(null)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fecha */}
          <p className="text-[11px] text-gray-400">
            Creada el{" "}
            {new Date(solicitud.created_at).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Footer — status change for admins */}
        {isAdmin && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <span className="text-xs text-gray-500 font-medium">
              Cambiar estado
            </span>
            <EstadoSelector
              solicitud={solicitud}
              onDone={() => {
                onRefetch();
                onClose();
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

// ── Solicitud card ────────────────────────────────────────────────────

function SolicitudCard({
  solicitud,
  isAdmin,
  onRefetch,
}: {
  solicitud: Solicitud;
  isAdmin: boolean;
  onRefetch: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const [deleteS, { isLoading: isDeleting }] = useDeleteSolicitudMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar solicitud",
      text: `¿Eliminar "${solicitud.titulo}"?`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteS(solicitud.uuid).unwrap();
      onRefetch();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <EstadoBadge estado={solicitud.estado} />
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAdmin && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                title="Eliminar"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2">
          {solicitud.titulo}
        </h3>

        {/* Description */}
        {solicitud.descripcion && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {solicitud.descripcion}
          </p>
        )}

        {/* Footer meta */}
        <div className="flex items-center justify-between gap-2 flex-wrap mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Tag className="w-3 h-3" />
              {solicitud.tipo_nombre}
            </span>
            {solicitud.area_responsable_nombre && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Building2 className="w-3 h-3" />
                {solicitud.area_responsable_nombre}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {solicitud.archivos.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Paperclip className="w-3 h-3" />
                {solicitud.archivos.length}
              </span>
            )}
            <span className="text-[11px] text-gray-400">
              {new Date(solicitud.created_at).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>

        {isAdmin && (
          <div
            className="mt-3 pt-3 border-t border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <User className="w-3 h-3" />
                {solicitud.solicitante_nombre}
              </span>
              <EstadoSelector solicitud={solicitud} onDone={onRefetch} />
            </div>
          </div>
        )}
      </div>

      {showDetail && (
        <DetailModal
          solicitud={solicitud}
          isAdmin={isAdmin}
          onClose={() => setShowDetail(false)}
          onRefetch={onRefetch}
        />
      )}
    </>
  );
}

// ── Main view ─────────────────────────────────────────────────────────

export default function SolicitudesView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const estadoFilter = (searchParams.get("estado") ?? "todos") as EstadoSolicitud | "todos";

  const { data: user } = useRetrieveUserQuery();
  const isAdmin =
    user?.roles_list?.some((r) => ["Administrador", "Tutor"].includes(r.nombre)) ?? false;

  const {
    data,
    isLoading,
    refetch,
  } = useGetSolicitudesQuery({ page, search, estado: estadoFilter });

  const results = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const [localSearch, setLocalSearch] = useState(search);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "todos") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("search", localSearch.trim());
  };

  const goPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Stats
  const totalNuevo = results.filter((s) => s.estado === "nuevo").length;
  const totalSeguimiento = results.filter((s) => s.estado === "seguimiento").length;
  const totalResuelto = results.filter((s) => s.estado === "resuelto").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Inbox, label: "Total", value: count, color: "blue" },
          { icon: Clock, label: "Nuevas", value: totalNuevo, color: "sky" },
          {
            icon: Clock,
            label: "En seguimiento",
            value: totalSeguimiento,
            color: "amber",
          },
          {
            icon: CheckCircle2,
            label: "Resueltas",
            value: totalResuelto,
            color: "emerald",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-${color}-50`}
            >
              <Icon className={`w-4.5 h-4.5 text-${color}-600 w-[18px] h-[18px]`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{isLoading ? "—" : value}</p>
              <p className="text-[11px] text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar solicitudes..."
            className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
          >
            Buscar
          </button>
        </form>

        <select
          value={estadoFilter}
          onChange={(e) => updateParam("estado", e.target.value)}
          className="px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors"
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">
            No se encontraron solicitudes
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ajusta los filtros o crea una nueva solicitud
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((s) => (
            <SolicitudCard
              key={s.uuid}
              solicitud={s}
              isAdmin={isAdmin}
              onRefetch={refetch}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-xs text-gray-500">
            Página {page} de {totalPages} · {count} solicitudes
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, i, arr) => (
                <span key={p} className="flex items-center">
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="px-1 text-xs text-gray-400">…</span>
                  )}
                  <button
                    onClick={() => goPage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-[#0056D2] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => goPage(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}