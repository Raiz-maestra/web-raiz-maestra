import { login } from './actions';

const ERROR_MESSAGES: Record<string, string> = {
  'campos-requeridos': 'Ingresa correo y contraseña.',
  'credenciales-invalidas': 'Correo o contraseña incorrectos.',
  'sin-acceso': 'Esta cuenta no tiene acceso al panel de administración.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-rm-bg)] px-4">
      <form
        action={login}
        className="w-full max-w-sm space-y-4 rounded-[var(--radius-rm)] bg-white p-8 shadow-[var(--shadow-rm)]"
      >
        <h1 className="text-2xl font-extrabold text-[var(--color-rm-ink)]">
          Panel de Administración
        </h1>
        {message && <p className="text-sm text-red-600">{message}</p>}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-semibold">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-[var(--radius-rm)] border px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-semibold">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-[var(--radius-rm)] border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-[var(--radius-rm)] bg-[var(--color-rm-green)] py-2 font-bold text-white"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
