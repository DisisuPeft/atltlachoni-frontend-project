import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CalificarForm } from "./entregas-modal";
import type { EntregaActividad } from "@/redux/features/types/control-escolar/type";

const unwrapMock = vi.fn();
const calificarMock = vi.fn(() => ({ unwrap: unwrapMock }));

vi.mock("@/redux/features/control-escolar/actividadesApiSlice", () => ({
  useCalificarEntregaMutation: () => [calificarMock, { isLoading: false }],
}));

vi.mock("@/sweetalert/sweetalerts", () => ({
  sweetAlert: vi.fn(),
}));

import { sweetAlert } from "@/sweetalert/sweetalerts";

function buildEntrega(overrides: Partial<EntregaActividad> = {}): EntregaActividad {
  return {
    id: 1,
    original_name: "tarea.pdf",
    mime_type: "application/pdf",
    size: 1024,
    size_formatted: "1 KB",
    file_type: "pdf",
    download_url: "/files/tarea.pdf",
    preview_url: null,
    actividad: 42,
    actividad_nombre: "Tarea 1",
    estudiante: 9,
    estudiante_nombre: "Ana López",
    comentario: null,
    entregado_tarde: false,
    calificacion: null,
    retroalimentacion: null,
    calificado_por: null,
    calificado_en: null,
    esta_calificada: false,
    ...overrides,
  };
}

describe("CalificarForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unwrapMock.mockResolvedValue({});
  });

  it("rejects a grade above the maximum without calling the mutation", async () => {
    render(<CalificarForm entrega={buildEntrega()} calificacionMaxima="10" />);

    const input = screen.getByPlaceholderText("0 - 10");
    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.click(screen.getByRole("button", { name: /calificar/i }));

    expect(calificarMock).not.toHaveBeenCalled();
    expect(sweetAlert).toHaveBeenCalledWith(
      "error",
      expect.stringContaining("entre 0 y 10"),
      "Error",
    );
  });

  it("rejects a negative grade without calling the mutation", async () => {
    render(<CalificarForm entrega={buildEntrega()} calificacionMaxima="10" />);

    fireEvent.change(screen.getByPlaceholderText("0 - 10"), {
      target: { value: "-1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /calificar/i }));

    expect(calificarMock).not.toHaveBeenCalled();
  });

  it("submits a valid grade with the entrega and actividad ids", async () => {
    const entrega = buildEntrega();
    render(<CalificarForm entrega={entrega} calificacionMaxima="10" />);

    fireEvent.change(screen.getByPlaceholderText("0 - 10"), {
      target: { value: "8.5" },
    });
    fireEvent.change(screen.getByPlaceholderText(/retroalimentación/i), {
      target: { value: "Buen trabajo" },
    });
    fireEvent.click(screen.getByRole("button", { name: /calificar/i }));

    await waitFor(() => expect(calificarMock).toHaveBeenCalledTimes(1));
    expect(calificarMock).toHaveBeenCalledWith({
      id: entrega.id,
      actividad: entrega.actividad,
      body: { calificacion: 8.5, retroalimentacion: "Buen trabajo" },
    });
    expect(sweetAlert).toHaveBeenCalledWith("success", expect.any(String), "Listo");
  });

  it("shows 'Actualizar' instead of 'Calificar' when the entrega is already graded", () => {
    render(
      <CalificarForm
        entrega={buildEntrega({ esta_calificada: true, calificacion: 9 })}
        calificacionMaxima="10"
      />,
    );

    expect(screen.getByRole("button", { name: /actualizar/i })).toBeInTheDocument();
  });

  it("disables the submit button while the grade input is empty", () => {
    render(<CalificarForm entrega={buildEntrega()} calificacionMaxima="10" />);
    expect(screen.getByRole("button", { name: /calificar/i })).toBeDisabled();
  });
});
