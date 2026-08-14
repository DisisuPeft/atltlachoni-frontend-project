import { apiSlice } from "@/redux/services/apiSlice";
import {
  ComprobantePago,
  EstudiantePerfil,
  EstudiantePerfilForm,
  InscripcionBody,
  InscripcionEstudianteDetail,
  Material,
  MiInscripcionPagos,
  ModuloConMateriales,
  ProgramaEducativoDetail,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
import { MessageResponse } from "../types/reponse";
import {
  InscriptionDetail,
  ModulosInterface,
} from "../types/alumnos/inscription";

export interface InscripcionCreatedResponse {
  id: number;
  message: string;
}

export interface AplicarPagoResultado {
  id: number;
  resultado: "aplicado" | "aplicado_con_residuo";
  monto_recibido: number;
  monto_pendiente: number;
  diferencia?: number;
  tipo_diferencia?: "excedente" | "parcial";
}

export interface AplicarPagoResponse {
  success: boolean;
  message: string;
  resultados: AplicarPagoResultado[];
}

export interface InscripcionEstudiante {
  id: number;
  ref: string;
  programa_nombre: string;
  campania_nombre: string;
  fecha_ingreso: string | null;
  modulo_actual: number;
  total_modulos: number;
  status: number;
}

const alumnoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addEstudiantes: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/estudiantes/",
        method: "POST",
        body: formData,
      }),
    }),
    getEstudiantes: builder.query<
      PaginatedResponse<EstudiantePerfil>,
      { page?: number; search?: string; status?: string; instituto?: number } | void
    >({
      query: (params = {}) => {
        const { page = 1, search, status, instituto } = params as {
          page?: number;
          search?: string;
          status?: string;
          instituto?: number;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        if (status && status !== "all") qs.set("status", status);
        if (instituto) qs.set("instituto", String(instituto));
        return `/control-escolar/estudiantes/?${qs.toString()}`;
      },
    }),
    retrieveEstudiante: builder.query<EstudiantePerfilForm, string>({
      query: (uuid) => `/control-escolar/estudiantes/${uuid}/`,
      providesTags: (_result, _error, uuid) => [{ type: "Estudiantes" as const, id: uuid }],
    }),
    updateEstudiante: builder.mutation<
      MessageResponse,
      { uuid: string; formData: EstudiantePerfilForm }
    >({
      query: ({ uuid, formData }) => ({
        url: `/control-escolar/estudiantes/${uuid}/`,
        method: "PATCH",
        body: formData,
      }),
    }),
    makeInscription: builder.mutation<
      InscripcionCreatedResponse,
      {
        campania: string | undefined;
        estudianteId: string | undefined;
        formData: InscripcionBody;
      }
    >({
      query: ({ campania, estudianteId, formData }) => ({
        url: `/control-escolar/inscripciones/?campania=${campania}&estudiante=${estudianteId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { estudianteId }) =>
        estudianteId ? [{ type: "Inscripciones" as const, id: estudianteId }] : [],
    }),
    subirComprobanteInscripcion: builder.mutation<
      ComprobantePago,
      { inscripcionId: number; formData: FormData }
    >({
      query: ({ inscripcionId, formData }) => ({
        url: `/control-escolar/inscripciones/${inscripcionId}/comprobantes/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { inscripcionId }) => [
        { type: "Comprobantes" as const, id: inscripcionId },
      ],
    }),
    getComprobantesInscripcion: builder.query<ComprobantePago[], number>({
      query: (inscripcionId) =>
        `/control-escolar/inscripciones/${inscripcionId}/comprobantes/lista/`,
      providesTags: (_result, _error, inscripcionId) => [
        { type: "Comprobantes" as const, id: inscripcionId },
      ],
    }),
    inscriptionAlumnoDetail: builder.query<InscriptionDetail, void>({
      query: () => `/control-escolar/inscripciones/inscription_details_alumno/`,
    }),
    programaEstudiante: builder.query<ProgramaEducativoDetail, string>({
      query: (id) =>
        `/control-escolar/programas-educativos/${id}/programa_estudiante`,
    }),
    ModuloPrograma: builder.query<
      ModulosInterface,
      { id: string; moduloId: number }
    >({
      query: ({ id, moduloId }) =>
        `/control-escolar/programas-educativos/${id}/modulos?modulo=${moduloId}`,
    }),
    getMaterialesModulo: builder.query<PaginatedResponse<Material>, number>({
      query: (moduloId) => `/control-escolar/materiales/?modulo=${moduloId}`,
    }),
    getMaterialesPrograma: builder.query<ModuloConMateriales[], string>({
      query: (programaId) => `/control-escolar/materiales/?programa=${programaId}`,
    }),
    deleteMaterial: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/materiales/${id}/`,
        method: "DELETE",
      }),
    }),
    getInscripcionesEstudiante: builder.query<InscripcionEstudianteDetail[], string>({
      query: (uuid) => `/control-escolar/estudiantes/${uuid}/inscripciones/`,
      providesTags: (_result, _error, uuid) => [{ type: "Inscripciones" as const, id: uuid }],
    }),
    getMisPagos: builder.query<MiInscripcionPagos[], void>({
      query: () => `/control-escolar/inscripciones/mis_pagos/`,
    }),
    activarEstudiante: builder.mutation<{ detail: string }, string>({
      query: (uuid) => ({
        url: `/control-escolar/estudiantes/${uuid}/activar/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, uuid) => [{ type: "Estudiantes" as const, id: uuid }],
    }),
    desactivarEstudiante: builder.mutation<{ detail: string }, string>({
      query: (uuid) => ({
        url: `/control-escolar/estudiantes/${uuid}/desactivar/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, uuid) => [{ type: "Estudiantes" as const, id: uuid }],
    }),
    aplicarPago: builder.mutation<
      AplicarPagoResponse,
      { inscripcionId: number; estudianteId: string; pagos: { id: number; monto: number }[] }
    >({
      query: ({ inscripcionId, pagos }) => ({
        url: `/control-escolar/inscripciones/${inscripcionId}/aplicar-pago/`,
        method: "POST",
        body: { pagos },
      }),
      invalidatesTags: (_result, _error, { estudianteId }) => [
        { type: "Inscripciones" as const, id: estudianteId },
      ],
    }),
  }),
});

export const {
  useAddEstudiantesMutation,
  useGetEstudiantesQuery,
  useRetrieveEstudianteQuery,
  useUpdateEstudianteMutation,
  useMakeInscriptionMutation,
  useInscriptionAlumnoDetailQuery,
  useProgramaEstudianteQuery,
  useModuloProgramaQuery,
  useGetMaterialesModuloQuery,
  useGetMaterialesProgramaQuery,
  useDeleteMaterialMutation,
  useGetInscripcionesEstudianteQuery,
  useSubirComprobanteInscripcionMutation,
  useGetComprobantesInscripcionQuery,
  useGetMisPagosQuery,
  useActivarEstudianteMutation,
  useDesactivarEstudianteMutation,
  useAplicarPagoMutation,
} = alumnoApiSlice;
