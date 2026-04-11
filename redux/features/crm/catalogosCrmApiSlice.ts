import { apiSlice } from "@/redux/services/apiSlice";
import {
  Pipeline,
  Etapa,
  TipoInteraccion,
  EstadoInteraccion,
  TipoSeguimiento,
  NivelTemperatura,
} from "../types/crm/lead-types";

const catalogosCrmApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPipelines: builder.query<Pipeline[], void>({
      query: () => "/crm/catalogos/pipelines/",
    }),

    getPipeline: builder.query<Pipeline, number>({
      query: (id) => `/crm/catalogos/pipelines/${id}/`,
    }),

    getEtapas: builder.query<Etapa[], { pipeline?: number } | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.pipeline) qs.set("pipeline", String(params.pipeline));
        return `/crm/catalogos/etapas/?${qs.toString()}`;
      },
    }),

    getTiposInteraccion: builder.query<TipoInteraccion[], void>({
      query: () => "/crm/catalogos/tipos-interaccion/",
    }),

    getEstadosInteraccion: builder.query<EstadoInteraccion[], void>({
      query: () => "/crm/catalogos/estados-interaccion/",
    }),

    getTiposSeguimiento: builder.query<TipoSeguimiento[], void>({
      query: () => "/crm/catalogos/tipos-seguimiento/",
    }),

    getNivelesTemperatura: builder.query<NivelTemperatura[], void>({
      query: () => "/crm/catalogos/niveles-temperatura/",
    }),
  }),
});

export const {
  useGetPipelinesQuery,
  useGetPipelineQuery,
  useGetEtapasQuery,
  useGetTiposInteraccionQuery,
  useGetEstadosInteraccionQuery,
  useGetTiposSeguimientoQuery,
  useGetNivelesTemperaturaQuery,
} = catalogosCrmApiSlice;