"use client";

import { useState } from "react";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import Link from "next/link";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Menu, X, LayoutDashboard } from "lucide-react";

export default function ModulosGrid() {
  const { data: user } = useRetrieveUserQuery();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile FAB trigger */}
      <button
        className="fixed bottom-6 left-4 z-50 lg:hidden flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-transform active:scale-95"
        style={{ background: "#0F4C75" }}
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={20} color="#fff" />
      </button>

      {/* Sidebar */}
      <aside
        className={[
          "flex flex-col bg-white border-r border-gray-200 shrink-0 transition-all duration-300 overflow-hidden",
          /* mobile: fixed overlay */
          "fixed inset-y-0 left-0 z-40 w-64",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          /* desktop: static panel, respects collapsed width */
          "lg:static lg:inset-auto lg:z-auto lg:translate-x-0 lg:shadow-none",
          collapsed ? "lg:w-[68px]" : "lg:w-56",
        ].join(" ")}
      >
        {/* Header */}
        <div
          className={[
            "flex items-center h-14 sm:h-16 border-b border-gray-100 shrink-0 px-3",
            collapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <LayoutDashboard size={16} color="#2F7FB1" />
              <span className="text-sm font-semibold text-gray-800 truncate">
                Módulos
              </span>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>

          {/* Mobile close */}
          <button
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {user?.modulos_accesibles?.map((m) => {
            const active = isActive(m.href);
            return (
              <Link
                key={m.uuid}
                href={{ pathname: m.href, query: { ref: m.uuid } }}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? m.nombre : undefined}
                className={[
                  "group relative flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-blue-50 text-[#0F4C75]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                ].join(" ")}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#2F7FB1]" />
                )}

                <span className="shrink-0 ml-px">
                  <DynamicIcon
                    iconName={m.icon}
                    size={18}
                    color={active ? "#0F4C75" : "#9CA3AF"}
                  />
                </span>

                {!collapsed && (
                  <span className="truncate leading-tight">{m.nombre}</span>
                )}

                {/* Tooltip when collapsed (desktop) */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
                    {m.nombre}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={[
            "border-t border-gray-100 shrink-0",
            collapsed ? "py-3 flex justify-center" : "px-4 py-3",
          ].join(" ")}
        >
          {collapsed ? (
            <span
              className="w-5 h-5 rounded-full block"
              style={{ background: "#2F7FB1", opacity: 0.3 }}
            />
          ) : (
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              CINFA · Dashboard
            </span>
          )}
        </div>
      </aside>
    </>
  );
}