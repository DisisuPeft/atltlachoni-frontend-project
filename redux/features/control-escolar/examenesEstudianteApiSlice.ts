import { apiSlice } from "@/redux/services/apiSlice";
import type {
  ExamenItem,
  ExamenDetalleEstudiante,
  EnviarRespuestasRequest,
  EnviarRespuestasResponse,
  MiCalificacion,
} from "../types/control-escolar/type";

export const examenesEstudianteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMisExamenes: builder.query<ExamenItem[], void>({
      query: () => "/control-escolar/examenes/mis_examenes/",
      providesTags: ["Examenes"],
    }),

    getExamenParaRendir: builder.query<ExamenDetalleEstudiante, number>({
      query: (id) => `/control-escolar/examenes/${id}/rendir/`,
      providesTags: (_r, _e, id) => [{ type: "Examenes" as const, id }],
    }),

    enviarRespuestasEstudiante: builder.mutation<
      EnviarRespuestasResponse,
      { id: number; body: EnviarRespuestasRequest }
    >({
      query: ({ id, body }) => ({
        url: `/control-escolar/examenes/${id}/enviar_respuestas/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Examenes" as const, id },
        "Calificaciones",
      ],
    }),

    getMiCalificacionExamen: builder.query<MiCalificacion, number>({
      query: (id) => `/control-escolar/examenes/${id}/mi_calificacion/`,
      providesTags: (_r, _e, id) => [{ type: "Calificaciones" as const, id }],
    }),

    descargarExamenPdf: builder.mutation<Blob, { id: number; intento?: number }>({
      query: ({ id, intento }) => ({
        url: `/control-escolar/examenes/${id}/pdf/`,
        params: intento != null ? { intento } : undefined,
        responseHandler: async (response) => {
          if (!response.ok) {
            const error = await response
              .json()
              .catch(() => ({ detail: "Error al descargar el PDF" }));
            return Promise.reject({ status: response.status, data: error });
          }
          return response.blob();
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMisExamenesQuery,
  useGetExamenParaRendirQuery,
  useEnviarRespuestasEstudianteMutation,
  useGetMiCalificacionExamenQuery,
  useDescargarExamenPdfMutation,
} = examenesEstudianteApiSlice;