import { apiSlice } from "@/redux/services/apiSlice";
import {
  Ponencia,
  PlantillaConstancia,
  Participante,
  ConstanciaPublica,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";

const ponenciasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Ponencias ─────────────────────────────────────────────────────────
    getPonencias: builder.query<
      PaginatedResponse<Ponencia>,
      { tipo?: string; page?: number } | void
    >({
      query: (params = {}) => {
        const { tipo, page = 1 } = (params ?? {}) as {
          tipo?: string;
          page?: number;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (tipo) qs.set("tipo", tipo);
        return `/control-escolar/ponencias/?${qs.toString()}`;
      },
    }),
    deletePonencia: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/ponencias/${id}/`,
        method: "DELETE",
      }),
    }),
    patchPonencia: builder.mutation<
      Ponencia,
      {
        id: number;
        plantilla_constancia?: number | null;
        fecha_evento?: string | null;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/ponencias/${id}/`,
        method: "PATCH",
        body,
      }),
    }),

    // ── Plantillas ────────────────────────────────────────────────────────
    getPlantillas: builder.query<PaginatedResponse<PlantillaConstancia>, void>({
      query: () => `/control-escolar/plantillas-constancia/`,
    }),
    createPlantilla: builder.mutation<PlantillaConstancia, FormData>({
      query: (formData) => ({
        url: `/control-escolar/plantillas-constancia/`,
        method: "POST",
        body: formData,
      }),
    }),

    // ── Participantes ─────────────────────────────────────────────────────
    getParticipantes: builder.query<
      PaginatedResponse<Participante>,
      { ponenciaId: number; page?: number; search?: string }
    >({
      query: ({ ponenciaId, page = 1, search }) => {
        const qs = new URLSearchParams({ page: String(page) });
        if (search) qs.set("search", search);
        return `/control-escolar/ponencias/${ponenciaId}/participantes/?${qs.toString()}`;
      },
    }),
    addParticipante: builder.mutation<
      Participante,
      { ponenciaId: number; nombre_completo: string; email: string }
    >({
      query: ({ ponenciaId, ...body }) => ({
        url: `/control-escolar/ponencias/${ponenciaId}/participantes/`,
        method: "POST",
        body,
      }),
    }),
    deleteParticipante: builder.mutation<
      void,
      { ponenciaId: number; participanteId: number }
    >({
      query: ({ ponenciaId, participanteId }) => ({
        url: `/control-escolar/ponencias/${ponenciaId}/participantes/${participanteId}/`,
        method: "DELETE",
      }),
    }),

    // ── Generación de constancias ─────────────────────────────────────────
    generarConstancia: builder.mutation<
      { descargado: boolean },
      { ponenciaId: number; participanteId: number }
    >({
      query: ({ ponenciaId, participanteId }) => ({
        url: `/control-escolar/ponencias/${ponenciaId}/participantes/${participanteId}/generar-constancia/`,
        method: "POST",
        responseHandler: async (response) => {
          const blob = await response.blob();
          // console.log("tipo:", blob.type, "| tamaño:", blob.size, "bytes");
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "constancia.pdf";
          a.click();
          URL.revokeObjectURL(url);
          return { descargado: true };
        },
      }),
    }),
    regenerarConstancia: builder.mutation<
      Participante,
      { ponenciaId: number; participanteId: number }
    >({
      query: ({ ponenciaId, participanteId }) => ({
        url: `/control-escolar/ponencias/${ponenciaId}/participantes/${participanteId}/regenerar-constancia/`,
        method: "POST",
      }),
    }),

    // ── Verificación pública ──────────────────────────────────────────────
    getConstanciaPublica: builder.query<ConstanciaPublica, string>({
      query: (token) => `/public/constancias/${token}/`,
    }),
  }),
});

export const {
  useGetPonenciasQuery,
  useDeletePonenciaMutation,
  usePatchPonenciaMutation,
  useGetPlantillasQuery,
  useCreatePlantillaMutation,
  useGetParticipantesQuery,
  useAddParticipanteMutation,
  useDeleteParticipanteMutation,
  useGenerarConstanciaMutation,
  useRegenerarConstanciaMutation,
  useGetConstanciaPublicaQuery,
} = ponenciasApiSlice;
