import { apiSlice } from "@/redux/services/apiSlice";
import {
  ProgramaEducativo,
  ProgramaEducativoForm,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
import { MessageResponse } from "../types/reponse";

const programasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProgramas: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/programas-educativos/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Programas" as const, id: "LIST" }],
    }),
    retrieveProgramas: builder.query<
      PaginatedResponse<ProgramaEducativo>,
      { page?: number; search?: string; status?: string } | void
    >({
      query: (params = {}) => {
        const { page = 1, search, status } = params as {
          page?: number;
          search?: string;
          status?: string;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        if (status !== undefined && status !== "") qs.set("status", status);
        return `/control-escolar/programas-educativos/?${qs.toString()}`;
      },
      providesTags: [{ type: "Programas" as const, id: "LIST" }],
    }),
    howManyProgramas: builder.query<number, void>({
      query: () => "/control-escolar/programas-educativos/howmanyprograms/",
    }),
    retrievePrograma: builder.query<ProgramaEducativoForm, string>({
      query: (uuid) => `/control-escolar/programas-educativos/${uuid}/`,
    }),
    updateProgramas: builder.mutation<
      MessageResponse,
      { uuid: string; formData: ProgramaEducativoForm }
    >({
      query: ({ uuid, formData }) => ({
        url: `/control-escolar/programas-educativos/${uuid}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [{ type: "Programas" as const, id: "LIST" }],
    }),
    activarPrograma: builder.mutation<{ message: string }, string>({
      query: (ref) => ({
        url: `/control-escolar/programas-educativos/${ref}/activar/`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Programas" as const, id: "LIST" }],
    }),
    desactivarPrograma: builder.mutation<{ message: string }, string>({
      query: (ref) => ({
        url: `/control-escolar/programas-educativos/${ref}/desactivar/`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Programas" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useCreateProgramasMutation,
  useRetrieveProgramasQuery,
  useHowManyProgramasQuery,
  useRetrieveProgramaQuery,
  useUpdateProgramasMutation,
  useActivarProgramaMutation,
  useDesactivarProgramaMutation,
} = programasApiSlice;
