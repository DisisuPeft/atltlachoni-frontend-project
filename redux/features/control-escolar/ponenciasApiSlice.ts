import { apiSlice } from "@/redux/services/apiSlice";
import { Ponencia } from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";

const ponenciasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPonencias: builder.query<
      PaginatedResponse<Ponencia>,
      { tipo?: string; page?: number } | void
    >({
      query: (params = {}) => {
        const { tipo, page = 1 } = (params ?? {}) as { tipo?: string; page?: number };
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
  }),
});

export const { useGetPonenciasQuery, useDeletePonenciaMutation } = ponenciasApiSlice;