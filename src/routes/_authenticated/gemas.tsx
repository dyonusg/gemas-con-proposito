import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, SelectorLeccion } from "@/components/gemas/Shell";
import { actualizar, hoy, nuevoId, useGemas, type Nota } from "@/lib/store";
import { guardarNota, mostrarFecha } from "@/lib/reflexiones";
import { useLecciones } from "@/lib/leccion";

export const Route = createFileRoute("/_authenticated/gemas")({
  head: () => ({
    meta: [
      { title: "Mis gemas · Gemas" },
      { name: "description", content: "Tus reflexiones y los momentos en que los peques vivieron la virtud." },
      { property: "og:title", content: "Mis gemas · Gemas" },
      { property: "og:description", content: "Recuerda por qué sirves: tus reflexiones y el efecto en los peques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MisGemas,
});

function MisGemas() {
  const e = useGemas();
  const [momento, setMomento] = useState("");
  const guardar = () => {
    if (!momento.trim()) return;
    actualizar((s) => ({ ...s, momentos: guardarNota(s.momentos, { id: nuevoId(), fecha: new Date().toISOString(), texto: momento.trim(), leccion: s.leccionActual, compartir: "solo_yo" }) }));
    setMomento("");
  };

  return (
    <Shell>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Mis gemas</h1>
      <p className="text-sm text-muted-foreground">Vuelve aquí cuando quieras recordar por qué haces esto.</p>
      <SelectorLeccion />

      <div className="mt-5 rounded-[20px] bg-menta-soft p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-tinta/70">Después del grupo · Efecto en los peques</p>
        <p className="mt-1 font-display text-lg font-semibold">¿En qué momento un peque vivió la virtud hoy?</p>
        <textarea value={momento} onChange={(ev) => setMomento(ev.target.value)} rows={3} placeholder="Ej.: una peque compartió sus colores sin que nadie se lo pidiera." className="mt-3 w-full rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-menta" />
        <p className="mt-1 text-xs text-muted-foreground">Sin nombres de peques, por favor.</p>
        <Button variant="tinta" size="sm" className="mt-3" onClick={guardar} disabled={!momento.trim()}>Guardar momento</Button>
      </div>

      <Seccion titulo="Momentos con los peques" extra={<Button asChild variant="link" size="sm"><Link to="/reflexiones">Ver y editar</Link></Button>}>
        <Lista items={e.momentos} vacio="Aún no has anotado ningún momento." tono="border-menta" />
      </Seccion>
      <Seccion titulo="Mis reflexiones" extra={<Link to="/reflexiones" className="text-sm font-bold text-lavanda">Ver y editar</Link>}>
        <Lista items={e.reflexiones.slice(0, 3)} vacio="Escribe tu primera reflexión sobre una lección." tono="border-lavanda" />
        <Link to="/reflexiones" className="mt-3 block rounded-full bg-lavanda-soft py-3 text-center text-sm font-bold">Mis reflexiones por lección ({e.reflexiones.length})</Link>
      </Seccion>
    </Shell>
  );
}

function Lista({ items, vacio, tono }: { items: Nota[]; vacio: string; tono: string }) {
  const lecciones = useLecciones();
  if (!items.length) return <p className="rounded-[20px] border-2 border-dashed border-border p-4 text-sm text-muted-foreground">{vacio}</p>;
  return (
    <ul className="space-y-2">
      {items.map((n) => (
        <li key={n.id} className={`rounded-[20px] border-l-4 bg-card p-4 shadow-card ${tono}`}>
          <p className="text-xs font-bold text-muted-foreground">{lecciones.find(l => l.numero === n.leccion)?.cualidad ?? "Virtud sin indicar"}</p>
          {n.pregunta && <p className="text-xs font-bold text-muted-foreground">{n.pregunta}</p>}
          <p className="mt-0.5">{n.texto}</p>
          <p className="mt-1 text-xs text-muted-foreground">{mostrarFecha(n.fecha)}</p>
        </li>
      ))}
    </ul>
  );
}
