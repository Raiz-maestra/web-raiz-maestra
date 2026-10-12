'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { readAuthReturn, validatePassword } from './auth-link';

const buttonClass = 'rounded-[var(--radius-rm)] bg-rm-green px-5 py-3 font-extrabold text-white hover:bg-rm-green-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rm-green disabled:opacity-50';
const inputClass = 'w-full rounded-[var(--radius-rm)] border border-rm-border bg-rm-surface px-4 py-3 focus-visible:outline-2 focus-visible:outline-rm-green';

export function AuthReturn({ recovery: initialRecovery }: { recovery: boolean }) {
  const initialized = useRef(false);
  const client = useRef<SupabaseClient | null>(null);
  const nativeUrl = useRef('raizmaestra://auth-callback');
  const [recovery, setRecovery] = useState(initialRecovery);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'saving' | 'done'>('loading');
  const [message, setMessage] = useState('Estamos comprobando tu enlace…');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const link = readAuthReturn(window.location.href);
    // Se conserva el enlace solo en memoria para abrir la app sin dejar tokens en el historial.
    nativeUrl.current = link.nativeUrl;
    window.history.replaceState(null, '', window.location.pathname);
    setRecovery(link.recovery || initialRecovery);

    async function consume() {
      if (link.invalid) {
        setStatus('error');
        setMessage('El enlace venció, ya fue utilizado o está incompleto. Solicita uno nuevo desde la app.');
        return;
      }
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        setStatus('error');
        setMessage('No podemos completar este proceso en la web por ahora. Continúa en la app o escríbenos para recibir ayuda.');
        return;
      }
      try {
        const supabase = createBrowserClient(url, key, { isSingleton: false, auth: { detectSessionInUrl: false, persistSession: false, autoRefreshToken: false } });
        client.current = supabase;
        const { data, error } = link.code
          ? await supabase.auth.exchangeCodeForSession(link.code)
          : await supabase.auth.setSession({ access_token: link.accessToken!, refresh_token: link.refreshToken! });
        if (error || !data.session) throw new Error('invalid-session');
        const params = new URLSearchParams({ access_token: data.session.access_token, refresh_token: data.session.refresh_token, type: link.recovery ? 'recovery' : 'signup' });
        nativeUrl.current = `raizmaestra://${link.recovery ? 'reset-password' : 'auth-callback'}#${params}`;
        setStatus('ready');
        setMessage(link.recovery || initialRecovery ? 'Elige tu nueva contraseña para volver a entrar a Raíz Maestra.' : 'Tu correo está confirmado. Ya puedes continuar en Raíz Maestra.');
      } catch {
        setStatus('error');
        setMessage(link.code ? 'Este enlace debe completarse en el dispositivo donde lo solicitaste. Abre la app; si el enlace venció, solicita uno nuevo.' : 'No pudimos validar el enlace. Solicita uno nuevo desde la app o vuelve a intentarlo con conexión a internet.');
      }
    }
    void consume();
  }, [initialRecovery]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validatePassword(password, confirmation);
    if (validation) {
      setMessage(validation);
      return;
    }
    if (!client.current || status !== 'ready') return;
    setStatus('saving');
    try {
      const { error } = await client.current.auth.updateUser({ password });
      if (error) {
        setStatus('ready');
        setMessage(error.code === 'same_password' ? 'Elige una contraseña distinta a la anterior.' : 'No pudimos guardar la contraseña. Revisa los requisitos y vuelve a intentarlo; si el enlace venció, solicita uno nuevo.');
        return;
      }
      setPassword('');
      setConfirmation('');
      nativeUrl.current = 'raizmaestra://auth-callback';
      await client.current.auth.signOut({ scope: 'local' });
      client.current = null;
      setStatus('done');
      setMessage('Tu contraseña se actualizó. Abre la app e inicia sesión con tu nueva contraseña.');
    } catch {
      setStatus('ready');
      setMessage('No pudimos conectar. Revisa tu conexión y vuelve a intentarlo.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rm-bg px-5 py-12 text-rm-ink">
      <section className="w-full max-w-md rounded-[var(--radius-rm)] border border-rm-border bg-rm-surface p-7 shadow-[var(--shadow-rm)] sm:p-9">
        <Link href="/" className="font-extrabold text-rm-green-dark">Raíz Maestra</Link>
        <h1 className="mt-5 text-3xl font-black">{recovery ? 'Nueva contraseña' : 'Confirma tu correo'}</h1>
        <p role="status" aria-live="polite" className="mt-4 leading-7 text-rm-ink-muted">{message}</p>
        {recovery && (status === 'ready' || status === 'saving') && (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="new-password" className="block font-bold">Nueva contraseña</label>
              <input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} disabled={status === 'saving'} className={inputClass} aria-describedby="password-help" />
              <p id="password-help" className="text-sm text-rm-ink-muted">Al menos 8 caracteres, una mayúscula y un número.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block font-bold">Repite la contraseña</label>
              <input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={status === 'saving'} className={inputClass} />
            </div>
            <button type="submit" disabled={status === 'saving'} className={`${buttonClass} w-full`}>{status === 'saving' ? 'Guardando…' : 'Guardar contraseña'}</button>
          </form>
        )}
        {status !== 'loading' && (
          <button type="button" onClick={() => { window.location.href = nativeUrl.current; }} disabled={status === 'saving'} className={`${buttonClass} mt-6 w-full`}>Abrir Raíz Maestra</button>
        )}
        <p className="mt-4 text-sm leading-6 text-rm-ink-muted">Si la app no se abre, ábrela desde tu dispositivo. Para recibir ayuda, escribe a <a href="mailto:appraizmaestra@gmail.com" className="font-bold text-rm-green-dark underline">appraizmaestra@gmail.com</a>.</p>
      </section>
    </main>
  );
}
