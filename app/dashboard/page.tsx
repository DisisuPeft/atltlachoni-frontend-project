"use client";

import {
  useGetDashboardMasterQuery,
  DashboardMasterSummary,
  DashboardMasterDiplomado,
  DashboardMasterInstituto,
} from "@/redux/features/control-escolar/dashboardApiSlice";
import {
  Users,
  CheckCircle2,
  DollarSign,
  Building2,
  UserCheck,
  Clock,
  TrendingDown,
  Wallet,
  BookOpen,
  RefreshCw,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(value: string) {
  return parseFloat(value).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-100 ${className ?? "h-6 w-full"}`}
    />
  );
}

// ─── Summary card ────────────────────────────────────────────────────────────

type CardColor = "blue" | "green" | "amber" | "red" | "purple" | "gray";

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: CardColor;
  loading?: boolean;
  note?: string;
}

const colorMap: Record<CardColor, { bg: string; icon: string; text: string }> = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   text: "text-blue-700" },
  green:  { bg: "bg-emerald-50", icon: "text-emerald-600", text: "text-emerald-700" },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  text: "text-amber-700" },
  red:    { bg: "bg-red-50",    icon: "text-red-600",    text: "text-red-700" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", text: "text-purple-700" },
  gray:   { bg: "bg-gray-50",   icon: "text-gray-500",   text: "text-gray-600" },
};

function SummaryCard({ icon: Icon, label, value, color = "blue", loading, note }: SummaryCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        )}
        {note && <p className="text-[11px] text-gray-400 mt-1">{note}</p>}
      </div>
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
      {children}
    </h2>
  );
}

// ─── Diplomados table ─────────────────────────────────────────────────────────

function DiplomadosTable({
  rows,
  loading,
}: {
  rows: DashboardMasterDiplomado[];
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#2F7FB1]" />
        <span className="text-sm font-semibold text-gray-800">Diplomados</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Nombre</th>
              <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Inscritos</th>
              <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Activos</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-5 py-3"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-5 py-3 text-right"><Skeleton className="h-4 w-10 ml-auto" /></td>
                    <td className="px-5 py-3 text-right"><Skeleton className="h-4 w-10 ml-auto" /></td>
                  </tr>
                ))
              : rows.map((d) => (
                  <tr key={d.nombre} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 max-w-[260px] truncate">{d.nombre}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">{d.inscritos}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {d.activosConfirmados}
                      </span>
                    </td>
                  </tr>
                ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-400">
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Institutos table ─────────────────────────────────────────────────────────

function InstitutosTable({
  rows,
  loading,
}: {
  rows: DashboardMasterInstituto[];
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-[#2F7FB1]" />
        <span className="text-sm font-semibold text-gray-800">Institutos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Instituto</th>
              <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Registros</th>
              <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Activos</th>
              <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Por actualizar</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-5 py-3"><Skeleton className="h-4 w-36" /></td>
                    <td className="px-5 py-3 text-right"><Skeleton className="h-4 w-10 ml-auto" /></td>
                    <td className="px-5 py-3 text-right"><Skeleton className="h-4 w-10 ml-auto" /></td>
                    <td className="px-5 py-3 text-right"><Skeleton className="h-4 w-10 ml-auto" /></td>
                  </tr>
                ))
              : rows.map((inst) => (
                  <tr key={inst.nombre} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 font-medium">{inst.nombre}</td>
                    <td className="px-5 py-3 text-right text-gray-900 font-medium">{inst.registros}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {inst.activos}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {inst.porActualizar > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                          <RefreshCw className="w-3 h-3" />
                          {inst.porActualizar}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Summary cards config ─────────────────────────────────────────────────────

function buildCards(s: DashboardMasterSummary) {
  return [
    {
      icon: Users,
      label: "Total registros",
      value: s.totalRegistros,
      color: "blue" as CardColor,
    },
    {
      icon: CheckCircle2,
      label: "Activos confirmados",
      value: s.activosConfirmados,
      color: "green" as CardColor,
    },
    {
      icon: DollarSign,
      label: "Inscripciones cobradas",
      value: fmt(s.inscripcionesCobradas),
      color: "green" as CardColor,
    },
    {
      icon: Wallet,
      label: "Saldo proyectado",
      value: fmt(s.saldoProyectado),
      color: "purple" as CardColor,
    },
    {
      icon: Building2,
      label: "Colegios / programas",
      value: s.colegiosProgramas,
      color: "blue" as CardColor,
    },
    {
      icon: UserCheck,
      label: "Asesores activos",
      value: s.asesores,
      color: "blue" as CardColor,
    },
    {
      icon: Clock,
      label: "Estatus por actualizar",
      value: s.estatusPorActualizar,
      color: s.estatusPorActualizar > 0 ? ("amber" as CardColor) : ("gray" as CardColor),
      note: s.estatusPorActualizar > 0 ? "Inscripciones en estado Pendiente" : undefined,
    },
    {
      icon: TrendingDown,
      label: "Bajas / reembolsos",
      value: s.bajasReembolsos,
      color: s.bajasReembolsos > 0 ? ("red" as CardColor) : ("gray" as CardColor),
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const { data, isLoading, isError } = useGetDashboardMasterQuery();

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <p className="text-sm text-red-500">No se pudo cargar el dashboard.</p>
      </div>
    );
  }

  const summary = data?.summary;
  const cards = summary ? buildCards(summary) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Summary cards */}
      <section>
        <SectionHeading>Resumen general</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                </div>
              ))
            : cards.map((card) => (
                <SummaryCard key={card.label} {...card} />
              ))}
        </div>
      </section>

      {/* Tables */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div>
          <SectionHeading>Por diplomado</SectionHeading>
          <DiplomadosTable rows={data?.diplomados ?? []} loading={isLoading} />
        </div>
        <div>
          <SectionHeading>Por instituto</SectionHeading>
          <InstitutosTable rows={data?.institutos ?? []} loading={isLoading} />
        </div>
      </section>
    </div>
  );
}