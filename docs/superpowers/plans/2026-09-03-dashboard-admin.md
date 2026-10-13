# Dashboard de Administración — Implementation Plan

Plan histórico de septiembre de 2026. Para conocer la implementación vigente y las correcciones posteriores, consultar el código y `docs/CHANGELOG.md`; las casillas de este documento no representan el estado actual del dashboard.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el dashboard web de administración de Raíz Maestra — login con Supabase Auth y 7 secciones (verificación de docentes, usuarios, escuelas, moderación, catálogos, métricas) con paridad funcional respecto al panel M6 ya verificado en la app móvil.

**Architecture:** Next.js 16 App Router, 100% Server Components para lecturas y Server Actions (`'use server'`) para escrituras — sin capa de repository/cliente inyectable (no hay un segundo modo mock que la justifique aquí). Autenticación con `@supabase/ssr`: `proxy.ts` hace el chequeo optimista de sesión, `requireAdmin()` (DAL) hace el chequeo real de `profiles.base_role === 'admin'` en cada página y cada acción.

**Tech Stack:** Next.js 16.3.4, React 19, TypeScript, `@supabase/ssr` + `@supabase/supabase-js` (pineados a `2.110.5`, misma versión que la app móvil), shadcn/ui (tokens `rm-*`), Tailwind v4, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-03-dashboard-admin-design.md`

## Global Constraints

- **Nunca `service_role`** en este repo, en ningún archivo. Todo opera como el usuario admin autenticado; RLS hace el trabajo.
- **Nunca hardcodear** `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` fuera de `.env.local` (no versionado) — ver sección "Seguridad — repo público" de `AGENTS.md`.
- Antes de cada commit de este plan: `git status`/`git diff` para confirmar que no se cuela ningún valor real de key/URL.
- Español para todo string visible al usuario; sin comentarios que expliquen QUÉ hace el código, solo el PORQUÉ cuando no es obvio.
- `requireAdmin()` se llama al inicio de **cada** page.tsx del dashboard y de **cada** Server Action — nunca solo en el layout (partial rendering de Next.js no re-ejecuta el layout en cada navegación interna).
- Sin tipos `Database` generados a mano ni con MCP en esta pasada — se tipa fila a fila con interfaces locales, igual que `AdminRepository.ts` de la app móvil (`data as MiFila[]`). Si el dashboard crece y necesita los tipos completos, se generan con `mcp__supabase__generate_typescript_types`, nunca escritos a mano (regla de `AGENTS.md`).
- Los textos de error/confirmación reutilizan literalmente los de la app móvil donde ya existe el mismo caso (ver tabla de la sección "Escrituras" del spec).
- Cada tarea termina con un cambio verificable en `pnpm dev` — no hay tests unitarios en este plan (decisión del spec: no hay lógica pura no trivial que los justifique).
- `@supabase/ssr` cambia de vez en cuando su API de cookies — antes de escribir `src/lib/supabase/server.ts` (Tarea 2) y `proxy.ts` (Tarea 3), confirmar contra `https://supabase.com/docs/guides/auth/server-side/nextjs` que `getAll`/`setAll` sigue siendo la firma vigente; el código de este plan usa esa firma porque es la estable desde hace tiempo, pero Supabase puede haber publicado un cambio.

---

## File Structure

```
package.json                              # + @supabase/ssr, @supabase/supabase-js
.env.example                              # + NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
proxy.ts                                  # gate optimista (raíz del proyecto)
src/lib/supabase/server.ts                # cliente Supabase server-side (RSC + actions)
src/lib/supabase/middleware.ts            # updateSession(), usado por proxy.ts
src/lib/supabase/dal.ts                   # requireAdmin()
src/app/login/page.tsx
src/app/login/actions.ts
src/app/admin/layout.tsx                  # sidebar + botón cerrar sesión
src/app/admin/page.tsx                    # redirect a /admin/verificacion
src/app/admin/verificacion/page.tsx
src/app/admin/verificacion/actions.ts
src/app/admin/usuarios/page.tsx
src/app/admin/usuarios/actions.ts
src/app/admin/escuelas/page.tsx
src/app/admin/escuelas/actions.ts
src/app/admin/moderacion/page.tsx
src/app/admin/moderacion/actions.ts
src/app/admin/catalogos/page.tsx
src/app/admin/catalogos/actions.ts
src/app/admin/metricas/page.tsx
src/components/ui/{sidebar,table,dialog,tabs,badge,form,input,label}.tsx  # shadcn
docs/CHANGELOG.md                         # entrada del cambio
```

---

### Task 1: Dependencias, variables de entorno y verificación de `.gitignore`

**Files:**
- Modify: `package.json`
- Create: `.env.local` (no versionado — el usuario pega los valores reales)
- Modify: `.env.example`
- Modify: `.gitignore` (solo si falta cobertura real, ver Step 3)

**Interfaces:**
- Produces: `@supabase/ssr`, `@supabase/supabase-js` instalados y disponibles para el resto de las tareas.

- [ ] **Step 1: Instalar dependencias pineadas**

```bash
pnpm add @supabase/supabase-js@2.110.5 @supabase/ssr@latest
```

Anotar en el plan la versión exacta de `@supabase/ssr` que instale pnpm (revisar `package.json` tras el install) — pinearla también si el `package.json` quedó con rango.

- [ ] **Step 2: Actualizar `.env.example`**

Agregar al final del archivo (crearlo si no existe):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

- [ ] **Step 3: Crear `.env.local` con los valores reales**

Pedir al usuario la URL y anon key del proyecto `jdpdiznqxkkjwmwaygzl` (las mismas que usa `~/Sites/app-rurales/.env` bajo `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY`) y escribirlas en `.env.local`. **Nunca** imprimirlas en la conversación ni en ningún archivo versionado.

- [ ] **Step 4: Confirmar que `.gitignore` cubre `.env.local`**

Correr:

```bash
git check-ignore -v .env.local
```

Expected: imprime la línea `.env*` de `.gitignore` como la regla que lo ignora. Si no imprime nada, agregar `.env.local` explícitamente a `.gitignore` antes de continuar — no seguir con ninguna otra tarea hasta que esto pase.

- [ ] **Step 5: Confirmar que nada del `.env.local` quedó en el árbol de git**

```bash
git status --porcelain | grep -i env
```

Expected: sin salida (o solo `.env.example` si se muestra como modificado).

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example
git commit -m "chore: agregar dependencias de Supabase SSR y .env.example del dashboard"
```

---

### Task 2: Cliente Supabase server-side

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (env vars de Task 1).
- Produces: `createClient()` async (para usar en Server Components y Server Actions), `updateSession(request: NextRequest): Promise<NextResponse>` (para `proxy.ts` en Task 3).

- [ ] **Step 1: Verificar la API vigente de `@supabase/ssr`**

Antes de escribir código: fetch `https://supabase.com/docs/guides/auth/server-side/creating-a-client.md` y confirmar que `createServerClient` sigue esperando `cookies: { getAll, setAll }`. Si cambió, adaptar el código de abajo a la firma nueva.

- [ ] **Step 2: Crear `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ponytail: setAll llamado desde un Server Component (no puede
            // escribir cookies); requireAdmin()/proxy.ts ya refrescan la
            // sesión en las rutas que sí pueden, así que se ignora acá.
          }
        },
      },
    },
  );
}
```

- [ ] **Step 3: Crear `src/lib/supabase/middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresca el token si expiró; requerido para que la sesión sobreviva
  // navegación server-side (RSC no puede refrescar cookies por sí solo).
  await supabase.auth.getClaims();

  return response;
}
```

- [ ] **Step 4: Verificar que no hay errores de tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores en los dos archivos nuevos.

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase/server.ts src/lib/supabase/middleware.ts
git commit -m "feat: cliente Supabase server-side para el dashboard"
```

---

### Task 3: `proxy.ts` — gate optimista de sesión

**Files:**
- Create: `proxy.ts` (raíz del proyecto, junto a `src/` — confirmar con `ls` si el proyecto usa `src/` como raíz de `app/`, en cuyo caso `proxy.ts` va en `src/`)

**Interfaces:**
- Consumes: `updateSession` de `src/lib/supabase/middleware.ts` (Task 2).
- Produces: redirecciones de `/admin/*` → `/login` sin sesión, y `/login` → `/admin` con sesión.

- [ ] **Step 1: Confirmar la raíz correcta del archivo**

```bash
ls src/app > /dev/null && echo "usa src/" || echo "usa raíz"
```

Si `app/` vive bajo `src/`, `proxy.ts` va en `src/proxy.ts`; si no, en la raíz del repo.

- [ ] **Step 2: Crear `proxy.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const hasSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  if (isAdminRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
```

- [ ] **Step 3: Verificar el build**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Prueba manual del gate optimista**

```bash
pnpm dev
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/admin/usuarios
```

Expected: `307` (o `308`) con `redirect_url` apuntando a `/login` (sin sesión todavía no hay páginas reales bajo `/admin`, pero el redirect debe dispararse igual porque el matcher no depende de que la ruta exista).

- [ ] **Step 5: Commit**

```bash
git add proxy.ts   # o src/proxy.ts, según Step 1
git commit -m "feat: proxy de sesión optimista para /admin"
```

---

### Task 4: DAL `requireAdmin()`

**Files:**
- Create: `src/lib/supabase/dal.ts`

**Interfaces:**
- Consumes: `createClient()` de `src/lib/supabase/server.ts` (Task 2).
- Produces: `requireAdmin(): Promise<{ userId: string; email: string }>` — usado por todas las páginas y acciones de `/admin/*` (Tasks 6-12). Redirige a `/login?error=sin-acceso` y no retorna si la cuenta no es admin.

- [ ] **Step 1: Crear `src/lib/supabase/dal.ts`**

```ts
import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('base_role')
    .eq('user_id', user.id)
    .single();

  if (error || profile?.base_role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/login?error=sin-acceso');
  }

  return { userId: user.id, email: user.email ?? '' };
});
```

- [ ] **Step 2: Verificar tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/dal.ts
git commit -m "feat: requireAdmin() como chequeo real de autorización"
```

---

### Task 5: Login (página + Server Action)

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/login/actions.ts`

**Interfaces:**
- Consumes: `createClient()` (Task 2).
- Produces: formulario funcional en `/login` que autentica y redirige a `/admin`, o muestra el error correspondiente.

- [ ] **Step 1: Crear `src/app/login/actions.ts`**

```ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    redirect('/login?error=campos-requeridos');
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect('/login?error=credenciales-invalidas');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('base_role')
    .eq('user_id', data.user.id)
    .single();

  if (profile?.base_role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/login?error=sin-acceso');
  }

  redirect('/admin');
}
```

- [ ] **Step 2: Crear `src/app/login/page.tsx`**

```tsx
import { login } from './actions';

const ERROR_MESSAGES: Record<string, string> = {
  'campos-requeridos': 'Ingresa correo y contraseña.',
  'credenciales-invalidas': 'Correo o contraseña incorrectos.',
  'sin-acceso': 'Esta cuenta no tiene acceso al panel de administración.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-rm-background)] px-4">
      <form
        action={login}
        className="w-full max-w-sm space-y-4 rounded-[var(--radius-rm)] bg-white p-8 shadow-[var(--shadow-rm)]"
      >
        <h1 className="text-2xl font-extrabold text-[var(--color-rm-ink)]">
          Panel de Administración
        </h1>
        {message && <p className="text-sm text-red-600">{message}</p>}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-semibold">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-[var(--radius-rm-input)] border px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-semibold">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-[var(--radius-rm-input)] border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-[var(--radius-rm)] bg-[var(--color-rm-action)] py-2 font-bold text-white"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
```

Nota: revisar los nombres reales de las variables CSS de tokens en `src/app/globals.css` (Tarea previa del repo, `--color-rm-*`/`--radius-rm*`/`--shadow-rm*`) y ajustar los nombres exactos usados arriba si difieren.

- [ ] **Step 3: Prueba manual**

```bash
pnpm dev
```

Abrir `http://localhost:3000/login`, iniciar sesión con una cuenta docente temporal de QA y confirmar la redirección a `/login?error=sin-acceso`. Después usar una cuenta administradora temporal de QA y confirmar la redirección a `/admin` (dará 404 hasta la Task 6). Las credenciales se obtienen por un canal privado y nunca se incluyen en este plan.

- [ ] **Step 4: Commit**

```bash
git add src/app/login
git commit -m "feat: pagina de login del dashboard"
```

---

### Task 6: Layout del dashboard (sidebar) + componentes shadcn base

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/ui/sidebar.tsx`, `src/components/ui/badge.tsx` (vía shadcn CLI)

**Interfaces:**
- Consumes: `requireAdmin()` (Task 4).
- Produces: layout que envuelve las 6 secciones con navegación fija; usado por Tasks 7-12.

- [ ] **Step 1: Instalar componentes shadcn**

```bash
pnpm dlx shadcn@latest add sidebar badge
```

- [ ] **Step 2: Crear `src/app/admin/layout.tsx`**

```tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const SECCIONES = [
  { href: '/admin/verificacion', label: 'Verificación de docentes' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/escuelas', label: 'Escuelas y microcentros' },
  { href: '/admin/moderacion', label: 'Moderación de contenido' },
  { href: '/admin/catalogos', label: 'Catálogos del sistema' },
  { href: '/admin/metricas', label: 'Métricas de adopción' },
] as const;

async function logout() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[var(--color-rm-background)]">
      <aside className="flex w-64 flex-col border-r bg-white p-4">
        <p className="mb-6 truncate text-sm text-[var(--color-rm-ink)]/70">{email}</p>
        <nav className="flex flex-1 flex-col gap-1">
          {SECCIONES.map((seccion) => (
            <Link
              key={seccion.href}
              href={seccion.href}
              className="rounded-[var(--radius-rm)] px-3 py-2 text-sm font-semibold hover:bg-[var(--color-rm-action)]/10"
            >
              {seccion.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button type="submit" className="mt-4 w-full text-left text-sm text-red-600">
            Cerrar sesión
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Crear `src/app/admin/page.tsx`**

```tsx
import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  redirect('/admin/verificacion');
}
```

- [ ] **Step 4: Prueba manual**

```bash
pnpm dev
```

Login como admin, confirmar que `/admin` redirige a `/admin/verificacion` (dará 404 hasta Task 7, esperado) y que la sidebar con las 6 secciones y el correo se renderiza sin errores de consola.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/page.tsx src/components/ui/sidebar.tsx src/components/ui/badge.tsx
git commit -m "feat: layout del dashboard con sidebar de navegacion"
```

---

### Task 7: Sección Verificación de docentes (RF-004)

**Files:**
- Create: `src/app/admin/verificacion/page.tsx`
- Create: `src/app/admin/verificacion/actions.ts`

**Interfaces:**
- Consumes: `requireAdmin()`, `createClient()`.
- Produces: `approveVerification(requestId: string, userId: string)`, `rejectVerification(requestId: string, motivo: string)`.

- [ ] **Step 1: Crear `src/app/admin/verificacion/actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

export async function approveVerification(requestId: string, userId: string) {
  const { userId: adminId } = await requireAdmin();
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { error: requestError } = await supabase
    .from('verification_requests')
    .update({ status: 'aprobada', resolved_by: adminId, resolved_at: now })
    .eq('id', requestId);
  if (requestError) throw requestError;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_verified: true })
    .eq('user_id', userId);
  if (profileError) throw profileError;

  revalidatePath('/admin/verificacion');
}

export async function rejectVerification(requestId: string, motivo: string) {
  if (!motivo.trim()) throw new Error('El rechazo requiere un motivo.');

  const { userId: adminId } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('verification_requests')
    .update({
      status: 'rechazada',
      motivo_rechazo: motivo.trim(),
      resolved_by: adminId,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  if (error) throw error;

  revalidatePath('/admin/verificacion');
}
```

- [ ] **Step 2: Crear `src/app/admin/verificacion/page.tsx`**

```tsx
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { approveVerification, rejectVerification } from './actions';

type PendingRow = {
  id: string;
  user_id: string;
  created_at: string;
  profiles: { nombre: string; apellidos: string; rut: string; schools: { nombre: string } | null } | null;
};

const PENDING_COLUMNS =
  'id, user_id, created_at, profiles!verification_requests_user_id_fkey(nombre, apellidos, rut, schools(nombre))';

export default async function VerificacionPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('verification_requests')
    .select(PENDING_COLUMNS)
    .eq('status', 'pendiente')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const solicitudes = (data as unknown as PendingRow[]) ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Verificación de docentes</h1>
      {solicitudes.length === 0 && <p>No hay solicitudes pendientes.</p>}
      {solicitudes.map((s) => (
        <div key={s.id} className="rounded-[var(--radius-rm)] border bg-white p-4">
          <p className="font-semibold">
            {s.profiles?.nombre} {s.profiles?.apellidos} — {s.profiles?.rut}
          </p>
          <p className="text-sm text-[var(--color-rm-ink)]/70">{s.profiles?.schools?.nombre}</p>
          <div className="mt-2 flex gap-2">
            <form action={approveVerification.bind(null, s.id, s.user_id)}>
              <button type="submit" className="rounded bg-[var(--color-rm-action)] px-3 py-1 text-white">
                Aprobar
              </button>
            </form>
            <form
              action={async (formData: FormData) => {
                'use server';
                await rejectVerification(s.id, String(formData.get('motivo') ?? ''));
              }}
              className="flex gap-2"
            >
              <input name="motivo" placeholder="Motivo del rechazo" className="rounded border px-2" />
              <button type="submit" className="rounded bg-red-600 px-3 py-1 text-white">
                Rechazar
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Prueba manual contra el backend real**

Con `pnpm dev` corriendo y sesión admin activa, si existe una solicitud pendiente real, aprobarla o rechazarla y confirmar con `mcp__supabase__execute_sql` (solo lectura) que `verification_requests.status` cambió. Si no hay ninguna pendiente, dejar constancia en el CHANGELOG (Task 13) de que esta sección se verificó solo por inspección visual (sin datos pendientes en el momento).

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/verificacion
git commit -m "feat: seccion de verificacion de docentes en el dashboard"
```

---

### Task 8: Sección Usuarios (RF-027/030)

**Files:**
- Create: `src/app/admin/usuarios/page.tsx`
- Create: `src/app/admin/usuarios/actions.ts`

**Interfaces:**
- Consumes: `requireAdmin()`, `createClient()`.
- Produces: `updateUserQuota(userId: string, storageQuotaMb: number)`, `toggleUserActive(userId: string, isActive: boolean)`.

- [ ] **Step 1: Crear `src/app/admin/usuarios/actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

export async function updateUserQuota(userId: string, storageQuotaMb: number) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: usedBytes, error: usageError } = await supabase.rpc('my_storage_used_bytes_for', {
    p_user_id: userId,
  });
  if (usageError) throw usageError;

  if (storageQuotaMb * 1024 * 1024 < (usedBytes ?? 0)) {
    throw new Error('La nueva cuota no puede ser menor al espacio ya utilizado por el docente.');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ storage_quota_mb: storageQuotaMb })
    .eq('user_id', userId);
  if (error) throw error;

  revalidatePath('/admin/usuarios');
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from('profiles').update({ is_active: isActive }).eq('user_id', userId);
  if (error) throw error;

  revalidatePath('/admin/usuarios');
}
```

- [ ] **Step 2: Crear `src/app/admin/usuarios/page.tsx`**

```tsx
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { updateUserQuota, toggleUserActive } from './actions';

type AdminUserRow = {
  user_id: string;
  nombre: string;
  apellidos: string;
  email: string;
  school_nombre: string | null;
  is_active: boolean;
  is_verified: boolean;
  storage_quota_mb: number;
};

export default async function UsuariosPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('admin_users_view')
    .select('user_id, nombre, apellidos, email, school_nombre, is_active, is_verified, storage_quota_mb')
    .order('nombre');
  if (error) throw error;

  const usuarios = (data as AdminUserRow[]) ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Usuarios</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nombre</th>
            <th>Correo</th>
            <th>Escuela</th>
            <th>Estado</th>
            <th>Cuota (MB)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.user_id} className="border-b">
              <td className="py-2">
                {u.nombre} {u.apellidos}
              </td>
              <td>{u.email}</td>
              <td>{u.school_nombre}</td>
              <td>{u.is_active ? 'Activo' : 'Deshabilitado'}</td>
              <td>
                <form
                  action={async (formData: FormData) => {
                    'use server';
                    await updateUserQuota(u.user_id, Number(formData.get('cuota')));
                  }}
                  className="flex gap-1"
                >
                  <input name="cuota" type="number" defaultValue={u.storage_quota_mb} className="w-20 rounded border px-1" />
                  <button type="submit" className="rounded bg-[var(--color-rm-action)] px-2 text-white">
                    Guardar
                  </button>
                </form>
              </td>
              <td>
                <form action={toggleUserActive.bind(null, u.user_id, !u.is_active)}>
                  <button type="submit" className="rounded border px-2 py-1">
                    {u.is_active ? 'Deshabilitar' : 'Habilitar'}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Prueba manual contra el backend real**

Repetir la verificación de la Tarea 10 de M6: bajar y luego subir la cuota de una cuenta de prueba, confirmar el mensaje de error al intentar bajarla por debajo del uso real, deshabilitar y rehabilitar una cuenta, y dejar el estado final igual al inicial (misma cuota, misma actividad) — usar `mcp__supabase__execute_sql` para confirmar antes/después.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/usuarios
git commit -m "feat: seccion de gestion de usuarios en el dashboard"
```

---

### Task 9: Sección Escuelas y microcentros (RF-028)

**Files:**
- Create: `src/app/admin/escuelas/page.tsx`
- Create: `src/app/admin/escuelas/actions.ts`

**Interfaces:**
- Consumes: `requireAdmin()`, `createClient()`.
- Produces: `createSchool(nombre: string, region: string, comuna: string)`.

- [ ] **Step 1: Crear `src/app/admin/escuelas/actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

export async function createSchool(nombre: string, region: string, comuna: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from('schools').insert({ nombre, region, comuna });
  if (error?.code === '23505') {
    throw new Error('Ya existe una escuela con ese nombre en la región seleccionada.');
  }
  if (error) throw error;

  revalidatePath('/admin/escuelas');
}
```

- [ ] **Step 2: Crear `src/app/admin/escuelas/page.tsx`**

```tsx
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { createSchool } from './actions';

type SchoolRow = { id: string; nombre: string; region: string; comuna: string; is_active: boolean };

export default async function EscuelasPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('schools')
    .select('id, nombre, region, comuna, is_active')
    .order('is_active', { ascending: false })
    .order('nombre');
  if (error) throw error;

  const escuelas = (data as SchoolRow[]) ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Escuelas y microcentros</h1>
      <form
        action={async (formData: FormData) => {
          'use server';
          await createSchool(
            String(formData.get('nombre')),
            String(formData.get('region')),
            String(formData.get('comuna')),
          );
        }}
        className="flex gap-2"
      >
        <input name="nombre" placeholder="Nombre" required className="rounded border px-2" />
        <input name="region" placeholder="Región" required className="rounded border px-2" />
        <input name="comuna" placeholder="Comuna" required className="rounded border px-2" />
        <button type="submit" className="rounded bg-[var(--color-rm-action)] px-3 text-white">
          Crear
        </button>
      </form>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nombre</th>
            <th>Región</th>
            <th>Comuna</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {escuelas.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="py-2">{e.nombre}</td>
              <td>{e.region}</td>
              <td>{e.comuna}</td>
              <td>{e.is_active ? 'Activa' : 'Desactivada'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Prueba manual contra el backend real**

Crear una escuela de prueba (ej. "Escuela Dashboard Verificación 2026-09-03", región Atacama), confirmar que aparece en la tabla, intentar repetir el mismo nombre+región y confirmar el mensaje de duplicado. Dejar la escuela de prueba documentada en `CHANGELOG.md` (Task 13) si no hay ruta de borrado disponible.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/escuelas
git commit -m "feat: seccion de escuelas en el dashboard"
```

---

### Task 10: Sección Moderación de contenido (RF-029)

**Files:**
- Create: `src/app/admin/moderacion/page.tsx`
- Create: `src/app/admin/moderacion/actions.ts`

**Interfaces:**
- Consumes: `requireAdmin()`, `createClient()`.
- Produces: `resolveReport(reportId: string)`, `hideMaterial(reportId: string, materialId: string)`, `hideMessage(reportId: string, messageId: string)`.

- [ ] **Step 1: Crear `src/app/admin/moderacion/actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

async function markResolved(reportId: string, adminId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('content_reports')
    .update({ status: 'resuelto', resolved_by: adminId, resolved_at: new Date().toISOString() })
    .eq('id', reportId);
  if (error) throw error;
}

export async function resolveReport(reportId: string) {
  const { userId } = await requireAdmin();
  await markResolved(reportId, userId);
  revalidatePath('/admin/moderacion');
}

export async function hideMaterial(reportId: string, materialId: string) {
  const { userId } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from('materials').update({ status: 'oculto' }).eq('id', materialId);
  if (error) throw error;

  await markResolved(reportId, userId);
  revalidatePath('/admin/moderacion');
}

export async function hideMessage(reportId: string, messageId: string) {
  const { userId } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('channel_messages')
    .update({ hidden_at: new Date().toISOString() })
    .eq('id', messageId);
  if (error) throw error;

  await markResolved(reportId, userId);
  revalidatePath('/admin/moderacion');
}
```

- [ ] **Step 2: Crear `src/app/admin/moderacion/page.tsx`**

```tsx
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { resolveReport, hideMaterial, hideMessage } from './actions';

type ReportRow = {
  id: string;
  motivo: string;
  material_id: string | null;
  message_id: string | null;
  reporter: { nombre: string; apellidos: string } | null;
  material: { title: string } | null;
  message: { body: string } | null;
};

const COLUMNS =
  'id, motivo, material_id, message_id, ' +
  'reporter:public_profiles!content_reports_reporter_id_fkey(nombre, apellidos), ' +
  'material:materials(title), ' +
  'message:channel_messages(body)';

export default async function ModeracionPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('content_reports')
    .select(COLUMNS)
    .eq('status', 'pendiente')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const reportes = (data as unknown as ReportRow[]) ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Moderación de contenido</h1>
      {reportes.length === 0 && <p>No hay reportes pendientes.</p>}
      {reportes.map((r) => (
        <div key={r.id} className="rounded-[var(--radius-rm)] border bg-white p-4">
          <p className="text-sm text-[var(--color-rm-ink)]/70">
            Reportado por {r.reporter?.nombre} {r.reporter?.apellidos} — {r.motivo}
          </p>
          <p className="mt-1">{r.material?.title ?? r.message?.body}</p>
          <div className="mt-2 flex gap-2">
            <form action={resolveReport.bind(null, r.id)}>
              <button type="submit" className="rounded border px-3 py-1">
                Descartar reporte
              </button>
            </form>
            {r.material_id && (
              <form action={hideMaterial.bind(null, r.id, r.material_id)}>
                <button type="submit" className="rounded bg-red-600 px-3 py-1 text-white">
                  Ocultar contenido
                </button>
              </form>
            )}
            {r.message_id && (
              <form action={hideMessage.bind(null, r.id, r.message_id)}>
                <button type="submit" className="rounded bg-red-600 px-3 py-1 text-white">
                  Ocultar contenido
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Prueba manual**

Si hay un reporte pendiente real en la base, ejercer "Descartar" u "Ocultar" y confirmar por SQL que `content_reports.status` pasó a `resuelto` y (si aplica) que `materials.status`/`channel_messages.hidden_at` cambiaron. Si no hay ninguno pendiente, documentar en el CHANGELOG que se verificó solo por inspección visual.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/moderacion
git commit -m "feat: seccion de moderacion de contenido en el dashboard"
```

---

### Task 11: Sección Catálogos del sistema (RF-032)

**Files:**
- Create: `src/app/admin/catalogos/page.tsx`
- Create: `src/app/admin/catalogos/actions.ts`
- Create (vía CLI): `src/components/ui/tabs.tsx`

**Interfaces:**
- Consumes: `requireAdmin()`, `createClient()`.
- Produces: `createCategory(nombre: string)`, `createChannel(nombre: string, region: string | null)`, `createEmergencyContact(nombre: string, telefono: string)`.

- [ ] **Step 1: Instalar el componente de tabs**

```bash
pnpm dlx shadcn@latest add tabs
```

- [ ] **Step 2: Crear `src/app/admin/catalogos/actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

const DUPLICATE_MESSAGE = 'Ya existe un elemento con ese nombre.';

export async function createCategory(nombre: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('material_categories').insert({ nombre });
  if (error?.code === '23505') throw new Error(DUPLICATE_MESSAGE);
  if (error) throw error;
  revalidatePath('/admin/catalogos');
}

export async function createChannel(nombre: string, region: string | null) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('channels').insert({ nombre, region });
  if (error?.code === '23505') throw new Error(DUPLICATE_MESSAGE);
  if (error) throw error;
  revalidatePath('/admin/catalogos');
}

export async function createEmergencyContact(nombre: string, telefono: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('emergency_contacts').insert({ nombre, telefono });
  if (error?.code === '23505') throw new Error(DUPLICATE_MESSAGE);
  if (error) throw error;
  revalidatePath('/admin/catalogos');
}
```

- [ ] **Step 3: Crear `src/app/admin/catalogos/page.tsx`**

```tsx
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createCategory, createChannel, createEmergencyContact } from './actions';

export default async function CatalogosPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [categorias, canales, contactos] = await Promise.all([
    supabase.from('material_categories').select('id, nombre').order('nombre'),
    supabase.from('channels').select('id, nombre, region').order('nombre'),
    supabase.from('emergency_contacts').select('id, nombre, telefono').order('orden'),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Catálogos del sistema</h1>
      <Tabs defaultValue="categorias">
        <TabsList>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="canales">Canales</TabsTrigger>
          <TabsTrigger value="contactos">Contactos de emergencia</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias" className="space-y-2">
          <form
            action={async (formData: FormData) => {
              'use server';
              await createCategory(String(formData.get('nombre')));
            }}
            className="flex gap-2"
          >
            <input name="nombre" required className="rounded border px-2" placeholder="Nombre" />
            <button type="submit" className="rounded bg-[var(--color-rm-action)] px-3 text-white">
              Agregar
            </button>
          </form>
          <ul>
            {categorias.data?.map((c) => <li key={c.id}>{c.nombre}</li>)}
          </ul>
        </TabsContent>

        <TabsContent value="canales" className="space-y-2">
          <form
            action={async (formData: FormData) => {
              'use server';
              const region = String(formData.get('region') ?? '').trim();
              await createChannel(String(formData.get('nombre')), region || null);
            }}
            className="flex gap-2"
          >
            <input name="nombre" required className="rounded border px-2" placeholder="Nombre" />
            <input name="region" className="rounded border px-2" placeholder="Región (vacío = global)" />
            <button type="submit" className="rounded bg-[var(--color-rm-action)] px-3 text-white">
              Agregar
            </button>
          </form>
          <ul>
            {canales.data?.map((c) => (
              <li key={c.id}>
                {c.nombre} {c.region ? `(${c.region})` : '(global)'}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="contactos" className="space-y-2">
          <form
            action={async (formData: FormData) => {
              'use server';
              await createEmergencyContact(String(formData.get('nombre')), String(formData.get('telefono')));
            }}
            className="flex gap-2"
          >
            <input name="nombre" required className="rounded border px-2" placeholder="Nombre" />
            <input name="telefono" required className="rounded border px-2" placeholder="Teléfono" />
            <button type="submit" className="rounded bg-[var(--color-rm-action)] px-3 text-white">
              Agregar
            </button>
          </form>
          <ul>
            {contactos.data?.map((c) => (
              <li key={c.id}>
                {c.nombre} — {c.telefono}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 4: Prueba manual contra el backend real**

Crear un elemento de prueba en cada una de las tres pestañas, confirmar que aparece de inmediato en la lista, y repetir el mismo nombre para confirmar el mensaje de duplicado. Como ninguna de las tres tablas tiene política de `delete` self-service (igual que en la app móvil), documentar los tres elementos de prueba dejados en `CHANGELOG.md` (Task 13) si no se pueden limpiar por RLS.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/catalogos src/components/ui/tabs.tsx
git commit -m "feat: seccion de catalogos del sistema en el dashboard"
```

---

### Task 12: Sección Métricas de adopción (RF-031)

**Files:**
- Create: `src/app/admin/metricas/page.tsx`

**Interfaces:**
- Consumes: `requireAdmin()`, `createClient()`, RPC `admin_adoption_metrics(p_region?, p_school_id?)`.
- Produces: ninguna (solo lectura, sin Server Actions propias — coincide con el spec).

- [ ] **Step 1: Crear `src/app/admin/metricas/page.tsx`**

```tsx
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

type MetricsRow = {
  schools_with_activity: number;
  schools_total: number;
  verified_teachers: number;
  teachers_total: number;
  active_mentors: number;
  materials_last_30d: number;
  support_requests_last_30d: number;
  support_requests_last_30d_answered: number;
  mentor_sessions_next_30d: number;
};

export default async function MetricasPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  await requireAdmin();
  const { region } = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc('admin_adoption_metrics', { p_region: region || undefined })
    .single();
  if (error) throw error;

  const m = data as MetricsRow;
  const sinDatos = m.schools_with_activity === 0 && m.verified_teachers === 0 && m.active_mentors === 0;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Métricas de adopción</h1>
      <form className="flex gap-2">
        <input name="region" defaultValue={region} placeholder="Región (opcional)" className="rounded border px-2" />
        <button type="submit" className="rounded bg-[var(--color-rm-action)] px-3 text-white">
          Filtrar
        </button>
      </form>
      {sinDatos ? (
        <p>No hay datos suficientes para el período seleccionado.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Escuelas con actividad" value={`${m.schools_with_activity} / ${m.schools_total}`} />
          <MetricCard label="Docentes verificados" value={`${m.verified_teachers} / ${m.teachers_total}`} />
          <MetricCard label="Mentores activos" value={m.active_mentors} />
          <MetricCard label="Material publicado (30d)" value={m.materials_last_30d} />
          <MetricCard
            label="Consultas de apoyo (30d)"
            value={`${m.support_requests_last_30d_answered} / ${m.support_requests_last_30d}`}
          />
          <MetricCard label="Mentorías agendadas (30d)" value={m.mentor_sessions_next_30d} />
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-rm)] border bg-white p-4">
      <p className="text-sm text-[var(--color-rm-ink)]/70">{label}</p>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  );
}
```

- [ ] **Step 2: Prueba manual**

Sin filtro: confirmar que las tarjetas muestran conteos reales no-cero. Con una región sin datos (ej. Región Metropolitana si no hay actividad ahí): confirmar el mensaje "No hay datos suficientes para el período seleccionado."

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/metricas
git commit -m "feat: seccion de metricas de adopcion en el dashboard"
```

---

### Task 13: CHANGELOG y verificación final end-to-end

**Files:**
- Modify: `docs/CHANGELOG.md`

**Interfaces:** ninguna — tarea de cierre.

- [ ] **Step 1: Recorrido completo con `claude-in-chrome`**

Con `pnpm dev` corriendo: abrir el navegador, hacer login como admin, recorrer las 7 pantallas (verificación, usuarios, escuelas, moderación, catálogos, métricas, y el logout) en ancho desktop y luego con `resize_window` a ~400px. Confirmar con `read_console_messages` (`onlyErrors`) que no hay errores en ninguna pantalla. Cerrar la pestaña al terminar.

- [ ] **Step 2: Confirmar el bloqueo de cuentas no-admin**

Login con la cuenta docente de prueba, confirmar que nunca se llega a ver ninguna pantalla de `/admin/*` y que el mensaje de bloqueo aparece en `/login`.

- [ ] **Step 3: `tsc` y `lint` limpios**

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Expected: sin errores en ambos.

- [ ] **Step 4: Agregar entrada a `docs/CHANGELOG.md`**

Con fecha/hora real del momento, resumen del dashboard agregado, lista de archivos tocados, y cualquier fixture de prueba dejado en la base (escuela/categoría/canal/contacto de prueba de las Tareas 9 y 11) igual que documentó `M6-Administracion-Estado.md` para la app móvil.

- [ ] **Step 5: Commit final**

```bash
git add docs/CHANGELOG.md
git commit -m "docs: registrar el dashboard de administracion en el changelog"
```
