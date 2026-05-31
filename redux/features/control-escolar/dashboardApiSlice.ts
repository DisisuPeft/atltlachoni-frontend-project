import { apiSlice } from "@/redux/services/apiSlice";

export interface DashboardResumen {
  total_alumnos: number;
  nuevos_este_mes: number;
  total_inscripciones: number;
  total_programas_activos: number;
  campanias_activas: number;
  campanias_proximas: number;
}

export interface AlumnoReciente {
  ref: string;
  nombre: string;
  matricula: string;
  fecha_inscripcion: string;
  programa: string;
  campania: string;
  campania_id: number;
}

export interface CampaniaProxima {
  id: number;
  nombre: string;
  programa: string;
  fecha_inicio: string;
  fecha_fin: string;
  total_inscritos: number;
  costo_asignado: number;
}

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardResumen: builder.query<DashboardResumen, void>({
      query: () => "/control-escolar/dashboard/resumen/",
    }),
    getAlumnosRecientes: builder.query<AlumnoReciente[], void>({
      query: () => "/control-escolar/dashboard/alumnos_recientes/",
    }),
    getCampaniasProximas: builder.query<CampaniaProxima[], void>({
      query: () => "/control-escolar/dashboard/campanias_proximas/",
    }),
  }),
});

export const {
  useGetDashboardResumenQuery,
  useGetAlumnosRecientesQuery,
  useGetCampaniasProximasQuery,
} = dashboardApiSlice;