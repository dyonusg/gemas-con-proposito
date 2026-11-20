import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/gemas/Shell";
import { Button } from "@/components/ui/button";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";

export const Route = createFileRoute("/donar/gracias")({
  validateSearch: (s: Record<string, unknown>): { session_id?: string | undefined } => ({ session_id: typeof s["session_id"] === "string" ? s["session_id"] : undefined }),
  head: () => ({
    meta: [
      { title: "¡Gracias por tu donación! · Gemas" },
      { name: "description", content: "Gracias por apoyar Gemas, un proyecto educativo sin fines de lucro." },
      { property: "og:title", content: "¡Gracias por tu donación! · Gemas" },
      { property: "og:description", content: "Tu apoyo ayuda a peques y facilitadores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Shell nav={false}>
      <img src={isotipo.url} alt="" className="mx-auto mt-12 size-24" />
      <h1 className="mt-6 text-center text-3xl font-bold">¡Gracias de corazón!</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Tu donación ayuda a que más peques descubran sus gemas. Recibirás el justificante por correo.</p>
      <Button asChild className="mt-6 w-full"><Link to="/">Volver al inicio de Gemas</Link></Button>
      <p className="mt-3 text-center text-sm text-muted-foreground">¿Aún no tienes cuenta? <Link to="/auth" className="font-bold">Entra o créala</Link></p>
    </Shell>
  ),
});
