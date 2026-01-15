// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  EstudiantePerfilForm,
  estudiantePerfilInitialValues,
} from "@/redux/features/types/control-escolar/type";
import { useGetGenerosQuery } from "@/redux/features/catalogos/generoApiSlice";
import {
  useRetrieveNivelEducativoQuery,
  useRetrieveInstitucionesQuery,
  useRetrieveEstadosQuery,
  // useRetrieveLocalidadesQuery,
} from "@/redux/features/catalogos/genericosApiSlice";

export default function useAlumnoForm() {
  // const router = useRouter();
  const { data: generos } = useGetGenerosQuery();
  const { data: nivelEducativo } = useRetrieveNivelEducativoQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery();
  const { data: estados } = useRetrieveEstadosQuery();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EstudiantePerfilForm>({
    defaultValues: estudiantePerfilInitialValues,
  });

  const entidad = watch("estado_pais");
  console.log(entidad);
  //   const { data: localidades } = useRetrieveLocalidadesQuery(
  //     entidad ? parseInt(entidad) : 0
  //   );
  const onSubmit = async (data: EstudiantePerfilForm) => {
    console.log(data);

    alert("Datos del estudiante guardados exitosamente");
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    control,
    errors,
    isSubmitting,
    generos,
    nivelEducativo,
    instituciones,
    estados,
  };
}
