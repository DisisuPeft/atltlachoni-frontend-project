import { apiSlice } from "@/redux/services/apiSlice";
import { Instituciones } from "../types/catalagos/cat";

const generoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveInstituciones: builder.query<Instituciones[], void>({
      query: () => "/catalagos/genericos/instituciones/",
    }),
  }),
});

export const { useRetrieveInstitucionesQuery } = generoApiSlice;
