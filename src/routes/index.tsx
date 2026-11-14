import { createFileRoute, Link } from "@tanstack/react-router";
import { useAcceso } from "@/components/gemas/Acceso";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, Heart, HeartHandshake, Sprout } from "lucide-react";
import logo from "@/assets/gemas-logo.svg.asset.json";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [ { title: "Gemas · Aprender, acompañar y servir" }, { name: "description", content: "Un camino acompañado para descubrir tus cualidades y ayudar a los niños a cultivar las suyas. De colaborador a facilitador, con alegría y confianza." }, { property: "og:title", content: "Gemas · Aprender, acompañar y servir" }, { property: "og:description", content: "Cada pequeño acto de servicio puede hacer crecer algo grande. Descubre el propósito de Gemas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" } ] }),
  component: Inicio,
});
function Inicio() {
  const { uid } = useAcceso();
  const destino = uid ? "/perfil" : "/auth";
  return <div className="min-h-screen bg-background">
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 md:px-8">
      <Link to="/" aria-label="Gemas, inicio"><img src={logo.url} alt="Gemas" className="h-9 w-auto md:h-11" /></Link>
      <Button asChild variant="outline" size="sm"><Link to={destino}>{uid ? "Mi espacio" : "Entrar"}<ArrowRight /></Link></Button>
    </header>
    <main>
      <section className="bg-menta-soft">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-10 md:px-8 md:py-14">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase"><Heart className="size-4 text-coral" /> Pequeños pasos, grandes semillas</p>
            <h1 className="mt-4 text-5xl font-bold md:text-6xl">Gemas</h1>
            <h2 className="mt-3 max-w-xl text-[26px] font-bold leading-tight md:text-4xl">Lo mejor de ti puede hacer crecer lo mejor de otros.</h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed">Acompañamos a quienes quieren servir en las clases de niños, cultivando cualidades como el amor, la generosidad y la paciencia.</p>
            <Button asChild size="lg" className="mt-6"><Link to={destino}>{uid ? "Continuar mi camino" : "Quiero formar parte"}<ArrowRight /></Link></Button>
            <p className="mt-3 text-sm font-bold">No necesitas saberlo todo para dar el primer paso.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-xl text-center">
          <img src={isotipo.url} alt="" className="mx-auto size-12" />
          <h2 className="mt-4 text-3xl font-bold">Todos llevamos gemas dentro</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">Cada niño tiene cualidades valiosas por descubrir. Al ayudarle a cultivarlas, tú también creces: ganas confianza, encuentras propósito y contribuyes a tu comunidad.</p>
        </div>
        <div className="mt-9 grid gap-8 md:grid-cols-3 md:gap-10">
          <div><Sprout className="size-8 text-menta" /><h3 className="mt-3 text-xl font-bold">Aprende a tu ritmo</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">De colaborador a facilitador, un paso cada vez. Una canción, una historia, una primera clase: cada experiencia cuenta.</p></div>
          <div><Gem className="size-8 text-lavanda" /><h3 className="mt-3 text-xl font-bold">Descubre tus propias gemas</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">El servicio también te transforma. Reconoce las cualidades que viven en ti y los pequeños momentos que hacen que todo tenga sentido.</p></div>
          <div><HeartHandshake className="size-8 text-coral" /><h3 className="mt-3 text-xl font-bold">Camina en compañía</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Con un compañero de camino y el apoyo de un mentor, un facilitador con experiencia que te acompaña. Nadie tiene que hacerlo solo.</p></div>
        </div>
      </section>
      <section className="bg-sol-soft px-6 py-10 text-center md:py-12">
        <div className="mx-auto max-w-xl"><h2 className="text-3xl font-bold">Tus ganas de aportar ya son un comienzo</h2><p className="mt-3 leading-relaxed">Vengas de donde vengas, aquí hay un lugar para ti. Para dar tus primeros pasos o para acompañar a quien empieza.</p><Button asChild className="mt-6"><Link to={destino}>{uid ? "Ir a mi espacio" : "Empezar con Gemas"}<ArrowRight /></Link></Button></div>
      </section>
      <section className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-6 py-10 md:flex-row md:items-center md:px-8">
        <div><h2 className="text-2xl font-bold">Un proyecto que crece con tu apoyo</h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">Gemas es un proyecto educativo sin ánimo de lucro. Tu donación ayuda a los próximos campus, a los libros y materiales para los niños y a seguir mejorando la app.</p></div>
        <Button asChild variant="outline" className="shrink-0"><Link to="/donar"><Heart /> Apoyar Gemas</Link></Button>
      </section>
    </main>
    <footer className="border-t border-border px-6 py-6 text-center text-xs leading-relaxed text-muted-foreground">Gemas es un apoyo independiente: acompaña, no sustituye la formación.<br /><a href="https://www.ruhi.org/es/" target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold underline underline-offset-4">Conoce los materiales del Instituto Ruhí <span aria-hidden="true">↗</span></a></footer>
  </div>;
}