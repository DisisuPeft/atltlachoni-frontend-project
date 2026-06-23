import { apiSlice } from "@/redux/services/apiSlice";
import type {
  ExamenItem,
  ExamenDetalleEstudiante,
  EnviarRespuestasBody,
  EnviarRespuestasResponse,
  MiCalificacionResponse,
} from "../types/control-escolar/type";

export const examenesEstudianteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMisExamenes: builder.query<ExamenItem[], void>({
      query: () => "/control-escolar/examenes/mis_examenes/",
      providesTags: ["Examen"],
    }),

    getExamenParaRendir: builder.query<ExamenDetalleEstudiante, number>({
      query: (id) => `/control-escolar/examenes/${id}/rendir/`,
    }),

    enviarRespuestasEstudiante: builder.mutation<
      EnviarRespuestasResponse,
      { id: number; body: EnviarRespuestasBody }
    >({
      query: ({ id, body }) => ({
        url: `/control-escolar/examenes/${id}/enviar_respuestas/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Examen", "MiCalificacion"],
    }),

    getMiCalificacionExamen: builder.query<MiCalificacionResponse, number>({
      query: (id) => `/control-escolar/examenes/${id}/mi_calificacion/`,
      providesTags: (_r, _e, id) => [{ type: "MiCalificacion" as const, id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMisExamenesQuery,
  useGetExamenParaRendirQuery,
  useEnviarRespuestasEstudianteMutation,
  useGetMiCalificacionExamenQuery,
} = examenesEstudianteApiSlice;