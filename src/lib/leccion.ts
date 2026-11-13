import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Leccion = Tables<"lecciones">;

export const leccionesQuery = queryOptions({
  queryKey: ["lecciones-completas"],
  queryFn: async () => {
    const { data } = await supabase.from("lecciones").select("*").order("numero");
    return (data ?? []) as Leccion[];
  },
  staleTime: Infinity,
});

export function useLecciones() {
  return useQuery(leccionesQuery).data ?? [];
}

export function useLeccion(numero: number) {
  return useLecciones().find((l) => l.numero === numero);
}
