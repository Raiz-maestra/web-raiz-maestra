import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Raíz Maestra — la app para docentes rurales de Chile",
  description:
    "Materiales pedagógicos, mentorías entre pares y una comunidad de colegas para profesores de escuelas rurales. Funciona sin señal.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-rm-bg text-rm-ink">
        {children}
      </body>
    </html>
  );
}
