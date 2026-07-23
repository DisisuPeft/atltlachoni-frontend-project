import { apiSlice } from "@/redux/services/apiSlice";
import {
  MaestroPerfil,
  MaestroPerfilForm,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
import { MessageResponse } from "../types/reponse";

const maestrosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMaestros: builder.query<
      PaginatedResponse<MaestroPerfil>,
      { page?: number; search?: string; status?: string; instituto?: number } | void
    >({
      query: (params = {}) => {
        const { page = 1, search, status, instituto } = params as {
          page?: number;
          search?: string;
          status?: string;
          instituto?: number;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        if (status && status !== "all") qs.set("status", status);
        if (instituto) qs.set("instituto", String(instituto));
        return `/control-escolar/maestros/?${qs.toString()}`;
      },
      providesTags: ["Maestros"],
    }),
    retrieveMaestro: builder.query<MaestroPerfilForm, string>({
      query: (ref) => `/control-escolar/maestros/${ref}/`,
      providesTags: (_result, _error, ref) => [{ type: "Maestros" as const, id: ref }],
    }),
    addMaestro: builder.mutation<{ message: string; create: string }, MaestroPerfilForm>({
      query: (formData) => ({
        url: "/control-escolar/maestros/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Maestros"],
    }),
    updateMaestro: builder.mutation<
      MessageResponse,
      { ref: string; formData: Partial<MaestroPerfilForm> }
    >({
      query: ({ ref, formData }) => ({
        url: `/control-escolar/maestros/${ref}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { ref }) => [
        { type: "Maestros" as const, id: ref },
        "Maestros",
      ],
    }),
    activarMaestro: builder.mutation<{ detail: string }, string>({
      query: (ref) => ({
        url: `/control-escolar/maestros/${ref}/activar/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, ref) => [
        { type: "Maestros" as const, id: ref },
        "Maestros",
      ],
    }),
    desactivarMaestro: builder.mutation<{ detail: string }, string>({
      query: (ref) => ({
        url: `/control-escolar/maestros/${ref}/desactivar/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, ref) => [
        { type: "Maestros" as const, id: ref },
        "Maestros",
      ],
    }),
  }),
});

export const {
  useGetMaestrosQuery,
  useRetrieveMaestroQuery,
  useAddMaestroMutation,
  useUpdateMaestroMutation,
  useActivarMaestroMutation,
  useDesactivarMaestroMutation,
} = maestrosApiSlice;