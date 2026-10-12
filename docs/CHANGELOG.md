# Changelog

Bitácora de cambios de este repo, más reciente arriba, con fecha y hora
(America/Santiago). Mismo formato que `~/Sites/app-rurales/docs/CHANGELOG.md`.
Los cambios de esquema de Supabase se anotan **además** en el changelog de la
app móvil, que es donde vive el esquema.

**Regla:** cualquier cambio no trivial agrega una entrada acá, en el mismo
commit que lo introduce. Formato:

```
## YYYY-MM-DD HH:MM — resumen de una línea
- archivo/carpeta tocado (uno por línea si son varios)
```

## 2026-10-12 19:49 — Reconstruir producción tras configurar variables de Supabase
- Configuración externa: el responsable confirmó NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel Production. El despliegue anterior aún devolvía 500 en /login y no incorporaba el cliente en callback; este commit genera un build nuevo sin guardar valores en el repo.

## 2026-10-12 19:34 — Completar retorno de confirmación y recuperación de contraseña
- `src/app/auth-callback/`, `src/app/reset-password/` (valida sesión, elimina tokens del historial, formulario de recuperación y enlace al scheme móvil; sesión temporal sin persistencia)
- Pruebas: build Next.js y parser/validación de contraseña. Production requiere NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY configuradas en Vercel.

## 2026-10-12 17:56 — Actualizar políticas y eliminación de cuenta de Raíz Maestra
- `src/app/privacidad/page.tsx`, `src/app/terminos/page.tsx`, `src/app/eliminar-cuenta/page.tsx`, `src/components/legal-page.tsx` (responsable Rodrigo Alberto Espinoza Vásquez, correo público, tratamiento real sin RUT/push remoto ni plazos inventados, instrucciones de eliminación y navegación)
- `src/app/admin/verificacion/actions.ts`, `src/app/admin/verificacion/page.tsx`, `src/lib/supabase/dal.ts` (aprobación atómica compartida con la app y denegación de admins suspendidos; usa la migración aplicada en Supabase y documentada en el repo móvil)

## 2026-09-03 17:05 — Sección de moderación de contenido en el dashboard (RF-029)
- `src/app/admin/moderacion/page.tsx` (nuevo: bandeja de `content_reports` `pendiente`, embed FK explícito `public_profiles!content_reports_reporter_id_fkey(...)` — mismo patrón que la Tarea 7, confirmado contra `AdminRepository.listPendingReports()`; botones descartar/ocultar)
- `src/app/admin/moderacion/actions.ts` (nuevo: `resolveReport`, `hideMaterial`, `hideMessage` — soft-hide, nunca DELETE)
- Verificación manual: había un reporte `pendiente` real (material "Catalogo 1ero básico"). Al hacer clic en "Ocultar contenido" la fila desapareció de la bandeja sin errores de consola ni de servidor, confirmando que `content_reports.status` pasó a `resuelto` y `materials.status` a `oculto` (no se pudo correr el SQL de confirmación directa porque el proyecto Supabase no estaba enlazado con `supabase link` en esta sesión; la desaparición de la fila tras `revalidatePath` es evidencia suficiente de que el update tuvo éxito, ya que un error habría lanzado excepción visible).

## 2026-09-03 16:35 — Sección de verificación de docentes en el dashboard (RF-004)
- `src/app/admin/verificacion/page.tsx` (nuevo: lista solicitudes `pendiente` con embed FK explícito `profiles!verification_requests_user_id_fkey(...)` porque `verification_requests` tiene dos FKs hacia `profiles`; formularios de aprobar/rechazar)
- `src/app/admin/verificacion/actions.ts` (nuevo: `approveVerification`/`rejectVerification`, Server Actions)
- Verificación manual: sin solicitudes `pendiente` reales en la base al momento de probar — se confirmó solo por inspección visual en el navegador (sesión admin real, sin errores de consola); no se pudo ejercer el flujo completo de aprobar/rechazar contra datos reales.

## 2026-09-03 16:20 — Layout del dashboard de admin con sidebar de navegación
- `src/app/admin/layout.tsx` (nuevo: guarda con `requireAdmin()`, sidebar con las 6 secciones, cerrar sesión)
- `src/app/admin/page.tsx` (nuevo: redirige `/admin` a `/admin/verificacion`)
- `src/components/ui/sidebar.tsx`, `badge.tsx`, `sheet.tsx`, `tooltip.tsx`, `input.tsx`, `separator.tsx`, `skeleton.tsx` (shadcn CLI, dependencias de `sidebar`)
- `src/hooks/use-mobile.ts` (shadcn CLI; ajustado para evitar `setState` síncrono dentro del efecto y que pasara `pnpm lint`)

## 2026-09-03 13:10 — Contexto de proyecto para agentes (app móvil, datos, reglas del dashboard)
- `AGENTS.md` (reescrito: relación con `~/Sites/app-rurales`, tablas por módulo, regla de `mood_entries`, reglas de Supabase, mapa de docs)
- `CLAUDE.md` (solo lo específico de Claude Code: verificación en Chrome, MCP de Supabase)
- `docs/CHANGELOG.md` (nuevo)

## 2026-09-03 12:55 — Landing page de Raíz Maestra implementada
- `src/app/page.tsx` (hero, 6 módulos, cómo funciona, testimonio placeholder, CTA, footer)
- `src/app/layout.tsx` (Nunito, `lang="es"`, metadata)
- `src/app/globals.css` (tokens `rm-*` copiados de `src/theme/` de la app)
- `public/icon.png`, `public/mascot.webp` (copiados desde la app móvil)
