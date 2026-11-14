import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Lock, Pencil, Trash2, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/gemas/Shell";
import { supabase } from "@/integrations/supabase/client";
import { actualizar, hoy, nuevoId, useGemas, type Compartir, type Nota } from "@/lib/store";

const leccionesQuery = queryOptions({
  queryKey: ["lecciones-lista"],
  queryFn: async () => {
    const { data } = await supabase.from("lecciones").select("numero, cualidad, color_gema").order("numero");
    return data ?? [];
  },
  staleTime: Infinity,
});

export const Route = createFileRoute("/reflexiones")({
  head: () => ({
    meta: [
      { title: "Mis reflexiones · Gemas" },
      { name: "description", content: "Escribe, edita y comparte tus reflexiones de cada lección." },
      { property: "og:title", content: "Mis reflexiones · Gemas" },
      { property: "og:description", content: "Tus reflexiones por lección, solo para ti o compartidas con tu mentor y compañeros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reflexiones,
});

const OPCIONES: { id: Compartir; label: string; icon: typeof Lock }[] = [
  { id: "solo_yo", label: "Solo yo", icon: Lock },
  { id: "mentor", label: "Mi mentor", icon: UserRound },
  { id: "todos", label: "Mentor y compañeros", icon: Users },
];

function Reflexiones() {
  const e = useGemas();
  const { data: lecciones = [] } = useQuery(leccionesQuery);
  const [filtro, setFiltro] = useState<number | "todas">("todas");
  const [editando, setEditando] = useState<Nota | null>(null);
  const [nueva, setNueva] = useState(false);

  const nombre = (n?: number) => {
    const l = lecciones.find((x) => x.numero === n);
    return l ? `Lección ${l.numero} · ${l.cualidad}` : n ? `Lección ${n}` : "Sin lección";
  };
  const lista = e.reflexiones.filter((r) => filtro === "todas" || r.leccion === filtro);

  const guardar = (n: Nota) =>
    actualizar((s) => ({
      ...s,
      reflexiones: s.reflexiones.some((r) => r.id === n.id)
        ? s.reflexiones.map((r) => (r.id === n.id ? { ...n, editada: hoy() } : r))
        : [n, ...s.reflexiones],
    }));
  const borrar = (id: string) => actualizar((s) => ({ ...s, reflexiones: s.reflexiones.filter((r) => r.id !== id) }));

  return (
    <Shell>
      <Link to={e.tipo === "mentor" ? "/mentor" : "/gemas"} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground">
        <ArrowLeft className="size-4" /> {e.tipo === "mentor" ? "Acompañar" : "Mis gemas"}
      </Link>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Mis reflexiones</h1>
      <p className="text-sm text-muted-foreground">{e.tipo === "mentor" ? "Lo que observas en los niños, tus ideas y lo que aprendes al acompañar." : "Una por lección o varias. Tú decides quién las lee."}</p>

      {!nueva && !editando && (
        <Button variant="tinta" className="mt-4 w-full" onClick={() => setNueva(true)}>Nueva reflexión</Button>
      )}
      {(nueva || editando) && (
        <Editor
          key={editando?.id ?? "nueva"}
          inicial={editando}
          leccionInicial={filtro === "todas" ? e.leccionActual : filtro}
          lecciones={lecciones}
          onCancelar={() => { setNueva(false); setEditando(null); }}
          onGuardar={(n) => { guardar(n); setNueva(false); setEditando(null); }}
        />
      )}

      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
        <Chip activo={filtro === "todas"} onClick={() => setFiltro("todas")}>Todas ({e.reflexiones.length})</Chip>
        {lecciones.filter((l) => e.reflexiones.some((r) => r.leccion === l.numero)).map((l) => (
          <Chip key={l.numero} activo={filtro === l.numero} onClick={() => setFiltro(l.numero)}>{l.numero}. {l.cualidad}</Chip>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {!lista.length && (
          <li className="rounded-[20px] border-2 border-dashed border-border p-4 text-sm text-muted-foreground">Aún no hay reflexiones aquí.</li>
        )}
        {lista.map((r) => {
          const op = OPCIONES.find((o) => o.id === (r.compartir ?? "solo_yo")) ?? { id: "solo_yo", label: "Solo yo", icon: Lock };
          return (
            <li key={r.id} className="rounded-[20px] border-l-4 border-lavanda bg-card p-4 shadow-card">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-muted-foreground">
                <span>{nombre(r.leccion)}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"><op.icon className="size-3" />{op.label}</span>
              </div>
              {r.pregunta && <p className="mt-2 text-xs font-bold text-lavanda">{r.pregunta}</p>}
              <p className="mt-1 whitespace-pre-wrap">{r.texto}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{r.fecha}{r.editada ? ` · editada ${r.editada}` : ""}</p>
                <div className="flex gap-1">
                  <Button variant="soft" size="sm" aria-label="Editar" onClick={() => { setNueva(false); setEditando(r); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil /></Button>
                  <Button variant="soft" size="sm" aria-label="Borrar" onClick={() => { if (window.confirm("¿Borrar esta reflexión? No se puede deshacer.")) borrar(r.id); }}><Trash2 /></Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${activo ? "bg-tinta text-nube" : "bg-muted text-muted-foreground"}`}>{children}</button>
  );
}

function Editor({ inicial, leccionInicial, lecciones, onGuardar, onCancelar }: {
  inicial: Nota | null;
  leccionInicial: number | undefined;
  lecciones: { numero: number; cualidad: string }[];
  onGuardar: (n: Nota) => void;
  onCancelar: () => void;
}) {
  const { tipo } = useGemas();
  const [texto, setTexto] = useState(inicial?.texto ?? "");
  const [leccion, setLeccion] = useState<number | undefined>(inicial?.leccion ?? leccionInicial);
  const [compartir, setCompartir] = useState<Compartir>(inicial?.compartir ?? "solo_yo");
  const ok = texto.trim().length > 0;
  return (
    <div className="mt-4 rounded-[20px] bg-lavanda-soft p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-lavanda">{inicial ? "Editar reflexión" : "Nueva reflexión"}</p>
      <label className="mt-3 block text-sm font-bold" htmlFor="leccion">Lección</label>
      <select id="leccion" value={leccion ?? ""} onChange={(ev) => setLeccion(ev.target.value ? Number(ev.target.value) : undefined)} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 text-sm">
        <option value="">Sin lección</option>
        {lecciones.map((l) => <option key={l.numero} value={l.numero}>{l.numero}. {l.cualidad}</option>)}
      </select>
      {inicial?.pregunta && <p className="mt-3 text-xs font-bold text-lavanda">{inicial.pregunta}</p>}
      <label className="mt-3 block text-sm font-bold" htmlFor="texto">Tu reflexión</label>
      <textarea id="texto" value={texto} onChange={(ev) => setTexto(ev.target.value)} rows={4} placeholder={tipo === "mentor" ? "¿Qué observas en los niños? ¿Qué ideas te surgen?" : "¿Qué te ha enseñado esta lección?"} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-lavanda" />
      <p className="mt-1 text-xs text-muted-foreground">Sin nombres de niños, por favor.</p>
      <p className="mt-3 text-sm font-bold">¿Quién puede leerla?</p>
      <div className="mt-1 grid grid-cols-3 gap-2" role="radiogroup">
        {OPCIONES.map((o) => (
          <button key={o.id} role="radio" aria-checked={compartir === o.id} onClick={() => setCompartir(o.id)} className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 text-[11px] font-bold ${compartir === o.id ? "border-tinta bg-card" : "border-transparent bg-card/50 text-muted-foreground"}`}>
            <o.icon className="size-4" />{o.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Si no has guardado tu camino con una cuenta, la reflexión solo queda en este móvil.</p>
      <div className="mt-3 flex gap-2">
        <Button variant="tinta" size="sm" disabled={!ok} onClick={() => onGuardar({ id: inicial?.id ?? nuevoId(), fecha: inicial?.fecha ?? hoy(), pregunta: inicial?.pregunta, texto: texto.trim(), leccion, compartir })}>Guardar</Button>
        <Button variant="soft" size="sm" onClick={onCancelar}>Cancelar</Button>
      </div>
    </div>
  );
}
