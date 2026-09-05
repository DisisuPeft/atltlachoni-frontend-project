"use client";

import { useState } from "react";
import {
  useGetExamenesQuery,
  useGetExamenDetalleQuery,
  useGetTiposExamenQuery,
  useGetTiposPreguntasQuery,
  useCreateExamenMutation,
  useUpdateExamenMutation,
  useDeleteExamenMutation,
  useCreatePreguntaMutation,
  useUpdatePreguntaMutation,
  useDeletePreguntaMutation,
  useCreateOpcionMutation,
  useUpdateOpcionMutation,
  useDeleteOpcionMutation,
  useGetRespuestasPendientesQuery,
  useCalificarRespuestaAbiertaMutation,
} from "@/redux/features/control-escolar/evaluacionesApiSlice";
import type {
  Examen,
  // ExamenDetalle,
  Pregunta,
  OpcionAdmin,
  TipoExamen,
  TipoPregunta,
  RespuestaPendiente,
} from "@/redux/features/types/control-escolar/type";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileQuestion,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

interface Props {
  programaNumericId: number;
  campaniaId?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const LETRAS = ["A", "B", "C", "D", "E"];

function LetraBadge({ letra }: { letra: string | null }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600 shrink-0">
      {letra ?? "–"}
    </span>
  );
}

// ── Inline confirm-delete button ───────────────────────────────────────────────

function DeleteButton({
  onConfirm,
  size = "sm",
}: {
  onConfirm: () => void;
  size?: "sm" | "xs";
}) {
  const [confirming, setConfirming] = useState(false);
  const cls = size === "xs" ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1";
  if (confirming)
    return (
      <span className="flex items-center gap-1">
        <span className="text-xs text-red-600">¿Eliminar?</span>
        <button
          type="button"
          onClick={onConfirm}
          className={`${cls} bg-red-600 text-white rounded hover:bg-red-700`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className={`${cls} border border-gray-300 text-gray-500 rounded hover:bg-gray-50`}
        >
          No
        </button>
      </span>
    );
  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-gray-400 hover:text-red-500 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Opcion row ────────────────────────────────────────────────────────────────

function OpcionRow({
  opcion,
  onDeleted,
}: {
  opcion: OpcionAdmin;
  onDeleted: () => void;
}) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(opcion.text);
  const [isCorrect, setIsCorrect] = useState(opcion.is_correct);

  const [updateOpcion, { isLoading: saving }] = useUpdateOpcionMutation();
  const [deleteOpcion] = useDeleteOpcionMutation();

  const handleSave = async () => {
    try {
      await updateOpcion({
        id: opcion.id,
        text,
        is_correct: isCorrect,
      }).unwrap();
      setEditing(false);
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al guardar la opción" }),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOpcion(opcion.id).unwrap();
      onDeleted();
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al eliminar la opción" }),
      );
    }
  };

  if (editing)
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-gray-100">
        <LetraBadge letra={opcion.letra} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 text-sm px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
        <label className="flex items-center gap-1 text-xs text-gray-600 shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => setIsCorrect(e.target.checked)}
            className="accent-green-600"
          />
          Correcta
        </label>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="text-blue-600 hover:text-blue-700"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 border-b last:border-b-0 border-gray-100 group ${opcion.is_correct ? "bg-green-50" : ""}`}
    >
      <LetraBadge letra={opcion.letra} />
      <span
        className={`flex-1 text-sm ${opcion.is_correct ? "text-green-700 font-medium" : "text-gray-700"}`}
      >
        {opcion.text}
      </span>
      {opcion.is_correct && (
        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
      )}
      <span className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <DeleteButton onConfirm={handleDelete} size="xs" />
      </span>
    </div>
  );
}

// ── Add opcion form ────────────────────────────────────────────────────────────

function AddOpcionForm({
  preguntaId,
  orden,
  onDone,
}: {
  preguntaId: number;
  orden: number;
  onDone: () => void;
}) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [letra, setLetra] = useState(LETRAS[orden] ?? "");
  const [createOpcion, { isLoading }] = useCreateOpcionMutation();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      await createOpcion({
        pregunta: preguntaId,
        text: text.trim(),
        is_correct: isCorrect,
        letra: letra || null,
        orden,
      }).unwrap();
      onDone();
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al crear la opción" }),
      );
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t border-gray-200">
      <select
        value={letra}
        onChange={(e) => setLetra(e.target.value)}
        className="w-14 text-xs px-1.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">–</option>
        {LETRAS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Texto de la opción"
        className="flex-1 text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <label className="flex items-center gap-1 text-xs text-gray-600 shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={isCorrect}
          onChange={(e) => setIsCorrect(e.target.checked)}
          className="accent-green-600"
        />
        Correcta
      </label>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className="text-blue-600 hover:text-blue-700 disabled:opacity-40"
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
      </button>
      <button
        type="button"
        onClick={onDone}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Pregunta card ─────────────────────────────────────────────────────────────

function PreguntaCard({
  pregunta,
  index,
  tiposPreguntas,
}: {
  pregunta: Pregunta;
  index: number;
  tiposPreguntas: TipoPregunta[];
}) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [editingEnunciado, setEditingEnunciado] = useState(false);
  const [enunciado, setEnunciado] = useState(pregunta.enunciado);
  const [tipo, setTipo] = useState<number | "">(pregunta.tipo_obj?.id ?? "");
  const [puntajeMaximo, setPuntajeMaximo] = useState(pregunta.puntaje_maximo ?? "1");
  const [addingOpcion, setAddingOpcion] = useState(false);

  const [updatePregunta, { isLoading: saving }] = useUpdatePreguntaMutation();
  const [deletePregunta] = useDeletePreguntaMutation();

  const handleSave = async () => {
    try {
      await updatePregunta({
        id: pregunta.id,
        enunciado,
        ...(tipo !== "" ? { tipo: Number(tipo) } : {}),
        puntaje_maximo: Number(puntajeMaximo),
      }).unwrap();
      setEditingEnunciado(false);
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al guardar la pregunta" }),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deletePregunta(pregunta.id).unwrap();
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al eliminar la pregunta" }),
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-2 px-4 py-3 bg-white group">
        <span className="text-xs font-bold text-gray-400 mt-0.5 shrink-0 w-5">
          {index + 1}.
        </span>

        {editingEnunciado ? (
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              rows={2}
              className="text-sm w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="text-xs px-2 py-1 border border-gray-300 rounded"
              >
                <option value="">Tipo de pregunta</option>
                {tiposPreguntas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.1"
                value={puntajeMaximo}
                onChange={(e) => setPuntajeMaximo(e.target.value)}
                aria-label="Puntaje máximo"
                className="w-24 text-xs px-2 py-1 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setEditingEnunciado(false)}
                className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <span className="flex-1 text-sm text-gray-800 leading-snug">
            {pregunta.enunciado}
          </span>
        )}

        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          {pregunta.tipo_obj && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
              {pregunta.tipo_obj.name}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {pregunta.puntaje_maximo} pts.
          </span>
          {!editingEnunciado && (
            <>
              <button
                type="button"
                onClick={() => setEditingEnunciado(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <DeleteButton onConfirm={handleDelete} size="xs" />
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-gray-400 hover:text-gray-600 ml-0.5"
          >
            {open ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Las preguntas abiertas no deben tener opciones. */}
      {open && (
        <div className="border-t border-gray-100">
          {pregunta.tipo_obj?.id === 2 ? (
            <p className="px-4 py-3 text-xs text-gray-400">Respuesta abierta: el alumno responderá con texto libre.</p>
          ) : (
            <>
          {pregunta.opciones.length === 0 && !addingOpcion && (
            <p className="text-xs text-gray-400 px-4 py-3">Sin opciones aún.</p>
          )}
          {pregunta.opciones.map((op) => (
            <OpcionRow key={op.id} opcion={op} onDeleted={() => {}} />
          ))}
          {addingOpcion ? (
            <AddOpcionForm
              preguntaId={pregunta.id}
              orden={pregunta.opciones.length}
              onDone={() => setAddingOpcion(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAddingOpcion(true)}
              className="flex items-center gap-1.5 w-full px-4 py-2 text-xs text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar opción
            </button>
          )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Add pregunta form ──────────────────────────────────────────────────────────

function AddPreguntaForm({
  examenId,
  tiposPreguntas,
  onDone,
}: {
  examenId: number;
  tiposPreguntas: TipoPregunta[];
  onDone: () => void;
}) {
  const dispatch = useAppDispatch();
  const [enunciado, setEnunciado] = useState("");
  const [tipo, setTipo] = useState<number | "">("");
  const [puntajeMaximo, setPuntajeMaximo] = useState("1");
  const [createPregunta, { isLoading }] = useCreatePreguntaMutation();

  const handleSubmit = async () => {
    if (!enunciado.trim() || tipo === "") return;
    try {
      await createPregunta({
        examen: examenId,
        enunciado: enunciado.trim(),
        tipo: Number(tipo),
        puntaje_maximo: Number(puntajeMaximo),
      }).unwrap();
      setEnunciado("");
      setTipo("");
      onDone();
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al crear la pregunta" }),
      );
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
      <p className="text-xs font-semibold text-blue-700">Nueva pregunta</p>
      <textarea
        value={enunciado}
        onChange={(e) => setEnunciado(e.target.value)}
        rows={2}
        placeholder="Escribe el enunciado de la pregunta…"
        className="w-full text-sm px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <select
          value={tipo}
          onChange={(e) =>
            setTipo(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="flex-1 text-sm px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Tipo de pregunta *</option>
          {tiposPreguntas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="0.1"
          value={puntajeMaximo}
          onChange={(e) => setPuntajeMaximo(e.target.value)}
          aria-label="Puntaje máximo"
          placeholder="Puntos"
          className="w-24 text-sm px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !enunciado.trim() || tipo === ""}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agregar"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-3 py-2 border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function RespuestaPendienteRow({
  respuesta,
  examenId,
  maximo,
}: {
  respuesta: RespuestaPendiente;
  examenId: number;
  maximo: number | null;
}) {
  const dispatch = useAppDispatch();
  const [calificacion, setCalificacion] = useState("");
  const [calificar, { isLoading }] = useCalificarRespuestaAbiertaMutation();

  const handleCalificar = async () => {
    const value = Number(calificacion);
    if (Number.isNaN(value) || value < 0 || (maximo != null && value > maximo)) {
      dispatch(setAlert({ type: "error", message: maximo != null ? `La calificación debe estar entre 0 y ${maximo}.` : "Ingresa una calificación válida." }));
      return;
    }
    try {
      await calificar({ id: respuesta.id, examen: examenId, calificacion: value }).unwrap();
      dispatch(setAlert({ type: "success", message: "Respuesta calificada." }));
    } catch {
      dispatch(setAlert({ type: "error", message: "No se pudo guardar la calificación." }));
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {maximo != null && (
        <div className="mb-2 flex justify-end text-xs text-gray-500">
          <span>Máximo: {maximo} pts.</span>
        </div>
      )}
      <p className="text-sm font-medium text-gray-800">{respuesta.pregunta_enunciado}</p>
      <p className="mt-2 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm text-gray-700">{respuesta.respuesta_texto}</p>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min="0"
          max={maximo ?? undefined}
          step="0.1"
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
          placeholder={maximo != null ? `0 - ${maximo}` : "Calificación"}
          className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleCalificar}
          disabled={isLoading || calificacion === ""}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40"
        >
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Guardar calificación
        </button>
      </div>
    </div>
  );
}

function AlumnoPendienteCard({
  estudianteNombre,
  respuestas,
  examenId,
  maximoPorEnunciado,
}: {
  estudianteNombre: string;
  respuestas: RespuestaPendiente[];
  examenId: number;
  maximoPorEnunciado: Map<string, number>;
}) {
  const [open, setOpen] = useState(false);
  const pendientes = respuestas.filter((r) => !r.esta_calificada).length;

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-gray-50"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
        )}
        <span className="text-sm font-semibold text-gray-800">{estudianteNombre}</span>
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          {pendientes} por calificar
        </span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-gray-100 bg-gray-50/50 p-3">
          {respuestas.map((respuesta) => (
            <RespuestaPendienteRow
              key={respuesta.id}
              respuesta={respuesta}
              examenId={examenId}
              maximo={maximoPorEnunciado.get(respuesta.pregunta_enunciado) ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RespuestasPendientesPanel({ examenId, preguntas }: { examenId: number; preguntas: Pregunta[] }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetRespuestasPendientesQuery({ examen: examenId, pendientes: 1, page });
  const maximoPorEnunciado = new Map(preguntas.map((p) => [p.enunciado, Number(p.puntaje_maximo)]));

  const grupos: { estudiante: string; respuestas: RespuestaPendiente[] }[] = [];
  for (const respuesta of data?.results ?? []) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.estudiante === respuesta.estudiante_nombre) {
      ultimo.respuestas.push(respuesta);
    } else {
      grupos.push({ estudiante: respuesta.estudiante_nombre, respuestas: [respuesta] });
    }
  }

  return (
    <div className="border-t border-gray-100 bg-amber-50/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-semibold text-gray-800">Respuestas abiertas pendientes</span>
        {!isLoading && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{data?.count ?? 0}</span>}
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 py-3 text-xs text-gray-400"><Loader2 className="h-4 w-4 animate-spin" />Cargando respuestas…</div>
      ) : grupos.length ? (
        <div className="space-y-2">
          {grupos.map((grupo) => (
            <AlumnoPendienteCard
              key={grupo.estudiante}
              estudianteNombre={grupo.estudiante}
              respuestas={grupo.respuestas}
              examenId={examenId}
              maximoPorEnunciado={maximoPorEnunciado}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500">No hay respuestas abiertas pendientes de revisión.</p>
      )}
      {!isLoading && (data?.previous || data?.next) && (
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" disabled={!data.previous} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 disabled:opacity-40">Anterior</button>
          <button type="button" disabled={!data.next} onClick={() => setPage((current) => current + 1)} className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 disabled:opacity-40">Siguiente</button>
        </div>
      )}
    </div>
  );
}

// ── Examen detail panel (fetches detail on demand) ─────────────────────────────

function ExamenDetailPanel({
  examen,
  tiposPreguntas,
}: {
  examen: Examen;
  tiposPreguntas: TipoPregunta[];
}) {
  const [addingPregunta, setAddingPregunta] = useState(false);
  const { data: detalle, isLoading } = useGetExamenDetalleQuery(examen.id);

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-6 px-4 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        Cargando preguntas…
      </div>
    );

  const preguntas = detalle?.preguntas ?? [];

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">
          {preguntas.length} pregunta{preguntas.length !== 1 ? "s" : ""}
        </span>
        {!addingPregunta && (
          <button
            type="button"
            onClick={() => setAddingPregunta(true)}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar pregunta
          </button>
        )}
      </div>

      {addingPregunta && (
        <AddPreguntaForm
          examenId={examen.id}
          tiposPreguntas={tiposPreguntas}
          onDone={() => setAddingPregunta(false)}
        />
      )}

      {preguntas.length === 0 && !addingPregunta ? (
        <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
          <FileQuestion className="w-8 h-8" />
          <p className="text-sm">Este examen no tiene preguntas aún.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {preguntas.map((p, i) => (
            <PreguntaCard
              key={p.id}
              pregunta={p}
              index={i}
              tiposPreguntas={tiposPreguntas}
            />
          ))}
        </div>
      )}
      <RespuestasPendientesPanel examenId={examen.id} preguntas={preguntas} />
    </div>
  );
}

// ── Examen card ────────────────────────────────────────────────────────────────

function ExamenCard({
  examen,
  tiposExamen,
  tiposPreguntas,
  programaNumericId,
  campaniaId,
}: {
  examen: Examen;
  tiposExamen: TipoExamen[];
  tiposPreguntas: TipoPregunta[];
  programaNumericId?: number;
  campaniaId?: number;
}) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(examen.name);
  const [fecha, setFecha] = useState(examen.fecha);
  const [duracion, setDuracion] = useState<number | "">(
    examen.duracion_minutos ?? "",
  );
  const [maxIntentos, setMaxIntentos] = useState<number>(
    examen.max_intentos ?? 1,
  );
  const [tipoExamen, setTipoExamen] = useState<number | "">(
    examen.tipo_examen_obj?.id ?? "",
  );

  const [updateExamen, { isLoading: saving }] = useUpdateExamenMutation();
  const [deleteExamen] = useDeleteExamenMutation();

  const handleSave = async () => {
    try {
      await updateExamen({
        id: examen.id,
        name,
        fecha,
        ...(tipoExamen !== "" ? { tipo_examen: Number(tipoExamen) } : {}),
        duracion_minutos: duracion === "" ? null : Number(duracion),
        max_intentos: maxIntentos,
      }).unwrap();
      setEditing(false);
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al guardar el examen" }),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExamen(examen.id).unwrap();
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al eliminar el examen" }),
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <ClipboardList className="w-5 h-5 text-blue-600" />
        </div>

        {editing ? (
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del examen"
              className="col-span-2 text-sm px-3 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="number"
              value={duracion}
              onChange={(e) =>
                setDuracion(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Duración (min)"
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="number"
              min={1}
              value={maxIntentos}
              onChange={(e) =>
                setMaxIntentos(Math.max(1, Number(e.target.value)))
              }
              placeholder="Intentos"
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={tipoExamen}
              onChange={(e) =>
                setTipoExamen(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="col-span-2 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tipo de examen</option>
              {tiposExamen.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {examen.name}
            </p>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {examen.tipo_examen_obj && (
                <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                  {examen.tipo_examen_obj.name}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <CalendarDays className="w-3 h-3" />
                {examen.fecha}
              </span>
              {examen.duracion_minutos && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {examen.duracion_minutos} min
                </span>
              )}
              {examen.max_intentos > 1 && (
                <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">
                  {examen.max_intentos} intentos
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          {editing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs px-2 py-1.5 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <DeleteButton onConfirm={handleDelete} />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="text-gray-400 hover:text-gray-600 p-1 ml-1"
              >
                {open ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Detail */}
      {open && !editing && (
        <div className="border-t border-gray-100">
          <ExamenDetailPanel examen={examen} tiposPreguntas={tiposPreguntas} />
        </div>
      )}
    </div>
  );
}

// ── Create examen form ─────────────────────────────────────────────────────────

function CreateExamenForm({
  programaNumericId,
  campaniaId,
  tiposExamen,
  onDone,
}: {
  programaNumericId: number;
  campaniaId?: number;
  tiposExamen: TipoExamen[];
  onDone: () => void;
}) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipoExamen, setTipoExamen] = useState<number | "">("");
  const [duracion, setDuracion] = useState<number | "">("");
  const [maxIntentos, setMaxIntentos] = useState<number>(1);
  const [createExamen, { isLoading }] = useCreateExamenMutation();

  const handleSubmit = async () => {
    if (!name.trim() || !fecha || tipoExamen === "") return;
    try {
      await createExamen({
        name: name.trim(),
        programa_educativo: programaNumericId,
        campania: campaniaId,
        tipo_examen: Number(tipoExamen),
        fecha,
        duracion_minutos: duracion === "" ? null : Number(duracion),
        max_intentos: maxIntentos,
      }).unwrap();
      onDone();
      dispatch(setAlert({ type: "success", message: "Examen creado" }));
    } catch {
      dispatch(
        setAlert({ type: "error", message: "Error al crear el examen" }),
      );
    }
  };

  return (
    <div className="border border-blue-200 rounded-xl bg-blue-50 p-5 space-y-4">
      <p className="text-sm font-semibold text-blue-800">Nuevo examen</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Nombre *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Examen Final Módulo 1"
            className="w-full text-sm px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tipo de examen *
          </label>
          <select
            value={tipoExamen}
            onChange={(e) =>
              setTipoExamen(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full text-sm px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Seleccionar…</option>
            {tiposExamen.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Fecha *
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Duración (minutos)
          </label>
          <input
            type="number"
            value={duracion}
            onChange={(e) =>
              setDuracion(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="90"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Intentos permitidos
          </label>
          <input
            type="number"
            min={1}
            value={maxIntentos}
            onChange={(e) =>
              setMaxIntentos(Math.max(1, Number(e.target.value)))
            }
            placeholder="1"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !name.trim() || !fecha || tipoExamen === ""}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Crear examen"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ProgramEvaluacionesTab({
  programaNumericId,
  campaniaId,
}: Props) {
  const [showCreate, setShowCreate] = useState(false);

  const { data: tiposExamen } = useGetTiposExamenQuery();
  const { data: tiposPreguntas } = useGetTiposPreguntasQuery();
  const { data: examenes, isLoading } = useGetExamenesQuery(
    { programa: programaNumericId, campania: campaniaId },
    { skip: !programaNumericId },
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Evaluaciones</h2>
          {!isLoading && (
            <p className="text-xs text-gray-400 mt-0.5">
              {examenes?.count} examen{examenes?.count !== 1 ? "es" : ""}
            </p>
          )}
        </div>
        {!showCreate && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo examen
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreate && (
        <CreateExamenForm
          programaNumericId={programaNumericId}
          campaniaId={campaniaId}
          tiposExamen={tiposExamen?.results ?? []}
          onDone={() => setShowCreate(false)}
        />
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 py-10 justify-center text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando exámenes…</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && examenes?.count === 0 && !showCreate && (
        <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
          <AlertCircle className="w-10 h-10" />
          <p className="text-sm">No hay exámenes para este programa.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Crear el primero
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {examenes?.results?.map((examen) => (
          <ExamenCard
            key={examen.id}
            examen={examen}
            tiposExamen={tiposExamen?.results ?? []}
            tiposPreguntas={tiposPreguntas?.results ?? []}
            programaNumericId={programaNumericId}
            campaniaId={campaniaId}
          />
        ))}
      </div>
    </div>
  );
}
