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
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ponytail: setAll llamado desde un Server Component (no puede
            // escribir cookies); requireAdmin()/proxy.ts ya refrescan la
            // sesión en las rutas que sí pueden, así que se ignora acá.
          }
          // El segundo parámetro (Cache-Control/Expires/Pragma para que un
          // CDN no cachee una respuesta con Set-Cookie de sesión) se ignora
          // a propósito: `next/headers` no expone ninguna API para escribir
          // encabezados de respuesta arbitrarios desde un Server Component o
          // Server Action (`headers()` es de solo lectura — ver
          // node_modules/next/dist/server/request/headers.d.ts, tipo
          // `ReadonlyHeaders`; `cookies()` sólo permite mutar cookies, no
          // headers). Además, `cookies()` ya opta la ruta a renderizado
          // dinámico (node_modules/next/dist/docs/.../functions/cookies.md),
          // por lo que Next no la sirve desde el Full Route Cache. El caso
          // real que sí puede llegar a un CDN es el de `middleware.ts`, que
          // sí tiene una `NextResponse` y reenvía estos headers.
        },
      },
    },
  );
}
