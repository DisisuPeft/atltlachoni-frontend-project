import { apiSlice } from "@/redux/services/apiSlice";
import {
  EstudiantePerfil,
  EstudiantePerfilForm,
  PagoFormData,
  ProgramaEducativoDetail,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
import { MessageResponse, SuccessMessage } from "../types/reponse";
import { InscriptionDetail } from "../types/alumnos/inscription";

const alumnoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addEstudiantes: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/estudiantes/",
        method: "POST",
        body: formData,
      }),
    }),
    getEstudiantes: builder.query<PaginatedResponse<EstudiantePerfil>, void>({
      query: () => "/control-escolar/estudiantes/",
    }),
    retrieveEstudiante: builder.query<EstudiantePerfilForm, string>({
      query: (uuid) => `/control-escolar/estudiantes/${uuid}/`,
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
      SuccessMessage,
      {
        campania: string | undefined;
        estudianteId: string | undefined;
        formData: PagoFormData;
      }
    >({
      query: ({ campania, estudianteId, formData }) => ({
        url: `/control-escolar/inscripciones/?campania=${campania}&estudiante=${estudianteId}`,
        method: "POST",
        body: formData,
      }),
    }),
    inscriptionAlumnoDetail: builder.query<InscriptionDetail, void>({
      query: () => `/control-escolar/inscripciones/inscription_details_alumno/`,
    }),
    programaEstudiante: builder.query<ProgramaEducativoDetail, string>({
      query: (id) =>
        `/control-escolar/programas-educativos/${id}/programa_estudiante`,
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
} = alumnoApiSlice;
