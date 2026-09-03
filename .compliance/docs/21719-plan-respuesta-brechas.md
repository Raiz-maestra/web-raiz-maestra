# Plan de Respuesta a Brechas de Datos Personales — Raíz Maestra

**Empresa:** Universidad Católica del Norte (UCN) — proyecto Raíz Maestra
**Responsable del plan:** [COMPLETAR: nombre y cargo del coordinador del proyecto en UCN]
**Contacto:** appraizmaestra@gmail.com
**Plazo legal:** notificar a la Agencia **sin dilaciones indebidas** (Art. 14 sexies; la ley NO fija un
plazo de 72 horas — eso es estándar GDPR, no chileno). Mantener además un **registro de las
vulneraciones** (`21719-registro-vulneraciones.md`), aunque no se notifiquen.

## Roles
- **Coordinador de incidente:** [COMPLETAR: nombre y cargo del coordinador del proyecto en UCN].
- **Equipo técnico:** David Álvarez Barraza, Sebastián Cortez (acceso a infraestructura Supabase/EAS).
- **Apoyo legal:** [COMPLETAR: contacto legal UCN, si el incidente lo amerita].

## Fase 1 — Detección y contención (0–4h)
1. Registrar fecha/hora de detección y quién detecta.
2. Contener: revocar sesiones/API keys comprometidas en el dashboard de Supabase, rotar la
   `SUPABASE_SERVICE_ROLE_KEY` si estuvo expuesta, revisar políticas RLS afectadas.
3. Abrir bitácora del incidente (documento simple, no requiere herramienta nueva).

## Fase 2 — Evaluación (4–24h)
1. Qué tablas y cuántos titulares (usar `21719-rat.md` para identificar categorías de datos
   involucradas — prestar especial atención si toca `mood_entries` o `support_requests`, datos
   sensibles).
2. Riesgo para los titulares (alto / no alto).
3. Si Supabase o Expo están involucrados como proveedor, exigirles la información del incidente
   (canal de soporte/seguridad de cada proveedor).

## Fase 3 — Notificación (sin dilaciones indebidas)
1. **A la Agencia de Protección de Datos:** naturaleza, categorías y volumen, consecuencias probables,
   medidas adoptadas, contacto.
2. **A los titulares:** cuando haya riesgo alto, y también si afecta **datos sensibles** (Autocuidado o
   Red de Apoyo — casi seguro el caso más probable dado el modelo de datos), datos económicos/
   financieros/bancarios, o de niños/niñas/adolescentes: qué pasó, qué datos, qué pueden hacer,
   contacto (`appraizmaestra@gmail.com`).

## Fase 4 — Cierre y mejora
Causa raíz · medidas correctivas · actualizar `21719-rat.md` y este plan.

## Plantilla de aviso (borrador)
> El [FECHA] detectamos [DESCRIPCIÓN]. Datos afectados: [CATEGORÍAS], ~[N] titulares.
> Medidas adoptadas: [...]. Contacto: appraizmaestra@gmail.com.

## Hallazgo de la auditoría — control `sec-logs`
`app-rurales` no tiene una tabla de audit log formal (`audit_log`/`activity_log` no existen en
`supabase/schema.sql`) — sin eso, el paso "qué datos y cuántos titulares" de la Fase 2 depende de los
logs nativos de Supabase (Dashboard → Logs) en vez de un registro propio con actor/IP. Es una mejora
recomendada, no bloqueante para publicar en tiendas.

---
*Borrador generado con compliance-cl (pack ley-21719). No constituye asesoría legal; revisar con un abogado.*
