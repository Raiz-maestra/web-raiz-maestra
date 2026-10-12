import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = { title: "Eliminar cuenta — Raíz Maestra", description: "Cómo eliminar tu cuenta y datos de Raíz Maestra." };

export default function EliminarCuentaPage() {
  return <LegalPage title="Eliminar tu cuenta" updated="12 de octubre de 2026">
    <LegalSection title="Desde la app">
      <ol className="list-decimal pl-5">
        <li>Inicia sesión con la cuenta que deseas eliminar.</li>
        <li>Abre Perfil y elige Eliminar mi cuenta.</li>
        <li>Lee el aviso, escribe ELIMINAR y confirma.</li>
        <li>Si aparece una limpieza pendiente, reintenta desde la misma pantalla.</li>
      </ol>
      <p>La eliminación es definitiva. Los administradores encuentran la misma opción en su panel; el último administrador activo debe transferir la administración antes de eliminarse.</p>
    </LegalSection>
    <LegalSection title="Si no puedes entrar">
      <p>Envía una solicitud desde el correo asociado a tu cuenta a <a className="font-bold text-rm-ink underline" href="mailto:appraizmaestra@gmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta">appraizmaestra@gmail.com</a>, dirigida al responsable RODRIGO ALBERTO ESPINOZA VASQUEZ. Indica que deseas eliminar tu cuenta de Raíz Maestra. No envíes contraseñas, documentos de identidad ni notas sensibles.</p>
      <p>El responsable verificará tu solicitud y te informará su estado. Esta página ofrece un canal de solicitud; no elimina una cuenta por visitar el enlace.</p>
    </LegalSection>
    <LegalSection title="Qué se elimina y qué puede conservarse">
      <p>Se retiran la cuenta, perfil, registros de ánimo, consultas, conversaciones y contenido asociado. Los archivos reutilizados en materiales de otra cuenta pueden mantenerse para no afectar su contenido. La limpieza de autenticación y archivos puede requerir reintentos.</p>
      <p>Los registros técnicos y respaldos están sujetos a la retención configurada con los proveedores y a obligaciones legales aplicables. Puedes solicitar al responsable información sobre esos períodos. Consulta la <a href="/privacidad" className="font-bold text-rm-ink underline">Política de Privacidad</a> para más detalles.</p>
    </LegalSection>
  </LegalPage>;
}
