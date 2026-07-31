"use client";

import { useState, useRef } from "react";
import { Modal } from "../common/modal";
import {
  useGetTiposSolicitudQuery,
  useCreateSolicitudMutation,
} from "@/redux/features/solicitudes/solicitudesApiSlice";
import {
  Plus,
  X,
  FileText,
  Tag,
  Paperclip,
  Loader2,
  AlertCircle,
  File,
  Image,
} from "lucide-react";
import Swal from "sweetalert2";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_MB = 10;

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
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors";

function FileIcon({ mime }: { mime: string }) {
  if (mime.startsWith("image/")) return <Image className="w-4 h-4 text-blue-500" />;
  return <File className="w-4 h-4 text-red-500" />;
}

export default function SolicitudForm() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: tiposData } = useGetTiposSolicitudQuery();
  const [createSolicitud, { isLoading }] = useCreateSolicitudMutation();

  const tipos = tiposData?.results ?? [];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!tipo) e.tipo = "Selecciona un tipo de solicitud";
    if (!titulo.trim()) e.titulo = "El título es requerido";
    else if (titulo.length < 5) e.titulo = "Mínimo 5 caracteres";
    return e;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = [];
    const rejected: string[] = [];

    Array.from(files).forEach((f) => {
      if (!ACCEPTED.includes(f.type)) {
        rejected.push(`${f.name}: tipo no permitido`);
      } else if (f.size > MAX_MB * 1024 * 1024) {
        rejected.push(`${f.name}: excede ${MAX_MB}MB`);
      } else {
        newFiles.push(f);
      }
    });

    if (rejected.length) {
      Swal.fire({
        icon: "warning",
        title: "Archivos rechazados",
        html: rejected.map((r) => `<p>${r}</p>`).join(""),
      });
    }

    setArchivos((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClose = () => {
    setOpen(false);
    setTipo("");
    setTitulo("");
    setDescripcion("");
    setArchivos([]);
    setErrors({});
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});

    const fd = new FormData();
    fd.append("tipo", tipo);
    fd.append("titulo", titulo);
    fd.append("descripcion", descripcion);
    archivos.forEach((f) => fd.append("archivos_nuevos", f));

    try {
      await createSolicitud(fd).unwrap();
      Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "Tu solicitud fue registrada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      handleClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la solicitud. Verifica los datos.",
      });
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nueva solicitud
      </button>

      <Modal show={open} onClose={handleClose} maxWidth="lg">
        <div className="flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Nueva solicitud
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Completa los datos para enviar tu solicitud
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Tipo */}
            <div>
              <SectionHeader icon={Tag} title="Tipo de solicitud" />
              <Field label="Tipo" required error={errors.tipo}>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Selecciona un tipo</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                      {t.area_responsable_nombre
                        ? ` · ${t.area_responsable_nombre}`
                        : ""}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Detalle */}
            <div>
              <SectionHeader icon={FileText} title="Detalle" />
              <div className="space-y-4">
                <Field label="Título" required error={errors.titulo}>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej. Necesito el banner para el diplomado de mayo"
                    className={inputClass}
                    maxLength={200}
                  />
                </Field>

                <Field label="Descripción" error={errors.descripcion}>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={4}
                    placeholder="Explica con detalle lo que necesitas..."
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </div>
            </div>

            {/* Archivos */}
            <div>
              <SectionHeader icon={Paperclip} title="Archivos adjuntos" />
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center hover:border-[#0056D2] transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  JPG, PNG, WEBP o PDF · máx. {MAX_MB}MB por archivo
                </p>
                <p className="text-xs text-[#0056D2] mt-1 font-medium">
                  Haz clic para adjuntar
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {archivos.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {archivos.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm"
                    >
                      <FileIcon mime={f.type} />
                      <span className="flex-1 truncate text-gray-700 text-xs">
                        {f.name}
                      </span>
                      <span className="text-gray-400 text-xs shrink-0">
                        {(f.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar solicitud"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}