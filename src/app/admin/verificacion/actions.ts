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
