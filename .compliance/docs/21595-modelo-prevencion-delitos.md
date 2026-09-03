# Modelo de Prevención de Delitos (MPD) — Universidad Católica del Norte / Proyecto Raíz Maestra

**RUT:** [COMPLETAR: RUT UCN o unidad responsable] · **Vigente desde:** 2026-09-03 · **Versión:** 1.0
**Encargado de Prevención:** [COMPLETAR: nombre y cargo del coordinador del proyecto en UCN]

> Conforme a la Ley 21.595 (que amplía la Ley 20.393). Modelo proporcional al tamaño del proyecto: un
> equipo reducido (2 desarrolladores) operando infraestructura por instrucción de la UCN, sin manejo de
> pagos a proveedores externos ni licitaciones públicas propias del proyecto. Aprobado por
> [COMPLETAR: la administración del proyecto en UCN].

## 1. Objeto y alcance
Este modelo busca prevenir la comisión de delitos que puedan generar responsabilidad penal en el marco
del proyecto Raíz Maestra. Aplica a los desarrolladores (David Álvarez Barraza, Sebastián Cortez) y a
cualquier prestador de servicios que se incorpore al proyecto.

## 2. Encargado de Prevención de Delitos
Se designa a [COMPLETAR: nombre y cargo del coordinador del proyecto en UCN] como Encargado de
Prevención, con autonomía respecto del equipo de desarrollo y los medios para ejercer su función.
Reporta a [COMPLETAR: instancia UCN correspondiente — dirección de proyecto/facultad]. Duración:
mientras dure el proyecto.

## 3. Identificación de riesgos
Los riesgos de delitos por proceso se detallan en la **Matriz de Riesgos** (`21595-matriz-riesgos.md`).
Procesos de mayor exposición en este proyecto: manejo de datos personales y sensibles de los docentes
usuarios (cruce directo con la Ley 21.719), acceso a infraestructura de producción (Supabase), y
eventual manejo de fondos del proyecto si el financiamiento UCN incluye pagos a proveedores.

## 4. Controles internos
- Acceso a la infraestructura de producción (Supabase, EAS) restringido a los desarrolladores del
  proyecto; credenciales fuera del código fuente (variables de entorno).
- Row Level Security en las 21 tablas de la base de datos, sin excepción, incluida la exclusión de
  `mood_entries` de cualquier acceso administrativo.
- Controles de acceso a sistemas y datos pendientes de reforzar: MFA para cuentas administrativas y
  registro de auditoría (`sec-mfa`, `sec-logs` — ver hallazgos en `RESUMEN.md`).
- Si el proyecto administra fondos o contrata proveedores: [COMPLETAR — definir procedimiento de
  autorización de pagos y segregación de funciones con la unidad administrativa de UCN].

## 5. Canal de denuncias
Canal de denuncias: **appraizmaestra@gmail.com** (mismo canal usado para derechos de datos personales,
ver `21595-reglamento-canal-denuncias.md`). Garantiza confidencialidad y **prohíbe represalias** contra
el denunciante. Procedimiento de investigación en `21595-codigo-etica.md`.

## 6. Capacitación
Capacitación del equipo de desarrollo al incorporarse al proyecto y revisión anual de este modelo y del
código de ética.

## 7. Régimen disciplinario
El incumplimiento de este modelo se sanciona conforme a la normativa aplicable de la UCN al proyecto y
la legislación vigente, según gravedad.

## 8. Supervisión y actualización
El Encargado supervisa el modelo y lo actualiza al menos anualmente o ante cambios relevantes del
proyecto (ej. nuevo proveedor, nuevo flujo de pagos). Deja registro de las revisiones. La **supervisión
externa periódica por un tercero independiente** (obligatoria para que el modelo se considere
"adecuado") es el único componente que no puede resolver esta auditoría por sí sola — ver
`RESUMEN.md`.

---
*Borrador generado con compliance-cl (pack ley-21595). No constituye asesoría legal; revisar con un abogado.*
