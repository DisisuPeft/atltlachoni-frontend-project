import { useForm } from "react-hook-form";
// import { setAlert } from "@/redux/features/alert/a lertSlice";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  InitalPagoForm,
  PagoFormData,
} from "@/redux/features/types/control-escolar/type";
import { useGetTipoPagoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { useGetMetodoPagoQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { useMakeInscriptionMutation } from "@/redux/features/control-escolar/alumnosApiSlice";
import { ErrorResponse } from "@/redux/features/types/reponse";
import { sweetAlert } from "@/sweetalert/sweetalerts";

type Tipo = "success" | "error";

export default function useInscripcionPrograma(
  estudianteId?: string,
  campania?: string | undefined,
  onSuccess?: (value: boolean) => void,
) {
  const [steps, setSteps] = useState(1);
  const { data: tipoPago } = useGetTipoPagoQuery();
  const { data: metodoPago } = useGetMetodoPagoQuery();
  const [mensaje, setMensaje] = useState<string | undefined>("");
  const [tipo, setTipo] = useState<Tipo>();
  const [makeInscription] = useMakeInscriptionMutation();
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

  const timeOutMessage = () => {
    setTimeout(() => {
      setMensaje("");
    }, 5000);
  };

  const onSubmit = async (data: PagoFormData) => {
    const next = { estudianteId, data, campania };
    try {
      const res = await makeInscription({
        campania: next.campania,
        estudianteId: next.estudianteId,
        formData: next.data,
      }).unwrap();
      setTipo("success");
      setMensaje(`${res.data.message}`);
      reset();
    } catch (error) {
      const e = error as ErrorResponse;
      // onSuccess(false);
      setTipo("error");
      setMensaje(`${e.data.detail}`);
    } finally {
      timeOutMessage();
    }
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
    mensaje,
    tipo,
  };
}
