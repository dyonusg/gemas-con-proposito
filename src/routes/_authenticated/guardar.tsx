import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/gemas/Shell";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_authenticated/guardar")({
  head: () => ({ meta: [{ title: "Mi cuenta · Gemas" }, { name: "description", content: "Gestiona tu perfil personal y tu vínculo con el mentor." }, { property: "og:title", content: "Mi cuenta · Gemas" }, { property: "og:description", content: "Tu perfil y tus datos guardados en tu cuenta de Gemas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <Shell><h1 className="mt-5 text-3xl font-bold">Mi cuenta</h1><Button asChild className="mt-5 w-full"><Link to="/perfil">Editar mi perfil</Link></Button></Shell>,
});