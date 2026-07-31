"use client";

import MultiSelect from "@/app/ui/components/select-multiple";
import {
  useUserForm,
  type UserFormData,
} from "@/hooks/users/user-create-form";
import { statusOptions } from "@/helpers";
import { Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  Calendar,
  Mail,
  ShieldCheck,
  Loader2,
  MailCheck,
} from "lucide-react";

// ── Shared primitives ────────────────────────────────────────────────

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
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 mb-5">
      <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#0056D2]" />
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
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const selectClass =
  "min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

// ── Form ─────────────────────────────────────────────────────────────

export default function UserForm() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    generos,
    rol,
    control,
  } = useUserForm(ref);

  const cancelHref = `/dashboard/sistema/usuarios?ref=${ref}`;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5">
          <Link
            href={cancelHref}
            className="inline-flex min-h-9 w-fit items-center gap-1.5 rounded-md px-1 text-sm font-medium text-slate-600 outline-none transition-colors hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Volver a usuarios
          </Link>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
              Sistema
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Crear Nuevo Usuario
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Registra una cuenta de staff (administradores, vendedores,
              etc.). El usuario recibirá un correo para activar su cuenta y
              definir su propia contraseña.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Información Personal */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
            <SectionHeader
              icon={User}
              title="Información Personal"
              description="Datos generales del usuario"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nombre" required error={errors.nombre?.message}>
                <input
                  placeholder="Ingrese el nombre"
                  {...register("nombre", {
                    required: "El nombre es requerido",
                  })}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Apellido Paterno"
                required
                error={errors.apellido_paterno?.message}
              >
                <input
                  placeholder="Ingrese el apellido paterno"
                  {...register("apellido_paterno", {
                    required: "El apellido paterno es requerido",
                  })}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Apellido Materno"
                error={errors.apellido_materno?.message}
              >
                <input
                  placeholder="Ingrese el apellido materno"
                  {...register("apellido_materno")}
                  className={inputClass}
                />
              </Field>
              <Field label="Género" required error={errors.genero?.message}>
                <select
                  {...register("genero", {
                    required: "El género es requerido",
                  })}
                  className={selectClass}
                >
                  <option value={0}>Seleccionar...</option>
                  {generos?.results.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.nombre}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Información Demográfica */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
            <SectionHeader
              icon={Calendar}
              title="Información Demográfica"
              description="Opcional"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Edad" error={errors.edad?.message}>
                <input
                  type="number"
                  placeholder="Ingrese la edad"
                  {...register("edad", {
                    min: { value: 1, message: "La edad debe ser mayor a 0" },
                    max: {
                      value: 100,
                      message: "La edad debe ser menor a 100",
                    },
                  })}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Fecha de Nacimiento"
                error={errors.fecha_nacimiento?.message}
              >
                <input
                  type="date"
                  {...register("fecha_nacimiento")}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
            <SectionHeader
              icon={Mail}
              title="Información de Contacto"
              description="Medios para comunicarse con el usuario"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Teléfono" required error={errors.telefono?.message}>
                <input
                  type="tel"
                  placeholder="10 dígitos"
                  maxLength={10}
                  {...register("telefono", {
                    required: "El teléfono es requerido",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "El teléfono debe tener 10 dígitos",
                    },
                  })}
                  className={inputClass}
                />
              </Field>
              <Field label="Email" required error={errors.email?.message}>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-sky-50 px-3.5 py-3 text-xs text-sky-800">
              <MailCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                No se asigna contraseña aquí: al crear el usuario se le
                enviará automáticamente un correo de activación a esta
                dirección para que configure su propio acceso.
              </p>
            </div>
          </div>

          {/* Roles y Estado */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
            <SectionHeader
              icon={ShieldCheck}
              title="Roles y Estado"
              description="Define los permisos y la disponibilidad de la cuenta"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Controller<UserFormData, "roles">
                name="roles"
                control={control}
                rules={{
                  required: true,
                  validate: (value) =>
                    value.length > 0 || "Debe seleccionar al menos un rol",
                }}
                render={({ field }) => (
                  <MultiSelect
                    label="Roles"
                    required
                    placeholder="Seleccione roles"
                    options={rol?.results ?? []}
                    labelKey="nombre"
                    valueKey="id"
                    {...field}
                    error={errors.roles?.message}
                  />
                )}
              />
              <Field label="Estado" required error={errors.status?.message}>
                <select
                  {...register("status", {
                    required: "El estado es requerido",
                  })}
                  className={selectClass}
                >
                  <option value={0}>Seleccionar...</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-slate-200 bg-[#f8fafc]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <Link
              href={cancelHref}
              className="min-h-10 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-white focus-visible:ring-2 focus-visible:ring-sky-600 inline-flex items-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
