import Image from "next/image";
import {
  BadgeCheck,
  BookOpen,
  Heart,
  MapPin,
  MessageCircle,
  Quote,
  Users,
} from "lucide-react";

const modules = [
  {
    icon: BookOpen,
    bg: "bg-rm-green-50",
    color: "text-rm-green-dark",
    title: "Recursos pedagógicos",
    text: "Guías, planificaciones y material listo para imprimir, ordenado por nivel y asignatura. Publica lo tuyo y descarga lo de otros para usarlo sin conexión.",
  },
  {
    icon: Users,
    bg: "bg-rm-blush",
    color: "text-rm-orange",
    title: "Mentorías 1 a 1",
    text: "Reserva una sesión con una docente que ya pasó por lo que estás enfrentando: aula multigrado, primer año en zona rural, evaluación docente.",
  },
  {
    icon: MessageCircle,
    bg: "bg-rm-mint",
    color: "text-rm-blue",
    title: "Comunidad",
    text: "Un foro donde preguntar sin vergüenza. Menciona a un colega con @, sigue los hilos que te importan y no pierdas ninguna respuesta.",
  },
  {
    icon: MapPin,
    bg: "bg-rm-peach",
    color: "text-rm-mustard",
    title: "Red de apoyo",
    text: "Encuentra a los docentes de tu comuna y tu región. Saber que hay otra profesora a 40 kilómetros cambia la semana.",
  },
  {
    icon: Heart,
    bg: "bg-rm-green-50",
    color: "text-rm-green-dark",
    title: "Autocuidado",
    text: "Registra cómo te sientes cada día y mira tu tendencia. Es tuyo y de nadie más: ni la dirección ni el equipo de la app pueden verlo.",
  },
  {
    icon: BadgeCheck,
    bg: "bg-rm-sand",
    color: "text-rm-ink-muted",
    title: "Perfil docente verificado",
    text: "Regístrate con tu establecimiento del directorio oficial MINEDUC (más de 12.000 escuelas). Así sabes que hablas con colegas de verdad.",
  },
];

const steps = [
  {
    title: "Crea tu cuenta con tu escuela",
    text: "Elige región, comuna y establecimiento. Toma dos minutos.",
  },
  {
    title: "Descarga lo que usarás sin señal",
    text: "Materiales, mensajes y tu registro de ánimo quedan guardados en el teléfono.",
  },
  {
    title: "Pregunta, comparte, reserva",
    text: "Todo lo que hagas offline se envía solo cuando vuelve la conexión.",
  },
];

const btn =
  "inline-flex h-13 items-center justify-center whitespace-nowrap rounded-rm px-6 text-[15px] font-extrabold transition-colors";
const btnPrimary = `${btn} bg-rm-green text-white hover:bg-rm-green-dark`;
const btnOutline = `${btn} border-[1.5px] border-rm-ink text-rm-ink hover:bg-rm-sand`;

export default function Home() {
  return (
    <>
      <header className="border-b border-rm-border">
        <div className="mx-auto flex h-20 max-w-[1160px] items-center justify-between px-5 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <Image src="/icon.png" alt="" width={44} height={44} className="rounded-xl" priority />
            <span className="text-xl font-black">Raíz Maestra</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#modulos" className="text-[15px] font-bold text-rm-ink-muted hover:text-rm-ink">Módulos</a>
            <a href="#como" className="text-[15px] font-bold text-rm-ink-muted hover:text-rm-ink">Cómo funciona</a>
            <a href="#comunidad" className="text-[15px] font-bold text-rm-ink-muted hover:text-rm-ink">Comunidad</a>
            <a href="#descargar" className={`${btnPrimary} h-11 px-5`}>Descargar la app</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1160px] gap-12 px-5 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-20">
          <div className="flex flex-col gap-6">
            <span className="text-sm font-extrabold uppercase tracking-[0.06em] text-rm-green-dark">
              Para docentes de escuelas rurales de Chile
            </span>
            <h1 className="text-[40px] font-black leading-[46px] text-pretty md:text-[56px] md:leading-[62px]">
              Enseñar lejos no significa enseñar sola.
            </h1>
            <p className="max-w-[520px] text-xl leading-[30px] text-rm-ink-secondary text-pretty">
              Raíz Maestra reúne materiales pedagógicos, mentorías entre pares y una comunidad de colegas que entienden lo que es hacer clases en un aula multigrado a tres horas de la ciudad.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <a href="#descargar" className={btnPrimary}>Descargar la app</a>
              <a href="#modulos" className={btnOutline}>Ver qué incluye</a>
            </div>
            <p className="text-sm text-rm-ink-secondary">
              Gratis para docentes. Funciona sin señal y sincroniza cuando vuelve la conexión.
            </p>
          </div>
          <Image
            src="/mascot.webp"
            alt="Mascota de Raíz Maestra saludando en un valle rural"
            width={764}
            height={764}
            sizes="(min-width: 768px) 560px, 100vw"
            className="mx-auto w-full max-w-[420px] mix-blend-multiply"
            priority
          />
        </section>

        <section id="modulos" className="mx-auto max-w-[1160px] px-5 py-16 md:px-8">
          <div className="mb-10 flex max-w-[640px] flex-col gap-3">
            <span className="text-sm font-extrabold uppercase tracking-[0.06em] text-rm-green-dark">
              Seis módulos, una sola app
            </span>
            <h2 className="text-3xl font-black leading-[38px] text-pretty md:text-[40px] md:leading-[48px]">
              Lo que necesitas para la clase de mañana y para la carrera de los próximos diez años.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ icon: Icon, bg, color, title, text }) => (
              <article
                key={title}
                className="flex flex-col gap-4 rounded-rm border border-rm-border bg-rm-surface p-7 shadow-rm"
              >
                <div className={`flex size-12 items-center justify-center rounded-[14px] ${bg}`}>
                  <Icon className={`size-6 ${color}`} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-extrabold leading-7">{title}</h3>
                <p className="leading-6 text-rm-ink-secondary text-pretty">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="como" className="border-y border-rm-border bg-rm-surface">
          <div className="mx-auto max-w-[1160px] px-5 py-16 md:px-8 md:py-18">
            <div className="mb-10 flex max-w-[560px] flex-col gap-3">
              <span className="text-sm font-extrabold uppercase tracking-[0.06em] text-rm-green-dark">
                Cómo funciona
              </span>
              <h2 className="text-3xl font-black leading-[38px] md:text-[40px] md:leading-[48px]">
                Tres pasos y estás dentro.
              </h2>
            </div>
            <ol className="grid gap-6 md:grid-cols-3">
              {steps.map(({ title, text }, i) => (
                <li key={title} className="flex flex-col gap-3">
                  <span className="text-5xl font-black leading-[52px] text-rm-green-soft">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl font-extrabold leading-7">{title}</h3>
                  <p className="leading-6 text-rm-ink-secondary text-pretty">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="comunidad" className="mx-auto max-w-[1160px] px-5 py-16 md:px-8 md:py-18">
          <figure className="mx-auto flex max-w-[860px] flex-col gap-6 rounded-rm border border-rm-border bg-rm-surface p-8 shadow-rm md:p-12">
            <Quote className="size-8 fill-rm-green-soft text-rm-green-soft" />
            <blockquote className="text-xl font-semibold leading-8 md:text-2xl md:leading-[34px] text-pretty">
              {/* TODO: reemplazar por un testimonio real de una docente del piloto */}
              [CITA DE UNA DOCENTE PILOTO]
            </blockquote>
            <figcaption className="flex items-center gap-3.5">
              <div className="size-12 rounded-full bg-rm-green-50" />
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold">[NOMBRE]</span>
                <span className="text-sm text-rm-ink-secondary">[Escuela], [Comuna]</span>
              </div>
            </figcaption>
          </figure>
        </section>

        <section id="descargar" className="mx-auto max-w-[1160px] px-5 pb-16 md:px-8 md:pb-18">
          <div className="flex flex-col items-start gap-5 rounded-[28px] bg-rm-ink p-8 md:p-12 lg:px-12 lg:py-14">
            <h2 className="max-w-[640px] text-3xl font-black leading-[38px] text-white text-pretty md:text-[40px] md:leading-[48px]">
              Hay más de 3.000 escuelas rurales en Chile. Ninguna debería sentirse una isla.
            </h2>
            <p className="max-w-[560px] text-lg leading-7 text-rm-green-soft">
              Descarga Raíz Maestra en tu teléfono y entra con tu escuela hoy.
            </p>
            <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
              {/* TODO: links reales a las tiendas */}
              <a href="#" className={btnPrimary}>App Store</a>
              <a href="#" className={btnPrimary}>Google Play</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rm-border">
        <div className="mx-auto flex max-w-[1160px] flex-col items-start gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="" width={28} height={28} className="rounded-lg" />
            <span className="text-sm text-rm-ink-secondary">© 2026 Raíz Maestra</span>
          </div>
          <div className="flex gap-6">
            <a href="/privacidad" className="text-sm font-bold text-rm-ink-secondary hover:text-rm-ink">Privacidad</a>
            <a href="/terminos" className="text-sm font-bold text-rm-ink-secondary hover:text-rm-ink">Términos</a>
            <a href="mailto:appraizmaestra@gmail.com" className="text-sm font-bold text-rm-ink-secondary hover:text-rm-ink">Contacto</a>
          </div>
        </div>
      </footer>
    </>
  );
}
