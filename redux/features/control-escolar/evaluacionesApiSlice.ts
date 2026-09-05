import { apiSlice } from "@/redux/services/apiSlice";
import type {
  TipoExamen,
  TipoPregunta,
  Examen,
  ExamenDetalle,
  CalificacionExamen,
  Pregunta,
  OpcionAdmin,
  CreateExamenBody,
  UpdateExamenBody,
  CreatePreguntaBody,
  UpdatePreguntaBody,
  CreateOpcionBody,
  UpdateOpcionBody,
  CreateTipoExamenBody,
  CreateTipoPreguntaBody,
  RespuestaPendiente,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";

export const evaluacionesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Catálogo: Tipos de Examen ─────────────────────────────────
    getTiposExamen: builder.query<PaginatedResponse<TipoExamen>, void>({
      query: () => "/control-escolar/catalogos/tipos-examen/",
      providesTags: ["TipoExamen"],
    }),
    createTipoExamen: builder.mutation<
      { message: string },
      CreateTipoExamenBody
    >({
      query: (body) => ({
        url: "/control-escolar/catalogos/tipos-examen/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TipoExamen"],
    }),
    updateTipoExamen: builder.mutation<
      TipoExamen,
      { id: number } & CreateTipoExamenBody
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/catalogos/tipos-examen/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TipoExamen"],
    }),
    deleteTipoExamen: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/catalogos/tipos-examen/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TipoExamen"],
    }),

    // ── Catálogo: Tipos de Pregunta ───────────────────────────────
    getTiposPreguntas: builder.query<PaginatedResponse<TipoPregunta>, void>({
      query: () => "/control-escolar/catalogos/tipos-pregunta/",
      providesTags: ["TipoPregunta"],
    }),
    createTipoPregunta: builder.mutation<
      { message: string },
      CreateTipoPreguntaBody
    >({
      query: (body) => ({
        url: "/control-escolar/catalogos/tipos-pregunta/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TipoPregunta"],
    }),
    deleteTipoPregunta: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/catalogos/tipos-pregunta/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TipoPregunta"],
    }),

    // ── Exámenes ──────────────────────────────────────────────────
    getExamenes: builder.query<
      PaginatedResponse<Examen>,
      { programa?: number; campania?: number }
    >({
      query: (params) => ({ url: "/control-escolar/examenes/", params }),
      providesTags: ["Examen"],
    }),
    getExamenDetalle: builder.query<ExamenDetalle, number>({
      query: (id) => `/control-escolar/examenes/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "Examen" as const, id }],
    }),
    createExamen: builder.mutation<{ message: string }, CreateExamenBody>({
      query: (body) => ({
        url: "/control-escolar/examenes/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Examen"],
    }),
    updateExamen: builder.mutation<Examen, { id: number } & UpdateExamenBody>({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/examenes/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Examen" as const, id },
        "Examen",
      ],
    }),
    deleteExamen: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/examenes/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Examen"],
    }),
    getResultadosExamen: builder.query<CalificacionExamen[], number>({
      query: (id) => `/control-escolar/examenes/${id}/resultados/`,
      providesTags: (_r, _e, id) => [
        { type: "CalificacionExamen" as const, id },
      ],
    }),

    // ── Preguntas ─────────────────────────────────────────────────
    getPreguntas: builder.query<Pregunta[], number>({
      query: (examenId) => ({
        url: "/control-escolar/examenes/preguntas/",
        params: { examen: examenId },
      }),
      providesTags: ["Pregunta"],
    }),
    createPregunta: builder.mutation<{ message: string }, CreatePreguntaBody>({
      query: (body) => ({
        url: "/control-escolar/examenes/preguntas/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pregunta", "Examen"],
    }),
    updatePregunta: builder.mutation<
      Pregunta,
      { id: number } & UpdatePreguntaBody
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/examenes/preguntas/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Pregunta", "Examen"],
    }),
    deletePregunta: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/examenes/preguntas/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pregunta", "Examen"],
    }),

    // ── Opciones de respuesta ──────────────────────────────────────
    getOpciones: builder.query<OpcionAdmin[], number>({
      query: (preguntaId) => ({
        url: "/control-escolar/examenes/opciones/",
        params: { pregunta: preguntaId },
      }),
      providesTags: ["Opcion"],
    }),
    createOpcion: builder.mutation<{ message: string }, CreateOpcionBody>({
      query: (body) => ({
        url: "/control-escolar/examenes/opciones/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Opcion", "Pregunta", "Examen"],
    }),
    updateOpcion: builder.mutation<
      OpcionAdmin,
      { id: number } & UpdateOpcionBody
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/examenes/opciones/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Opcion", "Pregunta", "Examen"],
    }),
    deleteOpcion: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/examenes/opciones/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Opcion", "Pregunta", "Examen"],
    }),

    // ── Calificaciones ──────────────────────────────────────────────
    getCalificaciones: builder.query<
      CalificacionExamen[],
      { examen?: number; estudiante?: number }
    >({
      query: (params) => ({
        url: "/control-escolar/examenes/calificaciones/",
        params,
      }),
      providesTags: ["CalificacionExamen"],
    }),

    getRespuestasPendientes: builder.query<
      PaginatedResponse<RespuestaPendiente>,
      { examen: number; pendientes?: 1; page?: number }
    >({
      query: (params) => ({
        url: "/control-escolar/examenes/respuestas/",
        params: { pendientes: 1, ...params },
      }),
      providesTags: ["CalificacionExamen"],
    }),
    calificarRespuestaAbierta: builder.mutation<
      RespuestaPendiente,
      { id: number; examen: number; calificacion: number }
    >({
      query: ({ id, calificacion }) => ({
        url: `/control-escolar/examenes/respuestas/${id}/calificar/`,
        method: "POST",
        body: { calificacion },
      }),
      invalidatesTags: (_r, _e, { examen }) => [
        "CalificacionExamen",
        "Calificaciones",
        { type: "Examen" as const, id: examen },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTiposExamenQuery,
  useCreateTipoExamenMutation,
  useUpdateTipoExamenMutation,
  useDeleteTipoExamenMutation,
  useGetTiposPreguntasQuery,
  useCreateTipoPreguntaMutation,
  useDeleteTipoPreguntaMutation,
  useGetExamenesQuery,
  useGetExamenDetalleQuery,
  useCreateExamenMutation,
  useUpdateExamenMutation,
  useDeleteExamenMutation,
  useGetResultadosExamenQuery,
  useGetPreguntasQuery,
  useCreatePreguntaMutation,
  useUpdatePreguntaMutation,
  useDeletePreguntaMutation,
  useGetOpcionesQuery,
  useCreateOpcionMutation,
  useUpdateOpcionMutation,
  useDeleteOpcionMutation,
  useGetCalificacionesQuery,
  useGetRespuestasPendientesQuery,
  useCalificarRespuestaAbiertaMutation,
} = evaluacionesApiSlice;
