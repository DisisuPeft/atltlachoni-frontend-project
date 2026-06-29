"use client";
import {
  useGetDepartamentosQuery,
  useAddDepartamentoMutation,
  useEditDepartamentoMutation,
  useDeleteDepartamentoMutation,
  useGetUsuariosDepartamentoQuery,
  useAsignarUsuariosMutation,
  useQuitarUsuariosMutation,
} from "@/redux/features/catalogos/departamentoApiSlice";
import { useGetInstitucionesQuery } from "@/redux/features/catalogos/institucionesApiSlice";
import Card from "@/app/ui/components/card";
import { Modal } from "../../common/modal";
import Input from "@/app/ui/components/input";
import Select from "@/app/ui/components/select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { Departamento, DepartamentoFormData } from "@/redux/features/types/catalagos/cat";
import { Plus, Pencil, Trash2, Users, UserMinus } from "lucide-react";
import { useGetUsersQuery } from "@/redux/features/auth/userApiSlice";
import { useGetRolesQuery } from "@/redux/features/auth/roleApiSlice";

export default function DepartamentosGrid() {
  const dispatch = useAppDispatch();
  const { data: departamentos, isLoading } = useGetDepartamentosQuery();
  const { data: instituciones } = useGetInstitucionesQuery();
  const [addDepartamento] = useAddDepartamentoMutation();
  const [editDepartamento] = useEditDepartamentoMutation();
  const [deleteDepartamento] = useDeleteDepartamentoMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Departamento | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Departamento | null>(null);
  const [usuariosTarget, setUsuariosTarget] = useState<Departamento | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartamentoFormData>({ mode: "onChange" });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<DepartamentoFormData>({ mode: "onChange" });

  const onSubmitCreate = async (data: DepartamentoFormData) => {
    try {
      await addDepartamento({
        ...data,
        jefe_departamento: data.jefe_departamento ? Number(data.jefe_departamento) : null,
        instituto: Number(data.instituto),
      }).unwrap();
      reset();
      setShowCreate(false);
      dispatch(setAlert({ type: "success", message: "Departamento creado con éxito." }));
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al crear el departamento." }));
    }
  };

  const onSubmitEdit = async (data: DepartamentoFormData) => {
    if (!editTarget) return;
    try {
      await editDepartamento({
        id: editTarget.id,
        formData: {
          ...data,
          jefe_departamento: data.jefe_departamento ? Number(data.jefe_departamento) : null,
          instituto: Number(data.instituto),
        },
      }).unwrap();
      resetEdit();
      setEditTarget(null);
      dispatch(setAlert({ type: "success", message: "Departamento actualizado." }));
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al actualizar el departamento." }));
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDepartamento(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      dispatch(setAlert({ type: "success", message: "Departamento eliminado." }));
    } catch {
      dispatch(
        setAlert({
          type: "error",
          message: "No se puede eliminar: el departamento tiene usuarios activos.",
        })
      );
    }
  };

  const openEdit = (dep: Departamento) => {
    setEditTarget(dep);
    resetEdit({
      nombre: dep.nombre,
      icono: dep.icono,
      jefe_departamento: dep.jefe_departamento,
      instituto: dep.instituto,
    });
  };

  if (isLoading) return <div>Cargando departamentos...</div>;

  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <button onClick={() => setShowCreate(true)}>
          <div className="flex flex-row gap-2 rounded-md bg-sky-500 p-2 text-white cursor-pointer">
            <Plus />
            Crear Departamento
          </div>
        </button>
      </div>

      {!departamentos || departamentos.results.length === 0 ? (
        <div>No existen departamentos</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {departamentos.results.map((dep) => (
            <Card key={dep.id}>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{dep.nombre}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUsuariosTarget(dep)}
                      className="text-sky-500 hover:text-sky-700"
                      title="Ver usuarios"
                    >
                      <Users size={18} />
                    </button>
                    <button
                      onClick={() => openEdit(dep)}
                      className="text-amber-500 hover:text-amber-700"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(dep)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{dep.instituto_nombre}</p>
                {dep.jefe_nombre && (
                  <p className="text-sm">Jefe: {dep.jefe_nombre}</p>
                )}
                <p className="text-sm text-gray-400">{dep.total_usuarios} usuario(s)</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Crear */}
      <Modal show={showCreate} onClose={() => { setShowCreate(false); reset(); }}>
        <form onSubmit={handleSubmit(onSubmitCreate)} className="p-10 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Nuevo Departamento</h2>
          <div>
            <Input
              label="Nombre"
              type="text"
              {...register("nombre", {
                required: "El nombre es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
              })}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
          </div>
          <div>
            <Input
              label="Ícono"
              type="text"
              placeholder="ej. users, chart, building"
              {...register("icono", { required: "El ícono es requerido" })}
            />
            {errors.icono && <p className="text-red-500 text-sm">{errors.icono.message}</p>}
          </div>
          <div>
            <Select
              label="Institución"
              options={instituciones?.results ?? []}
              labelKey="nombre"
              valueKey="id"
              required
              {...register("instituto", { required: "Selecciona una institución" })}
            />
            {errors.instituto && <p className="text-red-500 text-sm">{errors.instituto.message}</p>}
          </div>
          <div>
            <Input
              label="ID Jefe de Departamento (opcional)"
              type="number"
              {...register("jefe_departamento")}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="rounded-md bg-sky-500 text-white p-2 cursor-pointer"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar */}
      <Modal show={!!editTarget} onClose={() => { setEditTarget(null); resetEdit(); }}>
        <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="p-10 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Editar Departamento</h2>
          <div>
            <Input
              label="Nombre"
              type="text"
              {...registerEdit("nombre", {
                required: "El nombre es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
            />
            {errorsEdit.nombre && <p className="text-red-500 text-sm">{errorsEdit.nombre.message}</p>}
          </div>
          <div>
            <Input
              label="Ícono"
              type="text"
              {...registerEdit("icono", { required: "El ícono es requerido" })}
            />
            {errorsEdit.icono && <p className="text-red-500 text-sm">{errorsEdit.icono.message}</p>}
          </div>
          <div>
            <Select
              label="Institución"
              options={instituciones?.results ?? []}
              labelKey="nombre"
              valueKey="id"
              required
              {...registerEdit("instituto", { required: true })}
            />
          </div>
          <div>
            <Input
              label="ID Jefe de Departamento (opcional)"
              type="number"
              {...registerEdit("jefe_departamento")}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="rounded-md bg-amber-500 text-white p-2 cursor-pointer"
            >
              {isSubmittingEdit ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal show={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="p-10 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Eliminar Departamento</h2>
          <p>
            ¿Estás seguro de que deseas eliminar{" "}
            <strong>{deleteTarget?.nombre}</strong>? Esta acción no se puede
            deshacer.
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-md border border-gray-300 p-2 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onDelete}
              className="rounded-md bg-red-500 text-white p-2 cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Usuarios del Departamento */}
      {usuariosTarget && (
        <UsuariosDepartamentoModal
          departamento={usuariosTarget}
          onClose={() => setUsuariosTarget(null)}
        />
      )}
    </div>
  );
}

function UsuariosDepartamentoModal({
  departamento,
  onClose,
}: {
  departamento: Departamento;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<"asignados" | "asignar">("asignados");
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<number | undefined>();
  const [searchQ, setSearchQ] = useState("");

  const { data: asignados, isLoading: loadingAsignados } =
    useGetUsuariosDepartamentoQuery({ id: departamento.id });
  const { data: roles } = useGetRolesQuery({ q: "", page: 1 });
  const { data: todosUsuarios, isLoading: loadingTodos } = useGetUsersQuery(
    { q: searchQ, page: 1, role: roleFilter },
    { skip: tab !== "asignar" }
  );
  const [asignarUsuarios] = useAsignarUsuariosMutation();
  const [quitarUsuarios] = useQuitarUsuariosMutation();

  const toggleSelect = (uuid: string) =>
    setSelectedUuids((prev) =>
      prev.includes(uuid) ? prev.filter((u) => u !== uuid) : [...prev, uuid]
    );

  const handleAsignar = async () => {
    if (!selectedUuids.length) return;
    try {
      const msg = await asignarUsuarios({
        id: departamento.id,
        usuarios: selectedUuids,
      }).unwrap();
      dispatch(setAlert({ type: "success", message: String(msg) }));
      setSelectedUuids([]);
      onClose();
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al asignar usuarios." }));
    }
  };

  const handleQuitar = async (uuid: string) => {
    try {
      await quitarUsuarios({ id: departamento.id, usuarios: [uuid] }).unwrap();
      dispatch(
        setAlert({ type: "success", message: "Usuario removido del departamento." })
      );
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al quitar el usuario." }));
    }
  };

  return (
    <Modal show onClose={onClose}>
      <div className="p-8 flex flex-col gap-4 w-[520px]">
        <h2 className="text-lg font-semibold">
          Usuarios — {departamento.nombre}
        </h2>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(["asignados", "asignar"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "asignados" ? "Asignados" : "Buscar y asignar"}
            </button>
          ))}
        </div>

        {/* Tab: Asignados */}
        {tab === "asignados" && (
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {loadingAsignados ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : !asignados || asignados.length === 0 ? (
              <p className="text-sm text-gray-500">Sin usuarios asignados.</p>
            ) : (
              asignados.map((u) => (
                <div
                  key={u.uuid}
                  className="flex justify-between items-center border border-border rounded-md px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{u.nombre_completo}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <button
                    onClick={() => handleQuitar(u.uuid)}
                    className="text-red-500 hover:text-red-700"
                    title="Quitar del departamento"
                  >
                    <UserMinus size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Buscar y asignar */}
        {tab === "asignar" && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="flex-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <select
                value={roleFilter ?? ""}
                onChange={(e) =>
                  setRoleFilter(e.target.value ? Number(e.target.value) : undefined)
                }
                className="border border-border rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Todos los roles</option>
                {roles?.results.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {loadingTodos ? (
                <p className="text-sm text-gray-500">Cargando...</p>
              ) : !todosUsuarios || todosUsuarios.results.length === 0 ? (
                <p className="text-sm text-gray-500">No se encontraron usuarios.</p>
              ) : (
                todosUsuarios.results.map((u) => (
                  <label
                    key={u.uuid}
                    className="flex items-center gap-3 border border-border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUuids.includes(u.uuid)}
                      onChange={() => toggleSelect(u.uuid)}
                      className="accent-sky-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {u.nombre} {u.apellido_paterno}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                    {u.departamento_info && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">
                        {u.departamento_info.nombre}
                      </span>
                    )}
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-gray-500">
                {selectedUuids.length} seleccionado(s)
              </span>
              <button
                onClick={handleAsignar}
                disabled={!selectedUuids.length}
                className="rounded-md bg-sky-500 text-white px-4 py-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Asignar seleccionados
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}