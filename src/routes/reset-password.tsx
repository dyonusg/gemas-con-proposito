import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/gemas/Shell";
import { supabase } from "@/integrations/supabase/client";
import { useAcceso } from "@/components/gemas/Acceso";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña · Gemas" },
      { name: "description", content: "Crea una contraseña nueva para tu cuenta de Gemas." },
      { property: "og:title", content: "Nueva contraseña · Gemas" },
      { property: "og:description", content: "Recupera el acceso a tu camino guardado en Gemas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NuevaClave,
});

function NuevaClave() {
  const navigate = useNavigate();
  const { salir } = useAcceso();
  const [lista, setLista] = useState(false);
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    const { data } = supabase.auth.onAuthStateChange((ev, s) => {
      if (ev === "PASSWORD_RECOVERY" || (recovery && s)) setLista(true);
    });
    if (recovery) void supabase.auth.getUser().then(({ data }) => data.user && setLista(true));
    return () => data.subscription.unsubscribe();
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clave !== clave2) return setAviso("Las contraseñas no coinciden.");
    setCargando(true);
    const { error } = await supabase.auth.updateUser({ password: clave });
    setCargando(false);
    if (error) setAviso("No hemos podido cambiarla. Pide otro enlace e inténtalo de nuevo.");
    else { await salir(); navigate({ to: "/auth", replace: true }); }
  };

  return (
    <Shell nav={false}>
      <h1 className="mt-4 text-[32px] font-bold leading-[38px]">Nueva contraseña</h1>
      {!lista ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Abre esta página desde el enlace del correo. ¿No te ha llegado? <Link to="/auth" className="font-bold underline">Pide otro</Link>.
        </p>
      ) : (
        <form onSubmit={guardar} className="mt-5 grid gap-2 rounded-[20px] bg-card p-5 shadow-card">
          <input type="password" required minLength={8} value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Contraseña nueva" className="rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-coral" />
          <input type="password" required minLength={8} value={clave2} onChange={(e) => setClave2(e.target.value)} placeholder="Repite la contraseña" className="rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-coral" />
          <Button type="submit" disabled={cargando}>Guardar contraseña</Button>
          {aviso && <p className="text-sm font-bold">{aviso}</p>}
        </form>
      )}
    </Shell>
  );
}
