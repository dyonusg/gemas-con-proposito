import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, SelectorLeccion } from "@/components/gemas/Shell";
import { useLeccion } from "@/lib/leccion";
import { actualizar, hoy, nuevoId, useGemas } from "@/lib/store";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";

export const Route = createFileRoute("/tarjeta")({
  head: () => ({
    meta: [
      { title: "Tarjeta para las familias · Gemas" },
      { name: "description", content: "Crea la tarjeta de la clase con la virtud, la cita, la canción y una idea para casa." },
      { property: "og:title", content: "Tarjeta para las familias · Gemas" },
      { property: "og:description", content: "Que los niños sigan viviendo la virtud en casa durante la semana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TarjetaPage,
});

function TarjetaPage() {
  const e = useGemas();
  const l = useLeccion(e.leccionActual);
  const L = { virtud: l?.cualidad ?? "", cita: l?.cita ?? "", cancion: l?.cancion_titulo ?? "" };
  const [idea, setIdea] = useState("");
  const [enviada, setEnviada] = useState(false);

  const enviar = () => {
    if (!idea.trim()) return;
    actualizar((s) => ({
      ...s,
      tarjetas: [{ id: nuevoId(), fecha: hoy(), virtud: L.virtud, cita: L.cita, cancion: L.cancion, idea: idea.trim(), estado: "enviada" }, ...s.tarjetas],
    }));
    setIdea("");
    setEnviada(true);
  };

  return (
    <Shell>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Tarjeta para las familias</h1>
      <p className="text-sm text-muted-foreground">La recibe el adulto responsable del campus y la envía a las familias. Tú nunca tienes sus contactos.</p>
      <SelectorLeccion etiqueta="Gema de la tarjeta" />

      <div className="mt-5 overflow-hidden rounded-[20px] bg-card shadow-card">
        <div className="h-2 bg-gema" />
        <div className="p-5">
          <div className="flex items-center gap-2">
            <img src={isotipo.url} alt="" className="size-8" />
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Esta semana en clase</p>
          </div>
          <h2 className="mt-2 text-2xl font-bold">{L.virtud}</h2>
          <p className="mt-2 text-sm italic">{L.cita}</p>
          <p className="mt-2 text-sm"><strong>Canción:</strong> {L.cancion}</p>
          <label htmlFor="idea" className="mt-4 block text-sm font-bold">Una idea sencilla para casa</label>
          <textarea id="idea" value={idea} onChange={(ev) => setIdea(ev.target.value)} rows={3} placeholder="Ej.: preparad juntos un pequeño regalo para alguien del barrio." className="mt-2 w-full rounded-xl border-2 border-input bg-background p-3 text-sm outline-none focus:border-coral" />
        </div>
      </div>
      {enviada && <p className="mt-3 rounded-2xl bg-menta-soft p-3 text-sm font-bold">¡Enviada al responsable del campus! Llegará a las familias.</p>}
      <Button size="lg" className="mt-4 w-full" onClick={enviar} disabled={!idea.trim()}><Send /> Enviar al responsable</Button>

      <Seccion titulo="Tarjetas enviadas">
        {e.tarjetas.length === 0 ? (
          <p className="rounded-[20px] border-2 border-dashed border-border p-4 text-sm text-muted-foreground">Todavía no has enviado ninguna.</p>
        ) : (
          <ul className="space-y-2">
            {e.tarjetas.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-[20px] bg-card p-4 shadow-card">
                <span><strong>{t.virtud}</strong><span className="block text-xs text-muted-foreground">{t.fecha}</span></span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${t.estado === "reenviada" ? "bg-menta" : "bg-sol-soft"}`}>
                  {t.estado === "reenviada" ? "Ya en las familias" : "En el responsable"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Seccion>
    </Shell>
  );
}
