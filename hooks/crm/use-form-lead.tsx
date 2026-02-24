import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { LeadFormValues } from "@/redux/features/types/crm/type";
import { useForm } from "react-hook-form";

export default function useLeadForm() {
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  //   hook de creacion
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LeadFormValues>({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      correo: "",
      nombre_completo: "",
      apellido_paterno: "",
      apellido_materno: "",
      telefono: "",
      interesado_en: undefined,
      estatus: undefined,
      pipeline: undefined,
      etapa: undefined,
      fuente: undefined,
      vendedor_asignado: undefined,
      empresa: 1,
      institucion: unidadId,
      campania: undefined,
    },
  });

  const dispatch = useAppDispatch();
  const pipelineId = watch("pipeline") ?? 0;

  const onSubmit = (data: LeadFormValues) => {
    console.log(data);
  };

  return {
    register,
    onSubmit,
    reset,
    // etapas,
    errors,
    isSubmitting,
    setError,
    watch,
    pipelineId,
    // etapasLoading,
  };
}
