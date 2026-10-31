import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CrearActividadModal } from "./docente-actividades-view";

const unwrapMock = vi.fn();
const createActividadMock = vi.fn((..._args: [Record<string, unknown>]) => ({
  unwrap: unwrapMock,
}));
let isLoadingMock = false;

vi.mock("@/redux/features/control-escolar/actividadesApiSlice", () => ({
  useCreateActividadMutation: () => [createActividadMock, { isLoading: isLoadingMock }],
}));

vi.mock("@/sweetalert/sweetalerts", () => ({
  sweetAlert: vi.fn(),
}));

import { sweetAlert } from "@/sweetalert/sweetalerts";

describe("CrearActividadModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    unwrapMock.mockResolvedValue({ id: 1 });
    isLoadingMock = false;
  });

  it("blocks submission and shows an error when the name is empty", async () => {
    render(
      <CrearActividadModal
        show
        onClose={onClose}
        programaRef="programa-ref-123"
        modulos={[]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /crear actividad/i }));

    expect(createActividadMock).not.toHaveBeenCalled();
    expect(sweetAlert).toHaveBeenCalledWith(
      "error",
      expect.stringMatching(/obligatorio/i),
      "Error",
    );
  });

  it("submits the activity with the entered fields and the program ref", async () => {
    render(
      <CrearActividadModal
        show
        onClose={onClose}
        programaRef="programa-ref-123"
        modulos={[{ id: 7, nombre: "Módulo 1" }]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/ensayo final/i), {
      target: { value: "Tarea 1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear actividad/i }));

    await waitFor(() => expect(createActividadMock).toHaveBeenCalledTimes(1));

    expect(createActividadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: "Tarea 1",
        programa: "programa-ref-123",
        permite_entrega_tardia: true,
        calificacion_maxima: 10,
      }),
    );

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(sweetAlert).toHaveBeenCalledWith("success", expect.any(String), "Listo");
  });

  it("converts the datetime-local value to an ISO string for fecha_limite", async () => {
    render(
      <CrearActividadModal
        show
        onClose={onClose}
        programaRef="programa-ref-123"
        modulos={[]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/ensayo final/i), {
      target: { value: "Tarea con fecha" },
    });
    // The field is portaled into document.body by the Modal component.
    const fechaInput = document.body.querySelector('input[type="datetime-local"]');
    expect(fechaInput).not.toBeNull();
    fireEvent.change(fechaInput as HTMLInputElement, {
      target: { value: "2026-12-01T10:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear actividad/i }));

    await waitFor(() => expect(createActividadMock).toHaveBeenCalledTimes(1));

    const payload = createActividadMock.mock.calls[0][0];
    expect(payload.fecha_limite).toBe(new Date("2026-12-01T10:00").toISOString());
  });

  it("shows a backend error message and keeps the modal open when the request fails", async () => {
    unwrapMock.mockRejectedValueOnce({ data: { detail: "Ya existe una actividad con ese nombre." } });

    render(
      <CrearActividadModal
        show
        onClose={onClose}
        programaRef="programa-ref-123"
        modulos={[]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/ensayo final/i), {
      target: { value: "Tarea duplicada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /crear actividad/i }));

    await waitFor(() =>
      expect(sweetAlert).toHaveBeenCalledWith(
        "error",
        "Ya existe una actividad con ese nombre.",
        "Error",
      ),
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it("resets the form fields after closing via the X button, before the modal reopens", () => {
    const { rerender } = render(
      <CrearActividadModal
        show
        onClose={onClose}
        programaRef="programa-ref-123"
        modulos={[]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/ensayo final/i), {
      target: { value: "Borrador sin guardar" },
    });

    // The X button is the only button in the header, before "Crear actividad".
    const closeButton = screen.getAllByRole("button")[0];
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <CrearActividadModal
        show
        onClose={onClose}
        programaRef="programa-ref-123"
        modulos={[]}
      />,
    );

    expect(screen.getByPlaceholderText(/ensayo final/i)).toHaveValue("");
  });

  it("does not close via the X button while a creation request is in flight", () => {
    isLoadingMock = true;

    render(
      <CrearActividadModal
        show
        onClose={onClose}
        programaRef="programa-ref-123"
        modulos={[]}
      />,
    );

    const closeButton = screen.getAllByRole("button")[0];
    expect(closeButton).toBeDisabled();

    fireEvent.click(closeButton);

    expect(onClose).not.toHaveBeenCalled();
  });
});
