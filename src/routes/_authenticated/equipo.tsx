import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/equipo")({
  head: () => ({ meta: [{ title: "Equipo del campus · Gemas" }, { name: "description", content: "Accede al acompañamiento autorizado de Gemas." }, { property: "og:title", content: "Equipo del campus · Gemas" }, { property: "og:description", content: "Vista de acompañamiento del campus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  beforeLoad: () => { throw redirect({ to: "/mentor", replace: true }); },
});