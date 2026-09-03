'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

export async function createSchool(nombre: string, region: string, comuna: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from('schools').insert({ nombre, region, comuna });
  if (error?.code === '23505') {
    throw new Error('Ya existe una escuela con ese nombre en la región seleccionada.');
  }
  if (error) throw error;

  revalidatePath('/admin/escuelas');
}
