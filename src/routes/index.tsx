import { createFileRoute, Link } from "@tanstack/react-router";
import { useAcceso } from "@/components/gemas/Acceso";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import logo from "@/assets/gemas-logo.svg.asset.json";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [ { title: "Gemas · Aprender, acompañar y servir" }, { name: "description", content: "Un camino acompañado para descubrir tus cualidades y ayudar a los niños a cultivar las suyas. De colaborador a facilitador, con alegría y confianza." }, { property: "og:title", content: "Gemas · Aprender, acompañar y servir" }, { property: "og:description", content: "Cada pequeño acto de servicio puede hacer crecer algo grande. Descubre el propósito de Gemas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" } ] }),
  component: Inicio,
});
function Inicio() {
  const { uid } = useAcceso();
  const destino = uid ? "/perfil" : "/auth";
  return <div className="min-h-screen bg-card">
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-5 md:px-8">
      <Link to="/" aria-label="Gemas, inicio"><img src={logo.url} alt="Gemas" className="h-9 w-auto md:h-11" /></Link>
      <Button asChild variant="outline" size="sm"><Link to={destino}>{uid ? "Mi espacio" : "Entrar"}<ArrowRight /></Link></Button>
    </header>
    <main>
      <section className="px-6 pt-8 pb-12 text-center md:pt-12 md:pb-16">
        <div className="mx-auto max-w-2xl">
          <h1><img src={logo.url} alt="Gemas" fetchPriority="high" className="mx-auto w-56 max-w-full md:w-72" /></h1>
          <h2 className="mx-auto mt-7 max-w-xl text-[32px] font-bold leading-[38px] md:text-[40px] md:leading-[46px]">Aprende a acompañar.<br />Crece con los niños.</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">Un espacio para preparar tus clases de niños, descubrir tus cualidades y aprender junto a otros.</p>
          <Button asChild size="lg" className="mt-6"><Link to={destino}>{uid ? "Continuar mi camino" : "Empezar mi camino"}<ArrowRight /></Link></Button>
          <p className="mt-4 text-sm text-muted-foreground">No hace falta tener experiencia. Sí, ganas de aportar.</p>
        </div>
      </section>
      <section className="bg-menta-soft px-6 py-9 md:px-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start gap-4">
            <img src={isotipo.url} alt="" className="size-12 shrink-0" />
            <div className="max-w-2xl"><h2 className="text-2xl font-bold md:text-3xl">Lo que cultivamos juntos</h2>
              <p className="mt-2 text-base leading-relaxed">Amor, generosidad, paciencia… Cada niño tiene mucho que ofrecer. Cuando le ayudas a descubrirlo, tú también aprendes.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-7 border-t border-tinta/15 pt-7 md:grid-cols-3 md:gap-10">
            <div><span className="text-sm font-bold text-muted-foreground">01 / Aprender</span><h3 className="mt-2 text-xl font-bold">Una clase, paso a paso</h3><p className="mt-2 text-sm leading-relaxed">Prepara canciones, historias y actividades. De colaborador a facilitador, a tu ritmo.</p></div>
            <div><span className="text-sm font-bold text-muted-foreground">02 / Descubrir</span><h3 className="mt-2 text-xl font-bold">También se trata de ti</h3><p className="mt-2 text-sm leading-relaxed">Haz espacio para tus reflexiones y reconoce lo que vas aprendiendo al servir.</p></div>
            <div><span className="text-sm font-bold text-muted-foreground">03 / Acompañar</span><h3 className="mt-2 text-xl font-bold">Con gente a tu lado</h3><p className="mt-2 text-sm leading-relaxed">Comparte el camino con un compañero y un mentor: un facilitador con experiencia que te acompaña.</p></div>
          </div>
        </div>
      </section>
      <section className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-6 py-10 md:flex-row md:items-center md:px-8">
        <div><p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Sin ánimo de lucro</p><h2 className="text-2xl font-bold">Gemas lo hacemos entre todos</h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">Tu apoyo ayuda a preparar los próximos campus, conseguir libros y materiales para los niños y seguir mejorando la app.</p></div>
        <Button asChild variant="outline" className="shrink-0"><Link to="/donar"><Heart /> Apoyar Gemas</Link></Button>
      </section>
    </main>
    <footer className="border-t border-border px-6 py-6 text-center text-xs leading-relaxed text-muted-foreground">Gemas es un apoyo independiente: acompaña, no sustituye la formación.<br /><a href="https://www.ruhi.org/es/" target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold underline underline-offset-4">Conoce los materiales del Instituto Ruhí <span aria-hidden="true">↗</span></a></footer>
  </div>;
}