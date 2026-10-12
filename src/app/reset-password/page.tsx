import type { Metadata } from 'next';
import { AuthReturn } from '../auth-callback/auth-return';

export const metadata: Metadata = {
  title: 'Nueva contraseña | Raíz Maestra',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function ResetPasswordPage() {
  return <AuthReturn recovery />;
}
