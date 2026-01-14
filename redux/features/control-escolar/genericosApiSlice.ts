import { apiSlice } from "@/redux/services/apiSlice";
import {
  ModalidadesGenerico,
  TipoProgramaGenerico,
} from "../types/control-escolar/type";

const genericoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModalidades: builder.query<ModalidadesGenerico[], void>({
      query: () => "/control-escolar/genericos/modalidades/",
    }),
    getTiposProgramas: builder.query<TipoProgramaGenerico[], void>({
      query: () => "/control-escolar/genericos/tipos-programas/",
    }),
  }),
});

export const { useGetModalidadesQuery, useGetTiposProgramasQuery } =
  genericoApiSlice;
