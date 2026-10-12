'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

export async function approveVerification(requestId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.rpc('approve_verification', { p_request_id: requestId });
  if (error) throw error;

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
