import type { Metadata } from 'next';
import { AuthReturn } from './auth-return';

export const metadata: Metadata = {
  title: 'Confirmar correo | Raíz Maestra',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function AuthCallbackPage() {
  return <AuthReturn recovery={false} />;
}
