"use client";

import {
  useGetDashboardMasterQuery,
  DashboardMasterSummary,
  DashboardMasterDiplomado,
  DashboardMasterInstituto,
} from "@/redux/features/control-escolar/dashboardApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
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
    <div className={`animate-pulse rounded bg-gray-100 ${className ?? "h-6 w-full"}`} />
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

const colorMap: Record<CardColor, { bg: string; icon: string }> = {
  blue:   { bg: "bg-blue-50",    icon: "text-blue-600" },
  green:  { bg: "bg-emerald-50", icon: "text-emerald-600" },
  amber:  { bg: "bg-amber-50",   icon: "text-amber-600" },
  red:    { bg: "bg-red-50",     icon: "text-red-600" },
  purple: { bg: "bg-purple-50",  icon: "text-purple-600" },
  gray:   { bg: "bg-gray-50",    icon: "text-gray-400" },
};

function SummaryCard({ icon: Icon, label, value, color = "blue", loading, note }: SummaryCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${c.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] sm:text-xs text-gray-500 mb-1">{label}</p>
        {loading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{value}</p>
        )}
        {note && <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">{note}</p>}
      </div>
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </h2>
  );
}

// ─── Diplomados table ─────────────────────────────────────────────────────────

function DiplomadosTable({ rows, loading }: { rows: DashboardMasterDiplomado[]; loading: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#2F7FB1]" />
        <span className="text-sm font-semibold text-gray-800">Diplomados</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[360px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">Nombre</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">Inscritos</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">Activos</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-4 sm:px-5 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 sm:px-5 py-3 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                    <td className="px-4 sm:px-5 py-3 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                  </tr>
                ))
              : rows.map((d) => (
                  <tr key={d.nombre} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-5 py-3 text-gray-700 max-w-[200px] sm:max-w-[260px] truncate">{d.nombre}</td>
                    <td className="px-4 sm:px-5 py-3 text-right font-medium text-gray-900">{d.inscritos}</td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {d.activosConfirmados}
                      </span>
                    </td>
                  </tr>
                ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-400">Sin datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Institutos table ─────────────────────────────────────────────────────────

function InstitutosTable({ rows, loading }: { rows: DashboardMasterInstituto[]; loading: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-[#2F7FB1]" />
        <span className="text-sm font-semibold text-gray-800">Institutos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">Instituto</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">Registros</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">Activos</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">Pendientes</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-4 sm:px-5 py-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 sm:px-5 py-3 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                    <td className="px-4 sm:px-5 py-3 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                    <td className="px-4 sm:px-5 py-3 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                  </tr>
                ))
              : rows.map((inst) => (
                  <tr key={inst.nombre} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-5 py-3 text-gray-700 font-medium">{inst.nombre}</td>
                    <td className="px-4 sm:px-5 py-3 text-right text-gray-900 font-medium">{inst.registros}</td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {inst.activos}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      {inst.porActualizar > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                          <RefreshCw className="w-3 h-3" />
                          {inst.porActualizar}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">Sin datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── KPI data builders ────────────────────────────────────────────────────────

function buildFinancialCards(s: DashboardMasterSummary) {
  return [
    { icon: DollarSign, label: "Inscripciones cobradas", value: fmt(s.inscripcionesCobradas), color: "green" as CardColor },
    { icon: Wallet,     label: "Saldo proyectado",       value: fmt(s.saldoProyectado),       color: "purple" as CardColor },
    { icon: TrendingDown, label: "Bajas / reembolsos",   value: s.bajasReembolsos,
      color: s.bajasReembolsos > 0 ? "red" as CardColor : "gray" as CardColor },
  ];
}

function buildOperationalCards(s: DashboardMasterSummary) {
  return [
    { icon: Users,      label: "Total registros",        value: s.totalRegistros,           color: "blue" as CardColor },
    { icon: CheckCircle2, label: "Activos confirmados",  value: s.activosConfirmados,        color: "green" as CardColor },
    { icon: Clock,      label: "Estatus por actualizar", value: s.estatusPorActualizar,
      color: s.estatusPorActualizar > 0 ? "amber" as CardColor : "gray" as CardColor,
      note: s.estatusPorActualizar > 0 ? "Inscripciones en estado Pendiente" : undefined },
    { icon: UserCheck,  label: "Asesores activos",       value: s.asesores,                  color: "blue" as CardColor },
    { icon: Building2,  label: "Colegios / programas",   value: s.colegiosProgramas,         color: "blue" as CardColor },
  ];
}

// ─── KPI skeleton row ─────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
      <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function DashboardView() {
  const { data: user } = useRetrieveUserQuery();
  const { data, isLoading, isError } = useGetDashboardMasterQuery();

  const nombre = user?.nombre_completo?.split(" ")[0] ?? "";
  const roles = user?.roles_list ?? [];
  const rol = roles.find((r) =>
    ["Administrador", "Tutor", "Vendedor"].includes(r.nombre)
  )?.nombre ?? "Usuario";

  const hour = new Date().getHours();
  const saludo = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rolColor: Record<string, string> = {
    Administrador: "bg-[#EEF5FB] text-[#0F4C75]",
    Tutor:         "bg-emerald-50 text-emerald-700",
    Vendedor:      "bg-amber-50 text-amber-700",
  };

  if (isError) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-500">No se pudo cargar el dashboard.</p>
      </div>
    );
  }

  const summary = data?.summary;
  const financialCards = summary ? buildFinancialCards(summary) : [];
  const operationalCards = summary ? buildOperationalCards(summary) : [];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {saludo}{nombre ? `, ${nombre}` : ""}
            </h1>
            {rol && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${rolColor[rol] ?? "bg-gray-100 text-gray-600"}`}>
                {rol}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 capitalize">{fecha}</p>
        </div>
      </div>

      {/* ── KPIs financieros ───────────────────────────────────────── */}
      <section>
        <SectionHeading>Financiero</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : financialCards.map((card) => <SummaryCard key={card.label} {...card} />)}
        </div>
      </section>

      {/* ── KPIs operativos ────────────────────────────────────────── */}
      <section>
        <SectionHeading>Operativo</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            : operationalCards.map((card) => <SummaryCard key={card.label} {...card} />)}
        </div>
      </section>

      {/* ── Tablas ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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