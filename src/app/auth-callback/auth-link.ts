export function readAuthReturn(url: string) {
  const parsed = new URL(url);
  const params = new URLSearchParams(parsed.search);
  for (const [key, value] of new URLSearchParams(parsed.hash.slice(1))) params.set(key, value);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const code = params.get('code');
  const recovery = parsed.pathname === '/reset-password' || params.get('type') === 'recovery';
  const invalid = params.has('error') || params.has('error_code') || (!code && !(accessToken && refreshToken));
  const nativeParams = new URLSearchParams();
  if (!invalid) {
    if (code) nativeParams.set('code', code);
    if (accessToken && refreshToken) {
      nativeParams.set('access_token', accessToken);
      nativeParams.set('refresh_token', refreshToken);
    }
    nativeParams.set('type', recovery ? 'recovery' : 'signup');
  }
  return { accessToken, refreshToken, code, recovery, invalid, nativeUrl: `raizmaestra://${recovery ? 'reset-password' : 'auth-callback'}${nativeParams.size ? `#${nativeParams}` : ''}` };
}

export function validatePassword(password: string, confirmation: string) {
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Usa al menos 8 caracteres, una mayúscula y un número.';
  }
  if (password !== confirmation) return 'Las contraseñas no coinciden.';
  return null;
}
