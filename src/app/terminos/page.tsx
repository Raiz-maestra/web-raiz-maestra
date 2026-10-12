import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Términos de Uso — Raíz Maestra",
  description:
    "Condiciones de uso de la app Raíz Maestra para docentes de escuelas rurales de Chile.",
};

export default function TerminosPage() {
  return (
    <LegalPage title="Términos de Uso" updated="12 de octubre de 2026">
      <LegalSection title="1. Quiénes ofrecen el servicio">
        <p>
          Raíz Maestra es un servicio para docentes, cuyo responsable es RODRIGO ALBERTO ESPINOZA VASQUEZ. Al crear
          una cuenta aceptas estos Términos y nuestra{" "}
          <a className="font-bold text-rm-ink underline" href="/privacidad">
            Política de Privacidad
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Quién puede usar la app">
        <p>
          Raíz Maestra está dirigida a docentes mayores de edad de Chile, con especial foco en escuelas rurales. La solicitud de verificación se revisa por el equipo de administración con la información de tu perfil y establecimiento. No está dirigida a
          estudiantes ni a menores de edad.
        </p>
      </LegalSection>

      <LegalSection title="3. Tu cuenta">
        <p>
          Eres responsable de la información que entregas al registrarte y de mantener la
          confidencialidad de tu contraseña. Puedes eliminar tu cuenta desde Perfil → Eliminar mi cuenta o solicitar asistencia escribiendo a{" "}
          <a className="font-bold text-rm-ink underline" href="mailto:appraizmaestra@gmail.com">
            appraizmaestra@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Contenido que publicas">
        <p>
          Al publicar material pedagógico, mensajes en la comunidad o consultas a la red de apoyo,
          declaras que tienes derecho a compartir ese contenido y que es tuyo o cuentas con la
          autorización correspondiente. Conservas la propiedad intelectual del material que subes;
          nos otorgas una licencia no exclusiva para almacenarlo y mostrarlo dentro de la app a otros
          usuarios autenticados, con el único fin de operar el servicio.
        </p>
        <p>
          <strong className="text-rm-ink">
            No incluyas datos identificables de estudiantes
          </strong>{" "}
          (nombres completos, fotografías, situaciones que permitan identificarlos) en el material que
          publiques ni en tus mensajes. Eres responsable de resguardar la privacidad de tus estudiantes
          al usar la app.
        </p>
        <p>
          No está permitido publicar contenido que infrinja derechos de autor de terceros, que sea
          discriminatorio, difamatorio o ilegal. Podemos moderar u ocultar contenido que incumpla estas
          reglas, según lo descrito en nuestra Política de Privacidad.
        </p>
      </LegalSection>

      <LegalSection title="5. Mentorías y red de apoyo">
        <p>
          La selección del rol de mentor no acredita por sí sola un título profesional. Las consultas son visibles a los mentores del área seleccionada. Las mentorías entre pares y las consultas a la red de apoyo (salud mental, educación
          diferencial, gestión SLEP) son un espacio de acompañamiento entre docentes y no reemplazan
          atención profesional de salud formal. Si estás viviendo una emergencia, contacta a los
          canales de emergencia correspondientes.
        </p>
      </LegalSection>

      <LegalSection title="6. Disponibilidad del servicio">
        <p>
          Hacemos esfuerzos razonables para mantener la app disponible y funcional, incluyendo su modo
          sin conexión, pero no garantizamos disponibilidad ininterrumpida. Podemos modificar o
          discontinuar funcionalidades, avisando con anticipación razonable cuando sea posible.
        </p>
      </LegalSection>

      <LegalSection title="7. Ley aplicable">
        <p>
          Estos Términos se rigen por las leyes de la República de Chile. Cualquier controversia se
          someterá a los tribunales competentes de Chile.
        </p>
      </LegalSection>

      <LegalSection title="8. Cambios a estos términos">
        <p>
          Podemos actualizar estos Términos; publicaremos la versión vigente con su fecha en esta
          misma página.
        </p>
      </LegalSection>

      <LegalSection title="9. Contacto">
        <p>
          Para cualquier consulta sobre estos Términos, escríbenos a{" "}
          <a className="font-bold text-rm-ink underline" href="mailto:appraizmaestra@gmail.com">
            appraizmaestra@gmail.com
          </a>
          .
        </p>
      </LegalSection>


    </LegalPage>
  );
}
