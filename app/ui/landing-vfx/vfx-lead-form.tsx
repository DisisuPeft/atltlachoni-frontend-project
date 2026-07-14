"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  useProgramasDestacadosQuery,
  useSolicitudInformacionMutation,
} from "@/redux/features/control-escolar/programasApiSlice";

const INITIAL = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  correo: "",
  telefono: "",
  programa_ref: "",
  mensaje: "",
};

type FormState = typeof INITIAL;
type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.nombre.trim()) e.nombre = "Campo requerido";
  if (!f.apellido_paterno.trim()) e.apellido_paterno = "Campo requerido";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo))
    e.correo = "Correo inválido";
  if (!/^\d{10}$/.test(f.telefono)) e.telefono = "Debe ser de 10 dígitos";
  if (!f.programa_ref) e.programa_ref = "Selecciona un programa";
  return e;
}

const TRUST = [
  "Sin costo de asesoría",
  "Respuesta en menos de 24 h",
  "Modalidad 100% virtual",
  "Certificación institucional",
];

const INPUT_STYLE: React.CSSProperties = {
  background: "rgba(20,20,20,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  borderRadius: "12px",
  padding: "12px 16px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 500,
  marginBottom: "6px",
  color: "#A0A0A0",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export default function VfxLeadForm() {
  const sectionRef = useRef(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { data: programas = [] } = useProgramasDestacadosQuery({
    limit: 20,
    instituto: 3,
  });
  const [solicitar, { isLoading }] = useSolicitudInformacionMutation();

  const programaRef = form.programa_ref || programas[0]?.ref || "";

  const set =
    (k: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
      if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate({ ...form, programa_ref: programaRef });
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await solicitar({
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno || undefined,
        correo: form.correo,
        telefono: form.telefono,
        programa_ref: programaRef,
        mensaje: form.mensaje || undefined,
      }).unwrap();
      setSuccessMsg(
        "¡Recibimos tu solicitud! Te contactaremos en menos de 24 horas.",
      );
      setForm(INITIAL);
      setErrors({});
    } catch {
      setErrors({ nombre: "Ocurrió un error al enviar. Intenta de nuevo." });
    }
  };

  const fieldBorder = (name: keyof FormState) =>
    errors[name]
      ? "rgba(239,68,68,0.6)"
      : focusedField === name
        ? "rgba(24,198,42,0.5)"
        : "rgba(255,255,255,0.08)";

  return (
    <section
      id="solicitar-informacion-vfx"
      className="py-24 lg:py-36"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(24,198,42,0.05) 0%, transparent 60%)," +
          "linear-gradient(180deg, #050505 0%, #080808 50%, #050505 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={sectionRef}>
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#18C62A" }}
            >
              Empieza hoy
            </span>
            <h2
              className="mt-4 text-3xl lg:text-4xl font-black uppercase leading-tight text-white"
              style={{ fontFamily: "var(--font-orbitron, monospace)" }}
            >
              TU PRÓXIMO
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #18C62A, #18A8FF)",
                }}
              >
                CRÉDITO
              </span>
              <br />
              TE ESPERA
            </h2>
            <p
              className="mt-6 text-base leading-relaxed"
              style={{ color: "#A0A0A0" }}
            >
              Solicita información sin compromiso. Un asesor te contactará para
              resolver tus dudas y guiarte en el proceso de inscripción.
            </p>

            {/* Trust items */}
            <div className="mt-8 space-y-3">
              {TRUST.map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(24,198,42,0.12)",
                      border: "1px solid rgba(24,198,42,0.3)",
                    }}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="#18C62A"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm" style={{ color: "#A0A0A0" }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>

            {/* WA link */}
            <div className="mt-10">
              <a
                href="https://wa.link/fgv19q"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: "rgba(37,211,102,0.10)",
                  border: "1px solid rgba(37,211,102,0.25)",
                  color: "#25D366",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                >
                  <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.869.52 3.617 1.422 5.113L2 22l4.984-1.404A9.934 9.934 0 0012.001 22c5.522 0 9.999-4.477 9.999-9.999 0-5.523-4.477-10-9.999-10zm5.894 13.89c-.243.684-1.404 1.308-1.922 1.36-.519.053-1.009.246-3.402-.71-2.839-1.135-4.676-4.017-4.817-4.203-.14-.186-1.143-1.52-1.143-2.9s.722-2.055.978-2.337c.257-.281.56-.351.746-.351.186 0 .374.002.537.01.173.008.404-.065.632.483.232.558.788 1.928.857 2.067.07.14.116.302.023.488-.094.186-.14.302-.28.465-.14.163-.293.364-.42.49-.14.14-.284.292-.122.573.163.28.723 1.19 1.553 1.927.999.863 1.84 1.13 2.12 1.26.28.13.443.11.606-.07.163-.181.7-.815.887-1.095.186-.28.374-.233.63-.14.257.093 1.629.769 1.908.91.28.14.466.21.535.327.07.117.07.673-.172 1.356z" />
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div
              className="p-8 lg:p-10 rounded-3xl"
              style={{
                background: "rgba(12,12,12,0.85)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(24,198,42,0.15)",
                boxShadow: "0 0 80px rgba(24,198,42,0.06)",
              }}
            >
              {successMsg ? (
                <div className="py-12 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{
                      background: "rgba(24,198,42,0.12)",
                      border: "1px solid rgba(24,198,42,0.3)",
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="#18C62A"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">
                    ¡Solicitud enviada!
                  </p>
                  <p className="text-sm" style={{ color: "#A0A0A0" }}>
                    {successMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div
                    className="text-sm font-bold uppercase tracking-widest mb-6"
                    style={{
                      fontFamily: "var(--font-orbitron, monospace)",
                      color: "#18C62A",
                    }}
                  >
                    Solicitar información
                  </div>

                  {/* Nombre + Apellido paterno */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={LABEL_STYLE}>Nombre *</label>
                      <input
                        ref={nombreRef}
                        type="text"
                        value={form.nombre}
                        onChange={set("nombre")}
                        onFocus={() => setFocusedField("nombre")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tu nombre"
                        style={{
                          ...INPUT_STYLE,
                          borderColor: fieldBorder("nombre"),
                        }}
                      />
                      {errors.nombre && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {errors.nombre}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Apellido paterno *</label>
                      <input
                        type="text"
                        value={form.apellido_paterno}
                        onChange={set("apellido_paterno")}
                        onFocus={() => setFocusedField("apellido_paterno")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tu apellido"
                        style={{
                          ...INPUT_STYLE,
                          borderColor: fieldBorder("apellido_paterno"),
                        }}
                      />
                      {errors.apellido_paterno && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {errors.apellido_paterno}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Apellido materno */}
                  <div className="mb-4">
                    <label style={LABEL_STYLE}>
                      Apellido materno{" "}
                      <span style={{ color: "#A0A0A060" }}>(opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.apellido_materno}
                      onChange={set("apellido_materno")}
                      onFocus={() => setFocusedField("apellido_materno")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tu segundo apellido"
                      style={{
                        ...INPUT_STYLE,
                        borderColor: fieldBorder("apellido_materno"),
                      }}
                    />
                  </div>

                  {/* Correo + Teléfono */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={LABEL_STYLE}>Correo electrónico *</label>
                      <input
                        type="email"
                        value={form.correo}
                        onChange={set("correo")}
                        onFocus={() => setFocusedField("correo")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="tu@correo.com"
                        style={{
                          ...INPUT_STYLE,
                          borderColor: fieldBorder("correo"),
                        }}
                      />
                      {errors.correo && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {errors.correo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Teléfono *</label>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={set("telefono")}
                        onFocus={() => setFocusedField("telefono")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="10 dígitos"
                        maxLength={10}
                        style={{
                          ...INPUT_STYLE,
                          borderColor: fieldBorder("telefono"),
                        }}
                      />
                      {errors.telefono && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {errors.telefono}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Programa */}
                  <div className="hidden mb-4">
                    <label style={LABEL_STYLE}>Programa de interés *</label>
                    <select
                      value={programaRef}
                      onChange={set("programa_ref")}
                      onFocus={() => setFocusedField("programa_ref")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...INPUT_STYLE,
                        borderColor: fieldBorder("programa_ref"),
                        appearance: "none",
                        WebkitAppearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A0A0A0' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "16px",
                        paddingRight: "40px",
                      }}
                    >
                      <option value="" style={{ background: "#141414" }}>
                        Selecciona un programa
                      </option>
                      {programas.map((p, i) => (
                        <option
                          key={p.ref ?? `p-${i}`}
                          value={p.ref ?? ""}
                          style={{ background: "#141414" }}
                        >
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.programa_ref && (
                      <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                        {errors.programa_ref}
                      </p>
                    )}
                  </div>

                  {/* Mensaje */}
                  <div className="mb-6">
                    <label style={LABEL_STYLE}>
                      Mensaje{" "}
                      <span style={{ color: "#A0A0A060" }}>(opcional)</span>
                    </label>
                    <textarea
                      value={form.mensaje}
                      onChange={set("mensaje")}
                      onFocus={() => setFocusedField("mensaje")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="¿Tienes alguna duda o comentario?"
                      rows={3}
                      style={{
                        ...INPUT_STYLE,
                        resize: "none",
                        borderColor: fieldBorder("mensaje"),
                      }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #18C62A 0%, #18A8FF 100%)",
                      color: "#050505",
                      boxShadow: "0 4px 24px rgba(24,198,42,0.25)",
                      fontFamily: "var(--font-orbitron, monospace)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        ENVIANDO...
                      </>
                    ) : (
                      <>
                        QUIERO MI LUGAR
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  <p
                    className="mt-4 text-center text-xs"
                    style={{ color: "#A0A0A050" }}
                  >
                    Sin compromiso. Sin costo de asesoría.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
