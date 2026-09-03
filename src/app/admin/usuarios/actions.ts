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
