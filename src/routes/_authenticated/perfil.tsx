import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Shell } from "@/components/gemas/Shell";
import { FechaNacimiento, MESES } from "@/components/gemas/FechaNacimiento";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { actualizar, useGemas } from "@/lib/store";
import { esMenor, esCodigoMentor } from "@/lib/camino";
import { aliasValido } from "@/lib/cuenta";
import { esperarGuardado } from "@/lib/nube";
export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Tu perfil · Gemas" }, { name: "description", content: "Elige tu alias único y completa tu perfil de Gemas." }, { property: "og:title", content: "Tu perfil · Gemas" }, { property: "og:description", content: "Tu alias y tu forma de participar en Gemas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Perfil,
});
function Perfil() {
  const e = useGemas(); const { uid } = Route.useRouteContext(); const navigate = useNavigate();
  const [alias, setAlias] = useState(e.alias ?? ""); const [nacimiento, setNacimiento] = useState(e.fechaNacimiento ?? "");
  const [tipo, setTipo] = useState(e.tipo ?? "formacion"); const [consiente, setConsiente] = useState(e.consentimiento);
  const [calendario, setCalendario] = useState(false); const [aviso, setAviso] = useState(""); const [ocupado, setOcupado] = useState(false);
  const [mentor, setMentor] = useState(e.mentorCodigo); const [codigo, setCodigo] = useState("");
  const pideCodigo = tipo === "mentor" && e.tipo !== "mentor";
  const menor = nacimiento ? esMenor(nacimiento) : false;
  const [ano, mes, dia] = nacimiento.split("-").map(Number);
  const listo = aliasValido(alias) && nacimiento && (!menor || consiente) && (!pideCodigo || codigo.trim().length >= 6) && (tipo === "mentor" || !mentor || esCodigoMentor(mentor));
  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault(); if (!listo) return; setOcupado(true); setAviso("");
    try {
      const { data: disponible, error } = await supabase.rpc("alias_disponible", { _alias: alias });
      if (error) throw error;
      if (!disponible) { setAviso("Este alias ya está en uso. Elige otro, por favor."); return; }
      const { error: perfilError } = await supabase.from("profiles").update({ alias: alias.trim(), alias_normalizado: alias.trim().toLowerCase(), fecha_nacimiento: nacimiento, consentimiento_papel: menor && consiente, mentor_id: tipo !== "mentor" && mentor.trim() && mentor.trim() !== uid ? mentor.trim() : null }).eq("id", uid);
      if (perfilError) { setAviso(perfilError.code === "23505" ? "Este alias ya está en uso. Elige otro, por favor." : "No se pudo guardar el perfil. Inténtalo de nuevo."); return; }
      if (pideCodigo) { const { error: codError } = await supabase.rpc("canjear_codigo_mentor", { _codigo: codigo }); if (codError) { setAviso("Ese código de mentor no es válido, ya se usó o está reservado para otro correo. Pídele uno nuevo a la administración."); return; } }
      const { error: rolError } = await supabase.rpc("elegir_tipo", { _tipo: tipo === "mentor" ? "mentor" : "colaborador" }); if (rolError) throw rolError;
      actualizar((s) => ({ ...s, alias: alias.trim(), fechaNacimiento: nacimiento, consentimiento: menor && consiente, tipo, mentorCodigo: mentor.trim() }));
      await esperarGuardado(); await navigate({ to: tipo === "mentor" ? "/mentor" : "/camino" });
    } catch { setAviso("No se pudo guardar. Revisa tu conexión e inténtalo de nuevo."); }
    finally { setOcupado(false); }
  };
  return <Shell nav={Boolean(e.alias && e.fechaNacimiento)}><h1 className="mt-5 text-3xl font-bold">Tu perfil</h1>
    <form className="mt-5 space-y-4" onSubmit={guardar}>
      <fieldset><legend className="text-sm font-bold">¿Cómo usarás Gemas?</legend><div className="mt-2 grid grid-cols-2 gap-2">{(["formacion", "mentor"] as const).map((t) => <Button key={t} type="button" variant={tipo === t ? "menta" : "soft"} className="h-auto min-h-12 whitespace-normal" aria-pressed={tipo === t} onClick={() => setTipo(t)}>{t === "mentor" ? "Facilitador mentor" : "Facilitador en formación"}</Button>)}</div></fieldset>
      <label className="block text-sm font-bold">Elige un alias<input required minLength={2} maxLength={20} value={alias} onChange={(ev) => setAlias(ev.target.value)} placeholder="Por ejemplo: Rayo" className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal" /></label>
      <p className="text-xs text-muted-foreground">Único en Gemas. No uses tu nombre completo.</p>
      <label className="block text-sm font-bold" htmlFor="nacimiento">Tu fecha de nacimiento</label>
      <Button id="nacimiento" type="button" variant="outline" className="h-12 w-full justify-start" aria-expanded={calendario} onClick={() => setCalendario(!calendario)}><CalendarIcon />{nacimiento ? `${dia} de ${(MESES[(mes ?? 1) - 1] ?? "").toLowerCase()} de ${ano}` : "Toca para elegir"}</Button>
      {calendario && <div className="rounded-2xl border-2 border-input bg-card p-3"><FechaNacimiento value={nacimiento} onChange={(v) => { setNacimiento(v); setCalendario(false); }} /></div>}
      {menor && <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={consiente} onChange={(ev) => setConsiente(ev.target.checked)} className="mt-1 size-5 accent-coral" /><span>Mi familia ha firmado el consentimiento en papel al inscribirme en el campus.</span></label>}
      {pideCodigo && <label className="block text-sm font-bold">Código de registro de mentor<input required value={codigo} onChange={(ev) => setCodigo(ev.target.value.toUpperCase())} placeholder="Por ejemplo: K7PX2QAB" className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal tracking-widest" /><span className="mt-1 block text-xs font-normal text-muted-foreground">Para ser mentor necesitas un código que te da la administración de Gemas. El código está reservado para el correo con el que entras y sirve una sola vez.</span></label>}
      {tipo !== "mentor" && <label className="block text-sm font-bold">Código de tu mentor (opcional)<input value={mentor} onChange={(ev) => setMentor(ev.target.value)} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 text-xs font-normal" /><span className="mt-1 block text-xs font-normal text-muted-foreground">Al vincularte, puede consultar tus avances y solo las reflexiones que compartas.</span></label>}
      {aviso && <p role="alert" className="rounded-xl bg-sol-soft p-3 text-sm">{aviso}</p>}
      <Button type="submit" disabled={!listo || ocupado} className="w-full">{ocupado ? "Guardando…" : "Guardar y continuar"}</Button>
    </form>
  </Shell>;
}