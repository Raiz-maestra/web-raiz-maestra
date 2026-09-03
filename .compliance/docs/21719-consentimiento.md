# Consentimiento y avisos en el punto de captura — Raíz Maestra

> Art. 12 de la Ley 21.719: el consentimiento debe ser **previo, libre, específico, informado e
> inequívoco**, mediante un **acto afirmativo** (casilla NO premarcada), y **revocable** por un medio
> expedito, gratuito y permanente. Estos textos van en el flujo de registro (`RegisterWizard` /
> `StepPersonalData.tsx`) y en el onboarding del módulo de Autocuidado.

## 1. Aviso corto (paso de datos personales del registro)
> Tus datos (nombre, RUT, teléfono, correo, región, escuela) los trata la Universidad Católica del
> Norte (UCN) — proyecto Raíz Maestra — para crear tu cuenta y conectarte con recursos pedagógicos,
> mentorías, comunidad y red de apoyo. Puedes ejercer tus derechos en appraizmaestra@gmail.com. Más
> detalles en nuestra [Política de Privacidad](/privacidad).

## 2. Consentimiento de registro (checkbox, NO premarcado)
> ☐ Acepto que la UCN (proyecto Raíz Maestra) trate mis datos para crear y administrar mi cuenta,
> según su [Política de Privacidad](/privacidad) y sus [Términos de Uso](/terminos).

El repo ya registra el momento de aceptación (`profiles.consent_accepted_at`,
`supabase/schema.sql:127`) — mantener ese campo como evidencia de consentimiento, no solo el checkbox
en pantalla.

## 3. Datos sensibles — Autocuidado y Red de Apoyo (Art. 16, consentimiento reforzado)
Antes de habilitar el módulo de Autocuidado (bitácora de ánimo) o de enviar una primera consulta a la
Red de Apoyo (salud mental, educación diferencial, gestión SLEP), mostrar:
> ☐ Autorizo expresamente el tratamiento de mis registros de ánimo y/o el contenido de mis consultas
> a la Red de Apoyo, que pueden constituir datos sensibles de salud, para recibir contención y
> orientación profesional, según la [Política de Privacidad](/privacidad).

El repo ya registra este consentimiento por separado (`profiles.wellbeing_consent_at`,
`supabase/schema.sql:128`) — es el patrón correcto: **no reusar** el consentimiento general de
registro para habilitar estos módulos.

## 4. Revocación
Incluir en Ajustes de la app una opción para retirar el consentimiento de Autocuidado/Red de Apoyo
(deja de poder usar esos módulos, pero no afecta el resto de la cuenta) y un enlace directo a
`appraizmaestra@gmail.com` para solicitar la baja completa de la cuenta.

## 5. Registro del consentimiento (prueba)
Ya implementado en el schema: `consent_accepted_at` y `wellbeing_consent_at` por usuario
(`supabase/schema.sql:127-128`). [COMPLETAR: si se actualiza el texto de la política, versionar la
política (ej. `privacy_policy_version`) para poder acreditar qué versión aceptó cada usuario]. La
**carga de la prueba del consentimiento es del responsable** (Art. 12).

---
*Borrador generado con compliance-cl (pack ley-21719). No constituye asesoría legal; revisar con un abogado.*
