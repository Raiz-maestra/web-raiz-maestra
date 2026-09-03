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
    <div className="flex min-h-screen bg-[var(--color-rm-bg)]">
      <aside className="flex w-64 flex-col border-r bg-white p-4">
        <p className="mb-6 truncate text-sm text-[var(--color-rm-ink)]/70">{email}</p>
        <nav className="flex flex-1 flex-col gap-1">
          {SECCIONES.map((seccion) => (
            <Link
              key={seccion.href}
              href={seccion.href}
              className="rounded-[var(--radius-rm)] px-3 py-2 text-sm font-semibold hover:bg-[var(--color-rm-green)]/10"
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
