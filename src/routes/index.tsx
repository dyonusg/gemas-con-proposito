import { createFileRoute, Link } from "@tanstack/react-router";
import { useAcceso } from "@/components/gemas/Acceso";
import { useGemas } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/gemas/Shell";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [ { title: "Inicio · Gemas" }, { name: "description", content: "Tu espacio en Gemas, de colaborador a facilitador." }, { property: "og:title", content: "Inicio · Gemas" }, { property: "og:description", content: "Accede a tus lecciones, ideas y camino personal." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: Inicio,
});
function Inicio() {
  const { uid } = useAcceso(); const e = useGemas(); const navigate = useNavigate();
  useEffect(() => { void navigate({ to: uid ? "/perfil" : "/auth", replace: true }); }, [uid, navigate]);
  return <Shell nav={false}><img src={isotipo.url} alt="" className="mx-auto mt-12 size-28" /><h1 className="mt-6 text-center text-3xl font-bold">Gemas</h1><Button asChild className="mt-6 w-full"><Link to={uid ? "/perfil" : "/auth"}>{uid && e.alias ? `Continuar, ${e.alias}` : "Entrar"}</Link></Button></Shell>;
}