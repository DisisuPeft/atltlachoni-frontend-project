import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetCampaniasQuery,
  useGetProgramasGenericoQuery,
} from "@/redux/features/control-escolar/genericosApiSlice";
import {
  useGetFuentesQuery,
  useGetEstatusQuery,
  useGetEtapasQuery,
} from "@/redux/features/crm/genericosApiSlice";
import { useEffect } from "react";

const leadSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  apellido_paterno: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(100, "El apellido paterno no puede exceder 100 caracteres"),
  apellido_materno: z.string().optional(),
  correo: z.string().email("Ingresa un email válido"),
  telefono: z
    .string()
    .regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"),
  fuente: z.string().min(1, "Selecciona una fuente"),
  notas: z.string().optional(),
  etapa_id: z.string(),
  estatus_id: z.string(),
  programa_objetivo_id: z.string().min(1, "Selecciona un programa"),
  campania_id: z.string().min(1, "Selecciona una campaña"),
  contacto_alterno: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function useLeadForm() {
  const { data: campanias } = useGetCampaniasQuery("");
  const { data: programas } = useGetProgramasGenericoQuery();
  const { data: estatus, isLoading: estatusLoading } = useGetEstatusQuery();
  const { data: fuentes } = useGetFuentesQuery();
  const { data: etapas, isLoading: etapasLoading } = useGetEtapasQuery();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    mode: "onChange",
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo: "",
      telefono: "",
      fuente: "",
      notas: "",
      etapa_id: "",
      programa_objetivo_id: "",
      campania_id: "",
      estatus_id: "",
    },
  });

  useEffect(() => {
    if (estatus && !estatusLoading && etapas && !estatusLoading) {
      setValue("estatus_id", String(estatus[0].id));
      setValue("etapa_id", String(etapas[0].id));
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    watch,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    campanias,
    programas,
    estatus,
    fuentes,
    etapas,
  };
}
