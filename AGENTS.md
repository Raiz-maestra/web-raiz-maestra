# AGENTS.md

Contexto de proyecto para cualquier agente de IA (Claude Code, OpenCode,
Antigravity, Codex, Cursor…) que trabaje en este repo. Si eres Claude Code:
este archivo se importa automáticamente desde `CLAUDE.md` (`@AGENTS.md`) —
no dupliques su contenido, léelo desde ahí.

## Qué es esto

**Raíz Maestra — web.** Este repo tiene dos cosas:

1. **La landing pública** (`src/app/page.tsx`) — hoy, lista y verificada.
2. **El dashboard de administración web** — próximo: monitoreo de usuarios,
   recursos, mentorías, comunidad, reportes, etc. Todavía no existe código.

Es el **repo hermano de la app móvil** `~/Sites/app-rurales` (Expo SDK 54 +
React Native, Expo Router). Ambos apuntan al **mismo proyecto real de
Supabase** (`jdpdiznqxkkjwmwaygzl`): mismas tablas, mismas políticas RLS,
mismos usuarios. Nada de lo que se haga aquí puede asumir que la base es
"suya" — la app móvil es la dueña del esquema y este repo lo consume.

Raíz Maestra es una app para docentes de escuelas rurales de Chile: recursos
pedagógicos, mentorías 1 a 1, comunidad (foro), red de apoyo, autocuidado
(estado de ánimo, privado) y un panel de administración. Backend real con
RLS en todas las tablas, autenticación real y storage real. Los 7 módulos
(M0–M6) están completos en la app móvil.

## Equipo

Dos desarrolladores: **David Álvarez** y **Sebastián Cortez**. Ambos pushean
directo a la rama principal. Lo que ya está pusheado se trata como correcto e
intencional aunque la razón no sea obvia — revisar `git log`/blame antes de
asumir que algo es un error. En un merge o conflicto: leer ambos lados
completos, nunca resolver con "ours"/"theirs" a ciegas, nunca force-pushear
sobre los commits del otro. Si la intención no queda clara, preguntar.

## Stack — la versión importa

- **Next.js 16** (App Router, React Server Components, `LayoutProps<"/">`
  tipado). Esta versión tiene breaking changes respecto a lo que el modelo
  conoce — antes de escribir código que toque APIs de Next, leer la guía
  correspondiente en `node_modules/next/dist/docs/` (ver bloque
  `nextjs-agent-rules` al final de este archivo, lo mantiene `next dev`).
- **React 19**, **TypeScript**, **pnpm** (no npm/yarn — hay `pnpm-lock.yaml`).
- **Tailwind CSS v4** (`@import "tailwindcss"` + `@theme inline` en
  `src/app/globals.css`; no hay `tailwind.config.*`, los tokens se declaran
  como variables CSS).
- **shadcn/ui** ya inicializado (`components.json`, estilo `base-nova`,
  primitivas `@base-ui/react`, íconos `lucide-react`). Para un componente
  nuevo del dashboard: `pnpm dlx shadcn@latest add <componente>` en vez de
  escribirlo a mano.
- **Supabase**: todavía no hay cliente instalado en este repo. Cuando se
  agregue para el dashboard, seguir las reglas de la sección "Base de datos".

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build
pnpm lint            # eslint
pnpm exec tsc --noEmit
```

No hay tests todavía. Si se agregan para lógica pura del dashboard, usar
`node:test` colocado junto al módulo (`*.test.ts`), como en la app móvil.

## Estructura actual

```
src/app/layout.tsx     # Nunito vía next/font, lang="es", metadata, favicon
src/app/page.tsx       # la landing completa (una sola página)
src/app/globals.css    # Tailwind v4 + tokens shadcn + tokens rm-* de la marca
src/components/ui/     # componentes shadcn (vacío por ahora)
src/lib/utils.ts       # cn()
public/icon.png        # ícono de la app (256px)
public/mascot.webp     # mascota saludando, usada en el hero
```

## Diseño — una sola fuente de verdad, y no está aquí

Los tokens de marca (`--color-rm-*`, `--radius-rm`, `--shadow-rm*` en
`globals.css`) son **copias** de `~/Sites/app-rurales/src/theme/`
(`colors.ts`, `radius.ts`, `shadows.ts`, `typography.ts`). La app móvil es la
dueña: si un color cambia, cambia allá primero y se replica acá. No inventar
colores nuevos ni gradientes — la paleta es verde de acción `#3F9638`, fondo
crema `#FAF7EF`, tinta `#18321A`, y naranja/amarillo/azul solo como acentos de
categoría. Tipografía única: **Nunito** (títulos 800/900, cuerpo 400–700).
Radios "squircle": card/botón 18px, input 15px. Sombras tono tierra
(`#4a3b24`), difusas, nunca negro puro.

Para el dashboard: usar shadcn como base estructural (tablas, dialogs,
sheets, forms) pero **tematizado con los tokens `rm-*`**, no con el gris
neutral por defecto de shadcn. Un dashboard de Raíz Maestra tiene que verse
de la misma familia que la app.

## Contexto de la app móvil (lo que el dashboard va a monitorear)

Resumen para no tener que abrir el otro repo por cada duda básica. El detalle
completo vive en `~/Sites/app-rurales/docs/` — ver mapa más abajo.

### Módulos y tablas

| Módulo | Tablas | Qué resuelve |
|---|---|---|
| M0 · Usuarios | `microcentros`, `schools`, `profiles`, `verification_requests` | Identidad, territorio, verificación de docente |
| M1 · Saberes Pedagógicos | `material_categories`, `materials`, `material_attachments`, `favorites` | Biblioteca de material, publicación, adjuntos en storage |
| M2 · Mentorías | `mentorship_conversations`, `mentorship_messages`, `mentor_slots` | Chat docente↔mentor, agenda de sesiones |
| M3 · Comunidad | `channels`, `channel_messages`, `channel_reads`, `channel_favorites`, `channel_message_mentions`, `community_mutes` | Canales por región/microcentro, menciones, no leídos |
| M4 · Red de Apoyo | `support_requests`, `support_replies` | Consultas a especialistas por área |
| M5 · Autocuidado | `mood_entries`, `emergency_contacts` | Bitácora de ánimo (**dato sensible**), contención |
| Transversal | `content_reports` | Reportes de material o mensajes |
| M6 · Administración | *(sin tablas propias)* | Opera sobre las de arriba vía `is_admin()` |

- `profiles.base_role` es `'teacher' | 'admin'`. No hay tabla de permisos:
  todo pasa por la función `is_admin()` (`security definer`), y casi todas
  las tablas tienen una política `<tabla>_admin_all` que le da acceso total
  al admin.
- `schools` tiene ~12.025 establecimientos reales de las 16 regiones
  (Directorio MINEDUC 2025) + 6 escuelas piloto. Lectura anónima permitida
  (es la única tabla así, para el formulario de registro).
- Ya existen objetos pensados para administración que el dashboard debe
  reutilizar, no reinventar: la vista `admin_users_view` (profiles + schools
  + correo de `auth.users`), la función `admin_adoption_metrics()` (conteos
  agregados) y `my_storage_used_bytes_for(uuid)` (cuota de otro usuario).
  Antes de escribir una query nueva para el dashboard, revisar en
  `~/Sites/app-rurales/supabase/schema.sql` si ya hay una función/vista que
  la resuelva.

### La regla que no se negocia

**`mood_entries` nunca es legible por un admin.** Ni por RLS, ni por una
vista, ni por una función nueva "solo para el dashboard". Es la única
excepción deliberada al patrón "el admin puede todo" (REQ NF07 / RF-023 del
ERS): el registro de ánimo es exclusivamente de su dueño. Si el dashboard
necesita algo de M5, es un agregado (conteos, promedios por región) que ya
resuelve `admin_adoption_metrics()` — nunca filas individuales ni nada que
permita identificar a una persona.

## Base de datos — cómo trabajar contra Supabase desde este repo

- **Cargar los skills `supabase` y `supabase-postgres-best-practices`** antes
  de cualquier trabajo de schema, RLS, queries o auth. No escribir una
  política ni una migración a memoria.
- **El esquema vive en el repo de la app móvil.** `~/Sites/app-rurales/supabase/schema.sql`
  es la fuente de verdad del DDL (mantenido a mano) y
  `~/Sites/app-rurales/docs/DATA-MODEL.md` explica la intención de cada
  política. Leer ambos antes de tocar la base. Si el dashboard necesita una
  migración nueva (una vista, una función agregada), se aplica con las
  herramientas de migración de Supabase (MCP/CLI, nunca SQL pegado en el
  dashboard) y **se documenta allá**: `schema.sql`, `DATA-MODEL.md` y
  `docs/CHANGELOG.md` del repo de la app — porque el próximo que lea el
  esquema va a mirar ahí, no aquí.
- Toda tabla nueva lleva RLS en el mismo statement que la crea. Sin
  excepciones.
- **Nunca la `service_role` key en este repo**, ni en server components, ni
  en route handlers. El dashboard opera como el usuario admin autenticado y
  las políticas RLS hacen el trabajo — igual que `app/admin/*` en la app
  móvil. Si una consulta "no se puede" con RLS, la respuesta es una función
  `security definer` con `and is_admin()` adentro (ver `admin_users_view`
  como modelo), no saltarse RLS.
- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL` y
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (mismo proyecto que la app; pedirlas al
  equipo, no están versionadas). Crear `.env.example` cuando se agreguen.
- El gate de acceso al dashboard es `profiles.base_role = 'admin'`,
  verificado en servidor (proxy/middleware de Next 16 o en el layout del
  segmento), no solo en cliente.

## Mapa de documentación (repo hermano)

Todo en `~/Sites/app-rurales/docs/`:

- **`ERS-RaizMaestra.md`** — especificación de requisitos (RF-001 a RF-033,
  REQ-NF). Cualquier `RF-NNN` en commits o comentarios apunta acá. M6
  (RF-027 a RF-031) es el módulo de administración: lo que el dashboard web
  tiene que cubrir sale de ahí.
- **`DATA-MODEL.md`** — referencia completa de base de datos: tablas, por qué
  existe cada política y cada función `security definer`, storage.
- **`M0-…-Estado.md` … `M6-Administracion-Estado.md`** — qué se construyó y
  verificó por módulo vs. qué quedó fuera. **`M6-Administracion-Estado.md`
  es lectura obligatoria antes de diseñar el dashboard**: el panel de admin
  ya existe en la app móvil (`app/admin/*.tsx`, `AdminRepository`) y el
  dashboard web no debe contradecirlo ni duplicar reglas de negocio de forma
  distinta.
- **`CHANGELOG.md`** — bitácora con fecha/hora de la app. Leerla primero para
  saber qué cambió recientemente en el esquema.
- Código de referencia para el dashboard: `src/repositories/AdminRepository.ts`
  (las queries que ya funcionan contra RLS de admin) y
  `src/features/admin/` en la app móvil.

## Convenciones

- **Español** para strings visibles al usuario y comentarios; inglés está
  bien en nombres de variables/funciones.
- Sin comentarios que expliquen QUÉ hace el código — solo el PORQUÉ cuando no
  es obvio (una constraint escondida, un workaround, algo que sorprendería).
- **Estándar `ponytail`, siempre**: la solución más perezosa que de verdad
  funciona, YAGNI, nativo/stdlib antes que una dependencia nueva, sin
  abstracción para un solo caller. Es la barra por defecto del repo, no un
  modo opcional.
- **Cualquier feature o fix no trivial** — flujo `superpowers`:
  `brainstorming` → `writing-plans` → `subagent-driven-development`. Saltar
  directo a código solo para cambios genuinamente chicos. El dashboard
  entero es un caso de brainstorming primero.
- **UI: antes de darla por terminada, correr `pnpm dev` y probarla de
  verdad en el navegador** (desktop y ancho móvil). `tsc`/`lint` no
  verifican que la pantalla se vea bien.
- **Commits: Conventional Commits, breves.** `feat:`, `fix:`, `chore:`,
  `docs:`, `refactor:` + una línea imperativa. Cuerpo solo si el *por qué*
  no es obvio en el diff.
- **Cada cambio no trivial agrega una entrada a `docs/CHANGELOG.md` de este
  repo, en el mismo commit** (fecha y hora + resumen + archivos tocados, más
  reciente arriba). Los cambios de esquema van además al changelog del repo
  de la app, como se explica arriba.

## Pendientes conocidos de la landing

Marcados con `TODO` en `src/app/page.tsx`: testimonio real de una docente
piloto, links reales a App Store / Google Play, páginas de Privacidad y
Contacto. La cifra "más de 3.000 escuelas rurales" del CTA es dato general,
no del proyecto — confirmar o cambiar.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
