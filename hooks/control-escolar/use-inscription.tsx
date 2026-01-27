import { useForm } from "react-hook-form";
// import { setAlert } from "@/redux/features/alert/alertSlice";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  InitalPagoForm,
  PagoFormData,
} from "@/redux/features/types/control-escolar/type";
import { useGetTipoPagoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { useGetMetodoPagoQuery } from "@/redux/features/catalogos/genericosApiSlice";
// type Tipo = "create" | "delete";

export default function useInscripcionPrograma(
  estudianteId?: string,
  campania?: string | undefined,
  onSuccess?: (value: boolean) => void,
) {
  const [steps, setSteps] = useState(1);
  const { data: tipoPago } = useGetTipoPagoQuery();
  const { data: metodoPago } = useGetMetodoPagoQuery();
  const dispatch = useAppDispatch();
  const form = useForm<PagoFormData>({
    mode: "onChange",
    defaultValues: InitalPagoForm,
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  // const montoForm = watch("monto");

  const onSubmit = (data: PagoFormData) => {
    const next = { estudianteId, data, campania };
    console.log(next);
  };
  return {
    // isMorePages,
    // diplomados,
    errors,
    register,
    onSubmit,
    handleSubmit,
    tipoPago,
    reset,
    metodoPago,
    // control,
    setValue,
    watch,
    onSuccess,
    steps,
    setSteps,
    control,
  };
}
