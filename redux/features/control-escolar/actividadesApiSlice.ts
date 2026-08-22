import { apiSlice } from "@/redux/services/apiSlice";
import {
  Actividad,
  ActividadBody,
  EntregaActividad,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";

export interface ActividadFiltros {
  programa?: number | string;
  modulo?: number;
  submodulo?: number;
  campania?: number;
}

export interface CalificarEntregaBody {
  calificacion: number;
  retroalimentacion?: string;
}

// El backend de este módulo no pagina sus listas (regresa un array plano),
// a diferencia de otros endpoints de control-escolar — normalizamos aquí
// por si en algún punto empieza a envolverlas en {results: [...]}.
function toArray<T>(response: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(response) ? response : response.results;
}

const actividadesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActividades: builder.query<Actividad[], ActividadFiltros | void>({
      query: (params) => {
        const { programa, modulo, submodulo, campania } =
          (params ?? {}) as ActividadFiltros;
        const qs = new URLSearchParams();
        if (programa !== undefined) qs.set("programa", String(programa));
        if (modulo !== undefined) qs.set("modulo", String(modulo));
        if (submodulo !== undefined) qs.set("submodulo", String(submodulo));
        if (campania !== undefined) qs.set("campania", String(campania));
        const search = qs.toString();
        return `/control-escolar/actividades/${search ? `?${search}` : ""}`;
      },
      transformResponse: (response: Actividad[] | PaginatedResponse<Actividad>) =>
        toArray(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({
                type: "Actividades" as const,
                id: a.id,
              })),
              { type: "Actividades" as const, id: "LIST" },
            ]
          : [{ type: "Actividades" as const, id: "LIST" }],
    }),
    createActividad: builder.mutation<Actividad, ActividadBody>({
      query: (body) => ({
        url: "/control-escolar/actividades/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Actividades" as const, id: "LIST" }],
    }),
    getEntregasActividad: builder.query<
      EntregaActividad[],
      { actividad: number; estudiante?: number }
    >({
      query: ({ actividad, estudiante }) => {
        const qs = new URLSearchParams();
        qs.set("actividad", String(actividad));
        if (estudiante !== undefined)
          qs.set("estudiante", String(estudiante));
        return `/control-escolar/entregas-actividad/?${qs.toString()}`;
      },
      transformResponse: (
        response: EntregaActividad[] | PaginatedResponse<EntregaActividad>,
      ) => toArray(response),
      providesTags: (_result, _error, { actividad }) => [
        { type: "EntregasActividad" as const, id: actividad },
      ],
    }),
    subirEntregaActividad: builder.mutation<EntregaActividad, FormData>({
      query: (formData) => ({
        url: "/control-escolar/entregas-actividad/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: "EntregasActividad" as const, id: result.actividad },
              { type: "Actividades" as const, id: result.actividad },
              { type: "Actividades" as const, id: "LIST" },
            ]
          : [{ type: "Actividades" as const, id: "LIST" }],
    }),
    calificarEntrega: builder.mutation<
      EntregaActividad,
      { id: number; actividad: number; body: CalificarEntregaBody }
    >({
      query: ({ id, body }) => ({
        url: `/control-escolar/entregas-actividad/${id}/calificar/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { actividad }) => [
        { type: "EntregasActividad" as const, id: actividad },
      ],
    }),
  }),
});

export const {
  useGetActividadesQuery,
  useCreateActividadMutation,
  useGetEntregasActividadQuery,
  useSubirEntregaActividadMutation,
  useCalificarEntregaMutation,
} = actividadesApiSlice;
