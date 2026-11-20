import { createFileRoute, Link } from "@tanstack/react-router";
import { useAcceso } from "@/components/gemas/Acceso";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/gemas-logo.svg.asset.json";
import { Hero, GemQuiz, PathMap, ImpactChain, Stories, NeverAlone, GemCollection, FinalCTA, SupportBlock, CtaFlotante } from "@/components/home/Secciones";

const TITULO = "Gemas · Descubre tus personajes mientras acompañas a los niños";
const DESC = "Para jóvenes de 15 a 25: un camino por niveles, gratis y a tu ritmo, para aprender a acompañar círculos de niños. Nunca vas solo: tienes compañero de camino, mentor y una comunidad.";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [ { title: TITULO }, { name: "description", content: DESC }, { property: "og:title", content: TITULO }, { property: "og:description", content: DESC }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" } ] }),
  component: Inicio,
});

function Inicio() {
  const { uid } = useAcceso();
  const destino = uid ? "/perfil" : "/auth";
  return <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <Link to="/" aria-label="Gemas, inicio"><img src={logo.url} alt="Gemas" className="h-8 w-auto md:h-10" /></Link>
        <nav className="hidden gap-6 text-sm font-bold md:flex"><a href="#camino">Cómo funciona</a><a href="#impacto">Impacto</a><a href="#historias">Historias</a></nav>
        <Button asChild variant="outline" size="sm"><Link to={destino}>{uid ? "Mi espacio" : "Entrar"}<ArrowRight /></Link></Button>
      </div>
    </header>
    <main>
      <Hero destino={destino} />
      <GemQuiz destino={destino} />
      <PathMap />
      <ImpactChain />
      <Stories />
      <NeverAlone />
      <GemCollection />
      <FinalCTA destino={destino} />
      <SupportBlock />
    </main>
    <footer className="border-t border-border px-6 pt-6 pb-24 text-center text-xs leading-relaxed text-muted-foreground md:pb-6">Gemas es un apoyo independiente: acompaña, no sustituye la formación.<br /><a href="https://www.ruhi.org/es/" target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold underline underline-offset-4">Conoce los materiales del Instituto Ruhí <span aria-hidden="true">↗</span></a></footer>
    <CtaFlotante destino={destino} />
  </div>;
}
