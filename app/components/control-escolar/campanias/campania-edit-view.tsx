"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useGetCampaniaByIdQuery,
  useUpdateCampaniaMutation,
} from "@/redux/features/control-escolar/campaniasApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useGetProgramasGenericoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { useRetrieveInstitucionesQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { CampaniaUpdateBody } from "@/redux/features/types/control-escolar/type";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import {
  ArrowLeft,
  Tag,
  CalendarRange,
  BookOpen,
  DollarSign,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
  Save,
  ShieldAlert,
} from "lucide-react";

interface Props {
  id: number;
}

interface FormValues {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  programa: string;
  instituto: string;
  costo_asignado: number | string;
  status: number;
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-md bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#0056D2]" />
      </div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-500";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-500";

export default function CampaniaEditView({ id }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const { data: user } = useRetrieveUserQuery();
  const { data: campania, isLoading: isLoadingCampania } =
    useGetCampaniaByIdQuery(id);
  const { data: programas, isLoading: isLoadingProgramas } =
    useGetProgramasGenericoQuery();
  const { data: institutos, isLoading: isLoadingInstitutos } =
    useRetrieveInstitucionesQuery();
  const [updateCampania, { isLoading: isUpdating }] =
    useUpdateCampaniaMutation();

  const [dateError, setDateError] = useState<string | null>(null);

  // Rol check: Administrador o Tutor
  const canEdit =
    user?.roles_list?.some((r) =>
      ["Administrador", "Tutor"].includes(r.nombre),
    ) ?? false;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      programa: "",
      instituto: "",
      costo_asignado: "",
      status: 1,
    },
  });

  // Pre-popular el formulario cuando los datos de la campaña y catálogos estén disponibles
  useEffect(() => {
    if (!campania) return;

    setValue("nombre", campania.nombre || "");
    setValue("descripcion", campania.descripcion || "");
    setValue("fecha_inicio", campania.fecha_inicio || "");
    setValue("fecha_fin", campania.fecha_fin || "");
    setValue(
      "costo_asignado",
      campania.costo_asignado ? parseFloat(campania.costo_asignado) : 0,
    );
    setValue("status", campania.status ?? 1);

    if (programas?.length && campania.programa_nombre) {
      const matchP = programas.find(
        (p) => p.nombre.trim() === campania.programa_nombre.trim(),
      );
      if (matchP) {
        setValue("programa", String(matchP.id));
      }
    }

    if (institutos?.length && campania.institucion_nombre) {
      const matchI = institutos.find(
        (i) => i.nombre.trim() === campania.institucion_nombre.trim(),
      );
      if (matchI) {
        setValue("instituto", String(matchI.id));
      }
    }
  }, [campania, programas, institutos, setValue]);

  if (isLoadingCampania || isLoadingProgramas || isLoadingInstitutos) {
    return (
      <div className="py-24 flex flex-col items-center gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Cargando campaña...</p>
      </div>
    );
  }

  if (!campania) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-sm text-gray-400">No se encontró la campaña.</p>
        <Link
          href={`/dashboard/control-escolar/campanias${ref ? `?ref=${ref}` : ""}`}
          className="text-xs text-[#0056D2] hover:underline"
        >
          Volver a campañas
        </Link>
      </div>
    );
  }

  const matchedInitialPrograma = programas?.find(
    (p) => p.nombre.trim() === campania.programa_nombre?.trim(),
  );
  const matchedInitialInstituto = institutos?.find(
    (i) => i.nombre.trim() === campania.institucion_nombre?.trim(),
  );

  const onSubmit = async (data: FormValues) => {
    setDateError(null);

    // Validación en frontend: fecha_inicio no puede ser mayor a fecha_fin
    if (data.fecha_inicio && data.fecha_fin) {
      if (new Date(data.fecha_inicio) > new Date(data.fecha_fin)) {
        setDateError(
          "La fecha de inicio no puede ser posterior a la fecha de cierre.",
        );
        return;
      }
    }

    // PATCH manda solo los campos que cambiaron o se especificaron
    const payload: Partial<CampaniaUpdateBody> = {};

    if (data.nombre && data.nombre.trim() !== (campania.nombre || "").trim()) {
      payload.nombre = data.nombre.trim();
    }

    const descValue = data.descripcion?.trim() || null;
    const origDesc = campania.descripcion?.trim() || null;
    if (descValue !== origDesc) {
      payload.descripcion = descValue;
    }

    const fechaInicioVal = data.fecha_inicio || null;
    if (fechaInicioVal !== (campania.fecha_inicio || null)) {
      payload.fecha_inicio = fechaInicioVal;
    }

    const fechaFinVal = data.fecha_fin || null;
    if (fechaFinVal !== (campania.fecha_fin || null)) {
      payload.fecha_fin = fechaFinVal;
    }

    if (data.costo_asignado !== "" && data.costo_asignado !== undefined) {
      const numCosto = Number(data.costo_asignado);
      const origCosto = campania.costo_asignado
        ? parseFloat(campania.costo_asignado)
        : 0;
      if (numCosto !== origCosto) {
        payload.costo_asignado = numCosto;
      }
    }

    if (data.programa) {
      const progId = Number(data.programa);
      if (progId !== matchedInitialPrograma?.id) {
        payload.programa = progId;
      }
    }

    if (data.instituto) {
      const instId = Number(data.instituto);
      if (instId !== matchedInitialInstituto?.id) {
        payload.instituto = instId;
      }
    }

    const statusNum = Number(data.status);
    if (statusNum !== campania.status) {
      payload.status = statusNum;
    }

    if (Object.keys(payload).length === 0) {
      sweetAlert("info", "No se detectaron cambios para guardar", "Sin cambios");
      return;
    }

    try {
      await updateCampania({ id: campania.id, ...payload }).unwrap();
      sweetAlert("success", "La campaña fue actualizada con éxito", "¡Listo!");
      router.push(
        `/dashboard/control-escolar/campanias/${campania.id}${ref ? `?ref=${ref}` : ""}`,
      );
    } catch (err: unknown) {
      const errorObj = err as {
        status?: number;
        data?: { detail?: string } | Record<string, string[]>;
      };
      if (errorObj?.status === 403) {
        sweetAlert(
          "error",
          "No tienes permisos para editar esta campaña. Solo Administradores y Tutores pueden realizar esta acción.",
          "Permiso denegado",
        );
      } else {
        const detail =
          (errorObj?.data as { detail?: string })?.detail ??
          "No se pudo actualizar la campaña.";
        sweetAlert("error", detail, "Error");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href={`/dashboard/control-escolar/campanias/${campania.id}${ref ? `?ref=${ref}` : ""}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al detalle de la campaña
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Campaña</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {campania.nombre} · ID #{campania.id}
          </p>
        </div>
      </div>

      {/* Alerta de permisos si no es Administrador ni Tutor */}
      {!canEdit && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p>
            Solo los usuarios con rol de <strong>Administrador</strong> o{" "}
            <strong>Tutor</strong> tienen permisos para modificar campañas.
          </p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Información general */}
          <div>
            <SectionHeader icon={Tag} title="Información general" />
            <div className="space-y-4">
              <Field
                label="Nombre de la campaña"
                required
                error={errors.nombre?.message}
              >
                <input
                  {...register("nombre", {
                    required: "El nombre es requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  })}
                  disabled={!canEdit || isUpdating}
                  type="text"
                  placeholder="Ej. Psicología del Deporte Infantil"
                  className={inputClass}
                />
              </Field>

              <Field label="Descripción" error={errors.descripcion?.message}>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <textarea
                    {...register("descripcion")}
                    disabled={!canEdit || isUpdating}
                    rows={3}
                    placeholder="Describe los objetivos o detalles de la campaña..."
                    className={`${inputClass} pl-10 resize-none`}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Vigencia */}
          <div>
            <SectionHeader icon={CalendarRange} title="Vigencia" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Fecha de inicio"
                error={errors.fecha_inicio?.message}
              >
                <input
                  {...register("fecha_inicio")}
                  disabled={!canEdit || isUpdating}
                  type="date"
                  className={inputClass}
                />
              </Field>

              <Field label="Fecha de cierre" error={errors.fecha_fin?.message}>
                <input
                  {...register("fecha_fin")}
                  disabled={!canEdit || isUpdating}
                  type="date"
                  className={inputClass}
                />
              </Field>
            </div>
            {dateError && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {dateError}
              </p>
            )}
          </div>

          {/* Configuración */}
          <div>
            <SectionHeader icon={BookOpen} title="Configuración" />
            <div className="space-y-4">
              <Field label="Programa educativo" error={errors.programa?.message}>
                <div className="relative">
                  <select
                    {...register("programa")}
                    disabled={!canEdit || isUpdating}
                    className={selectClass}
                  >
                    <option value="">
                      {campania.programa_nombre
                        ? `Mantener actual: ${campania.programa_nombre}`
                        : "Selecciona un programa"}
                    </option>
                    {programas?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {campania.programa_nombre && (
                  <p className="text-xs text-gray-400 mt-1">
                    Programa registrado:{" "}
                    <span className="font-medium text-gray-600">
                      {campania.programa_nombre}
                    </span>
                  </p>
                )}
              </Field>

              <Field label="Instituto" error={errors.instituto?.message}>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    {...register("instituto")}
                    disabled={!canEdit || isUpdating}
                    className={`${selectClass} pl-10`}
                  >
                    <option value="">
                      {campania.institucion_nombre
                        ? `Mantener actual: ${campania.institucion_nombre}`
                        : "Selecciona un instituto"}
                    </option>
                    {institutos?.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {campania.institucion_nombre ? (
                  <p className="text-xs text-gray-400 mt-1">
                    Instituto registrado:{" "}
                    <span className="font-medium text-gray-600">
                      {campania.institucion_nombre}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-amber-600 mt-1">
                    Esta campaña no tiene un instituto asignado aún.
                  </p>
                )}
              </Field>

              <Field
                label="Costo asignado"
                error={errors.costo_asignado?.message}
              >
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    {...register("costo_asignado", {
                      min: { value: 0, message: "Debe ser mayor o igual a 0" },
                    })}
                    disabled={!canEdit || isUpdating}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              <Field label="Estado">
                <select
                  {...register("status")}
                  disabled={!canEdit || isUpdating}
                  className={selectClass}
                >
                  <option value={1}>Activa</option>
                  <option value={0}>Inactiva</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              href={`/dashboard/control-escolar/campanias/${campania.id}${ref ? `?ref=${ref}` : ""}`}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={!canEdit || isUpdating}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
