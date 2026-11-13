import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Volume2, ExternalLink, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, Destello } from "@/components/gemas/Shell";
import { PASOS, RUHI, PREGUNTAS_REFLEXION, type PasoId } from "@/lib/contenido";
import { useLeccion, type Leccion } from "@/lib/leccion";
import { enPasos, suavizar } from "@/lib/camino";
import { actualizar, hoy, nuevoId, useGemas } from "@/lib/store";

export const Route = createFileRoute("/preparar/$paso")({
  loader: ({ params }) => {
    const paso = PASOS.find((p) => p.id === params.paso);
    if (!paso) throw notFound();
    return { paso };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.paso.titulo} · Gemas` : "Preparar · Gemas" },
      { name: "description", content: "Prepara y ensaya el paso que te toca dirigir." },
      { property: "og:title", content: loaderData ? `${loaderData.paso.titulo} · Gemas` : "Preparar · Gemas" },
      { property: "og:description", content: "Ensaya la canción, la cita o la historia antes de la clase." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Preparar,
});

function escuchar(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "es-ES";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function Preparar() {
  const { paso } = Route.useLoaderData();
  const e = useGemas();
  const registro = e.pasos[paso.id];
  const leccion = useLeccion(e.leccionActual);
  const [reflexion, setReflexion] = useState("");
  const [pregunta] = useState(PREGUNTAS_REFLEXION[Math.max(0, PASOS.findIndex((p) => p.id === paso.id)) % PREGUNTAS_REFLEXION.length]);
  const [guardada, setGuardada] = useState(false);

  const guardarReflexion = () => {
    if (!reflexion.trim()) return;
    actualizar((s) => ({ ...s, reflexiones: [{ id: nuevoId(), fecha: hoy(), texto: reflexion.trim(), pregunta, compartir: "solo_yo" }, ...s.reflexiones] }));
    setReflexion("");
    setGuardada(true);
  };

  const marcar = () =>
    actualizar((s) => ({ ...s, pasos: { ...s.pasos, [paso.id]: { dirigido: true, fecha: hoy() } } }));

  return (
    <Shell>
      <Link to="/camino" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground">
        <ArrowLeft className="size-4" /> Mi camino
      </Link>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">{paso.titulo}</h1>
      <p className="text-sm text-muted-foreground">{paso.descripcion}</p>
      {leccion && <p className="mt-1 text-xs font-bold text-muted-foreground">Lección {leccion.numero} · {leccion.cualidad} · {leccion.color_gema}</p>}

      <div className="mt-5 rounded-[20px] bg-lavanda-soft p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-lavanda">Antes de la clase · Mis gemas</p>
        <p className="mt-1 font-display text-lg font-semibold">{pregunta}</p>
        {guardada ? (
          <p className="mt-2 flex items-center gap-2 text-sm font-bold"><Check className="size-4 text-menta" /> Guardada en <Link to="/reflexiones" className="underline">Mis reflexiones</Link></p>
        ) : (
          <>
            <textarea value={reflexion} onChange={(ev) => setReflexion(ev.target.value)} rows={3} placeholder="Escribe con calma, solo lo ves tú." className="mt-3 w-full rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-lavanda" />
            <Button variant="tinta" size="sm" className="mt-2" onClick={guardarReflexion} disabled={!reflexion.trim()}>Guardar reflexión</Button>
          </>
        )}
      </div>

      {leccion ? <Ensayo id={paso.id} l={leccion} /> : <p className="mt-6 text-sm text-muted-foreground">Cargando la lección…</p>}

      <a href={leccion?.historia_url ?? RUHI} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-between rounded-[20px] border-2 border-border bg-card p-4 text-sm font-bold">
        Material oficial de la lección en ruhi.org <ExternalLink className="size-4" />
      </a>
      <p className="mt-2 text-xs text-muted-foreground">La historia completa está en el material oficial; aquí solo tienes el resumen.</p>

      <div className="mt-7 rounded-[20px] bg-card p-5 text-center shadow-card">
        {registro?.dirigido ? (
          <>
            <Destello className="mx-auto size-8 animate-pop" />
            <p className="mt-2 font-display text-xl font-bold">¡Lo has dirigido!</p>
            <p className="text-sm text-muted-foreground">{registro.confirmado ? "Tu mentor lo ha confirmado." : "Tu mentor lo confirmará pronto."}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild variant="menta"><Link to="/gemas">Anotar un momento con los niños</Link></Button>
              <Button asChild variant="soft"><Link to="/tarjeta">Crear la tarjeta para las familias</Link></Button>
            </div>
          </>
        ) : (
          <>
            <p className="font-display text-xl font-bold">¿Ya lo has dirigido en clase?</p>
            <Button size="lg" className="mt-3 w-full" onClick={marcar}>Sí, lo he dirigido</Button>
          </>
        )}
      </div>
    </Shell>
  );
}

function Ensayo({ id, l }: { id: PasoId; l: Leccion }) {
  if (id === "cita") return <PracticaCita cita={l.cita ?? ""} fuente={l.cita_fuente} />;
  if (id === "virtud")
    return (
      <Seccion titulo={`La virtud: ${l.cualidad}`} extra={<Escuchar texto={l.explicacion_virtud} />}>
        <p className="rounded-[20px] bg-lavanda-soft p-5">{l.explicacion_virtud}</p>
      </Seccion>
    );
  if (id === "cancion")
    return (
      <Seccion titulo="Ensaya la canción">
        <div className="rounded-[20px] bg-menta-soft p-5">
          <p className="font-display text-xl font-semibold">{l.cancion_titulo}</p>
          {l.cancion_url && (
            <a href={l.cancion_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold underline">
              Escúchala y aprende la letra <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </Seccion>
    );
  if (id === "historia")
    return (
      <>
        <Seccion titulo="La historia" extra={<Escuchar texto={l.historia_resumen} />}>
          <p className="rounded-[20px] bg-coral-soft p-5">{l.historia_resumen}</p>
          {l.historia_donde && <p className="mt-2 text-xs text-muted-foreground">Dónde está: {l.historia_donde.replace(/\s*\(abrir\)/, "")}</p>}
        </Seccion>
        <Seccion titulo="Pautas para contarla">
          <Pautas items={["Léela entera dos veces en casa y cuéntala en voz alta una vez.", "No hace falta memorizarla: cuéntala con tus palabras.", "Mira a los niños a los ojos y haz pausas en los momentos clave.", "Si te quedas en blanco, respira y vuelve al resumen."]} />
        </Seccion>
      </>
    );
  if (id === "dinamica") {
    const d = enPasos(l.dinamica);
    return (
      <Seccion titulo={d.titulo ? `Dinámica: ${d.titulo}` : "La dinámica"}>
        <Pautas items={d.pasos} />
      </Seccion>
    );
  }
  const m = enPasos(l.manualidad_pasos);
  return (
    <>
      {l.manualidad_materiales && (
        <Seccion titulo="Materiales">
          <p className="rounded-[20px] bg-menta-soft p-4 text-sm">{suavizar(l.manualidad_materiales)}</p>
        </Seccion>
      )}
      <Seccion titulo="La manualidad paso a paso">
        <Pautas items={m.pasos} />
      </Seccion>
    </>
  );
}

function Escuchar({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return <Button variant="soft" size="sm" onClick={() => escuchar(texto)}><Volume2 /> Escuchar</Button>;
}

function Pautas({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 rounded-2xl bg-card p-3 text-sm shadow-card">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sol font-bold">{i + 1}</span>
          {t}
        </li>
      ))}
    </ol>
  );
}

function PracticaCita({ cita, fuente }: { cita: string; fuente: string | null }) {
  const palabras = cita.split(" ");
  const [ocultas, setOcultas] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOcultas((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  const ocultarTodo = () => setOcultas(ocultas.size ? new Set() : new Set(palabras.map((_, i) => i)));
  return (
    <Seccion titulo="Memoriza la cita de inspiración" extra={<Button variant="soft" size="sm" onClick={() => escuchar(cita)}><Volume2 /> Escuchar</Button>}>
      <div className="rounded-[20px] bg-sol-soft p-5">
        <p className="flex flex-wrap gap-x-1.5 gap-y-2 font-display text-xl font-semibold">
          {palabras.map((w, i) => (
            <button key={i} onClick={() => toggle(i)} className={`rounded-lg px-1 ${ocultas.has(i) ? "bg-tinta/15 text-transparent" : ""}`}>
              {w}
            </button>
          ))}
        </p>
        {fuente && <p className="mt-2 text-xs text-muted-foreground">{fuente}</p>}
        <p className="mt-3 text-xs text-muted-foreground">Toca palabras para esconderlas y dila de memoria.</p>
        <Button variant="tinta" size="sm" className="mt-3" onClick={ocultarTodo}>
          {ocultas.size ? <><Eye /> Mostrar todo</> : <><EyeOff /> Esconder todo</>}
        </Button>
      </div>
    </Seccion>
  );
}
