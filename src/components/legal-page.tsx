import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-rm-border">
        <div className="mx-auto flex h-20 max-w-[1160px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/icon.png" alt="" width={44} height={44} className="rounded-xl" />
            <span className="text-xl font-black">Raíz Maestra</span>
          </Link>
          <Link
            href="/"
            className="text-[15px] font-bold text-rm-ink-muted hover:text-rm-ink"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-16 md:px-8">
        <span className="text-sm font-extrabold uppercase tracking-[0.06em] text-rm-green-dark">
          Última actualización: {updated}
        </span>
        <h1 className="mt-3 text-[32px] font-black leading-[38px] text-pretty md:text-[40px] md:leading-[48px]">
          {title}
        </h1>
        <div className="legal-prose mt-10 flex flex-col gap-8">{children}</div>
      </main>

      <footer className="border-t border-rm-border">
        <div className="mx-auto flex max-w-[1160px] flex-col items-start gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="" width={28} height={28} className="rounded-lg" />
            <span className="text-sm text-rm-ink-secondary">© 2026 Raíz Maestra</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacidad" className="text-sm font-bold text-rm-ink-secondary hover:text-rm-ink">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-sm font-bold text-rm-ink-secondary hover:text-rm-ink">
              Términos
            </Link>
            <a
              href="mailto:appraizmaestra@gmail.com"
              className="text-sm font-bold text-rm-ink-secondary hover:text-rm-ink"
            >
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-extrabold leading-7">{title}</h2>
      <div className="flex flex-col gap-3 leading-7 text-rm-ink-secondary text-pretty">
        {children}
      </div>
    </section>
  );
}
