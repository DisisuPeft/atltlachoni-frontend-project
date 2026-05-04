"use client";

import { useState, useMemo } from "react";
import { useGetRolesQuery } from "@/redux/features/auth/roleApiSlice";
import {
  useGetPermisosQuery,
  useAsignarPermisosMutation,
  useQuitarPermisosMutation,
  type Permiso,
} from "@/redux/features/auth/permisosApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";

interface RolePermisosTabProps {
  userRoles: number[];
}

export default function RolePermisosTab({ userRoles }: RolePermisosTabProps) {
  const dispatch = useAppDispatch();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [pendingAdd, setPendingAdd] = useState<Set<number>>(new Set());
  const [pendingRemove, setPendingRemove] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const { data: allRoles } = useGetRolesQuery({ q: "", page: 1 });
  const { data: allPermisos, isLoading: loadingPermisos, refetch } = useGetPermisosQuery(
    { q: search, page, role: selectedRoleId ?? undefined },
    { skip: selectedRoleId === null },
  );

  const [asignar] = useAsignarPermisosMutation();
  const [quitar] = useQuitarPermisosMutation();

  const userRoleObjects = useMemo(
    () => allRoles?.results.filter((r) => userRoles.map(Number).includes(r.id)) ?? [],
    [allRoles, userRoles],
  );

  // Derived: is a permission checked (considering pending changes)
  const isChecked = (p: Permiso) =>
    (p.asignado && !pendingRemove.has(p.id)) || pendingAdd.has(p.id);

  // Group current page by app_label
  const grouped = useMemo<Record<string, Permiso[]>>(() => {
    if (!allPermisos) return {};
    return allPermisos.results.reduce<Record<string, Permiso[]>>((acc, p) => {
      const app = p.content_type_detail.app_label;
      if (!acc[app]) acc[app] = [];
      acc[app].push(p);
      return acc;
    }, {});
  }, [allPermisos]);

  const totalPages = allPermisos ? Math.ceil(allPermisos.count / 12) : 1;
  const pendingCount = pendingAdd.size + pendingRemove.size;

  const handleRoleChange = (roleId: number) => {
    setSelectedRoleId(roleId);
    setPendingAdd(new Set());
    setPendingRemove(new Set());
    setSearch("");
    setPage(1);
  };

  const togglePermiso = (p: Permiso) => {
    const checked = isChecked(p);
    if (checked) {
      if (p.asignado) setPendingRemove((prev) => new Set([...prev, p.id]));
      setPendingAdd((prev) => { const n = new Set(prev); n.delete(p.id); return n; });
    } else {
      if (!p.asignado) setPendingAdd((prev) => new Set([...prev, p.id]));
      setPendingRemove((prev) => { const n = new Set(prev); n.delete(p.id); return n; });
    }
  };

  const toggleApp = (permisos: Permiso[]) => {
    const allChecked = permisos.every(isChecked);
    const newAdd = new Set(pendingAdd);
    const newRemove = new Set(pendingRemove);
    if (allChecked) {
      permisos.forEach((p) => { if (p.asignado) newRemove.add(p.id); newAdd.delete(p.id); });
    } else {
      permisos.forEach((p) => { if (!p.asignado) newAdd.add(p.id); newRemove.delete(p.id); });
    }
    setPendingAdd(newAdd);
    setPendingRemove(newRemove);
  };

  const handleSave = async () => {
    if (!selectedRoleId || pendingCount === 0) return;
    setSaving(true);
    try {
      if (pendingAdd.size > 0)
        await asignar({ roleId: selectedRoleId, permisos: [...pendingAdd] }).unwrap();
      if (pendingRemove.size > 0)
        await quitar({ roleId: selectedRoleId, permisos: [...pendingRemove] }).unwrap();
      setPendingAdd(new Set());
      setPendingRemove(new Set());
      refetch();
      dispatch(setAlert({ type: "success", message: "Permisos actualizados correctamente" }));
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al actualizar permisos" }));
    } finally {
      setSaving(false);
    }
  };

  if (userRoles.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400 text-sm">
          Asigne al menos un rol al usuario en la pestaña <strong>Datos</strong> para gestionar permisos.
        </p>
      </div>
    );
  }

  const appEntries = Object.entries(grouped);

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1.5 min-w-[220px]">
          <label className="text-sm font-medium text-gray-700">Rol a configurar</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedRoleId ?? ""}
            onChange={(e) => handleRoleChange(Number(e.target.value))}
          >
            <option value="">-- Seleccionar rol --</option>
            {userRoleObjects.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        {selectedRoleId && (
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-gray-700">Buscar permiso</label>
            <input
              type="text"
              placeholder="Filtrar permisos..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* Permissions grid */}
      {selectedRoleId && (
        <>
          {loadingPermisos ? (
            <div className="py-12 text-center text-sm text-gray-400">Cargando permisos...</div>
          ) : appEntries.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No se encontraron permisos.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {appEntries.map(([app, permisos]) => {
                const checkedCount = permisos.filter(isChecked).length;
                const allChecked = checkedCount === permisos.length;
                const someChecked = checkedCount > 0 && !allChecked;

                return (
                  <div key={app} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-3 border-b border-gray-200">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => { if (el) el.indeterminate = someChecked; }}
                        onChange={() => toggleApp(permisos)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex-1">
                        {app}
                      </span>
                      <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                        {checkedCount} / {permisos.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gray-100">
                      {permisos.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked(p)}
                            onChange={() => togglePermiso(p)}
                            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                          />
                          <span className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-sm text-gray-700 leading-tight">{p.name}</span>
                            {p.pestanias.length === 0 ? (
                              <span className="text-xs text-amber-500">Sin pestaña asociada</span>
                            ) : (
                              <span className="text-xs text-gray-400 truncate">
                                {p.pestanias.map((t) => t.nombre).join(", ")}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 py-2">
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                {allPermisos && (
                  <span className="text-gray-400"> · {allPermisos.count} permisos</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              {pendingCount === 0 ? (
                "Sin cambios pendientes"
              ) : (
                <>
                  {pendingAdd.size > 0 && <span className="text-green-600">+{pendingAdd.size} por agregar</span>}
                  {pendingAdd.size > 0 && pendingRemove.size > 0 && <span className="mx-1 text-gray-300">·</span>}
                  {pendingRemove.size > 0 && <span className="text-red-500">−{pendingRemove.size} por quitar</span>}
                </>
              )}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || pendingCount === 0}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Guardando..." : "Guardar Permisos"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}