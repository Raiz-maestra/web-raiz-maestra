# Matriz de Riesgos de Delitos — Proyecto Raíz Maestra (UCN)

**Fecha:** 2026-09-03 · **Versión:** 1.0
**Responsable:** [COMPLETAR: nombre y cargo del coordinador del proyecto en UCN]

> Identifica, por proceso, dónde puede ocurrir un delito de la Ley 21.595, su nivel de riesgo y el
> control que lo mitiga. Actualizar al menos anualmente. Adaptada al perfil real del proyecto: un
> equipo de 2 desarrolladores operando infraestructura por instrucción de la UCN, sin proceso propio de
> licitaciones ni pagos a proveedores externos identificado en el repositorio auditado.

| Proceso | Delito potencial | Probabilidad | Impacto | Nivel | Control mitigante | Control técnico (id) | Estado |
|---|---|---|---|---|---|---|---|
| Acceso a infraestructura de producción (Supabase, EAS) | Delitos informáticos (acceso/uso indebido de datos de docentes) | Media | Alto | Medio-Alto | Credenciales fuera del código, RLS en 21 tablas, exclusión total de admin sobre `mood_entries` | `sec-secrets`, `sec-tenant` | [x] parcial — falta MFA y log de auditoría |
| Manejo de fondos del proyecto (si el financiamiento UCN incluye pagos a terceros) | Lavado / fraude / administración desleal | [COMPLETAR: baja/media/alta, según si el proyecto maneja fondos] | [COMPLETAR] | [COMPLETAR] | [COMPLETAR: procedimiento de autorización y segregación de funciones con la unidad administrativa UCN] | `ctrl-interno` | [ ] pendiente de definir con UCN |
| Uso indebido de datos personales/sensibles de docentes por el propio equipo de desarrollo | Delitos informáticos / infracción a Ley 21.719 | Baja | Alto | Medio | Código de ética, RLS, sin tabla de log de auditoría (pendiente) | `sec-mfa`, `sec-logs`, `ctrl-interno` | [x] parcial |
| Contratación de nuevos colaboradores para el proyecto | Conflicto de interés no declarado | Baja | Bajo | Bajo | Código de ética + declaración al incorporarse | — | [ ] pendiente de formalizar |
| Reporte de incidentes de seguridad o de datos | Ocultamiento de una brecha (agrava sanción bajo 21.719) | Baja | Alto | Medio | Plan de respuesta a brechas + registro de vulneraciones (`21719-plan-respuesta-brechas.md`) | `inc-brechas` | [x] documentado |

## Notas
- Niveles: combinación cualitativa probabilidad × impacto (bajo/medio/alto), a falta de datos
  cuantitativos históricos del proyecto.
- Los controles técnicos enlazan con `references/controls.md` de la skill (se evalúan en `state.json`).
- Filas marcadas `[COMPLETAR]` requieren información de UCN sobre el manejo administrativo/financiero
  del proyecto, que no es verificable desde el código de `app-rurales`.

---
*Borrador generado con compliance-cl (pack ley-21595). No constituye asesoría legal; revisar con un abogado.*
