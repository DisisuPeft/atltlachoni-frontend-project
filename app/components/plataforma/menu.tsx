"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { IconBook, IconDashboard, IconPlayCircle } from "./iconst";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = {
  id: number;
  nav: string;
  label: string;
  icon: React.FC<{ className?: string }>;
};

export default function PlataformaEducativa() {
  const { data: user } = useRetrieveUserQuery();
  const pathname = usePathname();

  const esDocente =
    user?.roles_list?.some((r) => r.nombre === "Docente") ?? false;

  const allNavItems: (NavItem & { soloEstudiante?: boolean })[] = [
    { id: 1, nav: "/plataforma", label: "Dashboard", icon: IconDashboard },
    {
      id: 2,
      nav: "/plataforma/educacion",
      label: esDocente ? "Gestión docente" : "Mi Aprendizaje",
      icon: IconBook,
    },
    {
      id: 3,
      nav: "/plataforma/ponencias",
      label: "Ponencias",
      icon: IconPlayCircle,
      soloEstudiante: true,
    },
  ];

  const navItems = allNavItems.filter(
    (item) => !(item.soloEstudiante && esDocente),
  );

  const isActive = (nav: string) =>
    nav === "/plataforma"
      ? pathname === "/plataforma"
      : pathname.startsWith(nav);

  // Solo visible en desktop — en móvil la navegación es el BottomNav
  return (
    <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 flex-col z-40">
      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.nav);
          return (
            <Link
              key={item.id}
              href={item.nav}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-blue-50 text-[#0056D2] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#0056D2] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.nombre_completo?.[0] ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.nombre_completo}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
