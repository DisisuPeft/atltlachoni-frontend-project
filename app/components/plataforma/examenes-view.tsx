"use client";

import { useState } from "react";
import {
  useGetMisExamenesQuery,
  useGetExamenParaRendirQuery,
  useEnviarRespuestasEstudianteMutation,
  useGetMiCalificacionExamenQuery,
} from "@/redux/features/control-escolar/examenesEstudianteApiSlice";
import type { EnviarRespuestasResponse } from "@/redux/features/types/control-escolar/type";
import {
  Loader2,
  ClipboardList,
  CheckCircle,
  XCircle,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

type Mode = "list" | "taking" | "result" | "reviewing";

interface Props {
  programaId: string;
}

function ScoreCard({
  calificacion,
  correctas,
  total,
}: {
  calificacion: number;
  correctas: number;
  total: number;
}) {
  const passed = calificacion >= 60;
  return (
    <div
      className={`flex flex-col items-center gap-3 p-8 rounded-2xl border ${
        passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}
    >
      <span
        className={`text-6xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}
      >
        {calificacion.toFixed(1)}
      </span>
      <span
        className={`text-sm font-semibold px-3 py-1 rounded-full ${
          passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {passed ? "Aprobado" : "Reprobado"}
      </span>
      <p className="text-sm text-gray-500">
        {correctas} de {total} correctas
      </p>
    </div>
  );
}

export default function ExamenesView({ programaId: _programaId }: Props) {
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitResult, setSubmitResult] =
    useState<EnviarRespuestasResponse | null>(null);

  const { data: examenes = [], isLoading: listLoading } =
    useGetMisExamenesQuery();

  const {
    data: examenDetalle,
    isLoading: examenLoading,
    isError: rendirError,
    error: rendirFetchError,
  } = useGetExamenParaRendirQuery(selectedId!, {
    skip: selectedId === null || mode !== "taking",
  });

  // 400 = examen ya entregado → mostrar calificación sin cambiar estado
  const alreadySubmitted =
    mode === "taking" &&
    rendirError &&
    (rendirFetchError as { status?: number })?.status === 400;

  const effectiveMode: Mode = alreadySubmitted ? "reviewing" : mode;

  const { data: miCalificacion, isLoading: calLoading } =
    useGetMiCalificacionExamenQuery(selectedId!, {
      skip: selectedId === null || effectiveMode !== "reviewing",
    });

  const [enviarRespuestas, { isLoading: submitting }] =
    useEnviarRespuestasEstudianteMutation();

  const resetToList = () => {
    setMode("list");
    setSelectedId(null);
    setAnswers({});
    setSubmitResult(null);
  };

  const startExam = (id: number) => {
    setSelectedId(id);
    setAnswers({});
    setMode("taking");
  };

  const handleSubmit = async () => {
    if (!selectedId) return;
    const body = {
      respuestas: Object.entries(answers).map(([pregunta, opcion_elegida]) => ({
        pregunta: Number(pregunta),
        opcion_elegida: Number(opcion_elegida),
      })),
    };
    try {
      const result = await enviarRespuestas({ id: selectedId, body }).unwrap();
      setSubmitResult(result);
      setMode("result");
    } catch {
      // wire up a toast here if needed
    }
  };

  // ── List ────────────────────────────────────────────────────────────────────

  if (effectiveMode === "list") {
    if (listLoading) {
      return (
        <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando exámenes…</span>
        </div>
      );
    }

    if (examenes.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300" />
          <p className="text-sm text-gray-500">No tienes exámenes asignados.</p>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-3">
        {examenes.map((examen) => (
          <div
            key={examen.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <ClipboardList className="h-5 w-5 shrink-0 text-gray-400" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {examen.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {examen.tipo_examen_obj?.name ?? "Examen"}
                  {examen.fecha
                    ? ` · ${new Date(examen.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}`
                    : ""}
                  {examen.duracion_minutos
                    ? ` · ${examen.duracion_minutos} min`
                    : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => startExam(examen.id)}
              className="shrink-0 rounded-lg bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#004BB5]"
            >
              Abrir
            </button>
          </div>
        ))}
      </div>
    );
  }

  // ── Taking ──────────────────────────────────────────────────────────────────

  if (effectiveMode === "taking") {
    const preguntas = examenDetalle?.preguntas ?? [];
    const answeredCount = Object.keys(answers).length;
    const allAnswered = preguntas.length > 0 && answeredCount === preguntas.length;

    return (
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
        <button
          onClick={resetToList}
          className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </button>

        {examenLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando examen…</span>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-lg font-bold text-gray-900">
                {examenDetalle?.name}
              </h1>
              <span className="ml-4 shrink-0 text-xs text-gray-400">
                {answeredCount}/{preguntas.length} respondidas
              </span>
            </div>

            <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full bg-[#0056D2] transition-all duration-300"
                style={{
                  width: preguntas.length
                    ? `${(answeredCount / preguntas.length) * 100}%`
                    : "0%",
                }}
              />
            </div>

            <div className="space-y-6">
              {preguntas.map((pregunta, idx) => (
                <div
                  key={pregunta.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <p className="mb-4 text-sm font-semibold text-gray-900">
                    <span className="mr-2 text-gray-400">{idx + 1}.</span>
                    {pregunta.enunciado}
                  </p>
                  <div className="space-y-2">
                    {pregunta.opciones.map((opcion) => {
                      const selected = answers[pregunta.id] === opcion.id;
                      return (
                        <label
                          key={opcion.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                            selected
                              ? "border-[#0056D2] bg-blue-50"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`pregunta-${pregunta.id}`}
                            value={opcion.id}
                            checked={selected}
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [pregunta.id]: opcion.id,
                              }))
                            }
                            className="accent-[#0056D2]"
                          />
                          {opcion.letra && (
                            <span className="w-5 shrink-0 text-sm font-medium text-gray-500">
                              {opcion.letra}
                            </span>
                          )}
                          <span className="text-sm text-gray-800">
                            {opcion.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!allAnswered && preguntas.length > 0 && (
              <div className="mt-6 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Responde todas las preguntas antes de enviar.
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className="flex items-center gap-2 rounded-lg bg-[#0056D2] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004BB5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Enviar respuestas
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Result ──────────────────────────────────────────────────────────────────

  if (effectiveMode === "result" && submitResult) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-8 px-6 py-16">
        <ScoreCard
          calificacion={submitResult.calificacion}
          correctas={submitResult.correctas}
          total={submitResult.total_preguntas}
        />
        {submitResult.message && (
          <p className="text-center text-sm text-gray-500">
            {submitResult.message}
          </p>
        )}
        <button
          onClick={resetToList}
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Volver a mis exámenes
        </button>
      </div>
    );
  }

  // ── Reviewing ───────────────────────────────────────────────────────────────

  if (effectiveMode === "reviewing") {
    const calificacion = miCalificacion
      ? parseFloat(miCalificacion.calificacion)
      : 0;
    const correctas = miCalificacion
      ? miCalificacion.respuestas.filter((r) => r.es_correcta === true).length
      : 0;

    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={resetToList}
          className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </button>

        {calLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : miCalificacion ? (
          <>
            <div className="mb-6">
              <ScoreCard
                calificacion={calificacion}
                correctas={correctas}
                total={miCalificacion.respuestas.length}
              />
            </div>

            <div className="space-y-3">
              {miCalificacion.respuestas.map((r, idx) => {
                const correct = r.es_correcta === true;
                return (
                  <div
                    key={r.id}
                    className={`rounded-xl border p-4 ${
                      correct
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {correct ? (
                        <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                      )}
                      <span className="text-sm text-gray-700">
                        Pregunta {idx + 1}
                      </span>
                      <span
                        className={`ml-auto text-xs font-medium ${
                          correct ? "text-green-700" : "text-red-600"
                        }`}
                      >
                        {correct ? "Correcta" : "Incorrecta"}
                      </span>
                    </div>
                    {r.opcion_elegida_obj && (
                      <p className="mt-2 pl-8 text-xs text-gray-500">
                        Tu respuesta:{" "}
                        {r.opcion_elegida_obj.letra
                          ? `${r.opcion_elegida_obj.letra}. `
                          : ""}
                        {r.opcion_elegida_obj.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="py-16 text-center text-sm text-gray-400">
            No se encontró la calificación.
          </p>
        )}
      </div>
    );
  }

  return null;
}