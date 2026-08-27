import { apiSlice } from "@/redux/services/apiSlice";
import {
  // Material,
  ModuloMaterial,
  // ModuloConMateriales,
  ProgramaEducativo,
  ProgramaEducativoForm,
  ProgramaDestacado,
  SolicitudInformacionInput,
  SolicitudInformacionResponse,
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
      {
        page?: number;
        search?: string;
        status?: string;
        instituto?: number;
      } | void
    >({
      query: (params = {}) => {
        const {
          page = 1,
          search,
          status,
          instituto,
        } = params as {
          page?: number;
          search?: string;
          status?: string;
          instituto?: number;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        if (status !== undefined && status !== "") qs.set("status", status);
        if (instituto) qs.set("instituto", String(instituto));
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
    modulosPrograma: builder.query<
      ModuloMaterial[],
      { ref: string; campania?: string | number }
    >({
      query: ({ ref, campania }) => {
        const qs = new URLSearchParams();
        if (campania !== undefined) qs.set("campania", String(campania));
        const search = qs.toString();
        return {
          url: `/control-escolar/materiales/${ref}/modulosprograma/${search ? `?${search}` : ""}`,
          cache: "no-store",
        };
      },
      providesTags: (_result, _error, { ref }) => [
        { type: "Materiales" as const, id: ref },
        { type: "Materiales" as const, id: "LIST" },
      ],
    }),
    programasDestacados: builder.query<
      ProgramaDestacado[],
      { limit?: number; instituto?: number } | void
    >({
      query: (params = {}) => {
        const { limit = 4, instituto } = (params ?? {}) as {
          limit?: number;
          instituto?: number;
        };
        const qs = new URLSearchParams();
        qs.set("limit", String(limit));
        if (instituto) qs.set("instituto", String(instituto));
        return `/public/programas-destacados/?${qs.toString()}`;
      },
    }),
    solicitudInformacion: builder.mutation<
      SolicitudInformacionResponse,
      SolicitudInformacionInput
    >({
      query: (body) => ({
        url: "/public/solicitar-informacion/",
        method: "POST",
        body,
      }),
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
  useModulosProgramaQuery,
  useProgramasDestacadosQuery,
  useSolicitudInformacionMutation,
} = programasApiSlice;
