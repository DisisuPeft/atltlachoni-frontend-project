import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(148,163,184,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.35)_1px,transparent_1px)] [background-size:32px_32px]" />

      <section className="relative w-full max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-sky-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 3v2m0 14v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4.5" />
            <path d="m10.5 10.5 3 3m0-3-3 3" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-9 text-sm font-semibold tracking-[0.24em] text-sky-300">ERROR 404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-6xl">Esta página se perdió en el camino.</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">La dirección no existe, cambió de lugar o ya no está disponible. Puedes volver al inicio o retomar tu trabajo desde el dashboard.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Ir al inicio</Link>
          <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Abrir dashboard</Link>
        </div>
        <p className="mt-10 text-sm text-slate-400">¿Crees que esto es un error? Contacta al equipo de soporte.</p>
      </section>
    </main>
  );
}
