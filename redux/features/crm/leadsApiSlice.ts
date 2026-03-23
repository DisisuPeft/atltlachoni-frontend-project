import { apiSlice } from "@/redux/services/apiSlice";
import { SuccessMessage } from "../types/reponse";
import { LeadFormData } from "@/hooks/crm/leads/use-lead-form";

const leadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLead: builder.mutation<SuccessMessage, LeadFormData>({
      query: (formData) => ({
        url: "/crm/leads/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useCreateLeadMutation } = leadsApiSlice;
