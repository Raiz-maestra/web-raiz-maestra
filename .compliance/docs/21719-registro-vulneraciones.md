# Registro de Vulneraciones a las Medidas de Seguridad — Raíz Maestra

> Art. 14 sexies: el responsable debe **registrar** las vulneraciones de seguridad (destrucción,
> pérdida, filtración o alteración no autorizada), **aunque no se notifiquen**. Documento interno,
> append-only — agregar una fila por cada incidente real, nunca borrar filas anteriores.

| # | Fecha detección | Quién detecta | Naturaleza de la vulneración | Datos afectados (categorías) | N° titulares aprox. | ¿Riesgo alto? | ¿Notificada a Agencia? | ¿Notificada a titulares? | Medidas adoptadas | Causa raíz |
|---|---|---|---|---|---|---|---|---|---|---|
| — | — | — | Sin incidentes registrados a la fecha (2026-09-03) | — | — | — | — | — | — | — |

## Notas
- Se registra **toda** vulneración, se notifique o no. La decisión de notificar (riesgo) queda
  documentada en la fila correspondiente.
- Recordar: notificar a titulares también si afecta datos sensibles (Autocuidado, Red de Apoyo),
  económicos/financieros/bancarios o de niños, niñas y adolescentes.
- **Hallazgo de higiene detectado en la auditoría (no es una vulneración de seguridad de producción,
  pero es un riesgo a corregir):** `app-rurales/docs/M6-Administracion-Estado.md` versiona en git
  credenciales reales de cuentas de prueba en texto plano. Recomendación: rotar esas contraseñas y
  quitarlas del historial/documentación versionada. No se registra como fila en esta tabla porque no
  hubo explotación conocida, pero debe corregirse antes de la primera revisión anual.

---
*Borrador generado con compliance-cl (pack ley-21719). No constituye asesoría legal; revisar con un abogado.*
