"use client";

import { useState } from "react";
import {
  useGetFuentesQuery,
  useGetEstatusQuery,
  useGetEtapasQuery,
  useGetTiposInteraccionQuery,
  useGetNivelesTemperaturaQuery,
  useGetTiposSeguimientoQuery,
} from "@/redux/features/crm/catalogosCrmApiSlice";
import { useChangeUnidad } from "@/hooks";
import { Check, X } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type TabId =
  | "fuentes"
  | "estatus"
  | "etapas"
  | "tipos-interaccion"
  | "temperatura"
  | "tipos-seguimiento";

const TABS: { id: TabId; label: string }[] = [
  { id: "fuentes", label: "Fuentes" },
  { id: "estatus", label: "Estatus" },
  { id: "etapas", label: "Etapas" },
  { id: "tipos-interaccion", label: "Tipos de Interacción" },
  { id: "temperatura", label: "Temperatura" },
  { id: "tipos-seguimiento", label: "Tipos de Seguimiento" },
];

// ── Shared ─────────────────────────────────────────────────────────────────

function BoolIcon({ value }: { value: boolean }) {
  return value ? (
    <Check className="w-4 h-4 text-green-600" />
  ) : (
    <X className="w-4 h-4 text-gray-300" />
  );
}

function ColorDot({ color }: { color?: string }) {
  if (!color) return <span className="text-gray-300">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-3 rounded-full border border-black/10"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-gray-500">{color}</span>
    </span>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 ${className ?? "text-gray-700"}`}>{children}</td>
  );
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-t border-gray-100">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-sm text-gray-400">
        Sin registros
      </td>
    </tr>
  );
}

// ── Tab: Fuentes ───────────────────────────────────────────────────────────

function TabFuentes({ instituto }: { instituto?: number }) {
  const { data, isLoading } = useGetFuentesQuery({ instituto });
  const rows = data?.results ?? [];
  return (
    <TableWrapper>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <Th>#</Th>
          <Th>Nombre</Th>
          <Th>Código</Th>
          <Th>Activo</Th>
          <Th>Orden</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {isLoading && <SkeletonRows cols={5} />}
        {!isLoading && rows.length === 0 && <EmptyRow cols={5} />}
        {!isLoading &&
          rows.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50 transition-colors">
              <Td className="text-gray-400">{f.id}</Td>
              <Td className="font-medium text-gray-900">{f.nombre}</Td>
              <Td className="text-gray-500 font-mono text-xs">{f.codigo}</Td>
              <Td>
                <BoolIcon value={f.activo} />
              </Td>
              <Td className="text-gray-400">{f.orden}</Td>
            </tr>
          ))}
      </tbody>
    </TableWrapper>
  );
}

// ── Tab: Estatus ───────────────────────────────────────────────────────────

function TabEstatus({ instituto }: { instituto?: number }) {
  const { data, isLoading } = useGetEstatusQuery({ instituto });
  const rows = data?.results ?? [];
  return (
    <TableWrapper>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <Th>#</Th>
          <Th>Nombre</Th>
          <Th>Código</Th>
          <Th>Color</Th>
          <Th>Es Final</Th>
          <Th>Orden</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {isLoading && <SkeletonRows cols={6} />}
        {!isLoading && rows.length === 0 && <EmptyRow cols={6} />}
        {!isLoading &&
          rows.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <Td className="text-gray-400">{s.id}</Td>
              <Td className="font-medium text-gray-900">{s.nombre}</Td>
              <Td className="text-gray-500 font-mono text-xs">{s.codigo}</Td>
              <Td>
                <ColorDot color={s.color} />
              </Td>
              <Td>
                <BoolIcon value={s.es_final} />
              </Td>
              <Td className="text-gray-400">{s.orden}</Td>
            </tr>
          ))}
      </tbody>
    </TableWrapper>
  );
}

// ── Tab: Etapas ────────────────────────────────────────────────────────────

function TabEtapas({ instituto }: { instituto?: number }) {
  const { data, isLoading } = useGetEtapasQuery({ instituto });
  const rows = data?.results ?? [];
  return (
    <TableWrapper>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <Th>#</Th>
          <Th>Nombre</Th>
          <Th>Pipeline</Th>
          <Th>Orden</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {isLoading && <SkeletonRows cols={4} />}
        {!isLoading && rows.length === 0 && <EmptyRow cols={4} />}
        {!isLoading &&
          rows.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50 transition-colors">
              <Td className="text-gray-400">{e.id}</Td>
              <Td className="font-medium text-gray-900">{e.nombre}</Td>
              <Td className="text-gray-500">{e.pipeline_nombre}</Td>
              <Td className="text-gray-400">{e.orden}</Td>
            </tr>
          ))}
      </tbody>
    </TableWrapper>
  );
}

// ── Tab: Tipos de interacción ──────────────────────────────────────────────

function TabTiposInteraccion({ instituto }: { instituto?: number }) {
  const { data, isLoading } = useGetTiposInteraccionQuery({ instituto });
  const rows = data?.results ?? [];
  return (
    <TableWrapper>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <Th>#</Th>
          <Th>Nombre</Th>
          <Th>Código</Th>
          <Th>Req. Duración</Th>
          <Th>Req. Teléfono</Th>
          <Th>Permite Archivos</Th>
          <Th>Orden</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {isLoading && <SkeletonRows cols={7} />}
        {!isLoading && rows.length === 0 && <EmptyRow cols={7} />}
        {!isLoading &&
          rows.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <Td className="text-gray-400">{t.id}</Td>
              <Td className="font-medium text-gray-900">{t.nombre}</Td>
              <Td className="text-gray-500 font-mono text-xs">{t.codigo}</Td>
              <Td>
                <BoolIcon value={t.requiere_duracion} />
              </Td>
              <Td>
                <BoolIcon value={t.requiere_telefono} />
              </Td>
              <Td>
                <BoolIcon value={t.permite_archivos} />
              </Td>
              <Td className="text-gray-400">{t.orden}</Td>
            </tr>
          ))}
      </tbody>
    </TableWrapper>
  );
}

// ── Tab: Niveles de Temperatura ────────────────────────────────────────────

function TabTemperatura({ instituto }: { instituto?: number }) {
  const { data, isLoading } = useGetNivelesTemperaturaQuery({ instituto });
  const rows = data?.results ?? [];
  return (
    <TableWrapper>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <Th>#</Th>
          <Th>Nombre</Th>
          <Th>Código</Th>
          <Th>Color</Th>
          <Th>Puntuación</Th>
          <Th>Orden</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {isLoading && <SkeletonRows cols={6} />}
        {!isLoading && rows.length === 0 && <EmptyRow cols={6} />}
        {!isLoading &&
          rows.map((n) => (
            <tr key={n.id} className="hover:bg-gray-50 transition-colors">
              <Td className="text-gray-400">{n.id}</Td>
              <Td className="font-medium text-gray-900">{n.nombre}</Td>
              <Td className="text-gray-500 font-mono text-xs">{n.codigo}</Td>
              <Td>
                <ColorDot color={n.color} />
              </Td>
              <Td className="text-gray-700">{n.puntuacion}</Td>
              <Td className="text-gray-400">{n.orden}</Td>
            </tr>
          ))}
      </tbody>
    </TableWrapper>
  );
}

// ── Tab: Tipos de Seguimiento ──────────────────────────────────────────────

function TabTiposSeguimiento({ instituto }: { instituto?: number }) {
  const { data, isLoading } = useGetTiposSeguimientoQuery({ instituto });
  const rows = data?.results ?? [];
  return (
    <TableWrapper>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <Th>#</Th>
          <Th>Nombre</Th>
          <Th>Código</Th>
          <Th>Orden</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {isLoading && <SkeletonRows cols={4} />}
        {!isLoading && rows.length === 0 && <EmptyRow cols={4} />}
        {!isLoading &&
          rows.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <Td className="text-gray-400">{t.id}</Td>
              <Td className="font-medium text-gray-900">{t.nombre}</Td>
              <Td className="text-gray-500 font-mono text-xs">{t.codigo}</Td>
              <Td className="text-gray-400">{t.orden}</Td>
            </tr>
          ))}
      </tbody>
    </TableWrapper>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function CatalogosView() {
  const [activeTab, setActiveTab] = useState<TabId>("fuentes");
  const { unidadId } = useChangeUnidad();
  const instituto = unidadId ?? undefined;

  return (
    <div>
      {/* Tab nav */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "fuentes" && <TabFuentes instituto={instituto} />}
      {activeTab === "estatus" && <TabEstatus instituto={instituto} />}
      {activeTab === "etapas" && <TabEtapas instituto={instituto} />}
      {activeTab === "tipos-interaccion" && <TabTiposInteraccion instituto={instituto} />}
      {activeTab === "temperatura" && <TabTemperatura instituto={instituto} />}
      {activeTab === "tipos-seguimiento" && <TabTiposSeguimiento instituto={instituto} />}
    </div>
  );
}