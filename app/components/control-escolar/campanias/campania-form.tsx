"use client";
import useFormCampania from "@/hooks/control-escolar/use-form-campania";
import { Modal } from "../../common/modal";
import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useState } from "react";
import Select from "@/app/ui/components/select";
import { useGetProgramasGenericoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import { Alert } from "@mui/material";

export default function CreateCampanias() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    programas,
    institutos,
    errorMessage,
  } = useFormCampania();
  const { isError } = useGetProgramasGenericoQuery();
  const [open, setOpen] = useState(false);
  const handleNewCampania = () => {
    if (isError) {
      sweetAlert(
        "warning",
        "No se pueden crear campañas si no existen programas educativos definidos",
        "Alerta",
      );
    } else {
      setOpen(true);
    }
  };
  // console.log(errorMessage);
  return (
    <div>
      <Button onClick={handleNewCampania}>+ Nueva Campaña</Button>
      <Modal show={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-10">
          <div className="px-2">
            <Input
              label="Nombre"
              type="text"
              register={register("nombre", {
                required: { value: true, message: "Esta campo es requerido" },
                minLength: {
                  value: 2,
                  message: "Se requieren minimo 2 caracteres.",
                },
                maxLength: {
                  value: 50,
                  message: "Maximo 50 caracteres",
                },
              })}
              error={errors.nombre?.message}
            />
          </div>
          <div className="px-2 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-[2px]">
                <Input
                  label="Fecha de inicio"
                  type="date"
                  register={register("fecha_inicio", {
                    required: {
                      value: true,
                      message: "La fecha de inicio es requerida",
                    },
                  })}
                />
                {errors.fecha_inicio && (
                  <div className="text-red-500">
                    {errors.fecha_inicio.message}
                  </div>
                )}
              </div>
              <div className="p-[2px]">
                <Input
                  label="Fecha de finalizacion"
                  type="date"
                  register={register("fecha_fin", {
                    required: {
                      value: true,
                      message: "La fecha de finalizacion es requerida",
                    },
                  })}
                />
                {errors.fecha_fin && (
                  <div className="text-red-500">{errors.fecha_fin.message}</div>
                )}
              </div>
            </div>
          </div>
          {errorMessage && (
            <Alert variant="outlined" severity="error" className="mt-5">
              {errorMessage}
            </Alert>
          )}
          <div className="px-1 mt-5">
            <div className="">
              <Select
                label="Selecciona un programa"
                options={programas ?? []}
                labelKey="nombre"
                valueKey="id"
                register={register("programa", {
                  required: {
                    value: true,
                    message: "Se debe seleccionar el programa",
                  },
                })}
              />
              {errors.programa && (
                <div className="text-red-500">{errors.programa.message}</div>
              )}
            </div>
          </div>
          <div>
            <div className="px-1 mt-4">
              <Input
                label="Costo asignado"
                type="number"
                register={register("costo_asignado", {
                  required: { value: true, message: "El costo es requerido" },
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El monto debe ser mayor o igual a 0",
                  },
                })}
              />
              {errors.costo_asignado && (
                <div className="text-red-500">
                  {errors.costo_asignado.message}
                </div>
              )}
            </div>
          </div>
          <div className="px-1 mt-5">
            <div className="">
              <Select
                label="Selecciona el instituto"
                options={institutos ?? []}
                labelKey="nombre"
                valueKey="id"
                register={register("instituto", {
                  required: {
                    value: true,
                    message: "Se debe seleccionar un instituto",
                  },
                })}
              />
              {errors.programa && (
                <div className="text-red-500">{errors.programa.message}</div>
              )}
            </div>
          </div>
          <div className="flex jutify-end mt-6">
            <button
              type="submit"
              className="rounded-md bg-sky-500 text-white p-2 cursor-pointer"
            >
              {isSubmitting ? <div>Guardando...</div> : <div>Guardar</div>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
