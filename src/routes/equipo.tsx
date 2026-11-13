import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion } from "@/components/gemas/Shell";
import { PASOS } from "@/lib/contenido";
import { actualizar, reiniciar, useGemas, type Tarjeta } from "@/lib/store";

export const Route = createFileRoute("/equipo")({
  head: () => ({
    meta: [
      { title: "Equipo del campus · Gemas" },
      { name: "description", content: "Mentores y responsables: confirma pasos, reconoce a los ayudantes y reenvía las tarjetas." },
      { property: "og:title", content: "Equipo del campus · Gemas" },
      { property: "og:description", content: "Herramientas para mentores y responsables del campus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Equipo,
});

const RECONOCIMIENTOS = ["¡Los niños te seguían encantados!", "Se notó que lo preparaste.", "Qué calma transmitiste.", "¡Listo para el siguiente paso!"];

function Equipo() {
  const [rol, setRol] = useState<"maestro" | "responsable">("maestro");
  return (
    <Shell nav={false}>
      <Link to="/camino" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground"><ArrowLeft className="size-4" /> Volver</Link>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Equipo del campus</h1>
      <div className="mt-4 grid grid-cols-2 rounded-full bg-muted p-1">
        {(["maestro", "responsable"] as const).map((r) => (
          <button key={r} onClick={() => setRol(r)} className={`rounded-full py-2 text-sm font-bold ${rol === r ? "bg-tinta text-nube" : "text-muted-foreground"}`}>
            {r === "maestro" ? "Mentor" : "Responsable"}
          </button>
        ))}
      </div>
      {rol === "maestro" ? <Maestro /> : <Responsable />}
      <p className="mt-10 text-center text-xs text-muted-foreground">
        Prototipo: los datos se guardan solo en este dispositivo.{" "}
        <button className="underline" onClick={() => confirm("¿Borrar todos los datos del prototipo?") && reiniciar()}>Reiniciar</button>
      </p>
    </Shell>
  );
}

function Maestro() {
  const e = useGemas();
  const pendientes = PASOS.filter((p) => e.pasos[p.id]?.dirigido && !e.pasos[p.id]?.confirmado);
  const [texto, setTexto] = useState<Record<string, string>>({});
  const confirmar = (id: string) =>
    actualizar((s) => ({ ...s, pasos: { ...s.pasos, [id]: { ...s.pasos[id as keyof typeof s.pasos]!, confirmado: true, reconocimiento: texto[id]?.trim() || undefined } } }));

  return (
    <Seccion titulo={`Pasos de ${e.alias ?? "tu ayudante"}`}>
      {pendientes.length === 0 ? (
        <p className="rounded-[20px] border-2 border-dashed border-border p-4 text-sm text-muted-foreground">No hay pasos por confirmar.</p>
      ) : (
        <ul className="space-y-3">
          {pendientes.map((p) => (
            <li key={p.id} className="rounded-[20px] bg-card p-4 shadow-card">
              <p className="font-bold">{p.titulo}</p>
              <p className="text-xs text-muted-foreground">Marcado el {e.pasos[p.id]?.fecha}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {RECONOCIMIENTOS.map((r) => (
                  <button key={r} onClick={() => setTexto({ ...texto, [p.id]: r })} className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${texto[p.id] === r ? "border-sol bg-sol-soft" : "border-border"}`}>{r}</button>
                ))}
              </div>
              <input value={texto[p.id] ?? ""} onChange={(ev) => setTexto({ ...texto, [p.id]: ev.target.value })} maxLength={80} placeholder="O escribe un reconocimiento breve" className="mt-2 h-10 w-full rounded-xl border-2 border-input bg-background px-3 text-sm outline-none focus:border-sol" />
              <Button variant="menta" className="mt-3 w-full" onClick={() => confirmar(p.id)}><BadgeCheck /> Confirmar paso</Button>
            </li>
          ))}
        </ul>
      )}
    </Seccion>
  );
}

function textoTarjeta(t: Tarjeta) {
  return `Esta semana en clase: ${t.virtud}\n${t.cita}\nCanción: ${t.cancion}\nIdea para casa: ${t.idea}`;
}

function Responsable() {
  const e = useGemas();
  const dirigidos = PASOS.map((p) => ({ p, n: e.pasos[p.id]?.dirigido ? 1 : 0 }));
  const reenviar = async (t: Tarjeta) => {
    await navigator.clipboard?.writeText(textoTarjeta(t)).catch(() => {});
    actualizar((s) => ({ ...s, tarjetas: s.tarjetas.map((x) => (x.id === t.id ? { ...x, estado: "reenviada" } : x)) }));
  };

  return (
    <>
      <Seccion titulo="Tarjetas para las familias">
        {e.tarjetas.length === 0 ? (
          <p className="rounded-[20px] border-2 border-dashed border-border p-4 text-sm text-muted-foreground">No ha llegado ninguna tarjeta.</p>
        ) : (
          <ul className="space-y-3">
            {e.tarjetas.map((t) => (
              <li key={t.id} className="rounded-[20px] bg-card p-4 shadow-card">
                <p className="font-bold">{t.virtud} <span className="text-xs font-semibold text-muted-foreground">· {t.fecha}</span></p>
                <p className="mt-1 text-sm">{t.idea}</p>
                <Button variant={t.estado === "reenviada" ? "soft" : "default"} size="sm" className="mt-3" onClick={() => reenviar(t)}>
                  <Copy /> {t.estado === "reenviada" ? "Copiar de nuevo" : "Copiar y marcar como enviada"}
                </Button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted-foreground">Copia el texto y envíalo por el canal habitual del campus.</p>
      </Seccion>

      <Seccion titulo="Quieren seguir sirviendo">
        <div className="rounded-[20px] bg-sol-soft p-4 text-sm">
          {e.encuesta?.seguir.startsWith("Sí") ? (
            <p><strong>{e.alias}</strong> quiere seguir{e.encuesta.seguir.includes("compañero") ? ` junto a ${e.pareja}` : ""}. Avisa al coordinador de su zona fuera de la app.</p>
          ) : (
            <p>Aún nadie ha respondido que quiere seguir.</p>
          )}
        </div>
      </Seccion>

      <Seccion titulo="Medición anónima (M1)">
        <ul className="space-y-2 rounded-[20px] bg-card p-4 shadow-card">
          {dirigidos.map(({ p, n }) => (
            <li key={p.id} className="flex items-center justify-between text-sm"><span>{p.corto}</span><span className="font-bold">{n} ayudante{n === 1 ? "" : "s"}</span></li>
          ))}
        </ul>
      </Seccion>
    </>
  );
}
