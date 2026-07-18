"use client";

import { useState, useRef, useEffect } from "react";
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

const TRUST_ITEMS = [
  "Sin costo de asesoría",
  "Respuesta en menos de 24 h",
  "Modalidad 100% en línea",
  "Certificación institucional avalada",
];

export default function IesdaLeadFormSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [highlighted, setHighlighted] = useState(false);

  const nombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ref = (e as CustomEvent<string>).detail;
      setForm((prev) => ({ ...prev, programa_ref: ref }));
      setHighlighted(true);
      setTimeout(() => setHighlighted(false), 2200);
      setTimeout(() => nombreRef.current?.focus(), 700);
    };
    window.addEventListener("iesda:preselect-programa", handler);
    return () =>
      window.removeEventListener("iesda:preselect-programa", handler);
  }, []);

  const { data: programas = [] } = useProgramasDestacadosQuery({
    limit: 20,
    instituto: 2,
  });
  const programasConRef = programas.filter(
    (p): p is typeof p & { ref: string } => Boolean(p.ref),
  );

  const [solicitar, { isLoading, error: apiError }] =
    useSolicitudInformacionMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      const payload = {
        nombre: form.nombre.trim(),
        apellido_paterno: form.apellido_paterno.trim(),
        ...(form.apellido_materno.trim()
          ? { apellido_materno: form.apellido_materno.trim() }
          : {}),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        programa_ref: form.programa_ref,
        ...(form.mensaje.trim() ? { mensaje: form.mensaje.trim() } : {}),
      };
      const res = await solicitar(payload).unwrap();
      setSuccessMsg(res.message);
    } catch {
      // apiError state handles display
    }
  };

  const GOLD = "#D7A22A";
  const inputBase =
    "w-full rounded-xl border bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder-white/40 focus:ring-2 focus:outline-none transition-colors";
  const inputBorder =
    "border-white/20 focus:border-[#D7A22A] focus:ring-[#D7A22A]/25";
  const errorBorder =
    "border-red-400/70 focus:border-red-400 focus:ring-red-400/20";

  return (
    <section
      id="solicitar-informacion-iesda"
      aria-labelledby="iesda-form-heading"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1C1208 0%, #2A1D0A 100%)",
      }}
    >
      {/* Textura de fondo */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23D7A22A' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow decorativos */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#D7A22A" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#C4943A" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={sectionRef}
          className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start"
        >
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Icono libro */}
            <div
              className="mb-6 w-12 h-12 flex items-center justify-center rounded-2xl"
              style={{
                background: "rgba(215,162,42,0.12)",
                border: "1px solid rgba(215,162,42,0.3)",
              }}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D7A22A"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <span
              className="font-medium text-sm uppercase tracking-wider"
              style={{ color: GOLD }}
            >
              Información sin compromiso
            </span>
            <h2
              id="iesda-form-heading"
              className="mt-3 text-3xl lg:text-4xl font-semibold text-white leading-tight"
            >
              Da el primer paso hacia tu formación profesional
            </h2>
            <p
              className="mt-4 text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Completa el formulario y un asesor académico te contactará con el
              programa que mejor se ajuste a tu perfil, objetivos y área de
              interés.
            </p>

            <ul className="mt-8 space-y-3">
              {TRUST_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(215,162,42,0.18)",
                      border: "1px solid rgba(215,162,42,0.4)",
                    }}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="#D7A22A"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Lema */}
            <div
              className="mt-10 p-5 rounded-2xl"
              style={{
                background: "rgba(215,162,42,0.07)",
                border: "1px solid rgba(215,162,42,0.2)",
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: GOLD }}
              >
                Lema de IESDA
              </p>
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                &quot;Saber, ser y servir.&quot;
              </p>
              <p
                className="mt-2 text-xs"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Rigor académico · Formación ética · Compromiso con la comunidad
              </p>
            </div>

            {/* Social proof */}
            <div
              className="mt-6 flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: "rgba(215,162,42,0.06)",
                border: "1px solid rgba(215,162,42,0.15)",
              }}
            >
              <div className="flex -space-x-2">
                {["#D7A22A", "#C4943A", "#2A2118", "#7D8EA3"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: color, borderColor: "#1C1208" }}
                    >
                      {["MR", "AV", "LG", "ST"][i]}
                    </div>
                  ),
                )}
              </div>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <span className="font-semibold text-white">
                  +100 profesionales
                </span>{" "}
                ya inscritos en IESDA.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div
              className={`rounded-3xl p-8 lg:p-10 transition-all duration-500 ${
                highlighted
                  ? "ring-4 shadow-[0_0_50px_rgba(215,162,42,0.25)]"
                  : ""
              }`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: highlighted
                  ? "1px solid rgba(215,162,42,0.5)"
                  : "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                ...(highlighted
                  ? ({
                      "--tw-ring-color": "rgba(215,162,42,0.4)",
                    } as React.CSSProperties)
                  : {}),
              }}
            >
              {/* Banner programa seleccionado */}
              {highlighted && !successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(215,162,42,0.12)",
                    border: "1px solid rgba(215,162,42,0.35)",
                  }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "#D7A22A" }}
                  >
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: "#D7A22A" }}
                  >
                    Programa seleccionado.{" "}
                    <span
                      className="font-normal"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      Completa tus datos y un asesor te contactará.
                    </span>
                  </p>
                </motion.div>
              )}

              {successMsg ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(215,162,42,0.15)",
                      border: "1px solid rgba(215,162,42,0.4)",
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="#D7A22A"
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
                  <h3 className="text-xl font-semibold text-white">
                    ¡Solicitud enviada!
                  </h3>
                  <p
                    className="text-sm leading-relaxed max-w-xs"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {successMsg}
                  </p>
                  <button
                    onClick={() => {
                      setSuccessMsg("");
                      setForm(INITIAL);
                    }}
                    className="mt-2 text-sm font-medium hover:underline"
                    style={{ color: GOLD }}
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Solicitar información
                    </h3>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Los campos con * son obligatorios.
                    </p>
                  </div>

                  {/* Programa */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      Programa de interés *
                    </label>
                    <select
                      name="programa_ref"
                      value={form.programa_ref}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.programa_ref ? errorBorder : inputBorder}`}
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <option value="" style={{ background: "#2A2118" }}>
                        Selecciona un programa…
                      </option>
                      {programasConRef.map((p) => (
                        <option
                          key={p.ref}
                          value={p.ref}
                          style={{ background: "#2A2118" }}
                        >
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.programa_ref && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.programa_ref}
                      </p>
                    )}
                  </div>

                  {/* Nombre + Apellido paterno */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        Nombre *
                      </label>
                      <input
                        ref={nombreRef}
                        name="nombre"
                        type="text"
                        autoComplete="given-name"
                        placeholder="María"
                        value={form.nombre}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.nombre ? errorBorder : inputBorder}`}
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.nombre}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        Apellido paterno *
                      </label>
                      <input
                        name="apellido_paterno"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Rodríguez"
                        value={form.apellido_paterno}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.apellido_paterno ? errorBorder : inputBorder}`}
                      />
                      {errors.apellido_paterno && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.apellido_paterno}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Apellido materno */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      Apellido materno{" "}
                      <span
                        className="font-normal"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        (opcional)
                      </span>
                    </label>
                    <input
                      name="apellido_materno"
                      type="text"
                      autoComplete="additional-name"
                      placeholder="López"
                      value={form.apellido_materno}
                      onChange={handleChange}
                      className={`${inputBase} ${inputBorder}`}
                    />
                  </div>

                  {/* Correo + Teléfono */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        Correo electrónico *
                      </label>
                      <input
                        name="correo"
                        type="email"
                        autoComplete="email"
                        placeholder="maria@correo.com"
                        value={form.correo}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.correo ? errorBorder : inputBorder}`}
                      />
                      {errors.correo && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.correo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        Teléfono *
                      </label>
                      <input
                        name="telefono"
                        type="tel"
                        autoComplete="tel"
                        placeholder="5512345678"
                        maxLength={10}
                        value={form.telefono}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.telefono ? errorBorder : inputBorder}`}
                      />
                      {errors.telefono && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.telefono}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      Mensaje{" "}
                      <span
                        className="font-normal"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        (opcional)
                      </span>
                    </label>
                    <textarea
                      name="mensaje"
                      rows={3}
                      placeholder="¿Tienes preguntas sobre horarios, costos o modalidad?"
                      value={form.mensaje}
                      onChange={handleChange}
                      className={`${inputBase} ${inputBorder} resize-none`}
                    />
                  </div>

                  {/* API error */}
                  {apiError && (
                    <p
                      className="text-sm text-red-400 rounded-xl px-4 py-2.5"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                      }}
                    >
                      Ocurrió un error al enviar tu solicitud. Por favor intenta
                      de nuevo.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    style={{
                      background: isLoading
                        ? "rgba(215,162,42,0.5)"
                        : "linear-gradient(135deg, #D7A22A 0%, #C4943A 100%)",
                      color: "#1C1208",
                      boxShadow: "0 4px 20px rgba(215,162,42,0.35)",
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
                        Enviando…
                      </>
                    ) : (
                      <>
                        Solicitar información gratuita
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  <p
                    className="text-center text-xs"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Al enviar aceptas que un asesor de IESDA te contacte. Sin
                    spam, sin compromisos.
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
