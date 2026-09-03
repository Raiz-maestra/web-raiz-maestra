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
