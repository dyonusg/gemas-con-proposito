import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Shell, Seccion } from "@/components/gemas/Shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administración · Gemas" },
      { name: "description", content: "Genera códigos de un solo uso para registrar facilitadores mentores en Gemas." },
      { property: "og:title", content: "Administración · Gemas" },
      { property: "og:description", content: "Códigos de registro para mentores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { uid } = Route.useRouteContext();
  const qc = useQueryClient();
  const [ocupado, setOcupado] = useState(false);
  const esAdmin = useQuery({ queryKey: ["es-admin", uid], staleTime: 60_000, queryFn: async () => (await supabase.rpc("has_role", { _user_id: uid, _role: "responsable" })).data === true });
  const codigos = useQuery({
    queryKey: ["codigos-mentor"],
    enabled: esAdmin.data === true,
    queryFn: async () => (await supabase.from("codigos_mentor").select("*").order("creado_en", { ascending: false })).data ?? [],
  });
  const generar = async () => {
    setOcupado(true);
    const { data, error } = await supabase.rpc("generar_codigo_mentor");
    setOcupado(false);
    if (error || !data) { toast.error("No se pudo generar el código."); return; }
    await navigator.clipboard?.writeText(data).catch(() => {});
    toast.success(`Código ${data} creado y copiado.`);
    qc.invalidateQueries({ queryKey: ["codigos-mentor"] });
  };

  if (esAdmin.isLoading) return <Shell><p className="mt-6 text-sm text-muted-foreground">Cargando…</p></Shell>;
  if (!esAdmin.data) return <Shell><h1 className="mt-5 text-3xl font-bold">Administración</h1><p className="mt-2 text-sm text-muted-foreground">Esta sección es solo para la administración de Gemas.</p></Shell>;

  return (
    <Shell>
      <h1 className="mt-5 text-3xl font-bold">Administración</h1>
      <p className="text-sm text-muted-foreground">Genera un código y dáselo a la persona que se registrará como facilitador mentor. Cada código sirve una sola vez.</p>
      <Button className="mt-4 w-full" onClick={generar} disabled={ocupado}><KeyRound /> {ocupado ? "Generando…" : "Generar código de mentor"}</Button>
      <Seccion titulo="Códigos generados">
        {codigos.data?.length ? (
          <ul className="space-y-2">
            {codigos.data.map((c) => (
              <li key={c.codigo} className="flex items-center justify-between gap-3 rounded-[20px] bg-card p-3 shadow-card">
                <span>
                  <span className="block font-display text-lg font-bold tracking-widest">{c.codigo}</span>
                  <span className="text-xs text-muted-foreground">{c.usado_por ? `Usado el ${new Date(c.usado_en!).toLocaleDateString("es-ES")}` : `Disponible · creado el ${new Date(c.creado_en).toLocaleDateString("es-ES")}`}</span>
                </span>
                {!c.usado_por && <Button variant="soft" size="icon" aria-label={`Copiar ${c.codigo}`} onClick={() => navigator.clipboard?.writeText(c.codigo).then(() => toast.success("Copiado."))}><Copy className="size-4" /></Button>}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Aún no has generado códigos.</p>}
      </Seccion>
    </Shell>
  );
}
