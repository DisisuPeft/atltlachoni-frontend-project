import { apiSlice } from "@/redux/services/apiSlice";
import { Campania } from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
const campaniasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCampanias: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/campanias/",
        method: "POST",
        body: formData,
      }),
    }),
    retrieveCampanias: builder.query<
      PaginatedResponse<Campania>,
      { page?: number; search?: string } | void
    >({
      query: (params = {}) => {
        const { page = 1, search } = params as {
          page?: number;
          search?: string;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        return `/control-escolar/campanias/?${qs.toString()}`;
      },
    }),
    retrieveCampania: builder.query<Campania, string>({
      query: (ref) => {
        const qs = new URLSearchParams();
        qs.set("ref", String(ref));
        // if (search) qs.set("search", search);
        return `/control-escolar/campanias/por_programa/?${qs.toString()}`;
      },
    }),
    howManyCampanias: builder.query<number, void>({
      query: () => "/control-escolar/campanias/howmanycampanias/",
    }),
    activarCampania: builder.mutation<Campania, number>({
      query: (id) => ({
        url: `/control-escolar/campanias/${id}/activar/`,
        method: "POST",
      }),
    }),
    desactivarCampania: builder.mutation<Campania, number>({
      query: (id) => ({
        url: `/control-escolar/campanias/${id}/desactivar/`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateCampaniasMutation,
  useRetrieveCampaniasQuery,
  useHowManyCampaniasQuery,
  useActivarCampaniaMutation,
  useDesactivarCampaniaMutation,
  useRetrieveCampaniaQuery,
} = campaniasApiSlice;
