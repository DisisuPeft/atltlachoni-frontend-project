"use client";

import { useInscriptionAlumnoDetailQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  BookOpen,
  GraduationCap,
  Clock,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Programa } from "@/redux/features/types/alumnos/inscription";

function isDocente(roles: { nombre: string }[]) {
  return roles.some((r) => r.nombre === "Docente");
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function ProgramaCard({ programa }: { programa: Programa }) {
  return (
    <Link
      href={`/plataforma/${programa.tipo}/${programa.ref}`}
      className="group bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:border-[#0056D2]/30 hover:shadow-md transition-all"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#0056D2]/10 to-[#0056D2]/5 flex-shrink-0">
        {programa.imagen_url ? (
          <Image
            src={programa.imagen_url}
            alt={programa.nombre}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-[#0056D2]/50" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[#0056D2] uppercase tracking-wide mb-0.5">
          {programa.tipo}
        </p>
        <h3 className="font-semibold text-gray-900 text-sm truncate">
          {programa.nombre}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {programa.modulos.length} módulos
        </p>
      </div>

      <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#0056D2] text-white text-xs font-semibold px-3 py-2 rounded-lg group-hover:bg-[#004BB5] transition-colors whitespace-nowrap flex-shrink-0">
        <PlayCircle className="w-3.5 h-3.5" />
        Continuar
      </span>
      <ArrowRight className="w-4 h-4 text-gray-300 sm:hidden flex-shrink-0" />
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 animate-pulse">
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-2 bg-gray-100 rounded-full" />
      </div>
      <div className="w-20 h-8 bg-gray-100 rounded-lg hidden sm:block" />
    </div>
  );
}

export default function Dashboard() {
  const { data: user } = useRetrieveUserQuery();
  const { data: detail, isLoading } = useInscriptionAlumnoDetailQuery();

  const esDocente = user?.roles_list ? isDocente(user.roles_list) : false;
  const nombre = user?.nombre_completo?.split(" ")[0] ?? "";
  const programas = detail?.programasInscritos ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* ── Greeting ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            ¡Hola, {nombre}!
          </h1>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              esDocente
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-50 text-[#0056D2]"
            }`}
          >
            {esDocente ? "Docente" : "Estudiante"}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {esDocente
            ? "Bienvenido a tu espacio de enseñanza."
            : "Continúa donde lo dejaste."}
        </p>
      </div>

      {/* ── Stats — solo Estudiante ────────────────────────────────── */}
      {!esDocente && detail && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<BookOpen className="w-4 h-4 text-[#0056D2]" />}
            value={detail.countCursos}
            label="Inscritos"
            color="bg-blue-50"
          />
          {/* <StatCard
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            value={detail.countCursos - detail.completados}
            label="En progreso"
            color="bg-amber-50"
          /> */}
          {/* <StatCard
            icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
            value={detail.completados}
            label="Completados"
            color="bg-green-50"
          /> */}
        </div>
      )}

      {/* ── Programas — solo Estudiante ───────────────────────────── */}
      {!esDocente && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Mis programas
            </h2>
            <Link
              href="/plataforma/educacion"
              className="flex items-center gap-1 text-sm text-[#0056D2] font-medium hover:underline"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading && (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            )}

            {!isLoading && programas.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-[#0056D2]/60" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">
                  Sin programas inscritos
                </p>
                <p className="text-sm text-gray-400">
                  Contacta a tu tutora para inscribirte en un programa.
                </p>
              </div>
            )}

            {!isLoading &&
              programas
                .slice(0, 3)
                .map((p) => <ProgramaCard key={p.ref} programa={p} />)}
          </div>
        </div>
      )}

      {/* ── Docente welcome ───────────────────────────────────────── */}
      {esDocente && (
        <div className="bg-white border border-gray-100 rounded-xl p-10 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Espacio del Docente
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Accede a tus ponencias y materiales desde el menú de navegación
            lateral.
          </p>
        </div>
      )}
    </div>
  );
}
