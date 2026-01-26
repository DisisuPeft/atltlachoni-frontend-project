import { apiSlice } from "@/redux/services/apiSlice";
import {
  EstudiantePerfil,
  EstudiantePerfilForm,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
import { MessageResponse } from "../types/reponse";

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
  }),
});

export const {
  useAddEstudiantesMutation,
  useGetEstudiantesQuery,
  useRetrieveEstudianteQuery,
  useUpdateEstudianteMutation,
} = alumnoApiSlice;
