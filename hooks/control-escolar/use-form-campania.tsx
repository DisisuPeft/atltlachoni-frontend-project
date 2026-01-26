import {
  CampaniaFormFields,
  initialCampaniaFormValues,
} from "@/redux/features/types/control-escolar/type";
import { useForm } from "react-hook-form";
import { useGetProgramasGenericoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { useRetrieveInstitucionesQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { useCreateCampaniasMutation } from "@/redux/features/control-escolar/campaniasApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { ErrorResponse } from "@/redux/features/types/reponse";
import { useState } from "react";

export default function useFormCampania() {
  const [createCampanias] = useCreateCampaniasMutation();
  const { data: programas } = useGetProgramasGenericoQuery();
  const { data: institutos } = useRetrieveInstitucionesQuery();
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CampaniaFormFields>({
    defaultValues: initialCampaniaFormValues,
    mode: "onChange",
  });

  const onSubmit = async (data: CampaniaFormFields) => {
    try {
      await createCampanias(data).unwrap();
      reset();
      setErrorMessage("");
      dispatch(
        setAlert({
          type: "success",
          message: "La campaña fue creada con exito",
        }),
      );
    } catch (error) {
      const e = error as ErrorResponse;
      setErrorMessage(e?.data.detail);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    programas,
    institutos,
    errorMessage,
  };
}
