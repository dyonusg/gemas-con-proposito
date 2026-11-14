import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { desconectarCuenta, esperarGuardado } from "@/lib/nube";

const Contexto = createContext<{ uid: string | null; salir: () => Promise<void> }>({ uid: null, salir: async () => {} });
export const useAcceso = () => useContext(Contexto);

export function Acceso({ children, queryClient }: { children: ReactNode; queryClient: QueryClient }) {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => {
    let activo = true;
    const { data } = supabase.auth.onAuthStateChange((evento, sesion) => {
      if (!activo) return;
      setUid(sesion?.user.id ?? null);
      if (evento === "SIGNED_OUT") {
        desconectarCuenta();
        void queryClient.cancelQueries().then(() => { queryClient.clear(); void router.invalidate(); });
      } else if (evento === "SIGNED_IN" || evento === "USER_UPDATED") {
        // Auth callbacks must finish before another Auth request runs.
        setTimeout(() => { if (activo) void router.invalidate(); }, 0);
      }
    });
    return () => { activo = false; data.subscription.unsubscribe(); };
  }, [queryClient, router]);

  const salir = async () => {
    await esperarGuardado();
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    desconectarCuenta();
    setUid(null);
    await router.navigate({ to: "/auth", replace: true });
  };
  return <Contexto.Provider value={{ uid, salir }}>{children}</Contexto.Provider>;
}