import { apiSlice } from "@/redux/services/apiSlice";
import type {
  CarteraVencidaParams,
  CarteraVencidaResponse,
  EstadoCuentaInscripcion,
} from "../types/control-escolar/type";

// Ambos endpoints: solo Administrador y Tutor (otro rol → 403).
const pagosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEstadoCuentaEstudiante: builder.query<EstadoCuentaInscripcion[], string>({
      query: (ref) => `/control-escolar/estudiantes/${ref}/pagos/`,
      // Mismo tag que las inscripciones: aplicarPago ya lo invalida.
      providesTags: (_result, _error, ref) => [
        { type: "Inscripciones" as const, id: ref },
      ],
    }),
    getCarteraVencida: builder.query<
      CarteraVencidaResponse,
      CarteraVencidaParams | void
    >({
      query: (params = {}) => {
        const { instituto, campania, search, dias_min, limit } =
          params as CarteraVencidaParams;
        const qs = new URLSearchParams();
        if (instituto) qs.set("instituto", String(instituto));
        if (campania) qs.set("campania", String(campania));
        if (search) qs.set("search", search);
        if (dias_min) qs.set("dias_min", String(dias_min));
        if (limit) qs.set("limit", String(limit));
        const q = qs.toString();
        return `/control-escolar/pagos/cartera-vencida/${q ? `?${q}` : ""}`;
      },
      providesTags: ["CarteraVencida"],
    }),
  }),
});

export const { useGetEstadoCuentaEstudianteQuery, useGetCarteraVencidaQuery } =
  pagosApiSlice;
