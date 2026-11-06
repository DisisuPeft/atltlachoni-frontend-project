import type { Metadata } from "next";
import Header from "../ui/landing-cinfa/header";
import Footer from "../ui/landing-cinfa/footer";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | CINFA",
  description:
    "Aviso de Privacidad Integral del Centro Internacional de Formación Académica, S.C. (CINFA), aplicable a IESDA e Instituto Thales.",
};

const CONTACT_EMAIL = "contacto.cinfa@gmail.com";

const SECCIONES = [
  { id: "datos-recabados", title: "1. Datos personales recabados" },
  { id: "finalidades-primarias", title: "2. Finalidades primarias" },
  { id: "finalidades-secundarias", title: "3. Finalidades secundarias" },
  { id: "medios-obtencion", title: "4. Medios de obtención" },
  { id: "transferencias", title: "5. Transferencias de datos" },
  { id: "derechos-arco", title: "6. Derechos ARCO" },
  { id: "tecnologias-seguimiento", title: "7. Tecnologías de seguimiento" },
  { id: "seguridad-conservacion", title: "8. Seguridad y conservación" },
  { id: "modificaciones", title: "9. Modificaciones al Aviso de Privacidad" },
  { id: "contacto", title: "10. Contacto" },
];

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-lg font-bold text-[#0F4C75] font-heading mb-3"
    >
      {children}
    </h2>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-sm leading-relaxed text-gray-600">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2F7FB1]" />
      <span>{children}</span>
    </li>
  );
}

export default function AvisoPrivacidadPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2A40] via-[#0F4C75] to-[#2F7FB1] pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 48px)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
            CINFA · IESDA · Instituto Thales
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-4">
            Aviso de Privacidad Integral
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Centro Internacional de Formación Académica, S.C. (CINFA), con
            RFC CIF251201R57 y domicilio en Avenida Kabah número 237, Colonia
            Maya, C.P. 29010, Tuxtla Gutiérrez, Chiapas, México, es
            responsable del tratamiento y protección de los datos personales
            que recaba.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
          {/* Quick nav */}
          <nav
            aria-label="Secciones del aviso de privacidad"
            className="hidden lg:block sticky top-28 self-start"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Contenido
            </p>
            <ul className="space-y-2 border-l border-gray-100">
              {SECCIONES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block -ml-px border-l-2 border-transparent pl-3 py-0.5 text-xs text-gray-500 hover:text-[#2F7FB1] hover:border-[#2F7FB1] transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="space-y-10">
            <p className="text-sm leading-relaxed text-gray-600">
              El presente Aviso de Privacidad es aplicable a los datos
              personales recabados directamente por CINFA, así como a
              aquellos obtenidos mediante los institutos, marcas, plataformas
              y proyectos educativos que opera, incluyendo{" "}
              <strong className="text-gray-800">
                Instituto de Educación Superior y Desarrollo Académico
                (IESDA)
              </strong>{" "}
              e <strong className="text-gray-800">Instituto Thales</strong>,
              independientemente de la marca mediante la cual el titular
              solicite información, se inscriba o reciba un servicio
              educativo. Para efectos del presente Aviso de Privacidad, todas
              estas operaciones se entenderán realizadas bajo la
              responsabilidad de{" "}
              <strong className="text-gray-800">
                CENTRO INTERNACIONAL DE FORMACIÓN ACADÉMICA, S.C.
              </strong>
            </p>

            <div>
              <SectionHeading id="datos-recabados">
                1. Datos personales recabados
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                Dependiendo de la relación que mantenga con CINFA o cualquiera
                de sus marcas educativas, podremos recabar:
              </p>
              <ul className="space-y-2 mb-3">
                <Bullet>
                  Datos de identificación, como nombre, edad y fecha de
                  nacimiento.
                </Bullet>
                <Bullet>
                  Datos de contacto, como teléfono, correo electrónico y
                  medios de mensajería.
                </Bullet>
                <Bullet>
                  Datos académicos y profesionales, incluyendo escolaridad,
                  profesión, institución de procedencia y documentación
                  relacionada con su formación.
                </Bullet>
                <Bullet>
                  Datos administrativos y de facturación necesarios para
                  gestionar inscripciones, pagos, comprobantes y servicios
                  educativos.
                </Bullet>
                <Bullet>
                  Información relacionada con su participación en cursos,
                  diplomados, talleres, clases, evaluaciones y otras
                  actividades académicas.
                </Bullet>
                <Bullet>
                  Información proporcionada voluntariamente mediante
                  formularios, redes sociales, WhatsApp, correo electrónico,
                  llamadas, sitios web, plataformas educativas o sistemas de
                  atención y CRM.
                </Bullet>
              </ul>
              <p className="text-sm leading-relaxed text-gray-600">
                En caso de que algún procedimiento requiera datos personales
                sensibles, se informará al titular sobre su tratamiento y se
                solicitará el consentimiento correspondiente cuando resulte
                legalmente necesario.
              </p>
            </div>

            <div>
              <SectionHeading id="finalidades-primarias">
                2. Finalidades primarias
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                Los datos personales podrán ser utilizados para:
              </p>
              <ul className="space-y-2">
                <Bullet>Atender solicitudes de información.</Bullet>
                <Bullet>
                  Dar seguimiento a personas interesadas en nuestros
                  programas.
                </Bullet>
                <Bullet>Gestionar registros e inscripciones.</Bullet>
                <Bullet>Integrar y administrar expedientes académicos.</Bullet>
                <Bullet>
                  Gestionar pagos, mensualidades, inscripciones y
                  facturación.
                </Bullet>
                <Bullet>
                  Brindar acceso a clases, plataformas, materiales, grupos
                  académicos y sesiones virtuales.
                </Bullet>
                <Bullet>
                  Gestionar evaluaciones, constancias, diplomas y
                  documentación académica.
                </Bullet>
                <Bullet>Proporcionar atención y soporte.</Bullet>
                <Bullet>
                  Comunicar horarios, clases, modificaciones y actividades
                  académicas o administrativas.
                </Bullet>
                <Bullet>
                  Gestionar nuestra relación con docentes, colaboradores y
                  prestadores de servicios.
                </Bullet>
                <Bullet>
                  Cumplir obligaciones legales, fiscales, administrativas y
                  contractuales.
                </Bullet>
                <Bullet>
                  Mantener los registros necesarios para la operación de los
                  servicios educativos.
                </Bullet>
              </ul>
            </div>

            <div>
              <SectionHeading id="finalidades-secundarias">
                3. Finalidades secundarias
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                CINFA también podrá tratar datos personales para:
              </p>
              <ul className="space-y-2 mb-3">
                <Bullet>
                  Comunicar nuevos cursos, diplomados, talleres y demás
                  programas.
                </Bullet>
                <Bullet>Enviar promociones y comunicaciones comerciales.</Bullet>
                <Bullet>
                  Dar seguimiento comercial a personas que hayan solicitado
                  información.
                </Bullet>
                <Bullet>Realizar encuestas de satisfacción.</Bullet>
                <Bullet>Elaborar estadísticas y análisis.</Bullet>
                <Bullet>
                  Mejorar nuestros servicios, campañas y procesos de
                  atención.
                </Bullet>
                <Bullet>
                  Realizar campañas publicitarias y de remarketing.
                </Bullet>
                <Bullet>
                  Utilizar testimonios, fotografías, opiniones o material
                  audiovisual con fines institucionales o promocionales
                  cuando exista la autorización correspondiente.
                </Bullet>
              </ul>
              <p className="text-sm leading-relaxed text-gray-600">
                El titular podrá solicitar que sus datos no sean utilizados
                para estas finalidades secundarias.
              </p>
            </div>

            <div>
              <SectionHeading id="medios-obtencion">
                4. Medios de obtención
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600">
                Los datos podrán ser recabados mediante los sitios web y
                plataformas de CINFA y sus marcas; formularios digitales o
                físicos; WhatsApp; correo electrónico; llamadas telefónicas;
                redes sociales; campañas publicitarias; plataformas
                educativas; sistemas CRM; procesos de inscripción y mediante
                comunicación directa con asesores, docentes o personal
                administrativo.
              </p>
            </div>

            <div>
              <SectionHeading id="transferencias">
                5. Transferencias de datos
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                Cuando resulte necesario para proporcionar los servicios
                educativos contratados, los datos podrán ser comunicados a
                terceros que participen en procesos académicos,
                administrativos, tecnológicos, fiscales, de certificación,
                acreditación, validación o expedición de documentación.
              </p>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                Esto podrá incluir instituciones educativas con las que CINFA
                mantenga convenios académicos, proveedores de plataformas
                tecnológicas y educativas, servicios de videoconferencia,
                proveedores de facturación, servicios administrativos y
                autoridades competentes.
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                Cuando una transferencia requiera legalmente el
                consentimiento del titular, éste será solicitado previamente.
              </p>
            </div>

            <div>
              <SectionHeading id="derechos-arco">
                6. Derechos ARCO
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                El titular podrá ejercer sus derechos de Acceso,
                Rectificación, Cancelación y Oposición (ARCO) respecto de sus
                datos personales. Asimismo, podrá solicitar la revocación de
                su consentimiento o la limitación del uso o divulgación de
                sus datos cuando resulte procedente.
              </p>
              <div className="rounded-xl border border-[#2F7FB1]/20 bg-[#2F7FB1]/5 px-5 py-4 mb-3">
                <p className="text-sm text-gray-700">
                  Las solicitudes deberán enviarse a:
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm font-semibold text-[#0F4C75] hover:text-[#2F7FB1] transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                La solicitud deberá contener información suficiente para
                identificar al titular, indicar el derecho que desea ejercer
                y especificar los datos personales involucrados.
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                CINFA podrá solicitar información adicional cuando resulte
                necesaria para acreditar la identidad del solicitante o
                atender correctamente la petición.
              </p>
            </div>

            <div>
              <SectionHeading id="tecnologias-seguimiento">
                7. Tecnologías de seguimiento
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                Los sitios web y plataformas digitales utilizados por CINFA y
                sus marcas podrán emplear cookies, píxeles, etiquetas y
                tecnologías similares para analizar la navegación, medir
                campañas publicitarias, mejorar nuestros servicios y ofrecer
                comunicaciones relevantes.
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                El usuario podrá administrar determinadas tecnologías
                mediante la configuración de su navegador o las herramientas
                proporcionadas por las plataformas correspondientes.
              </p>
            </div>

            <div>
              <SectionHeading id="seguridad-conservacion">
                8. Seguridad y conservación
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                CINFA adoptará medidas administrativas, técnicas y
                organizativas razonables para proteger los datos personales
                contra daño, pérdida, alteración, destrucción, acceso o
                tratamiento no autorizado.
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                Los datos serán conservados durante el periodo necesario para
                cumplir las finalidades descritas y las obligaciones legales,
                fiscales, administrativas o contractuales correspondientes.
              </p>
            </div>

            <div>
              <SectionHeading id="modificaciones">
                9. Modificaciones al Aviso de Privacidad
              </SectionHeading>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                CINFA podrá modificar o actualizar el presente Aviso de
                Privacidad como consecuencia de cambios legales, nuevos
                requerimientos, modificaciones en sus servicios o cambios en
                sus prácticas de tratamiento de información.
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                La versión vigente estará disponible a través de los sitios
                web oficiales de CINFA y/o de las marcas educativas
                correspondientes.
              </p>
            </div>

            <div>
              <SectionHeading id="contacto">10. Contacto</SectionHeading>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-5 space-y-1.5 text-sm text-gray-600">
                <p>
                  <strong className="text-gray-800">Responsable:</strong>{" "}
                  Centro Internacional de Formación Académica, S.C.
                </p>
                <p>
                  <strong className="text-gray-800">RFC:</strong>{" "}
                  CIF251201R57
                </p>
                <p>
                  <strong className="text-gray-800">Domicilio:</strong>{" "}
                  Avenida Kabah No. 237, Colonia Maya, C.P. 29010, Tuxtla
                  Gutiérrez, Chiapas, México.
                </p>
                <p>
                  <strong className="text-gray-800">
                    Correo electrónico:
                  </strong>{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-[#0F4C75] hover:text-[#2F7FB1] transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mt-4">
                Al proporcionar voluntariamente sus datos personales, el
                titular reconoce haber tenido acceso al presente Aviso de
                Privacidad, sin perjuicio de aquellos casos en los que la
                legislación aplicable requiera obtener consentimiento
                expreso.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
