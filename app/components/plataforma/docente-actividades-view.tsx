"use client";

import { useMemo, useState } from "react";
import {
  useGetActividadesQuery,
  useCreateActividadMutation,
} from "@/redux/features/control-escolar/actividadesApiSlice";
import { useGetMisProgramasDocenteQuery } from "@/redux/features/control-escolar/maestrosApiSlice";
import type { Actividad } from "@/redux/features/types/control-escolar/type";
import { Modal } from "@/app/components/common/modal";
import EntregasModal from "@/app/components/control-escolar/actividades/entregas-modal";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  Plus,
  X,
  Clock,
  Users,
  Loader2,
  GraduationCap,
  BookOpen,
} from "lucide-react";

function formatFecha(fecha: string | null) {
  if (!fecha) return null;
  return new Date(fecha).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActividadRow({
  actividad,
  onVerEntregas,
}: {
  actividad: Actividad;
  onVerEntregas: () => void;
}) {
  const vencida =
    !!actividad.fecha_limite && new Date(actividad.fecha_limite) < new Date();

  return (
    <button
      type="button"
      onClick={onVerEntregas}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left"
    >
      <ClipboardList className="w-4 h-4 text-purple-600 shrink-0" />
      <span className="flex-1 text-sm text-gray-800 truncate min-w-0">
        {actividad.nombre}
      </span>
      {actividad.fecha_limite && (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
            vencida ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
          }`}
        >
          <Clock className="w-3 h-3" />
          {formatFecha(actividad.fecha_limite)}
        </span>
      )}
      <span className="inline-flex items-center gap-1 text-xs text-gray-400 shrink-0">
        <Users className="w-3.5 h-3.5" />
        {actividad.total_entregas}
      </span>
    </button>
  );
}

interface CrearActividadModalProps {
  show: boolean;
  onClose: () => void;
  programaRef: string;
  modulos: { id: number; nombre: string }[];
}

function CrearActividadModal({
  show,
  onClose,
  programaRef,
  modulos,
}: CrearActividadModalProps) {
  const [createActividad, { isLoading }] = useCreateActividadMutation();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [modulo, setModulo] = useState<number | undefined>();
  const [fechaLimite, setFechaLimite] = useState("");
  const [permiteTardia, setPermiteTardia] = useState(true);
  const [calMax, setCalMax] = useState(10);

  const reset = () => {
    setNombre("");
    setDescripcion("");
    setModulo(undefined);
    setFechaLimite("");
    setPermiteTardia(true);
    setCalMax(10);
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      sweetAlert("error", "El nombre de la actividad es obligatorio.", "Error");
      return;
    }
    try {
      await createActividad({
        nombre,
        descripcion: descripcion || undefined,
        programa: programaRef,
        modulo,
        fecha_limite: fechaLimite ? new Date(fechaLimite).toISOString() : undefined,
        permite_entrega_tardia: permiteTardia,
        calificacion_maxima: calMax,
      }).unwrap();
      sweetAlert("success", "Actividad creada.", "Listo");
      reset();
      onClose();
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      sweetAlert("error", detail ?? "No se pudo crear la actividad.", "Error");
    }
  };

  return (
    <Modal show={show} onClose={onClose} maxWidth="md">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Nueva actividad</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: Ensayo final"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Instrucciones para el alumno..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Módulo
          </label>
          <select
            value={modulo ?? ""}
            onChange={(e) =>
              setModulo(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Sin módulo</option>
            {modulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fecha límite
            </label>
            <input
              type="datetime-local"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Calificación máxima
            </label>
            <input
              type="number"
              min={0}
              step="0.1"
              value={calMax}
              onChange={(e) => setCalMax(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={permiteTardia}
            onChange={(e) => setPermiteTardia(e.target.checked)}
            className="rounded border-gray-300"
          />
          Permitir entregas tardías
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Crear actividad
        </button>
      </div>
    </Modal>
  );
}

export default function DocenteActividadesView() {
  const { data: programasData, isLoading: loadingProgramas } =
    useGetMisProgramasDocenteQuery();
  const programas = programasData?.programas ?? [];

  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const activeRef = selectedRef ?? programas[0]?.ref ?? null;
  const activePrograma = programas.find((p) => p.ref === activeRef);

  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const [showCrear, setShowCrear] = useState(false);
  const [verEntregas, setVerEntregas] = useState<Actividad | null>(null);

  const { data: actividadesData, isLoading } = useGetActividadesQuery(
    { programa: activeRef! },
    { skip: !activeRef },
  );

  const grupos = useMemo(() => {
    const map = new Map<string, { key: string; label: string; items: Actividad[] }>();
    for (const a of actividadesData?.results ?? []) {
      const key = a.modulo ? String(a.modulo) : "sin-modulo";
      const label = a.modulo_nombre ?? "Sin módulo";
      if (!map.has(key)) map.set(key, { key, label, items: [] });
      map.get(key)!.items.push(a);
    }
    return Array.from(map.values());
  }, [actividadesData]);

  if (loadingProgramas) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (programas.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-gray-100 rounded-xl p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-purple-400" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Sin programas asignados</p>
          <p className="text-sm text-gray-400">
            Contacta al administrador para que te asigne a un programa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis actividades</h1>
          <p className="text-sm text-gray-500 mt-1">
            Crea tareas y califica las entregas de tus alumnos
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCrear(true)}
          disabled={!activeRef}
          className="flex items-center gap-1.5 text-xs font-medium text-white bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva actividad
        </button>
      </div>

      {programas.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {programas.map((p) => (
            <button
              key={p.ref}
              type="button"
              onClick={() => {
                setSelectedRef(p.ref);
                setOpenStates({});
              }}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors border ${
                activeRef === p.ref
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              {p.nombre}
            </button>
          ))}
        </div>
      )}

      {programas.length === 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <span className="font-medium">{programas[0].nombre}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-10">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando actividades…
        </div>
      ) : grupos.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400">
          Sin actividades registradas.
        </div>
      ) : (
        grupos.map((grupo, i) => {
          const isOpen = openStates[grupo.key] ?? i === 0;
          return (
            <div key={grupo.key} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenStates((p) => ({ ...p, [grupo.key]: !isOpen }))
                }
                className="w-full bg-gray-50 px-4 py-2.5 flex items-center gap-2"
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <FolderOpen className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-700">
                  {grupo.label}
                </span>
                <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5 ml-1">
                  {grupo.items.length}
                </span>
              </button>
              {isOpen && (
                <div className="divide-y divide-gray-100">
                  {grupo.items.map((a) => (
                    <ActividadRow
                      key={a.id}
                      actividad={a}
                      onVerEntregas={() => setVerEntregas(a)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {activeRef && (
        <CrearActividadModal
          show={showCrear}
          onClose={() => setShowCrear(false)}
          programaRef={activeRef}
          modulos={activePrograma?.modulos ?? []}
        />
      )}

      {verEntregas && (
        <EntregasModal
          actividad={verEntregas}
          onClose={() => setVerEntregas(null)}
        />
      )}
    </div>
  );
}
