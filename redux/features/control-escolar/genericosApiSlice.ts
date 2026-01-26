import { apiSlice } from "@/redux/services/apiSlice";
import {
  ModalidadesGenerico,
  TipoProgramaGenerico,
  ProgramaSimple,
} from "../types/control-escolar/type";

const genericoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModalidades: builder.query<ModalidadesGenerico[], void>({
      query: () => "/control-escolar/genericos/modalidades/",
    }),
    getTiposProgramas: builder.query<TipoProgramaGenerico[], void>({
      query: () => "/control-escolar/genericos/tipos-programas/",
    }),
    getProgramasGenerico: builder.query<ProgramaSimple[], void>({
      query: () => "/control-escolar/genericos/programas/",
    }),
  }),
});

export const {
  useGetModalidadesQuery,
  useGetTiposProgramasQuery,
  useGetProgramasGenericoQuery,
} = genericoApiSlice;
