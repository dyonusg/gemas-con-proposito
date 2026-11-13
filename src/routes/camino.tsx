import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, BadgeCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, Destello } from "@/components/gemas/Shell";
import { PASOS, LECCION } from "@/lib/contenido";
import { useGemas } from "@/lib/store";
import { siguientePaso, contarDirigidos } from "@/lib/camino";

export const Route = createFileRoute("/camino")({
  head: () => ({
    meta: [
      { title: "Mi camino · Gemas" },
      { name: "description", content: "Tu camino por pasos: canción, cita, historia, juego, media clase y clase entera." },
      { property: "og:title", content: "Mi camino · Gemas" },
      { property: "og:description", content: "Mira dónde estás y cuál es tu siguiente paso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Camino,
});

function Camino() {
  const e = useGemas();
  const sig = siguientePaso(e.pasos);
  const pasoSig = PASOS.find((p) => p.id === sig);
  const total = contarDirigidos(e.pasos);
  const reconocimientos = PASOS.filter((p) => e.pasos[p.id]?.reconocimiento);

  return (
    <Shell>
      <p className="mt-2 text-sm font-bold text-muted-foreground">¡Hola, {e.alias ?? "ayudante"}!</p>
      <h1 className="text-[32px] font-bold leading-[38px]">Tu camino</h1>
      <p className="text-sm text-muted-foreground">Virtud de esta semana: <strong className="text-foreground">{LECCION.virtud}</strong></p>

      {pasoSig ? (
        <div className="mt-5 overflow-hidden rounded-[20px] bg-tinta p-5 text-nube shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-sol">Tu siguiente paso</p>
          <h2 className="mt-1 text-2xl font-bold">{pasoSig.titulo}</h2>
          <p className="mt-1 text-sm text-nube/80">{pasoSig.descripcion} Prepara solo esto.</p>
          <Button asChild className="mt-4">
            <Link to="/preparar/$paso" params={{ paso: pasoSig.id }}>Preparar y ensayar</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-5 rounded-[20px] bg-sol p-5 shadow-card">
          <Destello className="size-8" />
          <h2 className="mt-2 text-2xl font-bold">¡Has dirigido una clase entera!</h2>
          <p className="text-sm">Ya puedes guiar a otros. Mira tu siguiente paso al terminar el campus.</p>
          <Button asChild variant="tinta" className="mt-4"><Link to="/cierre">Seguir sirviendo</Link></Button>
        </div>
      )}

      <Seccion titulo="Los pasos" extra={<span className="text-sm font-bold text-muted-foreground">{total}/6</span>}>
        <ol className="relative space-y-3 before:absolute before:top-4 before:bottom-4 before:left-[22px] before:w-1 before:rounded-full before:bg-border">
          {PASOS.map((p, i) => {
            const r = e.pasos[p.id];
            const esSig = p.id === sig;
            return (
              <li key={p.id} className="relative">
                <Link
                  to="/preparar/$paso"
                  params={{ paso: p.id }}
                  className={`flex items-center gap-4 rounded-[20px] p-3 pr-4 ${esSig ? "bg-card shadow-card ring-2 ring-coral" : "bg-card/60"}`}
                >
                  <span className={`relative z-[1] grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-bold ${r?.dirigido ? p.color : "bg-muted text-muted-foreground"}`}>
                    {r?.dirigido ? <Check className="size-5" strokeWidth={3} /> : esSig ? i + 1 : <Lock className="size-4" />}
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold">{p.titulo}</span>
                    <span className="text-xs text-muted-foreground">
                      {r?.dirigido ? (r.confirmado ? "Confirmado por tu mentor" : "Dirigido · pendiente de confirmar") : esSig ? "Te toca" : "Más adelante"}
                    </span>
                  </span>
                  {r?.confirmado && <BadgeCheck className="size-5 text-menta" />}
                </Link>
              </li>
            );
          })}
        </ol>
      </Seccion>

      <Seccion titulo={`Camináis juntos: tú y ${e.pareja}`}>
        <div className="rounded-[20px] bg-card p-4 shadow-card">
          <FilaPareja nombre={e.alias ?? "Tú"} pasos={e.pasos} />
          <FilaPareja nombre={e.pareja} pasos={e.pasosPareja} />
          <p className="mt-3 text-xs text-muted-foreground">Preparad juntos el siguiente paso. Sin chat: os veis en el campus.</p>
        </div>
      </Seccion>

      {reconocimientos.length > 0 && (
        <Seccion titulo="Lo que dice tu mentor">
          <ul className="space-y-2">
            {reconocimientos.map((p) => (
              <li key={p.id} className="rounded-[20px] bg-sol-soft p-4">
                <p className="font-display text-lg font-semibold">«{e.pasos[p.id]?.reconocimiento}»</p>
                <p className="text-xs text-muted-foreground">Tras: {p.corto}</p>
              </li>
            ))}
          </ul>
        </Seccion>
      )}
    </Shell>
  );
}

function FilaPareja({ nombre, pasos }: { nombre: string; pasos: ReturnType<typeof useGemas>["pasos"] }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-20 truncate text-sm font-bold">{nombre}</span>
      <div className="flex flex-1 gap-1.5">
        {PASOS.map((p) => (
          <span key={p.id} title={p.corto} className={`h-3 flex-1 rounded-full ${pasos[p.id]?.dirigido ? p.color : "bg-muted"}`} />
        ))}
      </div>
    </div>
  );
}
