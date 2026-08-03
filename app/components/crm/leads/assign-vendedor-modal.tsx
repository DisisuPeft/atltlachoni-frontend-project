"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Loader2, X } from "lucide-react";
import { Modal } from "@/app/components/common/modal";
import {
  useGetVendedoresQuery,
  useAsignarVendedorMutation,
} from "@/redux/features/crm/leadsApiSlice";
import { getApiErrorMessage } from "@/redux/utils/api-error";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white text-gray-700";

export interface AssignVendedorTarget {
  uuid: string;
  label: string;
}

interface AssignVendedorModalProps {
  open: boolean;
  onClose: () => void;
  leads: AssignVendedorTarget[];
  /** Se llama después de asignar con éxito (al menos un lead). */
  onAssigned?: () => void;
}

/** Modal de "Asignar vendedor" — reutilizable para un solo lead (detalle de
 * lead) o para varios a la vez (asignación masiva desde la tabla). No existe
 * un endpoint de bulk-assign en el backend, así que para varios leads se
 * dispara `asignar-vendedor` por cada uno en paralelo. */
export default function AssignVendedorModal({
  open,
  onClose,
  leads,
  onAssigned,
}: AssignVendedorModalProps) {
  const [vendedor, setVendedor] = useState<number | "">("");
  const [assigning, setAssigning] = useState(false);
  const { data: vendedores } = useGetVendedoresQuery();
  const [asignarVendedor] = useAsignarVendedorMutation();

  const isBulk = leads.length > 1;

  const handleClose = () => {
    if (assigning) return;
    setVendedor("");
    onClose();
  };

  const assign = async () => {
    if (!vendedor || leads.length === 0) return;
    setAssigning(true);
    const results = await Promise.allSettled(
      leads.map((lead) =>
        asignarVendedor({ uuid: lead.uuid, vendedor: Number(vendedor) }).unwrap(),
      ),
    );
    setAssigning(false);

    const failed = results
      .map((r, i) => ({ r, lead: leads[i] }))
      .filter(({ r }) => r.status === "rejected");

    if (failed.length === 0) {
      setVendedor("");
      onClose();
      onAssigned?.();
      if (isBulk) {
        Swal.fire({
          icon: "success",
          title: "Vendedor asignado",
          text: `Se asignó a ${leads.length} lead${leads.length > 1 ? "s" : ""}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
      return;
    }

    if (failed.length === leads.length) {
      Swal.fire({
        icon: "error",
        title: "No se pudo asignar el vendedor",
        text: getApiErrorMessage((failed[0].r as PromiseRejectedResult).reason),
      });
      return;
    }

    // Falló solo una parte: cierra el modal (lo que sí se pudo ya se aplicó)
    // y avisa cuáles quedaron pendientes.
    setVendedor("");
    onClose();
    onAssigned?.();
    Swal.fire({
      icon: "warning",
      title: "Asignación parcial",
      html: `Se asignó a ${leads.length - failed.length} de ${leads.length} leads.<br/>Quedaron pendientes: ${failed
        .map(({ lead }) => lead.label)
        .join(", ")}`,
    });
  };

  return (
    <Modal show={open} onClose={handleClose}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {isBulk ? `Asignar vendedor a ${leads.length} leads` : "Asignar vendedor"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isBulk
                ? "Selecciona a la persona responsable de los leads seleccionados."
                : "Selecciona a la persona responsable de este lead."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isBulk && (
          <div className="mt-4 max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
            <ul className="space-y-1">
              {leads.map((lead) => (
                <li
                  key={lead.uuid}
                  className="truncate rounded px-2 py-1 text-xs text-slate-600"
                >
                  {lead.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <label className="mt-5 block space-y-1.5">
          <span className="text-xs font-medium text-slate-600">Vendedor</span>
          <select
            value={vendedor}
            onChange={(event) =>
              setVendedor(event.target.value ? Number(event.target.value) : "")
            }
            className={selectClass}
          >
            <option value="">Seleccionar vendedor</option>
            {(vendedores ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre_completo}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={assigning}
            className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={assign}
            disabled={!vendedor || assigning}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {assigning && <Loader2 className="h-4 w-4 animate-spin" />}
            {isBulk ? `Asignar a ${leads.length} leads` : "Asignar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
