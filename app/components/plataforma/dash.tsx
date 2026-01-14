import Link from "next/link";

export default function Dashboard() {
  const coursesInProgress = [
    {
      id: 1,
      title: "Desarrollo Web Full Stack con React y Node.js",
      instructor: "Carlos Martínez",
      progress: 65,
      thumbnail: "/web-development-coding.png",
      lastAccessed: "Hace 2 horas",
      nextLesson: "APIs REST con Express",
    },
    {
      id: 2,
      title: "Diseño UX/UI: De Principiante a Profesional",
      instructor: "Ana García",
      progress: 42,
      thumbnail: "/ux-ui-design-interface.png",
      lastAccessed: "Ayer",
      nextLesson: "Prototipado en Figma",
    },
    {
      id: 3,
      title: "Python para Ciencia de Datos",
      instructor: "Miguel López",
      progress: 28,
      thumbnail: "/python-programming-data-science.jpg",
      lastAccessed: "Hace 3 días",
      nextLesson: "Análisis con Pandas",
    },
  ];

  const stats = {
    totalHours: 127,
    completedCourses: 8,
    currentStreak: 12,
    points: 3450,
  };

  const upcomingTasks = [
    {
      title: "Entregar proyecto final - React Avanzado",
      dueDate: "Hoy, 23:59",
      urgent: true,
    },
    {
      title: "Quiz: Fundamentos de UX",
      dueDate: "Mañana, 18:00",
      urgent: false,
    },
    {
      title: "Lectura: Machine Learning Basics",
      dueDate: "En 3 días",
      urgent: false,
    },
  ];

  const recentAchievements = [
    {
      title: "Madrugador",
      description: "Completa 5 lecciones antes de las 9 AM",
      icon: "🌅",
    },
    {
      title: "Racha de 10 días",
      description: "Aprende 10 días seguidos",
      icon: "🔥",
    },
    {
      title: "Primer certificado",
      description: "Completa tu primer curso",
      icon: "🎓",
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Horas totales</span>
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalHours}
            </div>
            <div className="text-sm text-green-600 mt-1">+5 esta semana</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Completados</span>
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.completedCourses}
            </div>
            <div className="text-sm text-gray-500 mt-1">cursos</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Racha actual</span>
              <svg
                className="w-5 h-5 text-orange-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c1.56 3.08 3.5 6.75 3.5 9.5 0 2.49-1.79 4.5-4 4.5s-4-2.01-4-4.5c0-2.75 1.94-6.42 3.5-9.5zm1 14c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-500 mt-1">días</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Puntos</span>
              <svg
                className="w-5 h-5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.points}
            </div>
            <div className="text-sm text-gray-500 mt-1">XP ganados</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Continuar aprendiendo
              </h2>
              <div className="space-y-4">
                {coursesInProgress.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {course.instructor}
                            </p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-semibold text-blue-600">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span>Último acceso: {course.lastAccessed}</span>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                            Continuar
                          </button>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Siguiente:</span>{" "}
                          {course.nextLesson}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Achievements */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Logros recientes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:border-blue-600 transition cursor-pointer"
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Próximas tareas
              </h3>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      task.urgent
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            task.urgent
                              ? "text-red-600 font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          {task.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-blue-600 font-semibold text-sm hover:bg-blue-50 rounded-lg transition">
                Ver todas las tareas
              </button>
            </section>

            {/* Learning Activity */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Actividad semanal
              </h3>
              <div className="space-y-3">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                  (day, index) => {
                    const hours = [2, 3, 1.5, 2.5, 0, 0, 1][index];
                    const maxHours = 3;
                    const percentage = (hours / maxHours) * 100;

                    return (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-8">{day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              hours > 0 ? "bg-blue-600" : "bg-gray-300"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 font-medium w-8">
                          {hours}h
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            {/* Recommendations */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">¿Buscas algo nuevo?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Explora cursos recomendados basados en tus intereses
              </p>
              <button className="w-full py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
                Explorar cursos
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
