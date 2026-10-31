import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RespuestaPendienteRow, RespuestasPendientesPanel } from "./program-evaluaciones-tab";
import type { OpcionAdmin, Pregunta, RespuestaPendiente } from "@/redux/features/types/control-escolar/type";

const unwrapMock = vi.fn();
const calificarMock = vi.fn(() => ({ unwrap: unwrapMock }));
const dispatchMock = vi.fn();
let respuestasPendientesData: {
  results: RespuestaPendiente[];
  count: number;
  next: string | null;
  previous: string | null;
} = { results: [], count: 0, next: null, previous: null };

vi.mock("@/redux/features/control-escolar/evaluacionesApiSlice", () => ({
  useCalificarRespuestaAbiertaMutation: () => [calificarMock, { isLoading: false }],
  useGetRespuestasPendientesQuery: () => ({
    data: respuestasPendientesData,
    isLoading: false,
  }),
}));

vi.mock("@/redux/hooks", () => ({
  useAppDispatch: () => dispatchMock,
}));

vi.mock("@/redux/features/alert/alertSlice", () => ({
  setAlert: (payload: unknown) => ({ type: "alert/setAlert", payload }),
}));

function buildRespuesta(overrides: Partial<RespuestaPendiente> = {}): RespuestaPendiente {
  return {
    id: 1,
    estudiante_nombre: "Ana López",
    pregunta_enunciado: "Explica el teorema de Pitágoras",
    examen_nombre: "Examen parcial",
    respuesta_texto: "Es a² + b² = c²...",
    opcion_elegida: null,
    calificacion: null,
    calificado_por: null,
    calificado_en: null,
    esta_calificada: false,
    ...overrides,
  };
}

const opcionesVacias = new Map<number, OpcionAdmin>();

describe("RespuestaPendienteRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unwrapMock.mockResolvedValue({});
  });

  it("rejects a grade above the maximum and does not call the mutation", async () => {
    render(
      <RespuestaPendienteRow
        respuesta={buildRespuesta()}
        examenId={5}
        maximo={10}
        opcionesPorId={opcionesVacias}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("0 - 10"), {
      target: { value: "20" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar calificación/i }));

    expect(calificarMock).not.toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ type: "error" }),
      }),
    );
  });

  it("submits a valid grade with the respuesta and examen ids", async () => {
    const respuesta = buildRespuesta();
    render(
      <RespuestaPendienteRow
        respuesta={respuesta}
        examenId={5}
        maximo={10}
        opcionesPorId={opcionesVacias}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("0 - 10"), {
      target: { value: "7" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar calificación/i }));

    await waitFor(() => expect(calificarMock).toHaveBeenCalledTimes(1));
    expect(calificarMock).toHaveBeenCalledWith({
      id: respuesta.id,
      examen: 5,
      calificacion: 7,
    });
  });

  it("allows any non-negative grade when no maximum is known for the question", async () => {
    render(
      <RespuestaPendienteRow
        respuesta={buildRespuesta()}
        examenId={5}
        maximo={null}
        opcionesPorId={opcionesVacias}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Calificación"), {
      target: { value: "9999" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar calificación/i }));

    await waitFor(() => expect(calificarMock).toHaveBeenCalledTimes(1));
  });

  it("shows the chosen option for multiple-choice answers instead of free text", () => {
    const opciones = new Map<number, OpcionAdmin>([
      [11, { id: 11, text: "Opción A", is_correct: true, letra: "A", orden: 1 }],
    ]);

    render(
      <RespuestaPendienteRow
        respuesta={buildRespuesta({ opcion_elegida: 11, respuesta_texto: null })}
        examenId={5}
        maximo={10}
        opcionesPorId={opciones}
      />,
    );

    expect(screen.getByText("Opción A")).toBeInTheDocument();
    expect(screen.getByText(/marcada como correcta/i)).toBeInTheDocument();
  });
});

function buildPregunta(overrides: Partial<Pregunta> = {}): Pregunta {
  return {
    id: 1,
    enunciado: "Explica tu respuesta",
    tipo_obj: null,
    puntaje_maximo: "10",
    calificacion_manual: true,
    opciones: [],
    ...overrides,
  };
}

describe("RespuestasPendientesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unwrapMock.mockResolvedValue({});
  });

  it("does not apply an upper-bound limit when two questions share the same wording with different max scores", async () => {
    const preguntas = [
      buildPregunta({ id: 1, enunciado: "Explica tu respuesta", puntaje_maximo: "5" }),
      buildPregunta({ id: 2, enunciado: "Explica tu respuesta", puntaje_maximo: "10" }),
    ];
    respuestasPendientesData = {
      results: [buildRespuesta({ pregunta_enunciado: "Explica tu respuesta" })],
      count: 1,
      next: null,
      previous: null,
    };

    render(<RespuestasPendientesPanel examenId={5} preguntas={preguntas} />);

    fireEvent.click(screen.getByRole("button", { name: /ana lópez/i }));

    // Ambiguous max (5 vs 10 for the same wording) → no bound shown, just "Calificación".
    expect(screen.getByPlaceholderText("Calificación")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("0 - 5")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("0 - 10")).not.toBeInTheDocument();

    // And since there is no reliable bound, an out-of-range-looking value for
    // either candidate question is still accepted instead of silently rejected.
    fireEvent.change(screen.getByPlaceholderText("Calificación"), {
      target: { value: "8" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar calificación/i }));
    await waitFor(() => expect(calificarMock).toHaveBeenCalledTimes(1));
  });

  it("applies the max score when the question wording is unique", () => {
    const preguntas = [
      buildPregunta({ id: 1, enunciado: "Pregunta única", puntaje_maximo: "7" }),
    ];
    respuestasPendientesData = {
      results: [buildRespuesta({ pregunta_enunciado: "Pregunta única" })],
      count: 1,
      next: null,
      previous: null,
    };

    render(<RespuestasPendientesPanel examenId={5} preguntas={preguntas} />);

    fireEvent.click(screen.getByRole("button", { name: /ana lópez/i }));

    expect(screen.getByPlaceholderText("0 - 7")).toBeInTheDocument();
  });
});
