import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { PASOS, type PasoId } from "./contenido";
import { alGuardar, cargarEstado, limpiarEstado, ESTADO_INICIAL, type Compartir, type Estado, type RegistroPaso } from "./store";

let usuario: string | null = null;
let generacion = 0;
let pendiente: Promise<void> = Promise.resolve();
let carga: Promise<void> | null = null;

export function desconectarCuenta() {
  generacion++;
  usuario = null;
  carga = null;
  limpiarEstado();
}

export async function esperarGuardado() { await pendiente; }

async function subir(uid: string, e: Estado, version: number) {
  if (version !== generacion || usuario !== uid) return;
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || data.user?.id !== uid || version !== generacion) return;
  const { error } = await supabase.from("estados_usuario").upsert({ user_id: uid, estado: JSON.parse(JSON.stringify(e)) as Json, updated_at: new Date().toISOString() });
  if (error) throw error;
  const filas = PASOS.filter((p) => e.pasos[p.id]?.dirigido).map((p) => ({ user_id: uid, paso: p.id, leccion_numero: e.leccionActual }));
  if (filas.length && e.tipo !== "mentor") {
    const { error } = await supabase.from("progreso_pasos").upsert(filas, { onConflict: "user_id,paso", ignoreDuplicates: true });
    if (error) throw error;
  }
  if (version !== generacion) return;
  const { error: borrarError } = await supabase.from("notas").delete().eq("user_id", uid).eq("tipo", "reflexion");
  if (borrarError) throw borrarError;
  if (e.reflexiones.length) {
    const { error } = await supabase.from("notas").insert(e.reflexiones.map((n) => ({ user_id: uid, tipo: "reflexion", texto: n.texto, pregunta: n.pregunta ?? null, leccion_numero: n.leccion ?? null, compartir: n.compartir ?? "solo_yo", local_id: n.id })));
    if (error) throw error;
  }
}

export async function sincronizar(uid: string) {
  if (usuario === uid && carga) return carga;
  desconectarCuenta();
  usuario = uid;
  const version = generacion;
  carga = (async () => {
    const resultados = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).single(),
      supabase.from("estados_usuario").select("estado").eq("user_id", uid).maybeSingle(),
      supabase.from("progreso_pasos").select("*").eq("user_id", uid),
      supabase.from("notas").select("*").eq("user_id", uid).eq("tipo", "reflexion"),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    for (const r of resultados) if (r.error) throw r.error;
    if (version !== generacion) return;
    const [perfil, guardado, pasos, notas, roles] = resultados;
    const raw = guardado.data?.estado;
    const snapshot = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Partial<Estado> : {};
    const progreso: Partial<Record<PasoId, RegistroPaso>> = { ...snapshot.pasos };
    for (const p of pasos.data ?? []) progreso[p.paso as PasoId] = { dirigido: true, confirmado: p.confirmado, reconocimiento: p.reconocimiento ?? undefined };
    cargarEstado({ ...ESTADO_INICIAL, ...snapshot,
      alias: perfil.data?.alias_normalizado ? perfil.data.alias : null,
      fechaNacimiento: perfil.data?.fecha_nacimiento ?? null,
      consentimiento: perfil.data?.consentimiento_papel ?? false,
      tipo: roles.data?.some((r) => r.role === "mentor") ? "mentor" : "formacion",
      mentorCodigo: perfil.data?.mentor_id ?? "",
      pasos: progreso, pasosPareja: snapshot.pasosPareja ?? {},
      reflexiones: snapshot.reflexiones ?? (notas.data ?? []).map((n) => ({ id: n.local_id ?? n.id, fecha: new Date(n.created_at).toLocaleDateString("es-ES"), texto: n.texto, pregunta: n.pregunta ?? undefined, leccion: n.leccion_numero ?? undefined, compartir: n.compartir as Compartir })),
    });
    alGuardar((e) => {
      pendiente = pendiente.then(() => subir(uid, e, version)).catch(() => { toast.error("No se han guardado los últimos cambios. Revisa tu conexión."); });
    });
  })().catch((error) => { if (version === generacion) { carga = null; usuario = null; } throw error; });
  return carga;
}