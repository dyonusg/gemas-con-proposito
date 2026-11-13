import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Volume2, ExternalLink, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, Destello } from "@/components/gemas/Shell";
import { PASOS, LECCION, PREGUNTAS_REFLEXION, type PasoId } from "@/lib/contenido";
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
  const [reflexion, setReflexion] = useState("");
  const [pregunta] = useState(PREGUNTAS_REFLEXION[PASOS.indexOf(paso) % PREGUNTAS_REFLEXION.length]);
  const [guardada, setGuardada] = useState(false);

  const guardarReflexion = () => {
    if (!reflexion.trim()) return;
    actualizar((s) => ({ ...s, reflexiones: [{ id: nuevoId(), fecha: hoy(), texto: reflexion.trim(), pregunta }, ...s.reflexiones] }));
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

      <div className="mt-5 rounded-[20px] bg-lavanda-soft p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-lavanda">Antes de la clase · Mis gemas</p>
        <p className="mt-1 font-display text-lg font-semibold">{pregunta}</p>
        {guardada ? (
          <p className="mt-2 flex items-center gap-2 text-sm font-bold"><Check className="size-4 text-menta" /> Guardada en Mis gemas</p>
        ) : (
          <>
            <textarea value={reflexion} onChange={(ev) => setReflexion(ev.target.value)} rows={3} placeholder="Escribe con calma, solo lo ves tú." className="mt-3 w-full rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-lavanda" />
            <Button variant="tinta" size="sm" className="mt-2" onClick={guardarReflexion} disabled={!reflexion.trim()}>Guardar reflexión</Button>
          </>
        )}
      </div>

      <Ensayo id={paso.id} />

      <a href={LECCION.ruhi} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-between rounded-[20px] border-2 border-border bg-card p-4 text-sm font-bold">
        Material oficial de la lección en ruhi.org <ExternalLink className="size-4" />
      </a>
      <p className="mt-2 text-xs text-muted-foreground">Los textos de esta pantalla son de ejemplo. Usa siempre el material oficial.</p>

      <div className="mt-7 rounded-[20px] bg-card p-5 text-center shadow-card">
        {registro?.dirigido ? (
          <>
            <Destello className="mx-auto size-8 animate-pop" />
            <p className="mt-2 font-display text-xl font-bold">¡Lo has dirigido!</p>
            <p className="text-sm text-muted-foreground">{registro.confirmado ? "Tu maestro lo ha confirmado." : "Tu maestro lo confirmará pronto."}</p>
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

function Ensayo({ id }: { id: PasoId }) {
  if (id === "cancion")
    return (
      <Seccion titulo="Ensaya la canción" extra={<Button variant="soft" size="sm" onClick={() => escuchar(LECCION.cancion.letra.join(" "))}><Volume2 /> Escuchar</Button>}>
        <div className="rounded-[20px] bg-menta-soft p-5 font-display text-xl font-semibold leading-relaxed">
          {LECCION.cancion.letra.map((l) => <p key={l}>{l}</p>)}
        </div>
      </Seccion>
    );
  if (id === "cita") return <PracticaCita />;
  if (id === "historia" || id === "media" || id === "clase")
    return (
      <>
        <Seccion titulo="La historia" extra={<Button variant="soft" size="sm" onClick={() => escuchar(LECCION.historia.resumen)}><Volume2 /> Escuchar</Button>}>
          <p className="rounded-[20px] bg-coral-soft p-5">{LECCION.historia.resumen}</p>
        </Seccion>
        <Seccion titulo="Pautas para contarla">
          <Pautas items={LECCION.historia.pautas} />
        </Seccion>
        {id !== "historia" && (
          <Seccion titulo="Orden de la clase">
            <Pautas items={["Bienvenida y oración", "Canción", "Cita para memorizar", "Historia", "Juego", "Dibujo y despedida"]} />
          </Seccion>
        )}
      </>
    );
  return (
    <Seccion titulo={`Juego: ${LECCION.juego.nombre}`}>
      <Pautas items={LECCION.juego.pautas} />
    </Seccion>
  );
}

function Pautas({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((t, i) => (
        <li key={t} className="flex gap-3 rounded-2xl bg-card p-3 text-sm shadow-card">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sol font-bold">{i + 1}</span>
          {t}
        </li>
      ))}
    </ol>
  );
}

function PracticaCita() {
  const palabras = LECCION.cita.split(" ");
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
    <Seccion titulo="Memoriza la cita" extra={<Button variant="soft" size="sm" onClick={() => escuchar(LECCION.cita)}><Volume2 /> Escuchar</Button>}>
      <div className="rounded-[20px] bg-sol-soft p-5">
        <p className="flex flex-wrap gap-x-1.5 gap-y-2 font-display text-xl font-semibold">
          {palabras.map((w, i) => (
            <button key={i} onClick={() => toggle(i)} className={`rounded-lg px-1 ${ocultas.has(i) ? "bg-tinta/15 text-transparent" : ""}`}>
              {w}
            </button>
          ))}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Toca palabras para esconderlas y dila de memoria.</p>
        <Button variant="tinta" size="sm" className="mt-3" onClick={ocultarTodo}>
          {ocultas.size ? <><Eye /> Mostrar todo</> : <><EyeOff /> Esconder todo</>}
        </Button>
      </div>
    </Seccion>
  );
}
