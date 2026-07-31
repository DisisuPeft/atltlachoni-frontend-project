"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRetrieveUserQuery, useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import ModulosGrid from "./modulos-card";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: verify, isLoading: isLoadingRoles } = useVerifyUserQuery();
  const { data: user, isLoading: isLoadingUser } = useRetrieveUserQuery();
  const roles = verify?.roles ?? [];
  const isVendedor = roles.some((role) => role.nombre === "Vendedor");
  const isAdministrador = verify?.superuser || roles.some((role) => role.nombre === "Administrador");
  const isVendedorPuro = isVendedor && !isAdministrador;

  useEffect(() => {
    if (!isVendedorPuro || !user || pathname !== "/dashboard") return;

    const crmModule = user.modulos_accesibles?.find((module) =>
      module.href === "/dashboard/crm" || module.href.startsWith("/dashboard/crm/"),
    );
    const params = new URLSearchParams(searchParams.toString());
    if (crmModule?.uuid) params.set("ref", crmModule.uuid);
    const crmPath = crmModule?.href?.replace(/\/$/, "") || "/dashboard/crm";
    const destination = crmPath === "/dashboard/crm" ? "/dashboard/crm/menu" : crmPath;
    router.replace(`${destination}${params.size ? `?${params.toString()}` : ""}`);
  }, [isVendedorPuro, pathname, router, searchParams, user]);

  const resolvingRole = isLoadingRoles || isLoadingUser;
  if (pathname === "/dashboard" && (resolvingRole || isVendedorPuro)) {
    return <main className="flex min-h-full flex-1 items-center justify-center bg-slate-50" aria-busy="true" />;
  }

  // El módulo CRM trae su propio sidebar fijo (app/components/crm/side-bar.tsx),
  // así que no debe apilarse con el ModulosGrid genérico o queda un hueco entre ambos.
  const hasOwnSidebar = pathname.startsWith("/dashboard/crm");

  return (
    <>
      {!resolvingRole && !isVendedorPuro && !hasOwnSidebar && <ModulosGrid />}
      <main className="flex-1 overflow-auto">{children}</main>
    </>
  );
}
