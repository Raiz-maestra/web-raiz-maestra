# Dashboard de administración web — diseño

Fecha: 2026-09-03

## Contexto

Este repo (`app-rurales-landingpage`) es Raíz Maestra — web: hoy solo tiene la
landing pública. Se agrega el dashboard de administración descrito como
próximo en `AGENTS.md`. Apunta al mismo proyecto Supabase que la app móvil
(`jdpdiznqxkkjwmwaygzl`), sin tablas propias.

M6 (Administración) ya está completo y verificado en vivo en la app móvil
(`~/Sites/app-rurales/app/admin/*.tsx`, `src/repositories/AdminRepository.ts`,
`docs/M6-Administracion-Estado.md`). El dashboard web es un **cliente nuevo
de las mismas reglas de negocio y el mismo backend** — no reinventa RLS,
vistas ni funciones. Los únicos objetos de base de datos que M6 necesitó
(`admin_users_view`, `my_storage_used_bytes_for()`, `admin_adoption_metrics()`)
ya existen; este proyecto no agrega ninguno.

## Alcance

**Paridad con la app móvil**, sin cerrar los "techos conocidos" que
`M6-Administracion-Estado.md` ya documenta como pendientes (editar/desactivar
escuelas, CRUD de microcentros, historial completo de moderación, selector
de escuela en métricas, botón de silenciar autor desde la bandeja). Quedan
fuera de esta primera versión — se retoman en un ciclo propio si se piden.

7 secciones, calcadas de las pantallas ya verificadas de M6:

| Sección | RF | Qué hace (idéntico a la app móvil) |
|---|---|---|
| Verificación de docentes | RF-004 | Cola de `verification_requests` pendientes, aprobar/rechazar (rechazo exige motivo) |
| Usuarios | RF-027/030 | Lista (`admin_users_view`), editar cuota de storage, activar/desactivar cuenta |
| Escuelas y microcentros | RF-028 | Crear escuela, listar todas con estado activo/desactivado (microcentros solo lectura) |
| Moderación de contenido | RF-029 | Bandeja de `content_reports` pendientes, descartar o soft-hide (material/mensaje) |
| Catálogos del sistema | RF-032 | Crear/listar categorías de material, canales, contactos de emergencia |
| Métricas de adopción | RF-031 | `admin_adoption_metrics()` con filtro opcional por región |

## Autenticación y autorización

Next.js 16 renombró `middleware.ts` → `proxy.ts` (Middleware deprecado). Se
usa el patrón de dos capas que la propia guía de autenticación de Next.js
recomienda para App Router:

1. **`proxy.ts`** (raíz del proyecto) — chequeo **optimista**: solo lee la
   cookie de sesión de Supabase (sin query a la base). Redirige a `/login`
   si no hay sesión y visita `/admin/*`; redirige a `/admin` si hay sesión y
   visita `/login`. Matcher: todo excepto estáticos/imágenes y la landing
   pública (`/`).
2. **`src/lib/supabase/dal.ts` → `requireAdmin()`** — chequeo **real**,
   memoizado por request con `cache()` de React: valida sesión Y
   `profiles.base_role === 'admin'`. Si falla, cierra la sesión
   (`supabase.auth.signOut()`) y redirige a `/login?error=sin-acceso`, que
   muestra "Esta cuenta no tiene acceso al panel de administración."

`requireAdmin()` se llama **al inicio de cada página del dashboard y de cada
Server Action** — no solo en `admin/layout.tsx`. La guía de Next.js advierte
que un layout compartido no se re-ejecuta en cada navegación interna
(partial rendering), así que apoyarse solo en el layout dejaría rutas sin
proteger tras la primera carga.

Login: formulario de email/password (`supabase.auth.signInWithPassword`),
sin magic link ni signup — no existe ruta self-service para volverse admin
en ningún punto del proyecto, por diseño (ver `M6-Administracion-Estado.md`).

Cliente Supabase server-side: `src/lib/supabase/server.ts` con `@supabase/ssr`
y `cookies()` de `next/headers`, siguiendo el quickstart oficial de Supabase
para Next.js App Router.

## Capa de datos

Sin clase/interfaz repository (a diferencia de `AdminRepository.ts` de la
app móvil, que existe porque los hooks de RN necesitan una capa inyectable
con un modo mock). Acá no hay ese segundo modo, así que:

- **Lecturas**: cada `page.tsx` de sección es un Server Component `async`
  que llama `requireAdmin()` y luego consulta Supabase directo — mismas
  vistas/RPCs/tablas que ya usa `AdminRepository` (`admin_users_view`,
  `schools`, `content_reports` con los mismos embeds de FK nombrados,
  `admin_adoption_metrics()`, etc.). Cero SQL nuevo.
- **Escrituras**: un `actions.ts` por carpeta de sección, funciones
  `'use server'` (`updateUserQuota`, `toggleUserActive`, `createSchool`,
  `resolveReport`, `hideMaterial`, `hideMessage`, `approveVerification`,
  `rejectVerification`, `createCategory`, `createChannel`,
  `createEmergencyContact`) — mismo cuerpo de query que los métodos
  equivalentes de `AdminRepository`, sin envoltura de clase. Cada acción
  llama `requireAdmin()` primero y `revalidatePath()` de su sección al
  terminar.
- Se reutilizan los mismos textos de error literales de la app móvil donde
  aplica (ej. "La nueva cuota no puede ser menor al espacio ya utilizado por
  el docente.", "Ya existe una escuela con ese nombre en la región
  seleccionada.") — no se inventa redacción nueva para el mismo caso.

## Rutas y UI

```
src/app/
  login/page.tsx                  # form + Server Action de login
  admin/
    layout.tsx                    # sidebar fija (6 secciones + cerrar sesión)
    page.tsx                      # redirect a /admin/verificacion
    verificacion/{page,actions}.ts
    usuarios/{page,actions}.ts
    escuelas/{page,actions}.ts
    moderacion/{page,actions}.ts
    catalogos/{page,actions}.ts   # tabs: categorías / canales / contactos
    metricas/page.tsx             # sin actions propias, solo lectura + filtro
proxy.ts
src/lib/supabase/{server,dal}.ts
```

Navegación: **sidebar fija** (no el hub de tarjetas de la app móvil) — patrón
típico de dashboard web, todas las secciones a un clic. shadcn/ui nuevo a
instalar (tematizado con tokens `rm-*`, nunca gris neutral por defecto):
`sidebar`, `table`, `dialog`, `tabs`, `badge`, `form`, `input`, `label`.
`button` y `card` ya existen en el repo.

## Secretos y variables de entorno

- Dependencias nuevas: `@supabase/ssr` y `@supabase/supabase-js`, pineadas a
  versión exacta (la app móvil usa `@supabase/supabase-js@^2.110.5` — se
  instala esa misma línea).
- `.env.local` (no versionado): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` — mismo proyecto y mismos valores que la
  app móvil usa bajo `EXPO_PUBLIC_*`, pedidos al equipo, nunca generados ni
  adivinados por el agente.
- `.env.example` con ambos nombres y placeholders, nunca valores reales.
- `.gitignore` ya cubre `.env*`; se revisa que siga cubriendo cualquier
  archivo de credenciales al escribir el código, sin quitar esa línea.
- **Nunca `service_role`** en este repo: todo opera como el usuario admin
  autenticado, RLS hace el trabajo (regla ya establecida en `AGENTS.md`).
- Aplica sin excepciones la sección "Seguridad — repo público" de
  `AGENTS.md` durante toda la implementación.

## Verificación

Sin tests unitarios nuevos — no hay lógica pura no trivial (las
validaciones son comparaciones simples que ya eligen su texto de error,
como en la app móvil). Verificación real antes de dar por cerrado el
trabajo:

1. `pnpm dev`, login con la cuenta admin de prueba
   (`seba.crz.sv+m1test-docente-20260825@gmail.com` / `AdminTest123!`) y
   confirmar acceso a las 7 pantallas.
2. Login con una cuenta docente (`deiviid.testm1.rf004@gmail.com` /
   `TestPass123!`) y confirmar el bloqueo con el mensaje de "sin acceso".
3. Recorrer las 7 pantallas con `claude-in-chrome` (desktop y ~400px móvil),
   `read_console_messages` sin errores.
4. Ejercer al menos una acción real por sección contra el backend vivo
   (ej. cambiar y revertir una cuota, crear y no limpiar un catálogo de
   prueba si no hay ruta de borrado — igual que hizo la Tarea 10 de M6),
   dejando cualquier fixture de prueba documentado en `CHANGELOG.md` si no
   se puede limpiar.

## Fuera de alcance (explícito)

- Cerrar los techos conocidos de M6 documentados arriba.
- Cualquier tabla, vista o función nueva en Supabase — si algo faltara, se
  vuelve a `AGENTS.md` § Base de datos antes de escribir DDL.
- Tests unitarios (no hay lógica que los justifique en esta pasada).
