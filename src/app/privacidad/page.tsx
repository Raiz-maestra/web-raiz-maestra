import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Política de Privacidad — Raíz Maestra",
  description:
    "Cómo Raíz Maestra (Universidad Católica del Norte) trata los datos personales de los docentes que usan la app.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad" updated="3 de septiembre de 2026">
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          Universidad Católica del Norte (UCN), RUT [COMPLETAR: RUT UCN o unidad responsable],
          domicilio [COMPLETAR: domicilio de la unidad UCN responsable del proyecto]. Raíz Maestra es
          un proyecto desarrollado con financiamiento de un fondo/concurso interno de la UCN; David
          Álvarez Barraza y Sebastián Cortez actúan como encargados técnicos del tratamiento, operando
          la infraestructura por instrucción de la UCN. Contacto para temas de datos personales:{" "}
          <a className="font-bold text-rm-ink underline" href="mailto:appraizmaestra@gmail.com">
            appraizmaestra@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Qué datos tratamos">
        <p>
          <strong className="text-rm-ink">Datos de identificación:</strong> nombre, apellidos, RUT,
          teléfono, correo electrónico.
        </p>
        <p>
          <strong className="text-rm-ink">Datos de perfil profesional:</strong> región, comuna,
          escuela, asignaturas, disponibilidad como mentor, biografía.
        </p>
        <p>
          <strong className="text-rm-ink">Contenido que tú generas:</strong> material pedagógico que
          publicas, mensajes en canales de comunidad, mensajes de mentoría, consultas a la red de
          apoyo profesional.
        </p>
        <p>
          <strong className="text-rm-ink">Datos sensibles</strong> (tratamiento reforzado, solo con tu
          consentimiento expreso): registros de tu estado de ánimo y notas del módulo de Autocuidado,
          y el contenido de tus consultas a especialistas de salud mental, educación diferencial o
          gestión SLEP en la Red de Apoyo.
        </p>
        <p>
          <strong className="text-rm-ink">Datos técnicos:</strong> token de notificaciones push de tu
          dispositivo.
        </p>
        <p>
          No solicitamos ni tratamos datos de estudiantes menores de edad. Te pedimos que{" "}
          <strong className="text-rm-ink">no incluyas datos identificables de estudiantes</strong> en
          el material que publicas ni en tus mensajes (ver nuestros{" "}
          <a className="font-bold text-rm-ink underline" href="/terminos">
            Términos de Uso
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidad y base de licitud">
        <ul className="list-disc pl-5">
          <li>Crear y administrar tu cuenta, verificar tu condición de docente — ejecución de la relación de servicio.</li>
          <li>Conectarte con mentores, comunidad y red de apoyo — ejecución de la relación de servicio.</li>
          <li>Registrar tu bitácora de ánimo y tus consultas de salud/educación diferencial — consentimiento expreso y reforzado.</li>
          <li>Enviarte notificaciones push relevantes de la app — ejecución de la relación de servicio.</li>
          <li>Administrar la plataforma, moderar contenido y prevenir abusos — interés legítimo del responsable.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Con quién compartimos los datos">
        <p>
          Usamos proveedores que actúan como encargados de tratamiento, tratando tus datos solo por
          nuestra instrucción: <strong className="text-rm-ink">Supabase, Inc.</strong> (base de datos,
          autenticación y almacenamiento de archivos) y <strong className="text-rm-ink">Expo (EAS)</strong>{" "}
          (envío de notificaciones push).
        </p>
        <p>
          Ambos proveedores tienen sede e infraestructura en Estados Unidos, por lo que tus datos
          pueden salir de Chile. Esta transferencia se ampara en las cláusulas contractuales modelo
          aprobadas por el Ministerio de Economía. No vendemos tus datos personales a terceros ni los
          usamos con fines de publicidad de terceros.
        </p>
      </LegalSection>

      <LegalSection title="5. Por cuánto tiempo">
        <p>
          Conservamos tus datos mientras tu cuenta esté activa. [COMPLETAR: plazo exacto tras
          solicitar la baja o tras un período de inactividad — mientras tanto, rige como referencia: 24
          meses de inactividad antes de anonimizar]. Puedes solicitar la eliminación de tu cuenta y tus
          datos en cualquier momento (ver sección 6).
        </p>
      </LegalSection>

      <LegalSection title="6. Tus derechos">
        <p>
          Puedes ejercer <strong className="text-rm-ink">acceso, rectificación, supresión, oposición,
          portabilidad y bloqueo</strong> sobre tus datos, y retirar tu consentimiento para el
          tratamiento de datos sensibles (Autocuidado y Red de Apoyo) cuando quieras, escribiendo a{" "}
          <a className="font-bold text-rm-ink underline" href="mailto:appraizmaestra@gmail.com">
            appraizmaestra@gmail.com
          </a>
          . Respondemos en 30 días corridos (prorrogables una sola vez por 30 días más). La
          rectificación, supresión y oposición son siempre gratuitas; el acceso es gratuito al menos
          una vez por trimestre.
        </p>
      </LegalSection>

      <LegalSection title="7. Decisiones automatizadas">
        <p>
          Raíz Maestra no toma decisiones automatizadas ni hace perfilado con efectos jurídicos o
          significativos sobre ti. La verificación de tu condición de docente y la moderación de
          contenido las realiza una persona del equipo de administración.
        </p>
      </LegalSection>

      <LegalSection title="8. Origen de los datos">
        <p>
          Los datos que tratamos los entregas tú directamente al registrarte y usar la app. El
          catálogo de escuelas de Chile (región/comuna/establecimiento) proviene del Directorio
          Oficial de Establecimientos Educacionales de MINEDUC, y no contiene datos personales tuyos.
        </p>
      </LegalSection>

      <LegalSection title="9. Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas proporcionales al riesgo: cifrado en tránsito
          (TLS/HTTPS), control de acceso por fila (Row Level Security) en las tablas de la base de
          datos, sin ninguna excepción para tus registros de Autocuidado — ni siquiera el equipo
          administrador puede leerlos —, hashing de contraseñas gestionado por el proveedor de
          autenticación, y almacenamiento seguro de tus tokens de sesión en tu dispositivo.
        </p>
      </LegalSection>

      <LegalSection title="10. Cambios">
        <p>
          Podemos actualizar esta política; publicaremos la versión vigente con su fecha en esta misma
          página.
        </p>
      </LegalSection>

      <LegalSection title="11. Reclamos">
        <p>
          Si consideras que no hemos protegido correctamente tus datos, puedes reclamar ante la
          Agencia de Protección de Datos Personales de Chile.
        </p>
      </LegalSection>

      <p className="text-sm text-rm-ink-muted">
        Este documento no constituye asesoría legal. Es un borrador fundado en la Ley 21.719 de
        Protección de Datos Personales de Chile.
      </p>
    </LegalPage>
  );
}
