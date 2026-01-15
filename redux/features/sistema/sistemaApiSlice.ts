import { apiSlice } from "@/redux/services/apiSlice";
import { Empresa } from "../types/sistema/types";

const sistemaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmpresa: builder.query<Empresa[], string>({
      query: (slug) => `/sistema/empresa/?slug=${slug}`,
    }),
  }),
});

export const { useGetEmpresaQuery } = sistemaApiSlice;
