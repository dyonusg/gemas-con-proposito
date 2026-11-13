import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, Destello } from "@/components/gemas/Shell";
import { actualizar, useGemas, type Encuesta } from "@/lib/store";

export const Route = createFileRoute("/cierre")({
  head: () => ({
    meta: [
      { title: "Al terminar el campus · Gemas" },
      { name: "description", content: "Cuéntanos cómo te has sentido y recibe tu invitación para seguir sirviendo." },
      { property: "og:title", content: "Al terminar el campus · Gemas" },
      { property: "og:description", content: "Tu siguiente paso después del campus de invierno." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cierre,
});

const PREGUNTAS: { key: keyof Omit<Encuesta, "comentario">; texto: string; opciones: string[] }[] = [
  { key: "sentimiento", texto: "¿Cómo te has sentido sirviendo?", opciones: ["Muy bien", "Bien", "Regular", "Mal"] },
  { key: "acompanado", texto: "¿Has servido solo o acompañado?", opciones: ["Con mi compañero de camino", "Con mi mentor", "Bastante solo"] },
  { key: "seguir", texto: "¿Quieres seguir sirviendo durante el curso?", opciones: ["Sí, con mi compañero de camino", "Sí", "No lo sé", "Ahora no"] },
];

function Cierre() {
  const e = useGemas();
  const [r, setR] = useState<Encuesta>({ sentimiento: "", acompanado: "", seguir: "", comentario: "" });
  const completa = r.sentimiento && r.acompanado && r.seguir;
  const quiereSeguir = e.encuesta?.seguir.startsWith("Sí");

  return (
    <Shell>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Al terminar el campus</h1>
      <p className="text-sm text-muted-foreground">Tu servicio no tiene por qué acabar aquí.</p>

      {e.encuesta ? (
        <>
          <div className="mt-5 rounded-[20px] bg-tinta p-5 text-nube shadow-card">
            <Destello className="size-8" />
            {quiereSeguir ? (
              <>
                <h2 className="mt-2 text-2xl font-bold">Te va a escribir tu coordinador</h2>
                <p className="mt-1 text-sm text-nube/80">
                  El responsable del campus avisará al coordinador de tu zona. Te invitará en persona a servir en una clase cerca de casa{e.encuesta.seguir.includes("compañero") ? `, junto a ${e.pareja} si es posible` : ""}.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-2xl font-bold">Gracias por servir</h2>
                <p className="mt-1 text-sm text-nube/80">Cuando quieras volver, la puerta está abierta.</p>
              </>
            )}
          </div>
          <a href="https://www.bahai.es/contacto/" target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-between rounded-[20px] border-2 border-border bg-card p-4 text-sm font-bold">
            ¿Prefieres escribirnos tú? Contacta aquí <ExternalLink className="size-4" />
          </a>
        </>
      ) : (
        <Seccion titulo="Encuesta corta">
          <div className="space-y-5 rounded-[20px] bg-card p-5 shadow-card">
            {PREGUNTAS.map((p) => (
              <fieldset key={p.key}>
                <legend className="mb-2 font-bold">{p.texto}</legend>
                <div className="flex flex-wrap gap-2">
                  {p.opciones.map((o) => (
                    <button key={o} type="button" onClick={() => setR({ ...r, [p.key]: o })} className={`rounded-full border-2 px-4 py-2 text-sm font-bold ${r[p.key] === o ? "border-coral bg-coral-soft" : "border-border"}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
            <textarea value={r.comentario} onChange={(ev) => setR({ ...r, comentario: ev.target.value })} rows={2} placeholder="¿Algo más? (opcional)" className="w-full rounded-xl border-2 border-input bg-background p-3 text-sm outline-none focus:border-coral" />
            <Button size="lg" className="w-full" disabled={!completa} onClick={() => actualizar((s) => ({ ...s, encuesta: r }))}>Enviar</Button>
          </div>
        </Seccion>
      )}
    </Shell>
  );
}
