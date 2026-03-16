import { apiSlice } from "@/redux/services/apiSlice";
import {
  EstatusInterface,
  EtapasInterface,
  FuentesInterface,
} from "../types/crm/type";

const genericosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEstatus: builder.query<EstatusInterface[], void>({
      query: () => "/crm/genericos/estatus/",
    }),
    getFuentes: builder.query<FuentesInterface[], void>({
      query: () => "/crm/genericos/fuentes/",
    }),
    getEtapas: builder.query<EtapasInterface[], void>({
      query: () => "/crm/genericos/etapas/",
    }),
  }),
});

export const { useGetFuentesQuery, useGetEstatusQuery, useGetEtapasQuery } =
  genericosApiSlice;
