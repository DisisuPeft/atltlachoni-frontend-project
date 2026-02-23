"use client";

import ButtonLink from "../../control-escolar/link-button";

// import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";

export function DashboardHeader() {
  // const { data: user } = useRetrieveUserQuery();
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xl sm:text-xl text-gray-600 mt-1 font-bold">
              Mis movimientos
            </p>
          </div>
          <div className="flex items-center">
            <ButtonLink path={"/dashboard/crm/nuevo-lead"}>
              Crear Lead
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
