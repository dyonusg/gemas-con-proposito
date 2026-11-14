import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { sincronizar } from "@/lib/nube";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth", replace: true });
    await sincronizar(data.user.id);
    const { data: perfil, error: perfilError } = await supabase.from("profiles").select("alias_normalizado, fecha_nacimiento").eq("id", data.user.id).single();
    if (perfilError) throw perfilError;
    if ((!perfil.alias_normalizado || !perfil.fecha_nacimiento) && location.pathname !== "/perfil") throw redirect({ to: "/perfil", replace: true });
    return { uid: data.user.id };
  },
  component: Outlet,
});