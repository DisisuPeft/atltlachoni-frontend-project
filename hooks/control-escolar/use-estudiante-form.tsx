import { useRouter } from "next/navigation";
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
  useRetrieveLocalidadesQuery,
} from "@/redux/features/catalogos/genericosApiSlice";
import { useEffect } from "react";
import { useAddEstudiantesMutation } from "@/redux/features/control-escolar/alumnosApiSlice";
import Swal from "sweetalert2";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import {
  useRetrieveUserQuery,
  useVerifyUserQuery,
} from "@/redux/features/auth/authApiSlice";
import { useSearchParams } from "next/navigation";

const defaultFormValues = {
  ...estudiantePerfilInitialValues,
  user: {
    ...estudiantePerfilInitialValues.user,
    fecha_nacimiento: "1999-08-24",
  },
};

export default function useAlumnoForm() {
  const router = useRouter();
  const { data: user } = useRetrieveUserQuery();
  const { data: verifyData } = useVerifyUserQuery();
  const ins = user?.departamento_info?.instituto.id;
  const isAdmin =
    verifyData?.superuser ||
    verifyData?.roles.some((r) => r.nombre === "Administrador") ||
    false;
  const { data: generos } = useGetGenerosQuery();
  const { data: nivelEducativo } = useRetrieveNivelEducativoQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery({ ins });
  const { data: estados } = useRetrieveEstadosQuery();
  const [addEstudiantes] = useAddEstudiantesMutation();
  const searchParams = useSearchParams();
  const pestaniaRef = searchParams.get("ref");
  // console.log(pestaniaRef);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<EstudiantePerfilForm>({
    defaultValues: defaultFormValues,
  });

  const entidad = watch("estado_pais");
  const { data: localidades } = useRetrieveLocalidadesQuery(
    entidad ? parseInt(entidad) : 0,
  );

  const onSubmit = async (data: EstudiantePerfilForm) => {
    try {
      const response = (await addEstudiantes(data).unwrap()) as {
        message: string;
        create: string;
      };
      const ref = response.create;

      const result = await Swal.fire({
        icon: "success",
        title: "Alumno creado",
        text: `${response.message ?? "Alumno creado."} ¿Deseas inscribir al alumno ahora?`,
        confirmButtonText: "Sí, inscribir",
        denyButtonText: "Registrar otro",
        cancelButtonText: "No",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonColor: "#0056D2",
        denyButtonColor: "#6B7280",
        cancelButtonColor: "#DC2626",
      });

      if (result.isConfirmed) {
        router.push(
          `/dashboard/control-escolar/alumnos/${ref}?ref=${pestaniaRef}`,
        );
      } else if (result.isDenied) {
        reset(defaultFormValues);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        router.push(`/dashboard/control-escolar/alumnos?ref=${pestaniaRef}`);
      }
    } catch (error) {
      const detail = (error as { data?: { detail?: string } })?.data?.detail;
      sweetAlert(
        "error",
        detail ?? "No fue posible crear al alumno. Intenta de nuevo.",
        "Error",
      );
    }
  };

  const dateBirth = watch("user.fecha_nacimiento");

  const caluleAgeBirth = () => {
    const birthday = new Date(dateBirth);
    const today = new Date();
    const yearsOld = today.getUTCFullYear() - birthday.getUTCFullYear();

    if (birthday.getUTCMonth() < today.getUTCMonth()) {
      return yearsOld;
    } else if (
      today.getUTCMonth() === birthday.getUTCMonth() &&
      birthday.getUTCDate() <= today.getUTCDate()
    ) {
      return yearsOld;
    }
    return yearsOld - 1;
  };

  useEffect(() => {
    setValue("user.edad", caluleAgeBirth());
  });

  useEffect(() => {
    if (ins) setValue("institucion", ins);
  }, [ins, setValue]);

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
    localidades,
    isAdmin,
  };
}
