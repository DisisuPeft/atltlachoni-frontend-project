"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  PencilIcon,
  Award,
} from "lucide-react";
import {
  useRetrieveMaestroQuery,
  useUpdateMaestroMutation,
  useActivarMaestroMutation,
  useDesactivarMaestroMutation,
} from "@/redux/features/control-escolar/maestrosApiSlice";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import { useGetGenerosQuery } from "@/redux/features/catalogos/generoApiSlice";
import {
  useRetrieveNivelEducativoQuery,
  useRetrieveInstitucionesQuery,
  useRetrieveEstadosQuery,
  useRetrieveLocalidadesQuery,
} from "@/redux/features/catalogos/genericosApiSlice";
import { MaestroPerfilForm } from "@/redux/features/types/control-escolar/type";
import type { Genero } from "@/redux/features/types/auth/auth-types";
import { sweetAlert } from "@/sweetalert/sweetalerts";

// ── Primitives ────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 mb-6">
      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-purple-600" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

// ── Profile header ───────────────────────────────────────────────────

function ProfileHeader({
  docenteRef,
  disabled,
  onToggleEdit,
}: {
  docenteRef: string;
  disabled: boolean;
  onToggleEdit: () => void;
}) {
  const { data: maestro, isLoading } = useRetrieveMaestroQuery(docenteRef);
  const [activar, { isLoading: activando }] = useActivarMaestroMutation();
  const [desactivar, { isLoading: desactivando }] = useDesactivarMaestroMutation();
  const toggling = activando || desactivando;

  const handleToggleStatus = async () => {
    try {
      if (maestro?.status === 1) {
        await desactivar(docenteRef).unwrap();
      } else {
        await activar(docenteRef).unwrap();
      }
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "No se pudo cambiar el estado", "Error");
    }
  };

  const nombre = maestro
    ? `${maestro.user_obj?.nombre ?? ""} ${maestro.user_obj?.apellido_paterno ?? ""} ${maestro.user_obj?.apellido_materno ?? ""}`.trim()
    : "";

  const initials = nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0">
          {isLoading ? (
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-xl font-bold text-purple-600">{initials}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {nombre || "—"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                {maestro?.user_obj?.email && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail className="w-3 h-3" />
                    {maestro.user_obj.email}
                  </span>
                )}
                {maestro?.user_obj?.telefono && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone className="w-3 h-3" />
                    {maestro.user_obj.telefono}
                  </span>
                )}
                {maestro?.numero_cedula && (
                  <span className="text-xs font-mono text-gray-400">
                    Céd. {maestro.numero_cedula}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
          {maestro && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                maestro.status === 1
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${maestro.status === 1 ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {maestro.status === 1 ? "Activo" : "Inactivo"}
            </span>
          )}
          <div className="flex items-center gap-2">
            {maestro && (
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={toggling}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  maestro.status === 1
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {toggling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${maestro.status === 1 ? "bg-red-400" : "bg-emerald-500"}`}
                  />
                )}
                {maestro.status === 1 ? "Desactivar" : "Activar"}
              </button>
            )}
            <button
              type="button"
              onClick={onToggleEdit}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                !disabled
                  ? "border-purple-500 text-purple-600 bg-purple-50"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PencilIcon className="w-3.5 h-3.5" />
              {disabled ? "Editar" : "Editando"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────

export default function DocenteEditView({ docenteRef }: { docenteRef: string }) {
  const [disabled, setDisabled] = useState(true);

  const { data: maestro, isLoading } = useRetrieveMaestroQuery(docenteRef);
  const [updateMaestro, { isLoading: isSubmitting }] = useUpdateMaestroMutation();

  const { data: verify } = useVerifyUserQuery();
  const isAdmin =
    verify?.superuser ||
    verify?.roles?.some((r) => r.nombre === "Administrador");

  const { data: generos } = useGetGenerosQuery();
  const { data: nivelEducativo } = useRetrieveNivelEducativoQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery(undefined);
  const { data: estados } = useRetrieveEstadosQuery();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<MaestroPerfilForm>();

  const estadoSeleccionado = watch("estado_pais");
  const { data: localidades } = useRetrieveLocalidadesQuery(
    Number(estadoSeleccionado),
    { skip: !estadoSeleccionado }
  );

  useEffect(() => {
    if (maestro && !isLoading) {
      reset({
        ...maestro,
        user: maestro.user_obj ?? maestro.user,
      });
    }
  }, [maestro, isLoading, reset]);

  const onSubmit = async (data: MaestroPerfilForm) => {
    try {
      await updateMaestro({ ref: docenteRef, formData: data }).unwrap();
      sweetAlert("success", "Datos del docente actualizados.", "Guardado");
      setDisabled(true);
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "No se pudo guardar los cambios.", "Error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <ProfileHeader
        docenteRef={docenteRef}
        disabled={disabled}
        onToggleEdit={() => setDisabled((v) => !v)}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            {!disabled && (
              <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                <PencilIcon className="w-4 h-4 flex-shrink-0" />
                Modo edición activo — los cambios se guardan al presionar{" "}
                <strong>Guardar cambios</strong>
              </div>
            )}

            {/* Personal */}
            <div>
              <SectionHeader
                icon={User}
                title="Información Personal"
                description="Datos de identificación del docente"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Nombre" required error={errors.user?.nombre?.message}>
                  <input
                    disabled={disabled}
                    {...register("user.nombre", { required: "Requerido" })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Apellido Paterno" required error={errors.user?.apellido_paterno?.message}>
                  <input
                    disabled={disabled}
                    {...register("user.apellido_paterno", { required: "Requerido" })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Apellido Materno">
                  <input
                    disabled={disabled}
                    {...register("user.apellido_materno")}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Género">
                  <select disabled={disabled} {...register("user.genero")} className={selectClass}>
                    <option value="">Seleccionar</option>
                    {generos?.results.map((g: Genero) => (
                      <option key={g.id} value={g.id}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {/* Contacto */}
            <div>
              <SectionHeader
                icon={Mail}
                title="Información de Contacto"
                description="Email y teléfono del docente"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Email" required error={errors.user?.email?.message}>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      disabled={disabled}
                      type="email"
                      {...register("user.email", {
                        required: "El email es requerido",
                        pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
                      })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>
                <Field label="Teléfono">
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      disabled={disabled}
                      type="tel"
                      {...register("user.telefono")}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Profesional */}
            <div>
              <SectionHeader
                icon={Award}
                title="Datos Profesionales"
                description="Cédula, certificado y nivel educativo"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Número de Cédula">
                  <input
                    disabled={disabled}
                    {...register("numero_cedula")}
                    className={inputClass}
                  />
                </Field>
                <Field label="¿Tiene Certificado?">
                  <select
                    disabled={disabled}
                    {...register("tiene_certificado")}
                    className={selectClass}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </Field>
                <Field label="Nivel Educativo">
                  <select
                    disabled={disabled}
                    {...register("nivel_educativo")}
                    className={selectClass}
                  >
                    <option value="">Seleccionar</option>
                    {nivelEducativo?.map((niv) => (
                      <option key={niv.id} value={niv.id}>
                        {niv.nombre}
                      </option>
                    ))}
                  </select>
                </Field>
                {isAdmin && (
                  <Field label="Institución">
                    <select
                      disabled={disabled}
                      {...register("institucion")}
                      className={selectClass}
                    >
                      <option value="">Seleccionar</option>
                      {instituciones?.map((ins) => (
                        <option key={ins.id} value={ins.id}>
                          {ins.nombre}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <SectionHeader
                icon={MapPin}
                title="Ubicación"
                description="Estado y ciudad de residencia"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Estado">
                  <select
                    disabled={disabled}
                    {...register("estado_pais")}
                    className={selectClass}
                  >
                    <option value="">Seleccionar estado</option>
                    {estados?.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Ciudad">
                  <select
                    disabled={disabled}
                    {...register("ciudad")}
                    className={selectClass}
                  >
                    <option value="">
                      {estadoSeleccionado
                        ? "Seleccionar ciudad"
                        : "Selecciona un estado primero"}
                    </option>
                    {localidades?.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {!disabled && (
            <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}