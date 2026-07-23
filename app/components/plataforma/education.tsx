"use client";

import { useState } from "react";
import { useInscriptionAlumnoDetailQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, GraduationCap, PlayCircle, CheckCircle2 } from "lucide-react";
import { Programa } from "@/redux/features/types/alumnos/inscription";

// ── Helpers ────────────────────────────────────────────────────────────

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-12 flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex gap-4 animate-pulse">
      <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-1.5 bg-gray-100 rounded-full mt-1" />
      </div>
      <div className="w-24 h-9 bg-gray-100 rounded-lg hidden sm:block self-center flex-shrink-0" />
    </div>
  );
}

function ProgramaCard({ programa }: { programa: Programa }) {
  const totalHoras = programa.modulos.reduce(
    (acc, m) => acc + (m.horas_totales ?? 0),
    0,
  );

  return (
    <Link
      href={`/plataforma/${programa.tipo}/${programa.ref}`}
      className="group bg-white border border-gray-100 rounded-xl p-5 flex gap-4 hover:border-[#0056D2]/30 hover:shadow-md transition-all"
    >
      {/* Imagen */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#0056D2]/10 to-[#0056D2]/5 flex-shrink-0">
        {programa.imagen_url ? (
          <Image
            src={programa.imagen_url}
            alt={programa.nombre}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-[#0056D2]/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[#0056D2] uppercase tracking-wide mb-0.5">
          {programa.tipo}
        </p>
        <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-snug">
          {programa.nombre}
        </h3>
        <p className="text-xs text-gray-400">
          {programa.modulos.length} módulos
          {totalHoras > 0 && ` · ${totalHoras}h`}
        </p>
      </div>

      {/* CTA */}
      <div className="self-center flex-shrink-0">
        <span className="inline-flex items-center gap-1.5 bg-[#0056D2] text-white text-xs font-semibold px-4 py-2.5 rounded-lg group-hover:bg-[#004BB5] transition-colors whitespace-nowrap">
          <PlayCircle className="w-3.5 h-3.5" />
          Continuar
        </span>
      </div>
    </Link>
  );
}

// ── Main ──────────────────────────────────────────────────────────────

export default function MainEducationDash() {
  const [tab, setTab] = useState<"progreso" | "completados">("progreso");
  const { data: detail, isLoading } = useInscriptionAlumnoDetailQuery();

  const enProgreso = detail?.programasInscritos ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi Aprendizaje</h1>
        <p className="text-sm text-gray-500 mt-1">
          Todos tus programas en un solo lugar
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {(
          [
            { key: "progreso", label: "En Progreso" },
            { key: "completados", label: "Completados" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading && (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!isLoading && tab === "progreso" && (
        <>
          {enProgreso.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-7 h-7 text-[#0056D2]/50" />}
              title="Sin programas activos"
              description="Contacta a tu tutora para inscribirte en un programa."
            />
          ) : (
            <div className="space-y-3">
              {enProgreso.map((p) => (
                <ProgramaCard key={p.ref} programa={p} />
              ))}
            </div>
          )}
        </>
      )}

      {!isLoading && tab === "completados" && (
        <EmptyState
          icon={<CheckCircle2 className="w-7 h-7 text-green-500/60" />}
          title="Aún no has completado ningún programa"
          description="Tus certificados aparecerán aquí cuando finalices un programa."
          action={
            <button
              onClick={() => setTab("progreso")}
              className="px-5 py-2.5 bg-[#0056D2] text-white text-sm font-semibold rounded-lg hover:bg-[#004BB5] transition-colors"
            >
              Ver programas activos
            </button>
          }
        />
      )}
    </div>
  );
}