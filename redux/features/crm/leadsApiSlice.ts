import { apiSlice } from "@/redux/services/apiSlice";
import { SuccessMessage } from "../types/reponse";
import { LeadFormData } from "@/hooks/crm/leads/use-lead-form";
import {
  Lead,
  LeadQueryParams,
  InteraccionLead,
  InteraccionForm,
  SeguimientoProgramado,
  SeguimientoForm,
  HistorialEtapa,
} from "../types/crm/lead-types";
import { PaginatedResponse } from "../types/paginated";

const leadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Leads ────────────────────────────────────────────────────────

    getLeads: builder.query<PaginatedResponse<Lead>, LeadQueryParams | void>({
      query: (params = {}) => {
        const {
          instituto,
          etapa,
          estatus,
          vendedor,
          fuente,
          page = 1,
          search,
        } = params as LeadQueryParams;
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (instituto) qs.set("instituto", String(instituto));
        if (etapa) qs.set("etapa", String(etapa));
        if (estatus) qs.set("estatus", String(estatus));
        if (vendedor) qs.set("vendedor", String(vendedor));
        if (fuente) qs.set("fuente", String(fuente));
        if (search) qs.set("search", search);
        return `/crm/leads/?${qs.toString()}`;
      },
    }),

    getLead: builder.query<Lead, string>({
      query: (uuid) => `/crm/leads/${uuid}/`,
    }),

    createLead: builder.mutation<SuccessMessage, LeadFormData>({
      query: (formData) => ({
        url: "/crm/leads/",
        method: "POST",
        body: formData,
      }),
    }),

    updateLead: builder.mutation<Lead, { uuid: string; data: Partial<Lead> }>({
      query: ({ uuid, data }) => ({
        url: `/crm/leads/${uuid}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteLead: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/crm/leads/${uuid}/`,
        method: "DELETE",
      }),
    }),

    // ─── Interacciones ────────────────────────────────────────────────

    getInteracciones: builder.query<
      PaginatedResponse<InteraccionLead>,
      { lead: number }
    >({
      query: ({ lead }) => `/crm/interacciones/?lead=${lead}`,
    }),

    createInteraccion: builder.mutation<InteraccionLead, InteraccionForm>({
      query: (data) => {
        if (data.evidencia instanceof File) {
          const formData = new FormData();
          (Object.entries(data) as [string, unknown][]).forEach(
            ([key, value]) => {
              if (value === undefined || value === null) return;
              if (value instanceof File) {
                formData.append(key, value);
              } else {
                formData.append(key, String(value));
              }
            },
          );
          return { url: "/crm/interacciones/", method: "POST", body: formData };
        }
        return { url: "/crm/interacciones/", method: "POST", body: data };
      },
    }),

    deleteInteraccion: builder.mutation<void, number>({
      query: (id) => ({
        url: `/crm/interacciones/${id}/`,
        method: "DELETE",
      }),
    }),

    // ─── Seguimientos ─────────────────────────────────────────────────

    getSeguimientos: builder.query<
      SeguimientoProgramado[],
      { lead?: number; completado?: boolean }
    >({
      query: ({ lead, completado }) => {
        const qs = new URLSearchParams();
        if (lead) qs.set("lead", String(lead));
        if (completado !== undefined) qs.set("completado", String(completado));
        return `/crm/seguimientos/?${qs.toString()}`;
      },
    }),

    createSeguimiento: builder.mutation<SeguimientoProgramado, SeguimientoForm>(
      {
        query: (data) => ({
          url: "/crm/seguimientos/",
          method: "POST",
          body: data,
        }),
      },
    ),

    completarSeguimiento: builder.mutation<void, number>({
      query: (id) => ({
        url: `/crm/seguimientos/${id}/completar/`,
        method: "POST",
      }),
    }),

    // ─── Historial etapas ─────────────────────────────────────────────

    getHistorialEtapas: builder.query<HistorialEtapa[], { lead: number }>({
      query: ({ lead }) => `/crm/historial-etapas/?lead=${lead}`,
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetInteraccionesQuery,
  useCreateInteraccionMutation,
  useDeleteInteraccionMutation,
  useGetSeguimientosQuery,
  useCreateSeguimientoMutation,
  useCompletarSeguimientoMutation,
  useGetHistorialEtapasQuery,
} = leadsApiSlice;
