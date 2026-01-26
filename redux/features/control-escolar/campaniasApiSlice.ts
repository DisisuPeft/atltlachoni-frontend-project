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
    retrieveCampanias: builder.query<PaginatedResponse<Campania>, void>({
      query: () => "/control-escolar/campanias/",
    }),
    howManyCampanias: builder.query<number, void>({
      query: () => "/control-escolar/campanias/howmanycampanias/",
    }),
  }),
});

export const {
  useCreateCampaniasMutation,
  useRetrieveCampaniasQuery,
  useHowManyCampaniasQuery,
} = campaniasApiSlice;
