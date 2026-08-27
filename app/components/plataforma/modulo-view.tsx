"use client";

import { useModuloProgramaQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { ArrowRight, BookOpen, Clock3, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModuloMateriales from "./modulo-materiales";

interface Props {
  moduloId: number;
  uuid: string;
}

export default function ModuloView({ moduloId, uuid }: Props) {
  const { data: modulo } = useModuloProgramaQuery({ id: uuid, moduloId });
  const pathname = usePathname();
  const totalLecciones = modulo?.submodulos.length ?? 0;

  return (
    <main className="min-h-full bg-[#FFF8EE] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 rounded-2xl border border-[#D8C9B5] bg-white px-5 py-6 shadow-sm sm:px-7">
          <p className="mb-3 flex items-center gap-2 text-base font-semibold text-[#315563]">
            <BookOpen aria-hidden="true" className="h-5 w-5" /> Curso · Módulo actual
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#123B4A] sm:text-4xl">
            {modulo?.nombre ?? "Cargando módulo"}
          </h1>
          {modulo && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-base text-[#315563]">
              <span className="flex items-center gap-2"><ListChecks aria-hidden="true" className="h-5 w-5" />{totalLecciones} {totalLecciones === 1 ? "lección" : "lecciones"}</span>
              {modulo.horas_totales > 0 && <span className="flex items-center gap-2"><Clock3 aria-hidden="true" className="h-5 w-5" />{modulo.horas_totales} h de estudio</span>}
            </div>
          )}
        </header>

        <ModuloMateriales moduloId={moduloId} />

        <section aria-labelledby="lecciones-title" className="mt-6 overflow-hidden rounded-2xl border border-[#D8C9B5] bg-white shadow-sm">
          <div className="border-b border-[#E7DCCC] px-5 py-5 sm:px-6">
            <p className="text-sm font-bold uppercase tracking-wider text-[#176B52]">Siguiente paso</p>
            <h2 id="lecciones-title" className="mt-1 font-heading text-2xl font-semibold text-[#123B4A]">Lecciones del módulo</h2>
            <p className="mt-1 text-base text-[#315563]">Elige una lección para continuar.</p>
          </div>
          {modulo?.submodulos.length ? (
            <ol className="divide-y divide-[#E7DCCC]">
              {modulo.submodulos.map((item, index) => (
                <li key={item.id}>
                  <Link href={`${pathname}/submodulo/${item.id}`} className="group flex min-h-16 items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FFF8EE] focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C75B39] sm:px-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E5F1EB] text-base font-bold text-[#176B52]">{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold leading-snug text-[#172B36]">{item.titulo}</span>
                      <span className="mt-1 block text-base text-[#315563]">Lección disponible · Abrir lección</span>
                    </span>
                    <span className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#123B4A] px-3 text-base font-semibold text-white transition-colors group-hover:bg-[#0B2D39]">Abrir <ArrowRight aria-hidden="true" className="h-5 w-5" /></span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : modulo ? <p className="px-5 py-6 text-base text-[#315563] sm:px-6">Aún no hay lecciones disponibles en este módulo.</p> : null}
        </section>
      </div>
    </main>
  );
}
