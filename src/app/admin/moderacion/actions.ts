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
