# RESUMEN — Cumplimiento legal Raíz Maestra (UCN)

**Fecha:** 2026-09-03 · **Marcos activos:** Ley 21.719 (Protección de Datos) · Ley 21.595 (Delitos
Económicos / Modelo de Prevención)

> **Disclaimer obligatorio:** este documento no constituye asesoría legal. Es un borrador fundado en la
> normativa chilena, generado para ayudar a cumplir sin necesidad de un abogado en la mayoría de los
> pasos. Revísalo con un abogado antes de publicar o firmar cualquier documento vinculante.

## Desviación de proceso, documentada a propósito
La skill `compliance-cl` asume por defecto `<repo auditado>/.compliance/` en el mismo repo. Aquí, por
decisión explícita del usuario, la **evidencia técnica** se recolectó en `~/Sites/app-rurales`
(commit `42fd241`) y **todo el output** (este `.compliance/`, más las páginas públicas `/privacidad` y
`/terminos`) se escribió en `~/Sites/app-rurales-landingpage` (commit base `25403be`), porque es el
repo con URL pública que exigen Play Store y App Store. Si `app-rurales` cambia de forma relevante
(nuevo módulo, nuevo proveedor, cambio de esquema), hay que volver a correr esta auditoría manualmente
— no hay automatismo cross-repo.

## Postura por marco

| Marco | Score | Pass | Parcial | Falla | No verificable |
|---|---|---|---|---|---|
| Ley 21.719 (Datos Personales) | **67%** | 12 | 8 | 3 | 1 |
| Ley 21.595 (Delitos Económicos) | **50%** | 2 | 4 | 1 | 1 |

Esta es la **primera corrida** — no hay corrida previa con la que comparar drift.

## Brechas priorizadas

1. **Dato pendiente de UCN — bloquea publicar:** nombre y cargo del coordinador/responsable de datos,
   RUT de la unidad UCN correspondiente, y domicilio. Aparece como `[COMPLETAR]` en todos los
   documentos. Sin esto, la política de privacidad no queda con un responsable identificable.
2. **Sin MFA en cuentas admin** (`sec-mfa`) y **sin log de auditoría** (`sec-logs`) — son la condición
   que deja abierta la EIPD de datos sensibles (Autocuidado / Red de Apoyo). No bloquean publicar en
   tiendas, pero son la remediación de mayor impacto legal a corto plazo.
3. **Sin flujo de eliminación de cuenta dentro de la app** (`data-derechos`) — hoy solo existe por
   correo. Recomendado para cumplir mejor el Art. 14 ter y porque Play Store lo valora explícitamente
   en el formulario de Data Safety (ver `docs/store-data-safety.md`).
4. **Región del proyecto Supabase sin confirmar** (`data-transfer`) — no verificable desde el código;
   confirmar en el dashboard para cerrar el anexo de transferencias con el país exacto.
5. **`.env.example` de `app-rurales` versiona una anon key real** en vez de un placeholder — hallazgo
   de higiene (`sec-secrets`), de bajo riesgo real (la anon key está pensada para ser pública, protegida
   por RLS) pero mala práctica a corregir.
6. **Supervisión externa anual del MPD** (`gov-auditoria`, Ley 21.595) — único insumo que esta skill no
   puede resolver por sí sola: requiere contratar a un tercero independiente (~UF 3-5).
7. **Hallazgo fuera de alcance de este pack, reportado aparte:** `app-rurales/docs/M6-Administracion-
   Estado.md` versiona credenciales reales de cuentas de prueba en texto plano en git. No es un
   requisito legal de este pack, pero es un riesgo de seguridad real — rotar esas credenciales.

## Qué quedó resuelto sin intervención de abogado
- DPO: no obligatorio (Art. 50) — resuelto y citado en `21719-rat.md` y `21719-eipd.md`.
- EIPD: test del Art. 15 ter corrido sobre Autocuidado y Red de Apoyo → **obligatoria**, documento
  generado con riesgo residual evaluado (`21719-eipd.md`).
- Base de licitud por flujo: resuelta fila por fila en el RAT.
- Mecanismo de transferencia internacional: cláusulas contractuales modelo del Ministerio de Economía,
  aplicado a Supabase y Expo (`21719-anexo-transferencias.md`).

## Único insumo externo no self-service
**Supervisión externa anual del Modelo de Prevención de Delitos** (Ley 21.595) — contratar un tercero
independiente. No requiere abogado necesariamente, pero sí un consultor externo al proyecto.

## Siguiente paso sugerido
Conseguir de la contraparte UCN los 3 datos `[COMPLETAR]` (responsable, RUT, domicilio) — sin eso, la
política de privacidad no se puede publicar en producción. Una vez completados, es un find-and-replace
en los 14 documentos de `.compliance/docs/` y en las páginas `/privacidad` y `/terminos`.

Se sugiere commitear esta carpeta: `git add .compliance && git commit -m "compliance: snapshot 2026-09-03"`.

---
*Generado con la skill compliance-cl. No constituye asesoría legal.*
