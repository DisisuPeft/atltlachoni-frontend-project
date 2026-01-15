import { apiSlice } from "@/redux/services/apiSlice";
import { EstudiantePerfil } from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";

const alumnoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addEstudiantes: builder.mutation({
      query: () => ({
        url: "/control-escolar/estudiantes/",
      }),
    }),
    getEstudiantes: builder.query<PaginatedResponse<EstudiantePerfil>, void>({
      query: () => "/control-escolar/estudiantes/",
    }),
  }),
});

export const { useAddEstudiantesMutation, useGetEstudiantesQuery } =
  alumnoApiSlice;
