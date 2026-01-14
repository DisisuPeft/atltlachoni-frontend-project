import { apiSlice } from "@/redux/services/apiSlice";
import { Genero } from "../types/auth/auth-types";
import { PaginatedResponse } from "../types/paginated";
import { Instituciones } from "../types/catalagos/cat";

const generoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneros: builder.query<PaginatedResponse<Genero>, void>({
      query: () => "/catalogos/generos/",
    }),
    addGeneros: builder.mutation({
      query: (formData) => ({
        url: "/catalogos/generos/",
        method: "POST",
        body: formData,
      }),
    }),
    getInstituciones: builder.query<PaginatedResponse<Instituciones>, void>({
      query: () => "/catalagos/instituciones/",
    }),
    addInstituciones: builder.mutation({
      query: (formData) => ({
        url: "/catalogos/instituciones/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetGenerosQuery,
  useAddGenerosMutation,
  useAddInstitucionesMutation,
  useGetInstitucionesQuery,
} = generoApiSlice;
