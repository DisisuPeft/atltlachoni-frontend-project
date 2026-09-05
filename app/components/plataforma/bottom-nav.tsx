"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { IconDashboard, IconBook, IconPlayCircle } from "./iconst";

const allNavItems = [
  { id: 1, nav: "/plataforma", label: "Inicio", icon: IconDashboard },
  { id: 2, nav: "/plataforma/educacion", label: "Aprendizaje", docenteLabel: "Gestión", icon: IconBook },
  { id: 3, nav: "/plataforma/ponencias", label: "Ponencias", icon: IconPlayCircle, soloEstudiante: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: user } = useRetrieveUserQuery();
  const esDocente = user?.roles_list?.some((r) => r.nombre === "Docente") ?? false;
  const navItems = allNavItems.filter((item) => !(item.soloEstudiante && esDocente));

  const isActive = (nav: string) =>
    nav === "/plataforma" ? pathname === "/plataforma" : pathname.startsWith(nav);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-inset-bottom">
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.nav);
          return (
            <Link
              key={item.id}
              href={item.nav}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "text-[#0056D2]" : "text-gray-400"
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#0056D2] rounded-full" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{esDocente && item.docenteLabel ? item.docenteLabel : item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
