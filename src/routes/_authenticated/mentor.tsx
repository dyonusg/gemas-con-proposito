import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BadgeCheck, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Shell, Seccion } from "@/components/gemas/Shell";
import { PASOS } from "@/lib/contenido";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/mentor")({
  head: () => ({
    meta: [
      { title: "Acompañar · Gemas" },
      { name: "description", content: "Vista del facilitador mentor: confirma los pasos de tus facilitadores en formación y lee sus reflexiones compartidas." },
      { property: "og:title", content: "Acompañar · Gemas" },
      { property: "og:description", content: "Acompaña a quienes van de colaborador a facilitador." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Mentor,
});

const RECONOCIMIENTOS = ["¡Los niños te seguían encantados!", "Se notó que lo preparaste.", "Qué calma transmitiste."];
const titulo = (id: string) => PASOS.find((p) => p.id === id)?.titulo ?? id;

function Mentor() {
  const { uid } = Route.useRouteContext();

  return (
    <Shell>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Acompañar</h1>
      <p className="text-sm text-muted-foreground">Confirma los pasos de tus facilitadores en formación y reconoce su esfuerzo.</p>
      {uid === undefined ? null : uid ? <Acompanados uid={uid} /> : (
        <div className="mt-5 rounded-[20px] bg-lavanda-soft p-5">
          <p className="font-display text-lg font-bold">Para acompañar a otros necesitas una cuenta</p>
          <p className="mt-1 text-sm text-muted-foreground">Así tus facilitadores en formación pueden vincularse contigo y compartirte sus pasos.</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild><Link to="/guardar">Crear cuenta o entrar</Link></Button>
            <Button asChild variant="soft"><Link to="/equipo">Ver ejemplo en este móvil</Link></Button>
          </div>
        </div>
      )}
      <Seccion titulo="Prepara tú también">
        <p className="text-sm text-muted-foreground">En <Link to="/lecciones" className="font-bold underline">Lecciones</Link> tienes las 24 lecciones para preparar la clase o ensayar con ellos.</p>
      </Seccion>
      <Seccion titulo="Mis observaciones e ideas">
        <Button asChild variant="soft"><Link to="/reflexiones">Mis reflexiones</Link></Button>
      </Seccion>
    </Shell>
  );
}

function Acompanados({ uid }: { uid: string }) {
  const qc = useQueryClient();
  const [texto, setTexto] = useState<Record<string, string>>({});
  const { data, isLoading } = useQuery({
    queryKey: ["acompanados", uid],
    queryFn: async () => {
      const { data: perfiles, error } = await supabase.rpc("mis_acompanados");
      if (error) throw error;
      const ids = (perfiles ?? []).map((p) => p.id);
      if (!ids.length) return [];
      const [{ data: pasos }, { data: notas }] = await Promise.all([
        supabase.from("progreso_pasos").select("*").in("user_id", ids),
        supabase.from("notas").select("*").in("user_id", ids).eq("tipo", "reflexion").in("compartir", ["mentor", "todos"]).order("created_at", { ascending: false }),
      ]);
      return (perfiles ?? []).map((p) => ({ ...p, pasos: (pasos ?? []).filter((x) => x.user_id === p.id), notas: (notas ?? []).filter((n) => n.user_id === p.id) }));
    },
  });

  const confirmar = async (id: string) => {
    const { error } = await supabase.from("progreso_pasos").update({ confirmado: true, confirmado_por: uid, reconocimiento: texto[id]?.trim() || null }).eq("id", id);
    if (error) toast.error("No se pudo confirmar"); else { toast.success("Paso confirmado"); qc.invalidateQueries({ queryKey: ["acompanados", uid] }); }
  };

  return (
    <>
      <div className="mt-5 rounded-[20px] bg-sol-soft p-4">
        <p className="text-sm font-bold">Tu código de mentor</p>
        <p className="text-xs text-muted-foreground">Compártelo con quien acompañas. Lo escribe en "Guardar mi camino".</p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-card px-2 py-1.5 text-xs">{uid}</code>
          <Button size="sm" variant="tinta" onClick={() => { navigator.clipboard.writeText(uid); toast.success("Código copiado"); }}><Copy /> Copiar</Button>
        </div>
      </div>
      {isLoading ? null : !data?.length ? (
        <p className="mt-5 rounded-[20px] border-2 border-dashed border-border p-4 text-sm text-muted-foreground">Aún no acompañas a nadie. Comparte tu código para empezar.</p>
      ) : data.map((c) => {
        const pendientes = c.pasos.filter((p) => !p.confirmado);
        return (
          <Seccion key={c.id} titulo={c.alias} extra={<span className="text-xs font-bold text-muted-foreground">{c.pasos.length}/{PASOS.length} pasos</span>}>
            {pendientes.length === 0 ? <p className="text-sm text-muted-foreground">Nada por confirmar.</p> : (
              <ul className="space-y-3">
                {pendientes.map((p) => (
                  <li key={p.id} className="rounded-[20px] bg-card p-4 shadow-card">
                    <p className="font-bold">{titulo(p.paso)}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {RECONOCIMIENTOS.map((r) => (
                        <button key={r} onClick={() => setTexto({ ...texto, [p.id]: r })} className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${texto[p.id] === r ? "border-sol bg-sol-soft" : "border-border"}`}>{r}</button>
                      ))}
                    </div>
                    <Button variant="menta" className="mt-3 w-full" onClick={() => confirmar(p.id)}><BadgeCheck /> Confirmar paso</Button>
                  </li>
                ))}
              </ul>
            )}
            {c.notas.length > 0 && (
              <ul className="mt-3 space-y-2">
                {c.notas.map((n) => (
                  <li key={n.id} className="flex gap-2 rounded-2xl bg-muted p-3 text-sm">
                    <MessageCircle className="size-4 shrink-0 text-lavanda" />
                    <span>{n.leccion_numero ? <strong>Lección {n.leccion_numero}: </strong> : null}{n.texto}</span>
                  </li>
                ))}
              </ul>
            )}
          </Seccion>
        );
      })}
    </>
  );
}
