import { apiSlice } from "@/redux/services/apiSlice";
import {
  Instituciones,
  NivelEducativo,
  EstadoRepublica,
  Localidad,
} from "../types/catalagos/cat";

const generoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveInstituciones: builder.query<Instituciones[], void>({
      query: () => "/catalagos/genericos/instituciones/",
    }),
    retrieveNivelEducativo: builder.query<NivelEducativo[], void>({
      query: () => "/catalagos/genericos/niveles-educativos/",
    }),
    retrieveEstados: builder.query<EstadoRepublica[], void>({
      query: () => "/catalagos/genericos/estados/",
    }),
    retrieveLocalidades: builder.query<Localidad[], number>({
      query: (estado) => `/catalagos/genericos/localidades/?=${estado}`,
    }),
  }),
});

export const {
  useRetrieveInstitucionesQuery,
  useRetrieveNivelEducativoQuery,
  useRetrieveEstadosQuery,
  useRetrieveLocalidadesQuery,
} = generoApiSlice;
