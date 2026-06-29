import { apiSlice } from "@/redux/services/apiSlice";
import {
  Instituciones,
  NivelEducativo,
  EstadoRepublica,
  Localidad,
  MetodoPago,
} from "../types/catalagos/cat";

const generoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveInstituciones: builder.query<Instituciones[], { ins?: number } | void>({
      query: (params = {}) => {
        const { ins } = params as { ins?: number };
        const qs = new URLSearchParams();
        if (ins) qs.set("ins", String(ins));
        const search = qs.toString();
        return `/catalagos/genericos/instituciones/${search ? `?${search}` : ""}`;
      },
    }),
    retrieveNivelEducativo: builder.query<NivelEducativo[], void>({
      query: () => "/catalagos/genericos/niveles-educativos/",
    }),
    retrieveEstados: builder.query<EstadoRepublica[], void>({
      query: () => "/catalagos/genericos/estados/",
    }),
    retrieveLocalidades: builder.query<Localidad[], number>({
      query: (estado) => `/catalagos/genericos/localidades/?estado=${estado}`,
    }),
    getMetodoPago: builder.query<MetodoPago[], void>({
      query: () => "/catalagos/genericos/metodo-pago/",
    }),
  }),
});

export const {
  useRetrieveInstitucionesQuery,
  useRetrieveNivelEducativoQuery,
  useRetrieveEstadosQuery,
  useRetrieveLocalidadesQuery,
  useGetMetodoPagoQuery,
} = generoApiSlice;
