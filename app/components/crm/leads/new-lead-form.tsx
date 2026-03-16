"use client";

import { useLeadForm } from "@/hooks";
import Input from "@/app/ui/components/input";
import Select from "@/app/ui/components/select";
import Textarea from "@/app/ui/components/textarea";

export default function createLead() {
  const {
    register,
    watch,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    etapas,
    estatus,
    fuentes,
    programas,
    campanias,
  } = useLeadForm();
  //   console.log(isSubmitting);
  const programaSeleccionado = watch("programa_objetivo_id");

  return (
    <div className="w-full max-w-4xl p-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo lead</h1>
        <p className="text-gray-600 mt-1">
          Debes ingresar la información del prospecto para registrarlo en el
          sistema.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección: Datos Personales */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Datos Personales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              placeholder="Ej: Juan"
              register={register("nombre")}
              error={errors.nombre?.message}
            />

            <Input
              label="Apellido Paterno *"
              placeholder="Ej: Pérez"
              register={register("apellido_paterno")}
              error={errors.apellido_paterno?.message}
            />

            <Input
              label="Apellido Materno "
              placeholder="Ej: García"
              register={register("apellido_materno")}
              error={errors.apellido_materno?.message}
            />
          </div>
        </div>

        {/* Sección: Datos de Contacto */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Datos de Contacto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email *"
              type="email"
              placeholder="Ej: juan.perez@email.com"
              register={register("correo")}
              error={errors.correo?.message}
            />

            <Input
              label="Teléfono (10 dígitos) *"
              type="tel"
              placeholder="Ej: 9612345678"
              register={register("telefono")}
              error={errors.telefono?.message}
              maxLength={10}
            />
            <Input
              label="Medio de contacto adicional Teléfono (10 dígitos) *"
              type="tel"
              placeholder="Ej: 9612345678"
              register={register("contacto_alterno")}
              error={errors.contacto_alterno?.message}
              maxLength={10}
            />
          </div>
        </div>

        {/* Sección: Información Comercial */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Información Comercial
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Fuente *"
              options={fuentes ?? []}
              valueKey="id"
              labelKey="nombre"
              placeholder="Canal de ingreso"
              register={register("fuente")}
              error={errors.fuente?.message}
            />

            <Select
              label="Etapa Inicial *"
              options={etapas ?? []}
              placeholder="Selecciona la etapa"
              register={register("etapa_id")}
              error={errors.etapa_id?.message}
            />
            <Select
              label="Estatus Inicial *"
              options={estatus ?? []}
              placeholder="Selecciona el estatus"
              register={register("estatus_id")}
              error={errors.estatus_id?.message}
            />

            <Select
              label="Programa de Interés *"
              options={programas ?? []}
              placeholder="Selecciona el programa"
              register={register("programa_objetivo_id")}
              error={errors.programa_objetivo_id?.message}
            />

            <Select
              label="Campaña *"
              options={campanias ?? []}
              placeholder={
                programaSeleccionado
                  ? "Selecciona la campaña"
                  : "Primero selecciona un programa"
              }
              register={register("campania_id")}
              error={errors.campania_id?.message}
              disabled={!programaSeleccionado}
            />

            {/* <div className="md:col-span-2">
              <Select
                label="Vendedor Asignado *"
                options={VENDEDORES}
                placeholder="Selecciona el vendedor responsable"
                register={register("vendedor_id")}
                error={errors.vendedor_id?.message}
              />
            </div> */}
          </div>
        </div>

        {/* Sección: Notas */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Notas Adicionales
          </h2>

          <Textarea
            label="Notas (opcional)"
            placeholder="Agrega cualquier información adicional relevante sobre el prospecto..."
            register={register("notas")}
            error={errors.notas?.message}
            rows={4}
          />
        </div>

        {/* Botón Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creando...
              </>
            ) : (
              "Crear Lead"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
