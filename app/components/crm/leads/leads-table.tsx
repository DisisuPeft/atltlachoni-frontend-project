"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, Search, SlidersHorizontal, UserPlus, Users, X } from "lucide-react";
import { useChangeUnidad } from "@/hooks";
import { useGetLeadsQuery, useGetVendedoresQuery } from "@/redux/features/crm/leadsApiSlice";
import { useGetEstatusQuery, useGetEtapasQuery, useGetFuentesQuery } from "@/redux/features/crm/catalogosCrmApiSlice";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import AssignVendedorModal from "./assign-vendedor-modal";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

function SkeletonRow({ columnCount }: { columnCount: number }) {
  return <tr className="animate-pulse">{Array.from({ length: columnCount }).map((_, index) => <td key={index} className="px-4 py-4"><div className="h-4 w-3/4 rounded bg-slate-100" /></td>)}</tr>;
}

export default function LeadsTable() {
  const { unidadId } = useChangeUnidad();
  const ref = useSearchParams().get("ref");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [fuente, setFuente] = useState<number>();
  const [estatus, setEstatus] = useState<number>();
  const [etapa, setEtapa] = useState<number>();
  const [vendedor, setVendedor] = useState<number>();
  // Activos por default (así lo entrega la API); "Inactivos" pide el mix
  // con incluir_inactivos=true y se filtra en cliente, ya que la API no
  // trae un filtro dedicado para ver solo los apagados.
  const [estado, setEstado] = useState<"activos" | "inactivos">("activos");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: verify } = useVerifyUserQuery();
  // Solo Administrador o superuser pueden asignar leads a un asesor,
  // masivamente o uno por uno — el resto ni siquiera ve la selección.
  const isAdmin =
    verify?.superuser === true ||
    verify?.roles?.some((r) => r.nombre === "Administrador");

  const instituto = unidadId ?? undefined;
  const { data, isLoading } = useGetLeadsQuery({ instituto, page, search: debouncedSearch || undefined, fuente, estatus, etapa, vendedor, incluir_inactivos: estado === "inactivos" });
  const { data: fuentesData } = useGetFuentesQuery({ instituto });
  const { data: estatusData } = useGetEstatusQuery({ instituto });
  const { data: etapasData } = useGetEtapasQuery({ instituto });
  const { data: vendedoresData } = useGetVendedoresQuery();
  const leads = estado === "inactivos" ? (data?.results ?? []).filter((lead) => lead.status !== 1) : (data?.results ?? []);
  const hasFilters = Boolean(search || fuente || estatus || etapa || vendedor);
  const totalPages = data ? Math.max(1, Math.ceil(data.count / 20)) : 1;
  const selectClass = "min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

  const reset = () => { setSearch(""); setFuente(undefined); setEstatus(undefined); setEtapa(undefined); setVendedor(undefined); setPage(1); };
  const toggle = (uuid: string) => setSelected((current) => current.includes(uuid) ? current.filter((id) => id !== uuid) : [...current, uuid]);
  const toggleAll = () => setSelected((current) => current.length === leads.length ? [] : leads.map((lead) => lead.uuid));
  const selectedLeads = leads
    .filter((lead) => selected.includes(lead.uuid))
    .map((lead) => ({ uuid: lead.uuid, label: `${lead.nombre} ${lead.apellido_paterno} ${lead.apellido_materno}`.trim() }));
  const columnCount = isAdmin ? 10 : 9;

  return (
    <section aria-label="Lista de leads" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="border-b border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, correo o teléfono…" className="min-h-10 w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100" /></div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1" role="tablist" aria-label="Estado de los leads">
            <button type="button" role="tab" aria-selected={estado === "activos"} onClick={() => { setEstado("activos"); setPage(1); }} className={`min-h-8 rounded-md px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-sky-600 ${estado === "activos" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Activos</button>
            <button type="button" role="tab" aria-selected={estado === "inactivos"} onClick={() => { setEstado("inactivos"); setPage(1); }} className={`min-h-8 rounded-md px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-sky-600 ${estado === "inactivos" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Inactivos</button>
          </div>
          <div className="flex items-center gap-1.5"><button type="button" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-sky-600 ${filtersOpen || hasFilters ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}><SlidersHorizontal className="h-4 w-4" />Filtros{hasFilters ? " activos" : ""}</button>{hasFilters && <button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-medium text-slate-600 outline-none hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-600"><X className="h-4 w-4" />Limpiar</button>}</div>
        </div>
        {filtersOpen && <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2 xl:grid-cols-4">
          <select value={fuente ?? ""} onChange={(event) => { setFuente(event.target.value ? Number(event.target.value) : undefined); setPage(1); }} className={selectClass}><option value="">Todas las fuentes</option>{fuentesData?.results.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select>
          <select value={estatus ?? ""} onChange={(event) => { setEstatus(event.target.value ? Number(event.target.value) : undefined); setPage(1); }} className={selectClass}><option value="">Todos los estatus</option>{estatusData?.results.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select>
          <select value={etapa ?? ""} onChange={(event) => { setEtapa(event.target.value ? Number(event.target.value) : undefined); setPage(1); }} className={selectClass}><option value="">Todas las etapas</option>{etapasData?.results.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select>
          <select value={vendedor ?? ""} onChange={(event) => { setVendedor(event.target.value ? Number(event.target.value) : undefined); setPage(1); }} className={selectClass}><option value="">Todos los asesores</option>{vendedoresData?.map((item) => <option key={item.id} value={item.id}>{item.nombre_completo}</option>)}</select>
        </div>}
      </div>

      {!isLoading && data && <div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-100 px-4 sm:px-5"><p className="text-sm text-slate-600"><span className="font-semibold text-slate-950">{estado === "inactivos" ? leads.length : data.count}</span> lead{(estado === "inactivos" ? leads.length : data.count) !== 1 ? "s" : ""} encontrado{(estado === "inactivos" ? leads.length : data.count) !== 1 ? "s" : ""}</p>{isAdmin && selected.length > 0 && <div className="flex items-center gap-2 text-sm font-medium text-sky-800"><Users className="h-4 w-4" />{selected.length} seleccionado{selected.length > 1 ? "s" : ""}<button type="button" onClick={() => setBulkAssignOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-sky-800 outline-none transition hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-600"><UserPlus className="h-3.5 w-3.5" />Asignar asesor</button><button type="button" onClick={() => setSelected([])} className="rounded p-1 hover:bg-sky-100" aria-label="Quitar selección"><X className="h-4 w-4" /></button></div>}</div>}

      <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_rgb(226,232,240)]"><tr>{isAdmin && <th className="w-12 px-4 py-3.5"><input type="checkbox" aria-label="Seleccionar todos los leads de esta página" checked={leads.length > 0 && selected.length === leads.length} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600" /></th>}{["Nombre", "Teléfono", "Fuente", "Programa", "Etapa", "Estatus", "Asesor", "Fecha", ""].map((column) => <th key={column} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500 whitespace-nowrap">{column}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{isLoading && Array.from({ length: 8 }).map((_, index) => <SkeletonRow key={index} columnCount={columnCount} />)}
        {!isLoading && leads.length === 0 && <tr><td colSpan={columnCount} className="px-4 py-14 text-center"><Search className="mx-auto mb-3 h-7 w-7 text-slate-300" /><p className="font-medium text-slate-700">No encontramos leads con estos criterios</p><button type="button" onClick={reset} className="mt-2 text-sm font-medium text-sky-700 hover:text-sky-900">Limpiar filtros</button></td></tr>}
        {!isLoading && leads.map((lead) => <tr key={lead.uuid} className={`transition-colors hover:bg-sky-50/50 ${selected.includes(lead.uuid) ? "bg-sky-50" : ""}`}>{isAdmin && <td className="px-4 py-3.5"><input type="checkbox" aria-label={`Seleccionar ${lead.nombre} ${lead.apellido_paterno}`} checked={selected.includes(lead.uuid)} onChange={() => toggle(lead.uuid)} className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600" /></td>}<td className="px-4 py-3.5 font-medium whitespace-nowrap text-slate-950"><Link href={`/dashboard/crm/detalle-lead/${lead.uuid}${ref ? `?ref=${ref}` : ""}`} className="outline-none hover:text-sky-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-sky-600">{lead.nombre} {lead.apellido_paterno} {lead.apellido_materno}</Link></td><td className="px-4 py-3.5 whitespace-nowrap text-slate-600">{lead.telefono}</td><td className="px-4 py-3.5 text-slate-600">{lead.fuente_nombre ?? "—"}</td><td className="px-4 py-3.5 text-slate-600">{lead.programa_nombre ?? "—"}</td><td className="px-4 py-3.5 text-slate-600">{lead.etapa_nombre ?? "—"}</td><td className="px-4 py-3.5"><span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">{lead.estatus_nombre ?? "—"}</span></td><td className="px-4 py-3.5 text-slate-600">{lead.vendedor_nombre ?? "—"}</td><td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{fmt(lead.created_at)}</td><td className="px-4 py-3.5"><Link href={`/dashboard/crm/detalle-lead/${lead.uuid}${ref ? `?ref=${ref}` : ""}`} aria-label={`Abrir lead de ${lead.nombre} ${lead.apellido_paterno}`} className="inline-flex rounded-md p-1.5 text-slate-500 outline-none transition hover:bg-slate-100 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-600"><ExternalLink className="h-4 w-4" /></Link></td></tr>)}</tbody></table></div>
      {(data?.next || data?.previous) && <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 sm:px-5"><p className="text-sm text-slate-600">Página {page} de {totalPages}</p><div className="flex gap-2"><button type="button" disabled={!data.previous} onClick={() => setPage((current) => current - 1)} aria-label="Página anterior" className="rounded-lg border border-slate-200 p-2 text-slate-700 outline-none transition hover:bg-slate-50 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-sky-600"><ChevronLeft className="h-4 w-4" /></button><button type="button" disabled={!data.next} onClick={() => setPage((current) => current + 1)} aria-label="Página siguiente" className="rounded-lg border border-slate-200 p-2 text-slate-700 outline-none transition hover:bg-slate-50 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-sky-600"><ChevronRight className="h-4 w-4" /></button></div></div>}

      {isAdmin && (
        <AssignVendedorModal
          open={bulkAssignOpen}
          onClose={() => setBulkAssignOpen(false)}
          leads={selectedLeads}
          onAssigned={() => setSelected([])}
        />
      )}
    </section>
  );
}
