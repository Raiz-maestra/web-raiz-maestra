import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Política de Privacidad — Raíz Maestra",
  description: "Datos, privacidad, derechos y contacto del responsable de Raíz Maestra.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad" updated="12 de octubre de 2026">
      <LegalSection title="1. Responsable y contacto">
        <p>El responsable del tratamiento de datos de Raíz Maestra es <strong className="text-rm-ink">RODRIGO ALBERTO ESPINOZA VASQUEZ</strong>. Para consultas sobre tus datos o para ejercer tus derechos, escribe a <a className="font-bold text-rm-ink underline" href="mailto:appraizmaestra@gmail.com">appraizmaestra@gmail.com</a>.</p>
        <p>Esta política comprende la app móvil, su versión web y la administración de la plataforma. Raíz Maestra está dirigida a docentes adultos en Chile.</p>
      </LegalSection>
      <LegalSection title="2. Datos y finalidades">
        <p>Al registrarte usamos nombre, apellidos, correo electrónico, escuela y asignatura para crear y gestionar la cuenta. Usamos tu biografía, disponibilidad y áreas de mentoría si decides completar esas funciones. La app no solicita RUT en el registro.</p>
        <p>Guardamos los materiales y adjuntos que publicas, favoritos, mensajes de comunidad y mentoría, reservas, solicitudes de verificación, reportes y consultas de apoyo para prestar esas funciones y gestionar la seguridad y moderación.</p>
        <p>La autenticación gestiona las contraseñas mediante hashes. Los proveedores pueden generar registros técnicos de acceso, errores y seguridad, que pueden incluir dirección IP y fechas de conexión. No usamos tus datos para publicidad de terceros ni vendemos datos personales.</p>
        <p>El catálogo de establecimientos proviene del Directorio Oficial de MINEDUC. No solicita información personal de estudiantes. No incluyas nombres, imágenes ni otros datos que permitan identificar estudiantes en lo que compartes.</p>
      </LegalSection>
      <LegalSection title="3. Ánimo y consultas de apoyo">
        <p>El estado de ánimo y sus notas son opcionales y requieren un consentimiento separado. Solo tu cuenta puede leer su historial: los administradores no tienen acceso a registros ajenos. La señal de tendencia es una regla simple aplicada a tus registros; no constituye diagnóstico ni decisión automatizada sobre ti.</p>
        <p>Las consultas de apoyo son visibles para su autor y los mentores que tienen seleccionada el área correspondiente. <strong className="text-rm-ink">No se envían de forma privada a un único especialista.</strong> Evita incluir información sensible que no sea necesaria, de terceros o de estudiantes.</p>
        <p>Ser mentor es una preferencia de perfil; la plataforma no certifica una habilitación profesional de salud por esa sola selección. La red ofrece acompañamiento y no sustituye atención clínica o servicios de emergencia.</p>
      </LegalSection>
      <LegalSection title="4. Quién puede ver información">
        <p>Usuarios autenticados pueden ver los materiales publicados, sus autores y la información pública de los directorios. Los canales se acotan por su configuración de región o microcentro. Las conversaciones de mentoría son visibles a sus participantes.</p>
        <p>Administradores autorizados gestionan cuentas, verificación, escuelas, catálogos, cuotas y reportes. No pueden consultar el historial de ánimo de otra persona ni las consultas de apoyo por su sola condición de administrador.</p>
      </LegalSection>
      <LegalSection title="5. Proveedores y datos fuera de Chile">
        <p>Supabase presta autenticación, base de datos y almacenamiento. La infraestructura configurada para el servicio puede procesar datos fuera de Chile, incluidos Estados Unidos. El responsable debe mantener los acuerdos con sus proveedores y las garantías aplicables al tratamiento y las transferencias.</p>
        <p>La landing y el panel web se procesan por su proveedor de alojamiento. Al abrir videos o recursos externos se establece conexión con YouTube, Google Drive o el destino elegido y se aplican sus políticas. Los recordatorios de pausa activa se programan localmente en el dispositivo; la app no utiliza actualmente un servicio de push remoto para esa función.</p>
      </LegalSection>
      <LegalSection title="6. Datos en tu dispositivo">
        <p>La app nativa protege la sesión con el almacenamiento seguro del sistema y cifra el cache de consultas y operaciones pendientes con una clave protegida por el dispositivo. El historial completo de ánimo no se conserva en ese cache. Una entrada pendiente sin conexión puede conservarse cifrada hasta enviarse.</p>
        <p>En el navegador, la sesión de autenticación utiliza almacenamiento del navegador. El cache corresponde a la pestaña y las consultas de apoyo y entradas de ánimo requieren conexión. Un dispositivo desbloqueado o comprometido puede permitir acceso a información; cierra sesión si lo compartes.</p>
        <p>Los archivos que descargas se conservan localmente para uso sin conexión. Ocultar un material en el servidor no puede retirar una copia ya descargada. Puedes borrar tus descargas y se limpian al cerrar sesión o completar la eliminación de cuenta.</p>
      </LegalSection>
      <LegalSection title="7. Conservación y eliminación">
        <p>Conservamos los datos necesarios mientras mantengas la cuenta y utilices el servicio. No aplicamos actualmente una eliminación automática por un número fijo de meses de inactividad.</p>
        <p>Puedes iniciar la eliminación definitiva en <strong className="text-rm-ink">Perfil → Eliminar mi cuenta</strong> o solicitarla al correo de contacto. Consulta <a className="font-bold text-rm-ink underline" href="/eliminar-cuenta">cómo eliminar tu cuenta</a>.</p>
        <p>La eliminación retira tu perfil y datos asociados, incluidos registros de ánimo y consultas. Un archivo reutilizado por materiales de otra cuenta puede conservarse para esos materiales. Si falla la limpieza de archivos o autenticación, la solicitud permanece pendiente y puede reintentarse hasta completarse.</p>
        <p>Los registros técnicos y las copias de respaldo siguen los períodos configurados con cada proveedor y no se utilizan como una cuenta activa. Para conocer la retención concreta vigente o una conservación exigida por ley, contacta al responsable. La política no fija un plazo de respaldo que no haya sido contratado o verificado.</p>
      </LegalSection>
      <LegalSection title="8. Tus derechos y consentimiento">
        <p>Puedes solicitar acceso, corrección, eliminación y los demás derechos que reconozca la legislación aplicable, así como retirar el consentimiento para datos sensibles, escribiendo a <a className="font-bold text-rm-ink underline" href="mailto:appraizmaestra@gmail.com">appraizmaestra@gmail.com</a>. Podremos verificar que eres titular de la cuenta antes de entregar o modificar datos. Retirar consentimiento no afecta la licitud del tratamiento anterior y puede impedir continuar usando la función correspondiente.</p>
        <p>La política considera la <a className="font-bold text-rm-ink underline" href="https://www.bcn.cl/leychile/navegar?idNorma=141599&amp;idVersion=2023-05-09">Ley 19.628</a>. Las modificaciones de la <a className="font-bold text-rm-ink underline" href="https://www.bcn.cl/leychile/Navegar?idNorma=1209272&amp;idVersion=2026-12-01">Ley 21.719</a> entran en vigencia el 1 de diciembre de 2026. Las solicitudes se atienden conforme a los plazos y mecanismos legales aplicables en cada momento.</p>
      </LegalSection>
      <LegalSection title="9. Cambios y consultas">
        <p>Publicamos la fecha de actualización en esta página. Si cambia sustancialmente la finalidad o el uso de datos sensibles, informaremos el cambio y solicitaremos el consentimiento que corresponda. Para consultas o reclamos, contacta primero al responsable sin perjuicio de los mecanismos legales disponibles.</p>
      </LegalSection>
    </LegalPage>
  );
}
