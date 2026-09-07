import { apiSlice } from "@/redux/services/apiSlice";
import {
  Campania,
  CampaniaUpdateBody,
  CampaniaAnuncioMeta,
  CampaniaAnuncioMetaBody,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
const campaniasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCampanias: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/campanias/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Campanias" as const, id: "LIST" }],
    }),
    getCampaniaById: builder.query<Campania, number>({
      query: (id) => `/control-escolar/campanias/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: "Campanias" as const, id },
      ],
    }),
    updateCampania: builder.mutation<
      Campania,
      { id: number } & Partial<CampaniaUpdateBody>
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/campanias/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Campanias" as const, id },
        { type: "Campanias" as const, id: "LIST" },
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCampania } = await queryFulfilled;
          dispatch(
            campaniasApiSlice.util.updateQueryData(
              "getCampaniaById",
              id,
              (draft) => {
                Object.assign(draft, updatedCampania);
              },
            ),
          );
        } catch {}
      },
    }),
    retrieveCampanias: builder.query<
      PaginatedResponse<Campania>,
      {
        page?: number;
        search?: string;
        instituto?: number;
        status?: string;
      } | void
    >({
      query: (params = {}) => {
        const {
          page = 1,
          search,
          instituto,
          status,
        } = params as {
          page?: number;
          search?: string;
          instituto?: number;
          status?: string;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        if (instituto) qs.set("instituto", String(instituto));
        if (status && status !== "all") qs.set("status", status);
        return `/control-escolar/campanias/?${qs.toString()}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({
                type: "Campanias" as const,
                id,
              })),
              { type: "Campanias" as const, id: "LIST" },
            ]
          : [{ type: "Campanias" as const, id: "LIST" }],
    }),
    retrieveCampania: builder.query<Campania, string>({
      query: (ref) => {
        const qs = new URLSearchParams();
        qs.set("ref", String(ref));
        // if (search) qs.set("search", search);
        return `/control-escolar/campanias/por_programa/?${qs.toString()}`;
      },
      providesTags: (_result, _error, ref) => [
        { type: "Campanias" as const, id: ref },
      ],
    }),
    howManyCampanias: builder.query<number, void>({
      query: () => "/control-escolar/campanias/howmanycampanias/",
      providesTags: [{ type: "Campanias" as const, id: "COUNT" }],
    }),
    activarCampania: builder.mutation<Campania, number>({
      query: (id) => ({
        url: `/control-escolar/campanias/${id}/activar/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Campanias" as const, id },
        { type: "Campanias" as const, id: "LIST" },
      ],
    }),
    desactivarCampania: builder.mutation<Campania, number>({
      query: (id) => ({
        url: `/control-escolar/campanias/${id}/desactivar/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Campanias" as const, id },
        { type: "Campanias" as const, id: "LIST" },
      ],
    }),

    // ─── Anuncios de Meta Ads vinculados a una campaña ─────────────────
    getCampaniaAnunciosMeta: builder.query<
      PaginatedResponse<CampaniaAnuncioMeta>,
      { campania?: number }
    >({
      query: ({ campania } = {}) => {
        const qs = new URLSearchParams();
        if (campania) qs.set("campania", String(campania));
        return `/control-escolar/campanias-anuncios-meta/?${qs.toString()}`;
      },
    }),
    createCampaniaAnuncioMeta: builder.mutation<
      CampaniaAnuncioMeta,
      CampaniaAnuncioMetaBody
    >({
      query: (body) => ({
        url: "/control-escolar/campanias-anuncios-meta/",
        method: "POST",
        body,
      }),
    }),
    updateCampaniaAnuncioMeta: builder.mutation<
      CampaniaAnuncioMeta,
      { id: number } & Partial<CampaniaAnuncioMetaBody>
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/campanias-anuncios-meta/${id}/`,
        method: "PATCH",
        body,
      }),
    }),
    deleteCampaniaAnuncioMeta: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/campanias-anuncios-meta/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCampaniasMutation,
  useUpdateCampaniaMutation,
  useRetrieveCampaniasQuery,
  useHowManyCampaniasQuery,
  useActivarCampaniaMutation,
  useDesactivarCampaniaMutation,
  useRetrieveCampaniaQuery,
  useGetCampaniaByIdQuery,
  useGetCampaniaAnunciosMetaQuery,
  useCreateCampaniaAnuncioMetaMutation,
  useUpdateCampaniaAnuncioMetaMutation,
  useDeleteCampaniaAnuncioMetaMutation,
} = campaniasApiSlice;
