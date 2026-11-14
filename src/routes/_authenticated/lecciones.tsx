import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Shell, Seccion, SelectorLeccion } from "@/components/gemas/Shell";
import { PASOS } from "@/lib/contenido";
import { useLeccion } from "@/lib/leccion";
import { useGemas } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/lecciones")({
  head: () => ({
    meta: [
      { title: "Lecciones · Gemas" },
      { name: "description", content: "Consulta los pasos de cada lección: materiales, cita, virtud, canción, historia, dinámica y manualidad." },
      { property: "og:title", content: "Lecciones · Gemas" },
      { property: "og:description", content: "Consulta el contenido de cada paso de la lección." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lecciones,
});

function Lecciones() {
  const e = useGemas();
  const leccion = useLeccion(e.leccionActual);

  return (
    <Shell>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Lecciones</h1>
      <p className="text-sm text-muted-foreground">
        Tú ya recorriste el camino. Aquí consultas los pasos de cada lección para preparar la clase o ensayar con quien acompañas.
      </p>

      <SelectorLeccion etiqueta="Lección a consultar" />
      {leccion && <p className="mt-1 text-xs text-muted-foreground">Gema: {leccion.color_gema}</p>}

      <Seccion titulo="Los pasos de esta lección">
        <ul className="space-y-2">
          {PASOS.map((p, i) => (
            <li key={p.id}>
              <Link
                to="/preparar/$paso"
                params={{ paso: p.id }}
                className="flex items-center gap-4 rounded-[20px] bg-card p-3 pr-4 shadow-card"
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-bold ${p.color}`}>{i + 1}</span>
                <span className="flex-1">
                  <span className="block font-bold">{p.titulo}</span>
                  <span className="text-xs text-muted-foreground">{p.descripcion}</span>
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </Seccion>
    </Shell>
  );
}
