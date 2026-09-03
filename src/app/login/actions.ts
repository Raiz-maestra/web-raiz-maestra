'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    redirect('/login?error=campos-requeridos');
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect('/login?error=credenciales-invalidas');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('base_role')
    .eq('user_id', data.user.id)
    .single();

  if (profile?.base_role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/login?error=sin-acceso');
  }

  redirect('/admin');
}
