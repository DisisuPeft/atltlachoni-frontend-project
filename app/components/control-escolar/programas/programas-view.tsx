export default function ProgramasView() {
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {/* {programasEjemplo.length} */}
          </div>
          <div className="text-sm text-gray-600">Programas Activos</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {/* {programasEjemplo.reduce((acc, p) => acc + p.estudiantes, 0)} */}
          </div>
          <div className="text-sm text-gray-600">Estudiantes Totales</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {/* {programasFiltrados.length} */}
          </div>
          <div className="text-sm text-gray-600">Resultados Filtrados</div>
        </div>
      </div>
      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o descripción..."
                // value={busqueda}
                // onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filtro Modalidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modalidad
            </label>
            <select
              // value={filtroModalidad}
              // onChange={(e) => setFiltroModalidad(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
              <option value="Mixta">Mixta</option>
            </select>
          </div>

          {/* Filtro Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              // value={filtroTipo}
              // onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="Licenciatura">Licenciatura</option>
              <option value="Técnico">Técnico</option>
              <option value="Técnico Superior">Técnico Superior</option>
              <option value="Maestría">Maestría</option>
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {/* {(busqueda ||
              filtroModalidad !== "all" ||
              filtroTipo !== "all") && (
              <button
                onClick={() => {
                  setBusqueda("");
                  setFiltroModalidad("all");
                  setFiltroTipo("all");
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            )} */}
      </div>

      {/* Lista de Programas */}
      {/* {programasFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programasFiltrados.map((programa) => (
              <ProgramaCard key={programa.id} {...programa} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron programas
            </h3>
            <p className="text-gray-600 mb-4">
              No hay programas que coincidan con los filtros seleccionados
            </p>
            <button
              onClick={() => {
                setBusqueda("");
                setFiltroModalidad("all");
                setFiltroTipo("all");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )} */}
    </>
  );
}
