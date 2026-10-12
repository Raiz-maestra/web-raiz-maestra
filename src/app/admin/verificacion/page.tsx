import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { approveVerification, rejectVerification } from './actions';

type PendingRow = {
  id: string;
  user_id: string;
  created_at: string;
  profiles: { nombre: string; apellidos: string; schools: { nombre: string } | null } | null;
};

const PENDING_COLUMNS =
  'id, user_id, created_at, profiles!verification_requests_user_id_fkey(nombre, apellidos, schools(nombre))';

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
            {s.profiles?.nombre} {s.profiles?.apellidos}
          </p>
          <p className="text-sm text-[var(--color-rm-ink)]/70">{s.profiles?.schools?.nombre}</p>
          <div className="mt-2 flex gap-2">
            <form action={approveVerification.bind(null, s.id)}>
              <button type="submit" className="rounded bg-[var(--color-rm-green)] px-3 py-1 text-white">
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
