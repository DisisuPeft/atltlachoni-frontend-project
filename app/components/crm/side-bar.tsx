"use client";

import { useGetPestaniaQuery } from "@/redux/features/auth/authApiSlice";
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  Settings2,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useChangeUnidad } from "@/hooks";

function NavIcon({ href }: { href: string }) {
  if (href.includes("seguimiento")) return <UsersRound className="h-4 w-4" />;
  if (href.includes("catalog")) return <Settings2 className="h-4 w-4" />;
  return <LayoutDashboard className="h-4 w-4" />;
}

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const { data: pestanias, isLoading } = useGetPestaniaQuery(ref);
  const [open, setOpen] = useState(false);
  const { unidades, onChange, unidadId } = useChangeUnidad();

  const navItems = isLoading
    ? Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-10 animate-pulse rounded-lg bg-slate-100" />
      ))
    : (pestanias ?? []).map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const href = ref ? `${item.href}?ref=${ref}` : item.href;
        return (
          <Link
            key={item.nombre}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={isActive ? "page" : undefined}
            className={`group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-600 ${
              isActive
                ? "bg-sky-50 text-sky-800"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <span className={isActive ? "text-sky-700" : "text-slate-400 group-hover:text-slate-600"}>
              <NavIcon href={item.href} />
            </span>
            <span className="truncate">{item.nombre}</span>
            {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-700" />}
          </Link>
        );
      });

  const navigation = (
    <>
      <div className="border-b border-slate-200 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Espacio de trabajo
        </p>
        <label htmlFor="crm-unidad" className="sr-only">
          Seleccionar negocio
        </label>
        <div className="relative mt-2">
          <select
            id="crm-unidad"
            name="negocio"
            onChange={onChange}
            value={String(unidadId ?? "")}
            className="min-h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
          >
            {unidades?.map((unidad) => (
              <option key={unidad.id} value={unidad.id}>
                {unidad.nombre}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
      <nav aria-label="Navegación CRM" className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Gestión comercial
        </p>
        {navItems}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
          <span className="font-semibold text-slate-700">Tip:</span> abre un lead para registrar interacciones y próximos pasos.
        </p>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Cerrar navegación CRM" : "Abrir navegación CRM"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="fixed left-3 top-[4.25rem] z-40 inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-600 md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <button
          type="button"
          aria-label="Cerrar navegación"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 md:top-0 md:z-30 md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          <Link href="/dashboard/crm/menu" className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sky-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-950 text-xs font-bold text-white">C</span>
            <span className="text-sm font-semibold tracking-tight text-slate-950">CINFA CRM</span>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Cerrar menú">
            <X className="h-4 w-4" />
          </button>
          <PanelLeftClose className="hidden h-4 w-4 text-slate-400 md:block" aria-hidden="true" />
        </div>
        {navigation}
      </aside>
    </>
  );
}
