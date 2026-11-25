"use client";

import { useState, useRef, useEffect } from "react";
import {
  useGetPlantillasQuery,
  useCreatePlantillaMutation,
  useGetParticipantesQuery,
  useAddParticipanteMutation,
  useDeleteParticipanteMutation,
  useGenerarConstanciaMutation,
  useRegenerarConstanciaMutation,
  useEnviarCorreoConstanciaMutation,
  usePatchPonenciaMutation,
} from "@/redux/features/control-escolar/ponenciasApiSlice";
import { Ponencia, Participante, PlantillaConstancia } from "@/redux/features/types/control-escolar/type";
import {
  X,
  Award,
  Plus,
  Trash2,
  Download,
  Loader2,
  Check,
  AlertCircle,
  RefreshCw,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Mail,
  MailCheck,
  Users,
  Link2,
} from "lucide-react";
import { PaginatedResponse } from "@/redux/features/types/paginated";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

// ── Nueva plantilla ────────────────────────────────────────────────────────

function PlantillaForm({ onSuccess }: { onSuccess: () => void }) {
  const [createPlantilla, { isLoading }] = useCreatePlantillaMutation();
  const [nombre, setNombre] = useState("");
  const [ponenteNombre, setPonenteNombre] = useState("");
  const [ponenteCargo, setPonenteCarargo] = useState("");
  const [lugar, setLugar] = useState("");
  const [fondo, setFondo] = useState<File | null>(null);
  const [firma, setFirma] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fondoRef = useRef<HTMLInputElement>(null);
  const firmaRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!nombre.trim() || !ponenteNombre.trim() || !lugar.trim()) {
      setError("Nombre, ponente y lugar son obligatorios");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.append("nombre", nombre.trim());
    fd.append("ponente_nombre", ponenteNombre.trim());
    fd.append("ponente_cargo", ponenteCargo.trim());
    fd.append("lugar", lugar.trim());
    if (fondo) fd.append("fondo", fondo);
    if (firma) fd.append("firma", firma);
    try {
      await createPlantilla(fd).unwrap();
      onSuccess();
    } catch {
      setError("Error al crear la plantilla");
    }
  };

  return (
    <div className="border border-blue-200 rounded-xl p-4 bg-blue-50 space-y-3">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Nueva plantilla</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input type="text" placeholder="Nombre de la plantilla" value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white" />
        <input type="text" placeholder="Nombre del ponente" value={ponenteNombre}
          onChange={(e) => setPonenteNombre(e.target.value)}
          className="h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white" />
        <input type="text" placeholder="Cargo del ponente" value={ponenteCargo}
          onChange={(e) => setPonenteCarargo(e.target.value)}
          className="h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white" />
        <input type="text" placeholder="Lugar del evento" value={lugar}
          onChange={(e) => setLugar(e.target.value)}
          className="h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => fondoRef.current?.click()}
          className="flex-1 flex items-center gap-2 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:bg-white transition-colors">
          <ImageIcon className="w-3.5 h-3.5" />
          {fondo ? fondo.name : "Fondo (imagen)"}
        </button>
        <button type="button" onClick={() => firmaRef.current?.click()}
          className="flex-1 flex items-center gap-2 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:bg-white transition-colors">
          <ImageIcon className="w-3.5 h-3.5" />
          {firma ? firma.name : "Firma (imagen)"}
        </button>
        <input ref={fondoRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => setFondo(e.target.files?.[0] ?? null)} />
        <input ref={firmaRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => setFirma(e.target.files?.[0] ?? null)} />
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />{error}
        </p>
      )}
      <div className="flex justify-end">
        <button type="button" onClick={handleSubmit} disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0056D2] text-white text-xs font-semibold rounded-lg hover:bg-[#004BB5] disabled:opacity-50 transition-colors">
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Crear plantilla
        </button>
      </div>
    </div>
  );
}

// ── Fila de participante ────────────────────────────────────────────────────

function ParticipanteRow({
  participante,
  ponenciaId,
  onDelete,
  onRefresh,
}: {
  participante: Participante;
  ponenciaId: number;
  onDelete: () => void;
  onRefresh: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [generar] = useGenerarConstanciaMutation();
  const [regenerar] = useRegenerarConstanciaMutation();
  const [enviarCorreo] = useEnviarCorreoConstanciaMutation();
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const dispatch = useAppDispatch();

  const downloadUrl = participante.constancia_path
    ? (participante.constancia_path.startsWith("http")
      ? participante.constancia_path
      : `${UPLOAD_HOST}/api${participante.constancia_path}`)
    : `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponenciaId}/participantes/${participante.id}/constancia/`;

  const handleGenerar = async (force = false) => {
    setLoading(true);
    try {
      const fn = force ? regenerar : generar;
      await fn({ ponenciaId, participanteId: participante.id }).unwrap();
      onRefresh();
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al generar la constancia" }));
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarCorreo = async () => {
    setSendingEmail(true);
    try {
      await enviarCorreo({ ponenciaId, participanteId: participante.id }).unwrap();
      onRefresh();
      dispatch(setAlert({ type: "success", message: "Correo enviado." }));
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      dispatch(setAlert({ type: "error", message: detail ?? "No se pudo enviar el correo." }));
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-2.5 group hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${participante.tiene_constancia ? "bg-green-100" : "bg-gray-100"}`}>
          {participante.tiene_constancia
            ? <Check className="w-3.5 h-3.5 text-green-600" />
            : <Award className="w-3.5 h-3.5 text-gray-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-medium text-gray-800 truncate">{participante.nombre_completo}</p>
            {participante.lead != null && (
              <span
                title={`Viene del registro público · Lead #${participante.lead}`}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-medium shrink-0"
              >
                <Users className="w-2.5 h-2.5" />
                CRM
              </span>
            )}
            {participante.email_enviado_en && (
              <span
                title={`Correo enviado: ${new Date(participante.email_enviado_en).toLocaleString("es-MX")}`}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-[#0056D2] text-[10px] font-medium shrink-0"
              >
                <MailCheck className="w-2.5 h-2.5" />
                Enviado
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">
            {participante.email}
            {participante.telefono ? ` · ${participante.telefono}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 justify-end sm:justify-normal shrink-0">
        {(loading || sendingEmail) && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}

        {!loading && !sendingEmail && participante.tiene_constancia && (
          <>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-[#0056D2] hover:bg-blue-50 rounded-lg transition-colors" title="Descargar">
              <Download className="w-3.5 h-3.5" />
            </a>
            <button type="button" onClick={handleEnviarCorreo}
              className="p-1.5 text-gray-400 hover:text-[#0056D2] hover:bg-blue-50 rounded-lg transition-colors"
              title={participante.email_enviado_en ? "Reenviar por correo" : "Enviar por correo"}>
              <Mail className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => handleGenerar(true)}
              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Regenerar">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {!loading && !sendingEmail && !participante.tiene_constancia && (
          <button type="button" onClick={() => handleGenerar(false)}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Generar">
            <Award className="w-3.5 h-3.5" />
          </button>
        )}

        {confirming ? (
          <div className="flex items-center gap-1">
            <button type="button" onClick={onDelete}
              className="text-xs px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700">Sí</button>
            <button type="button" onClick={() => setConfirming(false)}
              className="text-xs px-2 py-0.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">No</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:opacity-0 sm:group-hover:opacity-100 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Panel principal ─────────────────────────────────────────────────────────

export default function ConstanciasPanel({
  ponencia,
  onClose,
  onPonenciaUpdated,
}: {
  ponencia: Ponencia;
  onClose: () => void;
  onPonenciaUpdated: () => void;
}) {
  const dispatch = useAppDispatch();

  // Config state
  const [selectedPlantilla, setSelectedPlantilla] = useState<number | null>(
    ponencia.plantilla_constancia ?? null,
  );
  const [fechaEvento, setFechaEvento] = useState(ponencia.fecha_evento ?? "");
  const [showPlantillaForm, setShowPlantillaForm] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyRegistroLink = async () => {
    const link = `${window.location.origin}/webinar/${ponencia.ref}`;
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      dispatch(setAlert({ type: "success", message: "Liga de registro copiada" }));
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      dispatch(setAlert({ type: "error", message: "No se pudo copiar la liga" }));
    }
  };

  // Add participant state
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [addingPart, setAddingPart] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Generating all state
  const [generating, setGenerating] = useState(false);

  // Pagination & search
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Queries & mutations
  const { data: plantillasData, refetch: refetchPlantillas } = useGetPlantillasQuery();
  const plantillas: PlantillaConstancia[] = plantillasData?.results ?? [];

  const {
    data: participantesData,
    isLoading: loadingParts,
    refetch: refetchParts,
  } = useGetParticipantesQuery({ ponenciaId: ponencia.id, page, search: debouncedSearch || undefined });
  const participantes: Participante[] = participantesData?.results ?? [];
  const totalParticipantes = participantesData?.count ?? 0;
  const hasNext = !!participantesData?.next;
  const hasPrev = !!participantesData?.previous;

  const [patchPonencia] = usePatchPonenciaMutation();
  const [addParticipante] = useAddParticipanteMutation();
  const [deleteParticipante] = useDeleteParticipanteMutation();
  const [generarConstancia] = useGenerarConstanciaMutation();

  const conConstancia = participantes.filter((p) => p.tiene_constancia);

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      await patchPonencia({
        id: ponencia.id,
        plantilla_constancia: selectedPlantilla,
        fecha_evento: fechaEvento || null,
      }).unwrap();
      onPonenciaUpdated();
      dispatch(setAlert({ type: "success", message: "Configuración guardada" }));
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al guardar la configuración" }));
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAddParticipante = async () => {
    if (!nombre.trim()) {
      setAddError("El nombre es obligatorio");
      return;
    }
    setAddError(null);
    setAddingPart(true);
    try {
      await addParticipante({
        ponenciaId: ponencia.id,
        nombre_completo: nombre.trim(),
        email: email.trim() || undefined,
        telefono: telefono.trim() || undefined,
      }).unwrap();
      setNombre("");
      setEmail("");
      setTelefono("");
      setPage(1);
      refetchParts();
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail;
      setAddError(detail ?? "Error al agregar el participante");
    } finally {
      setAddingPart(false);
    }
  };

  const handleDeleteParticipante = async (participanteId: number) => {
    try {
      await deleteParticipante({ ponenciaId: ponencia.id, participanteId }).unwrap();
      refetchParts();
    } catch {
      dispatch(setAlert({ type: "error", message: "Error al eliminar el participante" }));
    }
  };

  // Itera por todas las páginas del backend y genera constancias para los pendientes
  const handleGenerarTodas = async () => {
    setGenerating(true);
    let currentPage = 1;
    let hasMore = true;
    let errores = 0;
    let generadas = 0;

    while (hasMore) {
      let pageData: PaginatedResponse<Participante>;
      try {
        const resp = await fetch(
          `${UPLOAD_HOST}/api/control-escolar/ponencias/${ponencia.id}/participantes/?page=${currentPage}`,
          { credentials: "include" },
        );
        if (!resp.ok) break;
        pageData = await resp.json();
      } catch {
        break;
      }

      const pending = pageData.results.filter((p) => !p.tiene_constancia);
      for (const p of pending) {
        try {
          await generarConstancia({ ponenciaId: ponencia.id, participanteId: p.id }).unwrap();
          generadas++;
        } catch {
          errores++;
        }
      }

      hasMore = !!pageData.next;
      currentPage++;
    }

    await refetchParts();
    setGenerating(false);

    if (errores === 0) {
      dispatch(setAlert({ type: "success", message: `${generadas} constancia(s) generadas correctamente` }));
    } else {
      dispatch(setAlert({ type: "error", message: `${generadas} generadas · ${errores} con error` }));
    }
  };

  return (
    <div className="border border-indigo-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-indigo-50 border-b border-indigo-200">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Award className="w-4 h-4 text-indigo-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-indigo-900">Constancias</p>
            <p className="text-xs text-indigo-500 truncate">{ponencia.titulo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopyRegistroLink}
            title="Copiar liga pública de registro"
            className={`p-1.5 rounded-lg transition-colors ${linkCopied ? "text-green-600 bg-green-100" : "text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100"}`}
          >
            {linkCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
          <button type="button" onClick={onClose}
            className="p-1.5 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* ── Config section ── */}
        <section className="space-y-3">
          <ConfigHeader title="Configuración de constancia" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Plantilla select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Plantilla
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedPlantilla ?? ""}
                  onChange={(e) =>
                    setSelectedPlantilla(e.target.value ? Number(e.target.value) : null)
                  }
                  className="flex-1 h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0056D2] bg-white"
                >
                  <option value="">Sin plantilla</option>
                  {plantillas.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowPlantillaForm((v) => !v)}
                  className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                  title={showPlantillaForm ? "Cancelar" : "Nueva plantilla"}
                >
                  {showPlantillaForm ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Fecha evento */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Fecha del evento
              </label>
              <input
                type="date"
                value={fechaEvento}
                onChange={(e) => setFechaEvento(e.target.value)}
                className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0056D2] bg-white"
              />
            </div>
          </div>

          {showPlantillaForm && (
            <PlantillaForm
              onSuccess={() => {
                setShowPlantillaForm(false);
                refetchPlantillas();
              }}
            />
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0056D2] text-white text-xs font-semibold rounded-lg hover:bg-[#004BB5] disabled:opacity-50 transition-colors"
            >
              {savingConfig ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Guardar configuración
            </button>
          </div>
        </section>

        {/* ── Participantes section ── */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <ConfigHeader
              title={`Participantes (${totalParticipantes})`}
              subtitle={`${conConstancia.length} con constancia en esta página · página ${page}`}
            />
            {totalParticipantes > 0 && (
              <button
                type="button"
                onClick={handleGenerarTodas}
                disabled={generating}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors w-full sm:w-auto shrink-0"
              >
                {generating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Award className="w-3.5 h-3.5" />
                )}
                Generar pendientes
              </button>
            )}
          </div>

          {/* Add form + search */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex flex-col gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-100">
              <input
                type="search"
                placeholder="Buscar por nombre…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-48 h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white shrink-0"
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddParticipante()}
                  className="flex-1 h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddParticipante()}
                  className="flex-1 h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white"
                />
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddParticipante()}
                  className="sm:w-36 h-8 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white shrink-0"
                />
                <button
                  type="button"
                  onClick={handleAddParticipante}
                  disabled={addingPart}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 bg-[#0056D2] text-white text-xs font-medium rounded-lg hover:bg-[#004BB5] disabled:opacity-50 transition-colors shrink-0"
                >
                  {addingPart ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Añadir
                </button>
              </div>
            </div>
            {addError && (
              <p className="px-4 py-2 text-xs text-red-600 bg-red-50 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {addError}
              </p>
            )}

            {/* List */}
            {loadingParts && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}

            {!loadingParts && participantes.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
                <Award className="w-8 h-8" />
                <p className="text-xs">Sin participantes registrados</p>
              </div>
            )}

            {!loadingParts && participantes.length > 0 && (
              <div className="divide-y divide-gray-100">
                {participantes.map((p) => (
                  <ParticipanteRow
                    key={p.id}
                    participante={p}
                    ponenciaId={ponencia.id}
                    onDelete={() => handleDeleteParticipante(p.id)}
                    onRefresh={refetchParts}
                  />
                ))}
              </div>
            )}

            {/* Paginación */}
            {(hasNext || hasPrev) && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrev || loadingParts}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Anterior
                </button>
                <span className="text-xs text-gray-400">
                  Página {page} · {totalParticipantes} en total
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext || loadingParts}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ConfigHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}