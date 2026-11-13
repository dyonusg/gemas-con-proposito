import { supabase } from "@/integrations/supabase/client";
import { PASOS, type PasoId } from "./contenido";
import { actualizar, type Compartir, type Estado, type RegistroPaso } from "./store";

// Guardar en la nube es OPCIONAL: sin sesión, todo sigue solo en este dispositivo.
export async function subirCamino(e: Estado) {
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) return;
  await supabase.from("profiles").upsert({
    id: uid,
    alias: e.alias ?? "colaborador",
    fecha_nacimiento: e.fechaNacimiento,
    consentimiento_papel: e.consentimiento,
  });
  const filas = PASOS.filter((p) => e.pasos[p.id]?.dirigido).map((p) => ({ user_id: uid, paso: p.id }));
  if (filas.length) await supabase.from("progreso_pasos").upsert(filas, { onConflict: "user_id,paso", ignoreDuplicates: true });
  // Reflexiones: el móvil manda; se reemplazan para que editar y borrar se reflejen.
  await supabase.from("notas").delete().eq("user_id", uid).eq("tipo", "reflexion");
  const notas = e.reflexiones.map((n) => ({ user_id: uid, tipo: "reflexion", texto: n.texto, pregunta: n.pregunta ?? null, leccion_numero: n.leccion ?? null, compartir: n.compartir ?? "solo_yo", local_id: n.id }));
  if (notas.length) await supabase.from("notas").insert(notas);
}

/** Al iniciar sesión: une lo guardado en la nube con lo de este dispositivo y sube el resultado. */
export async function sincronizar() {
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) return;
  const [{ data: perfil }, { data: pasos }, { data: notas }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
    supabase.from("progreso_pasos").select("*").eq("user_id", uid),
    supabase.from("notas").select("*").eq("user_id", uid).eq("tipo", "reflexion"),
  ]);
  let final: Estado | null = null;
  actualizar((s) => {
    const nube: Partial<Record<PasoId, RegistroPaso>> = {};
    for (const p of pasos ?? []) {
      nube[p.paso as PasoId] = { dirigido: true, confirmado: p.confirmado, reconocimiento: p.reconocimiento ?? undefined };
    }
    final = {
      ...s,
      alias: s.alias ?? perfil?.alias ?? null,
      fechaNacimiento: s.fechaNacimiento ?? perfil?.fecha_nacimiento ?? null,
      consentimiento: s.consentimiento || !!perfil?.consentimiento_papel,
      reflexiones: [
        ...s.reflexiones,
        ...(notas ?? [])
          .filter((n) => !s.reflexiones.some((r) => r.id === n.local_id))
          .map((n) => ({ id: n.local_id ?? n.id, fecha: new Date(n.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" }), texto: n.texto, pregunta: n.pregunta ?? undefined, leccion: n.leccion_numero ?? undefined, compartir: (n.compartir as Compartir) ?? "solo_yo" })),
      ],
      pasos: { ...nube, ...Object.fromEntries(Object.entries(s.pasos).map(([k, v]) => [k, { ...nube[k as PasoId], ...v, confirmado: v?.confirmado || nube[k as PasoId]?.confirmado }])) },
    };
    return final;
  });
  if (final) await subirCamino(final);
}
