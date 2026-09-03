import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('base_role')
    .eq('user_id', user.id)
    .single();

  if (error || profile?.base_role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/login?error=sin-acceso');
  }

  return { userId: user.id, email: user.email ?? '' };
});
