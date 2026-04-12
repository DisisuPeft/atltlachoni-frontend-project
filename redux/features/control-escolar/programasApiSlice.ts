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
    }),
    retrieveProgramas: builder.query<
      PaginatedResponse<ProgramaEducativo>,
      { page?: number; search?: string } | void
    >({
      query: (params = {}) => {
        const { page = 1, search } = params as { page?: number; search?: string };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        return `/control-escolar/programas-educativos/?${qs.toString()}`;
      },
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
    }),
    // uploadMaterial: builder.query<>
  }),
});

export const {
  useCreateProgramasMutation,
  useRetrieveProgramasQuery,
  useHowManyProgramasQuery,
  useRetrieveProgramaQuery,
  useUpdateProgramasMutation,
} = programasApiSlice;
