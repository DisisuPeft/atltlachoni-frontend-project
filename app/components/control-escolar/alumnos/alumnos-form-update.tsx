"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EstudiantePerfilForm,
  estudiantePerfilInitialValues,
} from "@/redux/features/types/control-escolar/type";

interface Props {
  ref?: string;
  type: string;
}
export default function EstudianteDetallePage({ ref, type }: Props) {
  const router = useRouter();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EstudiantePerfilForm>({
    defaultValues: estudiantePerfilInitialValues,
  });

  const onSubmit = async (data: EstudiantePerfilForm) => {
    setGuardando(true);
    console.log("[v0] Datos del estudiante a guardar:", data);

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setGuardando(false);
    setModoEdicion(false);
    alert("Datos del estudiante guardados exitosamente");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/estudiantes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a estudiantes
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {estudianteEjemplo.user.nombre}{" "}
                {estudianteEjemplo.user.apellido_paterno}{" "}
                {estudianteEjemplo.user.apellido_materno}
              </h1>
              <p className="text-gray-600 mt-1">
                Matrícula: {estudianteEjemplo.matricula}
              </p>
            </div> */}

            {!modoEdicion ? (
              <button
                onClick={() => setModoEdicion(true)}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar Información
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setModoEdicion(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={guardando}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Personal */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información Personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("user.nombre", {
                    required: "El nombre es requerido",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.user?.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.nombre.message}
                  </p>
                )}
              </div>

              {/* Apellido Paterno */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("user.apellido_paterno", {
                    required: "El apellido paterno es requerido",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.user?.apellido_paterno && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.apellido_paterno.message}
                  </p>
                )}
              </div>

              {/* Apellido Materno */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido Materno <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("user.apellido_materno", {
                    required: "El apellido materno es requerido",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.user?.apellido_materno && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.apellido_materno.message}
                  </p>
                )}
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("user.genero", {
                    required: "El género es requerido",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value={0}>Seleccionar</option>
                  <option value={1}>Masculino</option>
                  <option value={2}>Femenino</option>
                  <option value={3}>Otro</option>
                </select>
                {errors.user?.genero && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.genero.message}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("user.fecha_nacimiento", {
                    required: "La fecha de nacimiento es requerida",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.user?.fecha_nacimiento && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.fecha_nacimiento.message}
                  </p>
                )}
              </div>

              {/* Edad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("user.edad", {
                    required: "La edad es requerida",
                    min: 1,
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.user?.edad && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.edad.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información de Contacto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("user.email", {
                    required: "El email es requerido",
                    pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.user?.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.email.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("user.telefono", {
                    required: "El teléfono es requerido",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.user?.telefono && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user.telefono.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información Académica */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información Académica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matrícula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matrícula <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("matricula", {
                    required: "La matrícula es requerida",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.matricula && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.matricula.message}
                  </p>
                )}
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidad <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("especialidad", {
                    required: "La especialidad es requerida",
                  })}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.especialidad && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.especialidad.message}
                  </p>
                )}
              </div>

              {/* Fecha de Ingreso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  {...register("fecha_ingreso")}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Nivel Educativo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel Educativo
                </label>
                <select
                  {...register("nivel_educativo")}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  <option value={1}>Técnico</option>
                  <option value={2}>Técnico Superior</option>
                  <option value={3}>Licenciatura</option>
                  <option value={4}>Maestría</option>
                  <option value={5}>Doctorado</option>
                </select>
              </div>

              {/* Institución */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                <select
                  {...register("institucion")}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  <option value={1}>Universidad Central</option>
                  <option value={2}>Instituto Tecnológico</option>
                  <option value={3}>Escuela Superior</option>
                </select>
              </div>

              {/* Estado/País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado/País
                </label>
                <select
                  {...register("estado_pais")}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  <option value={1}>Aguascalientes</option>
                  <option value={15}>Ciudad de México</option>
                  <option value={19}>Nuevo León</option>
                  <option value={14}>Jalisco</option>
                </select>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <select
                  {...register("ciudad")}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  <option value={1}>Ciudad Principal</option>
                  <option value={2}>Ciudad Secundaria</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Estudiante
                </label>
                <select
                  {...register("status")}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                  <option value={2}>Suspendido</option>
                  <option value={3}>Egresado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Configuración de Usuario
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estado del Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Usuario
                </label>
                <select
                  {...register("user.status")}
                  disabled={!modoEdicion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>

              {/* Roles - Mostrando solo información */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Estudiante
                  </span>
                </div>
              </div>
            </div>

            {modoEdicion && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Nota:</span> Por seguridad, la
                  contraseña no se muestra. Si necesita cambiarla, el usuario
                  debe utilizar la función de restablecimiento de contraseña.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
