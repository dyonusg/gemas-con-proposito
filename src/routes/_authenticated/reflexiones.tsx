import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Pencil, Trash2, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, SelectorLeccion } from "@/components/gemas/Shell";
import { actualizar, nuevoId, useGemas, type Compartir, type Nota } from "@/lib/store";
import { useLecciones } from "@/lib/leccion";
import { guardarNota, borrarNota, mostrarFecha, type TipoReflexion } from "@/lib/reflexiones";

export const Route = createFileRoute("/_authenticated/reflexiones")({
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
  const lecciones = useLecciones();
  const [tipo, setTipo] = useState<TipoReflexion>("reflexiones");
  const [filtro, setFiltro] = useState<number | "todas">("todas");
  const [editando, setEditando] = useState<Nota | null>(null);
  const [nueva, setNueva] = useState(false);

  const nombre = (n?: number) => {
    const l = lecciones.find((x) => x.numero === n);
    return l ? l.cualidad : n ? `Virtud de la lección ${n}` : "Virtud sin indicar";
  };
  const lista = e[tipo].filter((r) => filtro === "todas" || r.leccion === filtro);

  const guardar = (n: Nota) =>
    actualizar((s) => ({
      ...s,
      [tipo]: guardarNota(s[tipo], n),
    }));
  const borrar = (id: string) => actualizar((s) => ({ ...s, [tipo]: borrarNota(s[tipo], id) }));

  return (
    <Shell>
      <Link to={e.tipo === "mentor" ? "/mentor" : "/gemas"} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground">
        <ArrowLeft className="size-4" /> {e.tipo === "mentor" ? "Acompañar" : "Mis gemas"}
      </Link>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Mis reflexiones</h1>
      <div className="mt-4 grid grid-cols-2 gap-2" role="tablist" aria-label="Tipo de reflexión">
        {([ ["reflexiones", "Personales"], ["momentos", "Sobre los peques"] ] as const).map(([valor, titulo]) => (
          <Button key={valor} role="tab" aria-selected={tipo === valor} variant={tipo === valor ? "tinta" : "soft"} onClick={() => { setTipo(valor); setEditando(null); setNueva(false); setFiltro("todas"); }}>{titulo}</Button>
        ))}
      </div>

      {!nueva && !editando && (
        <Button variant="tinta" className="mt-4 w-full" onClick={() => setNueva(true)}>Nueva reflexión</Button>
      )}
      {(nueva || editando) && (
        <Editor
          key={`${tipo}-${editando?.id ?? "nueva"}`}
          tipoReflexion={tipo}
          inicial={editando}
          leccionInicial={filtro === "todas" ? e.leccionActual : filtro}
          onCancelar={() => { setNueva(false); setEditando(null); }}
          onGuardar={(n) => { guardar(n); setNueva(false); setEditando(null); }}
        />
      )}

      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
        <Chip activo={filtro === "todas"} onClick={() => setFiltro("todas")}>Todas ({e[tipo].length})</Chip>
        {lecciones.filter((l) => e[tipo].some((r) => r.leccion === l.numero)).map((l) => (
          <Chip key={l.numero} activo={filtro === l.numero} onClick={() => setFiltro(l.numero)}>{l.cualidad}</Chip>
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
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-muted-foreground">
                <span>{nombre(r.leccion)}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"><op.icon className="size-3" />{tipo === "momentos" ? "Solo yo" : op.label}</span>
              </div>
              {r.pregunta && <p className="mt-2 text-xs font-bold text-lavanda">{r.pregunta}</p>}
              <p className="mt-1 whitespace-pre-wrap">{r.texto}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{mostrarFecha(r.fecha)}{r.editada ? ` · editada ${mostrarFecha(r.editada)}` : ""}</p>
                <div className="flex gap-1">
                  <Button variant="soft" size="sm" title="Editar reflexión" aria-label="Editar" onClick={() => { setNueva(false); setEditando(r); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil /></Button>
                  <Button variant="soft" size="sm" title="Borrar reflexión" aria-label="Borrar" onClick={() => { if (window.confirm("¿Borrar esta reflexión? No se puede deshacer.")) borrar(r.id); }}><Trash2 /></Button>
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
    <Button size="sm" variant={activo ? "tinta" : "soft"} onClick={onClick} className="shrink-0 text-xs">{children}</Button>
  );
}

function Editor({ inicial, leccionInicial, tipoReflexion, onGuardar, onCancelar }: {
  inicial: Nota | null;
  leccionInicial: number | undefined;
  tipoReflexion: TipoReflexion;
  onGuardar: (n: Nota) => void;
  onCancelar: () => void;
}) {
  const { tipo } = useGemas();
  const [texto, setTexto] = useState(inicial?.texto ?? "");
  const [leccion, setLeccion] = useState(inicial?.leccion ?? leccionInicial ?? 1);
  const [compartir, setCompartir] = useState<Compartir>(inicial?.compartir ?? "solo_yo");
  const ok = texto.trim().length > 0 && Boolean(leccion);
  return (
    <div className="mt-4 rounded-[20px] bg-lavanda-soft p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-lavanda">{inicial ? "Editar reflexión" : "Nueva reflexión"}</p>
      <SelectorLeccion etiqueta="Virtud de la reflexión" valor={leccion} onCambiar={setLeccion} />
      {inicial?.pregunta && <p className="mt-3 text-xs font-bold text-lavanda">{inicial.pregunta}</p>}
      <label className="mt-3 block text-sm font-bold" htmlFor="texto">Tu reflexión</label>
      <textarea id="texto" value={texto} onChange={(ev) => setTexto(ev.target.value)} rows={4} placeholder={tipoReflexion === "momentos" ? "¿Cómo vivieron los peques esta virtud?" : tipo === "mentor" ? "¿Qué aprendes al acompañar?" : "¿Qué te ha enseñado esta lección?"} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-lavanda" />
      <p className="mt-1 text-xs text-muted-foreground">Sin nombres de peques, por favor.</p>
      {tipoReflexion === "reflexiones" && <><p className="mt-3 text-sm font-bold">¿Quién puede leerla?</p>
      <div className="mt-1 grid grid-cols-3 gap-2" role="radiogroup">
        {OPCIONES.map((o) => (
          <Button variant="soft" key={o.id} role="radio" aria-checked={compartir === o.id} onClick={() => setCompartir(o.id)} className={`h-auto whitespace-normal flex-col rounded-xl p-2 text-[11px] ${compartir === o.id ? "border-tinta" : ""}`}>
            <o.icon className="size-4" />{o.label}
          </Button>
        ))}
      </div></>}
      <p className="mt-2 text-xs text-muted-foreground">Se guarda en tu cuenta. Solo la ven las personas con las que decidas compartirla.</p>
      <div className="mt-3 flex gap-2">
        <Button variant="tinta" size="sm" disabled={!ok} onClick={() => onGuardar({ id: inicial?.id ?? nuevoId(), fecha: inicial?.fecha ?? new Date().toISOString(), pregunta: inicial?.pregunta, texto: texto.trim(), leccion, compartir: tipoReflexion === "momentos" ? "solo_yo" : compartir })}>Guardar</Button>
        <Button variant="soft" size="sm" onClick={onCancelar}>Cancelar</Button>
      </div>
    </div>
  );
}
