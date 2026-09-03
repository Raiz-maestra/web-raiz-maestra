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
      <div className="overflow-x-auto rounded-[var(--radius-rm)] border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 pl-4">Nombre</th>
              <th>Correo</th>
              <th>Escuela</th>
              <th>Estado</th>
              <th>Cuota (MB)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.user_id} className="border-b last:border-b-0">
                <td className="py-2 pl-4">
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
                    <input
                      name="cuota"
                      type="number"
                      defaultValue={u.storage_quota_mb}
                      className="w-20 rounded border px-1"
                    />
                    <button type="submit" className="rounded bg-[var(--color-rm-green)] px-2 text-white">
                      Guardar
                    </button>
                  </form>
                </td>
                <td className="pr-4">
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
    </div>
  );
}
