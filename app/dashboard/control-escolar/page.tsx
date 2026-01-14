import StatCard from "@/app/components/common/stat-card";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Programas Activos" value={0} bgColor="bg-blue-50" />
        <StatCard
          title="Estudiantes Inscritos"
          value={0}
          bgColor="bg-green-50"
        />
        <StatCard title="Instructores" value={0} bgColor="bg-amber-50" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Programas Educativos */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Programas Educativos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* {programasActivos.map((programa) => (
              <ProgramaCard key={programa.id} {...programa} />
            ))} */}
          </div>
        </div>

        {/* Calendario / Próximos Eventos */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Próximos Eventos
          </h2>
          <div className="space-y-4">
            {/* {proximosEventos.map((evento, index) => (
              <EventCard key={index} {...evento} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
