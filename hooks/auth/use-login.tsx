import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { useRouter } from "next/navigation";
import { setAuth } from "@/redux/features/auth/authSlice";

interface LoginForm {
  email: string;
  password: string;
}

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data).unwrap();
      dispatch(setAuth());
      dispatch(setAlert({ message: "Bienvenido", type: "success" }));
      router.replace("/dashboard");
    } catch {
      dispatch(
        setAlert({ message: "Revisa tu email y password.", type: "error" })
      );
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
}
