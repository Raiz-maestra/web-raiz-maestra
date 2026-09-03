# Data Safety (Play Console) / App Privacy (App Store Connect) — Raíz Maestra

> No es un template de la skill compliance-cl (ninguna ley chilena exige este formato) — es un mapeo
> directo de `21719-rat.md` a los formularios que **Google Play Console** ("Data safety") y **Apple App
> Store Connect** ("App Privacy" / nutrition label) piden para poder publicar la app. Complétalo tal
> cual está redactado directamente en la consola de cada tienda.

## Tipos de datos recolectados

| Categoría (terminología de tienda) | ¿Se recolecta? | Campo(s) en el modelo de datos | ¿Se comparte con terceros? | Finalidad declarada |
|---|---|---|---|---|
| Nombre | Sí | `profiles.nombre`, `apellidos` | No — solo con el encargado de hosting (Supabase) | Funcionalidad de la app (cuenta) |
| Dirección de correo electrónico | Sí | `auth.users.email` | No — solo con Supabase (Auth) | Funcionalidad de la app, autenticación |
| Número de teléfono | Sí | `profiles.telefono` | No | Funcionalidad de la app (contacto) |
| ID de usuario / identificadores gubernamentales | Sí — RUT (identificador nacional chileno) | `profiles.rut` | No | Verificación de identidad docente |
| Ubicación (aproximada, no GPS) | Sí — región/comuna, texto administrativo | `profiles.school_id` → `schools.region/comuna` | No | Conectar al docente con su territorio/microcentro |
| Fotos o videos | No | — (no hay picker de imágenes ni bucket de avatares implementado) | — | — |
| Archivos y documentos | Sí — material pedagógico adjunto | `material_attachments` (bucket `material-attachments`) | No | Funcionalidad principal de la app (biblioteca de recursos) |
| Mensajes (in-app) | Sí — chat de mentoría y canales de comunidad | `mentorship_messages`, `channel_messages` | No | Funcionalidad principal de la app |
| Información de salud | **Sí — dato sensible** | `mood_entries` (bitácora de ánimo), `support_requests`/`support_replies` (consultas de salud mental/educación diferencial) | No | Autocuidado y red de apoyo profesional del docente |
| Identificadores de dispositivo | Sí — token de push | gestionado por `expo-notifications`, no persistido en tabla propia fuera de lo necesario | Sí — con Expo (EAS), para enrutar la notificación a Apple/Google | Notificaciones push |
| Datos de uso / analítica | No | No hay SDK de analytics en `package.json` | — | — |

## Preguntas clave del formulario

- **¿La app recolecta o comparte alguno de los tipos de datos requeridos?** Sí.
- **¿Los datos están cifrados en tránsito?** Sí (TLS/HTTPS, Supabase).
- **¿Los usuarios pueden solicitar que se elimine su dato?** Sí, por correo a
  `appraizmaestra@gmail.com` (ver `21719-canal-derechos.md`). **Recomendación antes de publicar:**
  ambas tiendas valoran (y Play Store puede exigir) un flujo de eliminación de cuenta **dentro de la
  app**, no solo por correo — hoy no existe en `app-rurales` (no se encontró pantalla de "Eliminar mi
  cuenta"). Evaluar agregarlo antes del release, o al menos declarar el proceso por correo de forma
  clara y accesible en `/privacidad`.
- **¿Se recolecta información de salud?** Sí — declarar explícitamente la categoría "Salud" en ambos
  formularios, dado `mood_entries` y `support_requests`.
- **¿Hay usuarios menores de 13/18 años?** No — la app es exclusivamente para docentes adultos (ver
  `21719-rat.md`, notas).
- **URL de política de privacidad a declarar en la consola:** `https://[COMPLETAR: dominio final de
  app-rurales-landingpage]/privacidad`.
- **URL de términos de uso (Apple la pide en la ficha de la app):** `https://[COMPLETAR: dominio final]
  /terminos`.

---
*Documento complementario generado junto con compliance-cl (packs ley-21719 + ley-21595). No
constituye asesoría legal ni garantiza la aprobación de la app por las tiendas.*
