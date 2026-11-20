import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Share2, RotateCcw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Gema } from "./Gema";
import { Reveal, useVisible } from "./Reveal";
import { GEMAS, QUIZ, NIVELES, CIFRAS, CIFRAS_SON_EJEMPLO, HISTORIAS, COMPANIA, gemaPorId, nombreGema } from "@/lib/home-contenido";
import { toast } from "sonner";

export function Hero({ destino }: { destino: string }) {
  return (
    <section id="hero" className="relative bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pt-8 pb-12 md:grid-cols-2 md:px-8 md:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-bold shadow-card">🎮 Un camino por niveles</span>
          <h1 className="mt-5 text-[40px] font-bold leading-[1.05] md:text-6xl">Lo mejor de ti puede hacer crecer lo mejor de otros.</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed md:text-lg">Gemas es un juego por niveles para aprender a dar clases a niños. Cada lección es una misión con pasos cortos: preparas, practicas, la das y subes de nivel. Por el camino desbloqueas personajes y descubres tus propias cualidades.</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-14 px-7 text-base shadow-pop"><Link to={destino}>Empieza tu camino<ArrowRight /></Link></Button>
            <a href="#camino" className="text-sm font-bold underline underline-offset-4">¿Cómo funciona?</a>
          </div>
          <p className="mt-3 text-sm font-bold text-muted-foreground">Gratis · A tu ritmo · Nunca solo</p>
        </div>
        <div className="mx-auto w-full max-w-[340px] rounded-[2rem] border border-border bg-card p-6 shadow-card md:max-w-[400px]">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Así se juega</p>
          <ol className="mt-4 space-y-3">
            {NIVELES.map((n, i) => (
              <li key={n.nombre} className={`flex items-center gap-3 rounded-2xl p-2.5 ${i === 0 ? "bg-menta-soft" : "bg-background"}`}>
                <Gema color={n.color} apagada={i > 1} className="size-10 shrink-0" />
                <div className="min-w-0 flex-1"><p className="text-sm font-bold">Nivel {i + 1} · {n.nombre}</p><p className="truncate text-xs text-muted-foreground">{n.texto}</p></div>
                {i === 0 && <span className="rounded-full bg-menta px-2 py-0.5 text-[10px] font-bold">Empiezas aquí</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function tarjetaStories(nombre: string, frase: string): Promise<Blob | null> {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1920;
  const x = c.getContext("2d"); if (!x) return Promise.resolve(null);
  const css = getComputedStyle(document.documentElement);
  const v = (n: string) => css.getPropertyValue(n).trim();
  const g = x.createLinearGradient(0, 0, 1080, 1920);
  g.addColorStop(0, v("--menta")); g.addColorStop(0.45, v("--sol")); g.addColorStop(0.75, v("--coral")); g.addColorStop(1, v("--lavanda"));
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1920);
  x.fillStyle = v("--nube"); x.beginPath(); x.roundRect(90, 520, 900, 880, 60); x.fill();
  x.fillStyle = v("--tinta"); x.textAlign = "center";
  x.font = "bold 56px 'Nunito', sans-serif"; x.fillText("Mi personaje inicial es", 540, 700);
  x.font = "bold 110px 'Baloo 2', sans-serif"; x.fillText(nombre, 540, 860);
  x.font = "48px 'Nunito', sans-serif";
  const palabras = frase.split(" "); let linea = ""; let y = 1010;
  for (const p of palabras) { if (x.measureText(linea + p).width > 760) { x.fillText(linea, 540, y); linea = ""; y += 66; } linea += p + " "; }
  x.fillText(linea, 540, y);
  x.font = "bold 52px 'Baloo 2', sans-serif"; x.fillText("Descubre el tuyo en Gemas ✨", 540, 1700);
  return new Promise((r) => c.toBlob(r, "image/png"));
}

export function GemQuiz({ destino }: { destino: string }) {
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const terminado = respuestas.length === QUIZ.length;
  const conteo = respuestas.reduce<Record<string, number>>((a, id) => ({ ...a, [id]: (a[id] ?? 0) + 1 }), {});
  const ganadora = gemaPorId(Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "amor");
  const actual = QUIZ[respuestas.length];
  const compartir = async () => {
    const texto = `Mi personaje inicial es ${nombreGema(ganadora.nombre)}: ${ganadora.frase} Descubre el tuyo en Gemas ✨`;
    const blob = await tarjetaStories(nombreGema(ganadora.nombre), ganadora.frase);
    const file = blob ? new File([blob], "mi-gema.png", { type: "image/png" }) : null;
    try {
      if (file && navigator.canShare?.({ files: [file] })) return await navigator.share({ files: [file], text: texto });
      if (navigator.share) return await navigator.share({ text: texto, url: window.location.origin });
      if (blob) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mi-gema.png"; a.click(); toast.success("Tarjeta descargada, ¡lista para tus stories!"); }
    } catch { /* compartir cancelado */ }
  };
  return (
    <section id="descubre" className="mx-auto max-w-3xl px-6 py-14 md:px-8">
      <Reveal className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-menta">Minijuego · 30 segundos</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Descubre tu personaje</h2>
        <p className="mt-2 text-muted-foreground">Tres preguntas rápidas. Sin registro.</p>
      </Reveal>
      <div className="mt-8 rounded-[2rem] bg-card p-6 shadow-card md:p-8" aria-live="polite">
        {!terminado && actual ? (
          <div key={respuestas.length} className="animate-pop">
            <div className="flex gap-1.5" aria-label={`Pregunta ${respuestas.length + 1} de ${QUIZ.length}`}>
              {QUIZ.map((_, i) => <span key={i} className={`h-2 flex-1 rounded-full ${i <= respuestas.length ? "bg-menta" : "bg-muted"}`} />)}
            </div>
            <h3 className="mt-5 text-xl font-bold md:text-2xl">{actual.pregunta}</h3>
            <div className="mt-5 grid gap-3">
              {actual.opciones.map((o) => (
                <button key={o.texto} type="button" onClick={() => setRespuestas([...respuestas, o.gema])} className="rounded-2xl border-2 border-border bg-background p-4 text-left font-bold transition hover:-translate-y-0.5 hover:border-menta focus-visible:border-menta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{o.texto}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative animate-pop text-center">
            <div className="confeti" aria-hidden>{Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ left: `${(i * 7.3) % 100}%`, animationDelay: `${(i % 5) * 0.12}s` }} className={["bg-coral", "bg-sol", "bg-menta", "bg-lavanda"][i % 4]} />)}</div>
            <Gema color={ganadora.color} className="brillo mx-auto size-24" />
            <p className="mt-4 text-sm font-bold text-muted-foreground">Tu personaje inicial es</p>
            <h3 className="text-3xl font-bold">{nombreGema(ganadora.nombre)}</h3>
            <p className="mx-auto mt-2 max-w-sm leading-relaxed">{ganadora.frase}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg"><Link to={destino}>Empieza con tu personaje<ArrowRight /></Link></Button>
              <Button variant="outline" size="lg" onClick={compartir}><Share2 />Compartir</Button>
            </div>
            <button type="button" onClick={() => setRespuestas([])} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground underline underline-offset-4"><RotateCcw className="size-3.5" />Jugar otra vez</button>
          </div>
        )}
      </div>
    </section>
  );
}

function Nivel({ n, i }: { n: (typeof NIVELES)[number]; i: number }) {
  const [ref, visible] = useVisible<HTMLLIElement>(0.6);
  return (
    <li ref={ref} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
      <span className={`relative z-10 flex size-16 shrink-0 items-center justify-center rounded-2xl bg-card shadow-card transition duration-700 ${visible ? "" : "grayscale opacity-50"}`}>
        <Gema color={n.color} className={`size-10 ${visible ? "brillo" : ""}`} />
      </span>
      <div>
        <p className="text-xs font-bold uppercase text-muted-foreground">Nivel {i + 1}</p>
        <h3 className="text-xl font-bold">{n.nombre}</h3>
        <p className="mt-1 text-sm leading-relaxed">{n.texto}</p>
        <span className="mt-2 inline-block rounded-full bg-menta-soft px-2.5 py-1 text-xs font-bold">🔓 {n.ganas}</span>
      </div>
    </li>
  );
}

export function PathMap() {
  return (
    <section id="camino" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Tu camino, nivel a nivel</h2>
          <p className="mt-2 font-bold">Completa misiones, gana experiencia y desbloquea un personaje nuevo en cada nivel.</p>
        </Reveal>
        <ol className="relative mt-10 grid gap-8 md:grid-cols-5 md:gap-4">
          <span aria-hidden className="absolute top-2 bottom-2 left-8 w-1 rounded-full bg-gema md:top-8 md:right-[10%] md:bottom-auto md:left-[10%] md:h-1 md:w-auto" />
          {NIVELES.map((n, i) => <Nivel key={n.nombre} n={n} i={i} />)}
        </ol>
      </div>
    </section>
  );
}

function Contador({ valor }: { valor: number }) {
  const [ref, visible] = useVisible<HTMLSpanElement>(0.5);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(valor); return; }
    let f = 0; const t0 = performance.now();
    const paso = (t: number) => { const k = Math.min(1, (t - t0) / 1400); setV(Math.round(valor * (1 - (1 - k) ** 3))); if (k < 1) f = requestAnimationFrame(paso); };
    f = requestAnimationFrame(paso); return () => cancelAnimationFrame(f);
  }, [visible, valor]);
  return <span ref={ref}>{v}</span>;
}

export function ImpactChain() {
  const cadena = [["🙋", "Tú"], ["🧒", "Un niño"], ["🏡", "Su familia"], ["🌍", "Tu comunidad"]];
  return (
    <section id="impacto" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-14 md:px-8">
      <Reveal className="mx-auto max-w-2xl text-center"><h2 className="text-3xl font-bold leading-tight md:text-4xl">Una clase cambia a un niño. Un niño cambia su barrio. Así empieza un mundo mejor.</h2></Reveal>
      <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-6">
        {cadena.map(([e, t], i) => (
          <div key={t} className="flex items-center gap-3 md:gap-6">
            <div className="onda relative flex size-20 flex-col items-center justify-center rounded-full bg-card shadow-card md:size-24" style={{ animationDelay: `${i * 0.5}s` }}>
              <span className="text-2xl" aria-hidden>{e}</span><span className="text-xs font-bold">{t}</span>
            </div>
            {i < cadena.length - 1 && <ArrowRight className="size-5 text-coral" aria-hidden />}
          </div>
        ))}
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CIFRAS.map((c) => (
          <div key={c.etiqueta} className="rounded-3xl border border-border bg-card p-5 text-center">
            <p className="font-display text-4xl font-bold"><Contador valor={c.valor} />+</p>
            <p className="mt-1 text-sm font-bold">{c.etiqueta}</p>
          </div>
        ))}
      </div>
      {CIFRAS_SON_EJEMPLO && <p className="mt-3 text-center text-xs text-muted-foreground">Cifras de ejemplo, pronto mostraremos datos reales.</p>}
    </section>
  );
}

export function Stories() {
  return (
    <section id="historias" className="scroll-mt-20 bg-background py-14">
      <Reveal className="px-6 text-center"><h2 className="text-3xl font-bold md:text-4xl">Jóvenes como tú</h2><p className="mt-2 text-xs text-muted-foreground">Historias de ejemplo</p></Reveal>
      <ul className="mx-auto mt-8 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:px-8">
        {HISTORIAS.map((h) => { const g = gemaPorId(h.gema); return (
          <li key={h.nombre} className="flex aspect-[9/14] w-60 shrink-0 snap-center flex-col justify-between rounded-[2rem] bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-gema font-display text-xl font-bold">{h.nombre[0]}</span>
              <div><p className="font-bold">{h.nombre}, {h.edad}</p><p className="text-xs text-muted-foreground">{h.ciudad}</p></div>
            </div>
            <p className="font-display text-xl font-bold leading-snug">“{h.frase}”</p>
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-muted px-3 py-1 text-xs font-bold"><Gema color={g.color} className="size-4" />Descubrió: {g.nombre}</span>
          </li>
        ); })}
      </ul>
    </section>
  );
}

export function NeverAlone() {
  const [girada, setGirada] = useState<number | null>(null);
  return (
    <section className="mx-auto max-w-5xl px-6 py-14 md:px-8">
      <Reveal className="text-center"><h2 className="text-3xl font-bold md:text-4xl">Nunca solo/a</h2><p className="mt-2 text-muted-foreground">Toca cada tarjeta para conocer más</p></Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {COMPANIA.map((c, i) => (
          <button key={c.titulo} type="button" aria-pressed={girada === i} onClick={() => setGirada(girada === i ? null : i)} className="h-44 rounded-3xl perspective-[900px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className={`relative block size-full transition-transform duration-500 transform-3d ${girada === i ? "rotate-y-180" : ""}`}>
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-card border border-border backface-hidden"><span className="text-4xl" aria-hidden>{c.emoji}</span><span className="text-lg font-bold">{c.titulo}</span></span>
              <span className="absolute inset-0 flex items-center justify-center rounded-3xl bg-tinta p-6 text-center font-bold text-nube backface-hidden rotate-y-180">{c.detras}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function GemCollection() {
  const [abierta, setAbierta] = useState<string | null>(null);
  const actual = GEMAS.find((g) => g.id === abierta);
  return (
    <section className="bg-tinta py-14 text-nube">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <Reveal className="text-center"><h2 className="text-3xl font-bold md:text-4xl">¿Cuántos personajes desbloquearás?</h2></Reveal>
        <div className="mt-8 grid grid-cols-5 gap-3 md:gap-5">
          {GEMAS.map((g) => (
            <button key={g.id} type="button" onClick={() => setAbierta(g.id)} onMouseEnter={() => setAbierta(g.id)} aria-label={`${g.nombre}: ${g.desbloqueo}`} className={`group flex aspect-square flex-col items-center justify-center rounded-2xl bg-nube/5 transition hover:bg-nube/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sol ${abierta === g.id ? "bg-nube/15" : ""}`}>
              <Gema color={g.color} apagada={abierta !== g.id} className="size-8 transition group-hover:scale-110 md:size-12" />
              {abierta !== g.id && <Lock className="mt-1 size-3 opacity-50" aria-hidden />}
            </button>
          ))}
        </div>
        <p className="mt-6 min-h-12 text-center" aria-live="polite">{actual ? <><b className="text-sol">{actual.nombre}</b> · {actual.desbloqueo}</> : "Toca un personaje para saber cómo se desbloquea."}</p>
      </div>
    </section>
  );
}

export function FinalCTA({ destino }: { destino: string }) {
  return (
    <section className="relative overflow-hidden bg-sol-soft px-6 py-16 text-center">
      <div className="particulas" aria-hidden>{Array.from({ length: 10 }).map((_, i) => <i key={i} style={{ left: `${i * 10 + 4}%`, animationDelay: `${i * 0.7}s` }} />)}</div>
      <div className="relative mx-auto max-w-xl">
        <h2 className="text-3xl font-bold md:text-4xl">Tus ganas de aportar ya son un comienzo.</h2>
        <p className="mt-3 text-lg font-bold">Vengas de donde vengas, aquí hay un lugar para ti.</p>
        <Button asChild size="lg" variant="outline" className="mt-7 h-14 border-tinta bg-tinta px-8 text-base text-nube hover:bg-tinta/90 hover:text-nube"><Link to={destino}>Empezar el nivel 1<ArrowRight /></Link></Button>
      </div>
    </section>
  );
}

export function SupportBlock() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center md:px-8">
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Gemas es un proyecto educativo sin ánimo de lucro. Tu apoyo hace posibles los campus, los libros y materiales para los niños y la mejora de la app.</p>
      <Button asChild variant="outline" className="shrink-0"><Link to="/donar"><Heart />Apoyar Gemas</Link></Button>
    </section>
  );
}

export function CtaFlotante({ destino }: { destino: string }) {
  const [ver, setVer] = useState(false);
  const r = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const hero = document.getElementById("hero"); if (!hero) return;
    r.current = new IntersectionObserver(([e]) => setVer(!e?.isIntersecting), { threshold: 0 });
    r.current.observe(hero); return () => r.current?.disconnect();
  }, []);
  return (
    <div className={`fixed inset-x-4 bottom-4 z-30 transition md:hidden ${ver ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"}`}>
      <Button asChild size="lg" className="h-14 w-full text-base shadow-pop"><Link to={destino}>Empieza tu camino<ArrowRight /></Link></Button>
    </div>
  );
}
