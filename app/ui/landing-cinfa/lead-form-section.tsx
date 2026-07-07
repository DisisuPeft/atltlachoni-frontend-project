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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) e.correo = "Correo inválido";
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

export default function LeadFormSection() {
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
      // Focus primer campo vacío después de que el scroll termine
      setTimeout(() => nombreRef.current?.focus(), 700);
    };
    window.addEventListener("cinfa:preselect-programa", handler);
    return () => window.removeEventListener("cinfa:preselect-programa", handler);
  }, []);

  const { data: programas = [] } = useProgramasDestacadosQuery({ limit: 20 });
  const programasConRef = programas.filter((p): p is typeof p & { ref: string } => Boolean(p.ref));

  const [solicitar, { isLoading, error: apiError }] = useSolicitudInformacionMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        ...(form.apellido_materno.trim() ? { apellido_materno: form.apellido_materno.trim() } : {}),
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

  const inputBase =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2F7FB1] focus:ring-2 focus:ring-[#2F7FB1]/20 focus:outline-none transition-colors";
  const errorClass = "border-red-400 focus:border-red-400 focus:ring-red-200";

  return (
    <section
      id="solicitar-informacion"
      aria-labelledby="form-heading"
      className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={sectionRef} className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-[#2F7FB1] font-medium text-sm uppercase tracking-wider">
              Información sin compromiso
            </span>
            <h2
              id="form-heading"
              className="mt-3 text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight"
            >
              Da el primer paso hacia tu especialización en salud
            </h2>
            <p className="mt-4 text-gray-500 text-lg leading-relaxed">
              Completa el formulario y un asesor académico te contactará con el
              plan que mejor se adapte a tu perfil y objetivos profesionales.
            </p>

            <ul className="mt-8 space-y-3">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0F4C75]/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#0F4C75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex -space-x-2">
                {[
                  "bg-[#0F4C75]",
                  "bg-[#2F7FB1]",
                  "bg-teal-500",
                  "bg-indigo-500",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {["ML", "RG", "SP", "AH"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">+100 profesionales</span>{" "}
                ya inscritos en CINFA.
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
              className={`bg-white rounded-3xl border shadow-xl p-8 lg:p-10 transition-all duration-500 ${
                highlighted
                  ? "border-[#2F7FB1] ring-4 ring-[#2F7FB1]/25 shadow-[0_0_40px_rgba(47,127,177,0.2)]"
                  : "border-gray-100"
              }`}
            >
              {/* Banner de atención — visible solo tras clic en un programa */}
              {highlighted && !successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 flex items-center gap-3 bg-[#0F4C75]/5 border border-[#2F7FB1]/30 rounded-xl px-4 py-3"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0F4C75] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                    </svg>
                  </span>
                  <p className="text-sm text-[#0F4C75] font-medium leading-snug">
                    Programa seleccionado. <span className="font-normal text-gray-500">Completa tus datos y un asesor te contactará.</span>
                  </p>
                </motion.div>
              )}

              {successMsg ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">¡Solicitud enviada!</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{successMsg}</p>
                  <button
                    onClick={() => { setSuccessMsg(""); setForm(INITIAL); }}
                    className="mt-2 text-sm text-[#2F7FB1] font-medium hover:underline"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Solicitar información</h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Todos los campos marcados con * son obligatorios.
                    </p>
                  </div>

                  {/* Programa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Programa de interés *
                    </label>
                    <select
                      name="programa_ref"
                      value={form.programa_ref}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.programa_ref ? errorClass : ""}`}
                    >
                      <option value="">Selecciona un diplomado…</option>
                      {programasConRef.map((p) => (
                        <option key={p.ref} value={p.ref}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.programa_ref && (
                      <p className="mt-1 text-xs text-red-500">{errors.programa_ref}</p>
                    )}
                  </div>

                  {/* Nombre + Apellido paterno */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        ref={nombreRef}
                        name="nombre"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Juana"
                        value={form.nombre}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.nombre ? errorClass : ""}`}
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido paterno *
                      </label>
                      <input
                        name="apellido_paterno"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Pérez"
                        value={form.apellido_paterno}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.apellido_paterno ? errorClass : ""}`}
                      />
                      {errors.apellido_paterno && (
                        <p className="mt-1 text-xs text-red-500">{errors.apellido_paterno}</p>
                      )}
                    </div>
                  </div>

                  {/* Apellido materno */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido materno
                      <span className="ml-1 text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input
                      name="apellido_materno"
                      type="text"
                      autoComplete="additional-name"
                      placeholder="López"
                      value={form.apellido_materno}
                      onChange={handleChange}
                      className={inputBase}
                    />
                  </div>

                  {/* Correo + Teléfono */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        name="correo"
                        type="email"
                        autoComplete="email"
                        placeholder="juana@correo.com"
                        value={form.correo}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.correo ? errorClass : ""}`}
                      />
                      {errors.correo && (
                        <p className="mt-1 text-xs text-red-500">{errors.correo}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className={`${inputBase} ${errors.telefono ? errorClass : ""}`}
                      />
                      {errors.telefono && (
                        <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>
                      )}
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                      <span className="ml-1 text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <textarea
                      name="mensaje"
                      rows={3}
                      placeholder="¿Tienes alguna pregunta sobre costos, horarios o modalidad?"
                      value={form.mensaje}
                      onChange={handleChange}
                      className={`${inputBase} resize-none`}
                    />
                  </div>

                  {/* API error */}
                  {apiError && (
                    <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">
                      Ocurrió un error al enviar tu solicitud. Por favor intenta de nuevo.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0F4C75] hover:bg-[#2F7FB1] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando…
                      </>
                    ) : (
                      <>
                        Solicitar información gratuita
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    Al enviar aceptas que un asesor de CINFA te contacte. Sin spam, sin compromisos.
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