import { useForm } from "react-hook-form";
import { InscripcionBody } from "@/redux/features/types/control-escolar/type";
import { useMakeInscriptionMutation } from "@/redux/features/control-escolar/alumnosApiSlice";
import { ErrorResponse } from "@/redux/features/types/reponse";
import { sweetAlert } from "@/sweetalert/sweetalerts";

interface Props {
  estudianteId?: string;
  campania?: string | undefined;
  onSuccess: (value: boolean) => void | undefined;
}

const defaultValues: InscripcionBody = {
  monto_inicial: 0,
  fecha_primera_mensualidad: "",
  notas: "",
};

export default function useInscripcionPrograma({ estudianteId, campania, onSuccess }: Props) {
  const [makeInscription] = useMakeInscriptionMutation();

  const form = useForm<InscripcionBody>({ mode: "onChange", defaultValues });
  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = form;

  const onSubmit = async (data: InscripcionBody) => {
    try {
      const res = await makeInscription({ campania, estudianteId, formData: data }).unwrap();
      reset();
      onSuccess(false);
      sweetAlert("success", `${res?.message}`, "Éxito");
    } catch (error) {
      const e = error as ErrorResponse;
      onSuccess(false);
      sweetAlert("error", `${e?.data?.detail}`, "Error");
    }
  };

  return { errors, register, onSubmit, handleSubmit, reset, setValue, watch, control };
}