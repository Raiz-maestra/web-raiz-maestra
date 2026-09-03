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
    // PostgREST limita a 1000 filas y `schools` ya tiene ~12.000 (Directorio
    // MINEDUC) — ordenar por más reciente primero, no por nombre, para que
    // una escuela recién creada sea siempre visible en esta lista.
    .order('created_at', { ascending: false });
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
        className="flex flex-wrap gap-2 rounded-[var(--radius-rm)] border bg-white p-4"
      >
        <input name="nombre" placeholder="Nombre" required className="rounded border px-2 py-1" />
        <input name="region" placeholder="Región" required className="rounded border px-2 py-1" />
        <input name="comuna" placeholder="Comuna" required className="rounded border px-2 py-1" />
        <button type="submit" className="rounded bg-[var(--color-rm-green)] px-3 py-1 text-white">
          Crear
        </button>
      </form>
      <div className="overflow-x-auto rounded-[var(--radius-rm)] border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 pl-4">Nombre</th>
              <th>Región</th>
              <th>Comuna</th>
              <th className="pr-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {escuelas.map((e) => (
              <tr key={e.id} className="border-b last:border-b-0">
                <td className="py-2 pl-4">{e.nombre}</td>
                <td>{e.region}</td>
                <td>{e.comuna}</td>
                <td className="pr-4">{e.is_active ? 'Activa' : 'Desactivada'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
