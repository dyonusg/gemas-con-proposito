import { supabase } from "@/integrations/supabase/client";
import { PASOS, type PasoId } from "./contenido";
import { actualizar, type Estado, type RegistroPaso } from "./store";

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
}

/** Al iniciar sesión: une lo guardado en la nube con lo de este dispositivo y sube el resultado. */
export async function sincronizar() {
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) return;
  const [{ data: perfil }, { data: pasos }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
    supabase.from("progreso_pasos").select("*").eq("user_id", uid),
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
      pasos: { ...nube, ...Object.fromEntries(Object.entries(s.pasos).map(([k, v]) => [k, { ...nube[k as PasoId], ...v, confirmado: v?.confirmado || nube[k as PasoId]?.confirmado }])) },
    };
    return final;
  });
  if (final) await subirCamino(final);
}
