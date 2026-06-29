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
    getDashboardResumen: builder.query<
      DashboardResumen,
      { instituto?: number; empresa?: number } | void
    >({
      query: (params = {}) => {
        const { instituto, empresa } = params as {
          instituto?: number;
          empresa?: number;
        };
        const qs = new URLSearchParams();
        if (instituto) qs.set("instituto", String(instituto));
        if (empresa) qs.set("empresa", String(empresa));
        const search = qs.toString();
        return `/control-escolar/dashboard/resumen/${search ? `?${search}` : ""}`;
      },
    }),
    getAlumnosRecientes: builder.query<AlumnoReciente[], { instituto?: number } | void>({
      query: (params = {}) => {
        const { instituto } = params as { instituto?: number };
        const qs = new URLSearchParams();
        if (instituto) qs.set("instituto", String(instituto));
        const search = qs.toString();
        return `/control-escolar/dashboard/alumnos_recientes/${search ? `?${search}` : ""}`;
      },
    }),
    getCampaniasProximas: builder.query<CampaniaProxima[], { instituto?: number } | void>({
      query: (params = {}) => {
        const { instituto } = params as { instituto?: number };
        const qs = new URLSearchParams();
        if (instituto) qs.set("instituto", String(instituto));
        const search = qs.toString();
        return `/control-escolar/dashboard/campanias_proximas/${search ? `?${search}` : ""}`;
      },
    }),
  }),
});

export const {
  useGetDashboardResumenQuery,
  useGetAlumnosRecientesQuery,
  useGetCampaniasProximasQuery,
} = dashboardApiSlice;