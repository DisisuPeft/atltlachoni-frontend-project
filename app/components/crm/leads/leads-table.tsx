"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useGetLeadsQuery,
  useGetVendedoresQuery,
} from "@/redux/features/crm/leadsApiSlice";
import {
  useGetFuentesQuery,
  useGetEstatusQuery,
  useGetEtapasQuery,
} from "@/redux/features/crm/catalogosCrmApiSlice";
import { useChangeUnidad } from "@/hooks";
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, j) => (
        <td key={j} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function LeadsTable() {
  const { unidadId } = useChangeUnidad();
  const instituto = unidadId ?? undefined;
  const ref = useSearchParams().get("ref");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterFuente, setFilterFuente] = useState<number | undefined>();
  const [filterEstatus, setFilterEstatus] = useState<number | undefined>();
  const [filterEtapa, setFilterEtapa] = useState<number | undefined>();
  const [filterVendedor, setFilterVendedor] = useState<number | undefined>();

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useGetLeadsQuery({
    instituto,
    page,
    search: debouncedSearch || undefined,
    fuente: filterFuente,
    estatus: filterEstatus,
    etapa: filterEtapa,
    vendedor: filterVendedor,
  });

  const { data: fuentesData } = useGetFuentesQuery({ instituto });
  const { data: estatusData } = useGetEstatusQuery({ instituto });
  const { data: etapasData } = useGetEtapasQuery({ instituto });
  const { data: vendedoresData } = useGetVendedoresQuery();

  const leads = data?.results ?? [];
  const fuentes = fuentesData?.results ?? [];
  const estatus = estatusData?.results ?? [];
  const etapas = etapasData?.results ?? [];
  const vendedores = vendedoresData ?? [];

  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  const selectCls =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-400 transition-colors";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        <select
          value={filterFuente ?? ""}
          onChange={(e) => {
            setFilterFuente(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
          className={selectCls}
        >
          <option value="">Todas las fuentes</option>
          {fuentes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nombre}
            </option>
          ))}
        </select>

        <select
          value={filterEstatus ?? ""}
          onChange={(e) => {
            setFilterEstatus(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
          className={selectCls}
        >
          <option value="">Todos los estatus</option>
          {estatus.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>

        <select
          value={filterEtapa ?? ""}
          onChange={(e) => {
            setFilterEtapa(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
          className={selectCls}
        >
          <option value="">Todas las etapas</option>
          {etapas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>

        <select
          value={filterVendedor ?? ""}
          onChange={(e) => {
            setFilterVendedor(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
          className={selectCls}
        >
          <option value="">Todos los asesores</option>
          {vendedores.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nombre_completo}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {!isLoading && data && (
        <p className="text-sm text-gray-500 mb-3">
          {data.count} lead{data.count !== 1 ? "s" : ""} encontrado
          {data.count !== 1 ? "s" : ""}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                "Nombre",
                "Teléfono",
                "Fuente",
                "Etapa",
                "Estatus",
                "Asesor",
                "Fecha",
                "",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

            {!isLoading && leads.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  No se encontraron leads con los filtros aplicados
                </td>
              </tr>
            )}

            {!isLoading &&
              leads.map((lead) => (
                <tr
                  key={lead.uuid}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {lead.nombre} {lead.apellido_paterno}{" "}
                    {lead.apellido_materno}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {lead.telefono}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {lead.fuente_nombre ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {lead.etapa_nombre ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {lead.estatus_nombre ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {lead.vendedor_nombre ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {fmt(lead.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/crm/detalle-lead/${lead.uuid}${ref ? `?ref=${ref}` : ""}`}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {(data?.next || data?.previous) && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={!data.previous}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
