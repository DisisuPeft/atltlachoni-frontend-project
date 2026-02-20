"use client";

import { useAlumnoForm } from "@/hooks";

export default function EstudianteDetallePage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    generos,
    nivelEducativo,
    instituciones,
    estados,
    localidades,
  } = useAlumnoForm();
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  {generos?.results.map((genero) => (
                    <option key={genero.id} value={genero.id}>
                      {genero.nombre}
                    </option>
                  ))}
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
                  disabled={true}
                  type="number"
                  {...register("user.edad", {
                    required: "La edad es requerida",
                    min: 1,
                  })}
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matrícula <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("matricula", {
                    required: "La matrícula es requerida",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.matricula && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.matricula.message}
                  </p>
                )}
              </div> */}

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidad <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("especialidad", {
                    required: "La especialidad es requerida",
                  })}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  {nivelEducativo?.map((niv) => (
                    <option key={niv.id} value={niv.id}>
                      {niv.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institución */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                <select
                  {...register("institucion")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  {instituciones?.map((ins) => (
                    <option key={ins.id} value={ins.id}>
                      {ins.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado/País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  {...register("estado_pais")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  {estados?.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <select
                  {...register("ciudad")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Seleccionar</option>
                  {localidades ? (
                    localidades.map((localidad) => (
                      <option key={localidad.id} value={localidad.id}>
                        {localidad.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No data</option>
                  )}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Crear Estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
