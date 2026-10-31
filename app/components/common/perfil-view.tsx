"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Loader2, Mail, Shield, Building2 } from "lucide-react";

export default function PerfilView() {
  const { data: user, isLoading } = useRetrieveUserQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando perfil…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-24 text-center text-sm text-gray-500">
        No pudimos cargar tu información de perfil.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Información de tu cuenta
        </p>
      </div>

      {/* Encabezado */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#0056D2] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {user.nombre_completo?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate">
            {user.nombre_completo}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Roles</h2>
        </div>
        {user.roles_list?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.roles_list.map((rol) => (
              <span
                key={rol.id}
                className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-[#0056D2]"
              >
                {rol.nombre}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Sin roles asignados</p>
        )}
      </div>

      {/* Departamento / instituto */}
      {user.departamento_info && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">
              Departamento
            </h2>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-400">Departamento</dt>
              <dd className="text-gray-800 font-medium mt-0.5">
                {user.departamento_info.nombre}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400">Instituto</dt>
              <dd className="text-gray-800 font-medium mt-0.5">
                {user.departamento_info.instituto.nombre}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
