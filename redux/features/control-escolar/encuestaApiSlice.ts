import { apiSlice } from "@/redux/services/apiSlice";

export interface DiplomadoEncuestaCatalogo {
  id: number;
  nombre: string;
  status: number; // 1 = activo, 0 = inactivo
  programa: number | null; // null = diplomado "general", no ligado a un programa
  programa_nombre?: string | null;
}

const encuestaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveDiplomadosCatalogo: builder.query<
      DiplomadoEncuestaCatalogo[],
      { instituto?: number; campania?: number } | void
    >({
      query: (params = {}) => {
        const { instituto, campania } = (params ?? {}) as {
          instituto?: number;
          campania?: number;
        };
        const qs = new URLSearchParams();
        if (instituto) qs.set("instituto", String(instituto));
        if (campania) qs.set("campania", String(campania));
        const search = qs.toString();
        return `/control-escolar/encuesta/diplomados/${search ? `?${search}` : ""}`;
      },
    }),
  }),
});

export const { useRetrieveDiplomadosCatalogoQuery } = encuestaApiSlice;
