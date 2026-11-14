import { supabase } from "@/integrations/supabase/client";

export function solicitarCodigo(correo: string, redirectTo: string) {
  return supabase.auth.signInWithOtp({
    email: correo.trim().toLowerCase(),
    options: { shouldCreateUser: true, emailRedirectTo: redirectTo },
  });
}

export async function verificarCodigo(correo: string, codigo: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: correo.trim().toLowerCase(), token: codigo.trim(), type: "email",
  });
  if (error) throw error;
  if (!data.session) throw new Error("No se ha confirmado el acceso.");
  return data.session;
}