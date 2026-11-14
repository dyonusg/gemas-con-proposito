import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Volume2, ExternalLink, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, Destello } from "@/components/gemas/Shell";
import { PASOS, RUHI, PREGUNTAS_REFLEXION, type PasoId } from "@/lib/contenido";
import { useLeccion, type Leccion } from "@/lib/leccion";
import { enPasos, suavizar } from "@/lib/camino";
import { actualizar, hoy, nuevoId, useGemas } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/preparar/$paso")({
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
    actualizar((s) => ({ ...s, reflexiones: [{ id: nuevoId(), fecha: hoy(), leccion: e.leccionActual, texto: reflexion.trim(), pregunta: e.tipo === "mentor" ? "¿Qué observas en los niños? ¿Qué ideas te surgen para la clase?" : pregunta, compartir: "solo_yo" }, ...s.reflexiones] }));
    setReflexion("");
    setGuardada(true);
  };

  const marcar = () =>
    actualizar((s) => ({ ...s, pasos: { ...s.pasos, [paso.id]: { dirigido: true, fecha: hoy() } } }));

  const esMentor = e.tipo === "mentor";
  const volverA = esMentor ? "/lecciones" : "/camino";

  return (
    <Shell>
      <Link to={volverA} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground">
        <ArrowLeft className="size-4" /> {esMentor ? "Lecciones" : "Mi camino"}
      </Link>
      <Timeline actual={paso.id} pasos={e.pasos} />
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">{paso.titulo}</h1>
      <p className="text-sm text-muted-foreground">{paso.descripcion}</p>
      {leccion && <p className="mt-1 text-xs font-bold text-muted-foreground">Lección {leccion.numero} · {leccion.cualidad} · {leccion.color_gema}</p>}

      <div className="mt-5 rounded-[20px] bg-lavanda-soft p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-lavanda">{esMentor ? "Mis observaciones e ideas" : "Antes de la clase · Mis gemas"}</p>
        <p className="mt-1 font-display text-lg font-semibold">{esMentor ? "¿Qué observas en los niños? ¿Qué ideas te surgen para la clase?" : pregunta}</p>
        {guardada ? (
          <p className="mt-2 flex items-center gap-2 text-sm font-bold"><Check className="size-4 text-menta" /> Guardada en <Link to="/reflexiones" className="underline">Mis reflexiones</Link></p>
        ) : (
          <>
            <textarea value={reflexion} onChange={(ev) => setReflexion(ev.target.value)} rows={3} placeholder="Escribe con calma, solo lo ves tú." className="mt-3 w-full rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-lavanda" />
            {esMentor && <p className="mt-1 text-xs text-muted-foreground">Sin nombres ni datos personales de los niños, por favor.</p>}
            <Button variant="tinta" size="sm" className="mt-2" onClick={guardarReflexion} disabled={!reflexion.trim()}>Guardar reflexión</Button>
          </>
        )}
      </div>

      {leccion ? <Ensayo id={paso.id} l={leccion} /> : <p className="mt-6 text-sm text-muted-foreground">Cargando la lección…</p>}

      <a href={leccion?.historia_url ?? RUHI} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-between rounded-[20px] border-2 border-border bg-card p-4 text-sm font-bold">
        Material oficial de la lección en ruhi.org <ExternalLink className="size-4" />
      </a>
      <p className="mt-2 text-xs text-muted-foreground">La historia completa está en el material oficial; aquí solo tienes el resumen.</p>

      {!esMentor && (
      <div className="mt-7 rounded-[20px] bg-card p-5 text-center shadow-card">
        {registro?.dirigido ? (
          <>
            <Destello className="mx-auto size-8 animate-pop" />
            <p className="mt-2 font-display text-xl font-bold">{paso.id === "materiales" ? "¡Materiales listos!" : "¡Lo has dirigido!"}</p>
            <p className="text-sm text-muted-foreground">{registro.confirmado ? "Tu mentor lo ha confirmado." : "Tu mentor lo confirmará pronto."}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild variant="menta"><Link to="/gemas">Anotar un momento con los niños</Link></Button>
              <Button asChild variant="soft"><Link to="/tarjeta">Crear la tarjeta para las familias</Link></Button>
            </div>
          </>
        ) : (
          <>
            <p className="font-display text-xl font-bold">{paso.id === "materiales" ? "¿Ya tienes los materiales?" : "¿Ya lo has dirigido en clase?"}</p>
            <Button size="lg" className="mt-3 w-full" onClick={marcar}>{paso.id === "materiales" ? "Sí, los tengo listos" : "Sí, lo he dirigido"}</Button>
          </>
        )}
      </div>
      )}
      <SiguienteAnterior actual={paso.id} volverA={volverA} esMentor={esMentor} />
    </Shell>
  );
}

function Ensayo({ id, l }: { id: PasoId; l: Leccion }) {
  if (id === "materiales")
    return (
      <>
        <Seccion titulo="Para la dinámica">
          <Checklist texto={l.dinamica_materiales} vacio="Esta dinámica no necesita materiales." />
        </Seccion>
        <Seccion titulo="Para la manualidad">
          <Checklist texto={l.manualidad_materiales} vacio="Esta manualidad no necesita materiales." />
        </Seccion>
        <Seccion titulo="Antes de la clase">
          <Pautas items={["Reúne los materiales unos días antes y guárdalos en una bolsa.", "Prepara un ejemplo terminado de la manualidad para enseñarlo.", "Cuenta los niños que vendrán y prepara material de sobra."]} />
        </Seccion>
      </>
    );
  if (id === "cita") return <PracticaCita cita={l.cita ?? ""} autor={l.cita_autor} fuente={l.cita_fuente} url={l.cita_url} />;
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
          {l.historia_autor && <p className="mt-3 text-sm"><span className="font-bold">Autor y obra:</span> {l.historia_autor}</p>}
          {l.historia_url && (
            <a href={l.historia_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-bold underline">
              Leer la historia completa en la fuente original <ExternalLink className="size-4" />
            </a>
          )}
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

function Checklist({ texto, vacio }: { texto: string | null; vacio: string }) {
  const items = (texto ?? "")
    .split(/[,;]/)
    .map((t) => suavizar(t.trim().replace(/\.$/, "")))
    .filter(Boolean);
  const [marcados, setMarcados] = useState<Set<number>>(new Set());
  if (!items.length) return <p className="rounded-[20px] bg-sol-soft p-4 text-sm">{vacio}</p>;
  const toggle = (i: number) =>
    setMarcados((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <div>
      <ul className="space-y-2">
        {items.map((t, i) => {
          const hecho = marcados.has(i);
          return (
            <li key={i}>
              <button onClick={() => toggle(i)} aria-pressed={hecho} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left text-sm shadow-card transition-colors ${hecho ? "bg-menta-soft" : "bg-card"}`}>
                <span className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${hecho ? "border-menta bg-menta text-primary-foreground" : "border-border bg-card"}`}>
                  {hecho && <Check className="size-4" strokeWidth={3} />}
                </span>
                <span className={hecho ? "text-muted-foreground line-through" : ""}>{t}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">{marcados.size}/{items.length} listos · toca cada material cuando lo tengas</p>
    </div>
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

function PracticaCita({ cita, autor, fuente, url }: { cita: string; autor: string | null; fuente: string | null; url: string | null }) {
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
        {autor && <p className="mt-3 font-bold">— {autor}</p>}
        {fuente && <p className="mt-1 text-xs text-muted-foreground">{fuente}</p>}
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-bold underline">
            Ver la cita en su fuente original <ExternalLink className="size-4" />
          </a>
        )}
        <p className="mt-3 text-xs text-muted-foreground">Toca palabras para esconderlas y dila de memoria.</p>
        <Button variant="tinta" size="sm" className="mt-3" onClick={ocultarTodo}>
          {ocultas.size ? <><Eye /> Mostrar todo</> : <><EyeOff /> Esconder todo</>}
        </Button>
      </div>
    </Seccion>
  );
}

function Timeline({ actual, pasos }: { actual: PasoId; pasos: Record<string, { dirigido?: boolean } | undefined> }) {
  return (
    <nav aria-label="Pasos del camino" className="sticky top-0 z-10 -mx-4 mt-3 bg-background/95 px-4 py-2 backdrop-blur">
      <ol className="flex items-start justify-between gap-1">
        {PASOS.map((p, i) => {
          const activo = p.id === actual;
          const hecho = pasos[p.id]?.dirigido;
          return (
            <li key={p.id} className="relative flex flex-1 flex-col items-center">
              {i > 0 && <span className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${hecho ? "bg-menta" : "bg-border"}`} />}
              <Link to="/preparar/$paso" params={{ paso: p.id }} aria-current={activo ? "step" : undefined} className="relative z-10 flex flex-col items-center gap-1">
                <span className={`flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold ${activo ? "border-coral bg-coral text-primary-foreground" : hecho ? "border-menta bg-menta text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                  {hecho && !activo ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={`text-center text-[10px] leading-tight ${activo ? "font-bold text-foreground" : "text-muted-foreground"}`}>{p.corto}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SiguienteAnterior({ actual, volverA, esMentor }: { actual: PasoId; volverA: string; esMentor: boolean }) {
  const i = PASOS.findIndex((p) => p.id === actual);
  const ant = PASOS[i - 1];
  const sig = PASOS[i + 1];
  return (
    <div className="mt-5 flex gap-2">
      {ant ? (
        <Button asChild variant="soft" className="flex-1"><Link to="/preparar/$paso" params={{ paso: ant.id }}><ArrowLeft className="size-4" /> {ant.corto}</Link></Button>
      ) : <span className="flex-1" />}
      {sig ? (
        <Button asChild variant="menta" className="flex-1"><Link to="/preparar/$paso" params={{ paso: sig.id }}>{sig.corto} <ArrowRight className="size-4" /></Link></Button>
      ) : (
        <Button asChild variant="menta" className="flex-1"><Link to={volverA}>{esMentor ? "Volver a Lecciones" : "Volver a Mi camino"}</Link></Button>
      )}
    </div>
  );
}
