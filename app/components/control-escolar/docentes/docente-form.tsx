"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Loader2, Award } from "lucide-react";
import { useAddMaestroMutation } from "@/redux/features/control-escolar/maestrosApiSlice";
import { useRetrieveUserQuery, useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import { useGetGenerosQuery } from "@/redux/features/catalogos/generoApiSlice";
import type { Genero } from "@/redux/features/types/auth/auth-types";
import { useRetrieveNivelEducativoQuery, useRetrieveInstitucionesQuery, useRetrieveEstadosQuery, useRetrieveLocalidadesQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { MaestroPerfilForm, maestroPerfilInitialValues } from "@/redux/features/types/control-escolar/type";
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
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors";

// ── Main ─────────────────────────────────────────────────────────────

export default function DocenteForm() {
  const router = useRouter();
  const [addMaestro, { isLoading: isSubmitting }] = useAddMaestroMutation();

  const { data: verify } = useVerifyUserQuery();
  const { data: user } = useRetrieveUserQuery();
  const isAdmin =
    verify?.superuser ||
    verify?.roles?.some((r) => r.nombre === "Administrador");

  const { data: generos } = useGetGenerosQuery();
  const { data: nivelEducativo } = useRetrieveNivelEducativoQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery(
    { ins: isAdmin ? undefined : user?.departamento_info?.instituto.id },
    { skip: false }
  );
  const { data: estados } = useRetrieveEstadosQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MaestroPerfilForm>({ defaultValues: maestroPerfilInitialValues });

  const estadoSeleccionado = watch("estado_pais");
  const { data: localidades } = useRetrieveLocalidadesQuery(
    Number(estadoSeleccionado),
    { skip: !estadoSeleccionado }
  );

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: MaestroPerfilForm) => {
    setServerError(null);
    try {
      await addMaestro(data).unwrap();
      sweetAlert("success", "Docente creado. Se enviará el correo de activación si el email es nuevo.", "Docente creado");
      router.push("/dashboard/control-escolar/docentes");
    } catch (err: unknown) {
      const raw = (err as { data?: unknown })?.data;
      let msg = "No se pudo crear el docente.";
      if (typeof raw === "string") msg = raw;
      else if (raw && typeof raw === "object") {
        const first = Object.values(raw as Record<string, unknown>)[0];
        if (Array.isArray(first)) msg = String(first[0]);
        else if (typeof first === "string") msg = first;
      }
      setServerError(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Docente</h1>
        <p className="text-sm text-gray-500 mt-1">
          Completa los datos para registrar al docente. Si el email es nuevo se enviará automáticamente el correo de activación.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ── Información Personal ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={User}
            title="Información Personal"
            description="Datos de identificación del docente"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Nombre" required error={errors.user?.nombre?.message}>
              <input
                {...register("user.nombre", { required: "El nombre es requerido" })}
                placeholder="Ej. Juan"
                className={inputClass}
              />
            </Field>
            <Field label="Apellido Paterno" required error={errors.user?.apellido_paterno?.message}>
              <input
                {...register("user.apellido_paterno", { required: "El apellido paterno es requerido" })}
                placeholder="Ej. García"
                className={inputClass}
              />
            </Field>
            <Field label="Apellido Materno" error={errors.user?.apellido_materno?.message}>
              <input
                {...register("user.apellido_materno")}
                placeholder="Ej. López"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Género" required error={errors.user?.genero?.message}>
              <select
                {...register("user.genero", { required: "El género es requerido" })}
                className={selectClass}
              >
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

        {/* ── Contacto ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                  type="email"
                  {...register("user.email", {
                    required: "El email es requerido",
                    pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
                  })}
                  placeholder="correo@ejemplo.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
            <Field label="Teléfono" error={errors.user?.telefono?.message}>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  {...register("user.telefono")}
                  placeholder="10 dígitos"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* ── Datos Profesionales ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={Award}
            title="Datos Profesionales"
            description="Cédula, certificado y nivel educativo"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Número de Cédula" error={errors.numero_cedula?.message}>
              <input
                {...register("numero_cedula")}
                placeholder="Ej. 1234567"
                className={inputClass}
              />
            </Field>
            <Field label="¿Tiene Certificado?">
              <select {...register("tiene_certificado")} className={selectClass}>
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </Field>
            <Field label="Nivel Educativo">
              <select {...register("nivel_educativo")} className={selectClass}>
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
                <select {...register("institucion")} className={selectClass}>
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

        {/* ── Ubicación ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={MapPin}
            title="Ubicación"
            description="Estado y ciudad de residencia"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Estado">
              <select {...register("estado_pais")} className={selectClass}>
                <option value="">Seleccionar estado</option>
                {estados?.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ciudad">
              <select {...register("ciudad")} className={selectClass}>
                <option value="">
                  {estadoSeleccionado ? "Seleccionar ciudad" : "Selecciona un estado primero"}
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

        {/* ── Acciones ── */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Creando..." : "Crear Docente"}
          </button>
        </div>
      </form>
    </div>
  );
}