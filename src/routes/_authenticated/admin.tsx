import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Shell, Seccion } from "@/components/gemas/Shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PROPOSITOS } from "@/lib/donacion";
import { getStripeEnvironment } from "@/lib/stripe";

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
  const [correo, setCorreo] = useState("");
  const correoOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo.trim());
  const esAdmin = useQuery({ queryKey: ["es-admin", uid], staleTime: 60_000, queryFn: async () => (await supabase.rpc("has_role", { _user_id: uid, _role: "responsable" })).data === true });
  const codigos = useQuery({
    queryKey: ["codigos-mentor"],
    enabled: esAdmin.data === true,
    queryFn: async () => (await supabase.from("codigos_mentor").select("*").order("creado_en", { ascending: false })).data ?? [],
  });
  const donaciones = useQuery({
    queryKey: ["donaciones"],
    enabled: esAdmin.data === true,
    queryFn: async () => (await supabase.from("donaciones").select("*").eq("entorno", getStripeEnvironment()).order("created_at", { ascending: false }).limit(100)).data ?? [],
  });
  const generar = async () => {
    setOcupado(true);
    const { data, error } = await supabase.rpc("generar_codigo_mentor", { _correo: correo });
    setOcupado(false);
    if (error || !data) { toast.error("No se pudo generar el código."); return; }
    await navigator.clipboard?.writeText(data).catch(() => {});
    toast.success(`Código ${data} reservado para ${correo.trim()} y copiado.`);
    setCorreo("");
    qc.invalidateQueries({ queryKey: ["codigos-mentor"] });
  };

  if (esAdmin.isLoading) return <Shell><p className="mt-6 text-sm text-muted-foreground">Cargando…</p></Shell>;
  if (!esAdmin.data) return <Shell><h1 className="mt-5 text-3xl font-bold">Administración</h1><p className="mt-2 text-sm text-muted-foreground">Esta sección es solo para la administración de Gemas.</p></Shell>;

  return (
    <Shell>
      <h1 className="mt-5 text-3xl font-bold">Administración</h1>
      <p className="text-sm text-muted-foreground">Genera un código y dáselo a la persona que se registrará como facilitador mentor. Cada código queda reservado para un correo y sirve una sola vez.</p>
      <label className="mt-4 block text-sm font-bold">Correo de la persona que será mentor<input type="email" value={correo} onChange={(ev) => setCorreo(ev.target.value)} placeholder="nombre@correo.com" className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal" /><span className="mt-1 block text-xs font-normal text-muted-foreground">Solo quien entre en Gemas con este correo podrá usar el código.</span></label>
      <Button className="mt-3 w-full" onClick={generar} disabled={ocupado || !correoOk}><KeyRound /> {ocupado ? "Generando…" : "Generar código de mentor"}</Button>
      <Seccion titulo="Donaciones recibidas">
        {donaciones.data?.length ? (
          <>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {PROPOSITOS.map((p) => {
                const total = donaciones.data.filter((d) => d.proposito === p.id).reduce((a, d) => a + d.importe_centimos, 0) / 100;
                return <div key={p.id} className="rounded-2xl bg-menta-soft p-3 text-center"><span className="block font-display text-lg font-bold">{total.toLocaleString("es-ES")} €</span><span className="text-[11px] leading-tight">{p.titulo}</span></div>;
              })}
            </div>
            <ul className="space-y-2">
              {donaciones.data.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-[20px] bg-card p-3 text-sm shadow-card">
                  <span><span className="block font-bold">{PROPOSITOS.find((p) => p.id === d.proposito)?.titulo ?? d.proposito}</span><span className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString("es-ES")}{d.mensual ? " · mensual" : " · única"}</span></span>
                  <span className="font-display text-lg font-bold">{(d.importe_centimos / 100).toLocaleString("es-ES")} €</span>
                </li>
              ))}
            </ul>
          </>
        ) : <p className="text-sm text-muted-foreground">Aún no hay donaciones.</p>}
      </Seccion>
      <Seccion titulo="Códigos generados">
        {codigos.data?.length ? (
          <ul className="space-y-2">
            {codigos.data.map((c) => (
              <li key={c.codigo} className="flex items-center justify-between gap-3 rounded-[20px] bg-card p-3 shadow-card">
                <span>
                  <span className="block font-display text-lg font-bold tracking-widest">{c.codigo}</span>
                  <span className="block text-xs">{c.correo ?? "Sin persona asignada (no se puede usar)"}</span>
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
