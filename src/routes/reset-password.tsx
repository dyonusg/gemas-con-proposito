import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/gemas/Shell";

// Preserve old email links without offering password-based access.
export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Recuperar acceso · Gemas" },
    { name: "description", content: "Vuelve a entrar a Gemas con un código de correo, sin contraseña." },
    { property: "og:title", content: "Recuperar acceso · Gemas" },
    { property: "og:description", content: "Tu cuenta y tu camino siguen guardados: entra con tu correo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: RecuperarAcceso,
});
function RecuperarAcceso() {
  return <Shell nav={false}>
    <h1 className="mt-4 text-[32px] font-bold leading-[38px]">Ya no necesitas contraseña</h1>
    <p className="mt-3 text-sm text-muted-foreground">Tu cuenta sigue siendo la misma. Puedes entrar con un código de un solo uso enviado a tu correo.</p>
    <Button asChild className="mt-6 w-full"><Link to="/auth">Volver a entrar</Link></Button>
  </Shell>;
}
