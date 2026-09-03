# Instructivo — qué hacer ante cada situación (Raíz Maestra / UCN)

> Manual operativo para consultar cuando pase algo. Basado en `references/instructivo-situaciones.md`
> de la skill compliance-cl, adaptado con los contactos y el modelo de datos reales del proyecto.

## A. Llega un derecho del titular (acceso, rectificación, supresión, oposición, portabilidad, bloqueo)
**Plazo: 30 días corridos, prorrogable una sola vez por 30 días más** (avisando al titular).
**Gratuidad:** rectificación, supresión y oposición siempre gratis; acceso gratis al menos una vez por
trimestre (se puede cobrar si pide acceso/portabilidad más de una vez en el trimestre).
1. Registra la solicitud (fecha, quién, qué pide) en `appraizmaestra@gmail.com` y verifica identidad.
2. Ubica sus datos: `profiles` y tablas relacionadas en Supabase (ver `21719-rat.md`).
3. Ejecuta: **acceso/portabilidad** → exporta en JSON; **supresión** → borra o anonimiza (no solo
   soft-delete/`hidden_at`); **rectificación/oposición/bloqueo** → aplica sobre la fila correspondiente.
4. Responde por escrito y **guarda evidencia** (copia del correo de respuesta).

## B. Brecha de seguridad (acceso no autorizado, fuga, pérdida, alteración)
**Plazo: notificar a la Agencia sin dilaciones indebidas** (Art. 14 sexies; la ley NO fija 72h).
1. **Contén:** revoca accesos/API keys en el Dashboard de Supabase, rota credenciales. Abre bitácora.
2. **Evalúa:** qué tablas y cuántos titulares, nivel de riesgo (especial atención si toca
   `mood_entries` o `support_requests`).
3. **Notifica:** a la **Agencia de Protección de Datos**; a los **titulares** si hay riesgo alto o si
   afecta datos sensibles (Autocuidado/Red de Apoyo), económicos o de niños/niñas.
4. **Registra** la vulneración en `docs/21719-registro-vulneraciones.md` aunque no la notifiques.
5. **Cierra:** causa raíz + fix + actualiza el RAT y el plan de brechas. No notificar deliberadamente
   agrava la infracción.

## C. Fiscalización de la Agencia de Protección de Datos
Único caso donde conviene un **abogado** (la representación es reservada por ley).
1. Designa un contacto único (sugerido: el coordinador UCN del proyecto). Todo por escrito.
2. Identifica la etapa: ¿solicitud de información (preliminar) o pliego de cargos (formal)?
3. Reúne los antecedentes: ya están en `docs/` de esta carpeta (RAT, DPA, EIPD, registro de
   vulneraciones).
4. Responde en plazo, cargo por cargo, mostrando debida diligencia y remediación.
5. Nunca ocultar o destruir documentos, ni ignorar plazos.

## D. Cambia la ley o sale un reglamento
1. Re-correr la skill `compliance-cl` sobre este mismo repo — `state.json` mostrará qué cambió (drift).

## E. Calendario de revisión

| Cuándo | Qué | Quién |
|---|---|---|
| Anual (o ante cambios) | Revisar y actualizar el **RAT** (`docs/21719-rat.md`) | Responsable de datos UCN |
| Anual | **Supervisión externa del MPD** (Ley 21.595, obligatoria) | Consultor/tercero independiente — insumo no self-service |
| Anual | Capacitación del equipo | Encargado de Prevención |
| Al cambiar de proveedor o región de Supabase | Actualizar DPA + anexo de transferencia | Responsable de datos |
| Cada release relevante de `app-rurales` | Re-correr `/compliance-cl` (detecta drift) | Equipo de desarrollo |

---
*Guía operativa de compliance-cl. No es asesoría legal.*
