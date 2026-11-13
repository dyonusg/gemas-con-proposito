import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Cloud, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/gemas/Shell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/guardar")({
  head: () => ({
    meta: [
      { title: "Guardar mi camino · Gemas" },
      { name: "description", content: "Opcional: guarda tu camino para verlo en otro móvil y que tu mentor lo confirme." },
      { property: "og:title", content: "Guardar mi camino · Gemas" },
      { property: "og:description", content: "Guardar tu camino es opcional. Sin cuenta, sigue en este móvil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Guardar,
});

function Guardar() {
  const [email, setEmail] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const [modo, setModo] = useState<"entrar" | "crear" | "olvido">("crear");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setListo(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setCargando(true);
    setAviso(null);
    if (modo === "olvido") {
      const { error } = await supabase.auth.resetPasswordForEmail(correo, { redirectTo: `${window.location.origin}/reset-password` });
      setCargando(false);
      setAviso(error ? "No hemos podido enviar el correo. Inténtalo más tarde." : "Si hay una cuenta con ese correo, te llegará un enlace para crear otra contraseña.");
      return;
    }
    const { data, error } =
      modo === "crear"
        ? await supabase.auth.signUp({ email: correo, password: clave, options: { emailRedirectTo: `${window.location.origin}/guardar` } })
        : await supabase.auth.signInWithPassword({ email: correo, password: clave });
    setCargando(false);
    if (error) setAviso(modo === "entrar" ? "No hemos podido entrar. Revisa el correo y la contraseña." : error.message);
    else if (modo === "crear" && !data.session) setAviso("Te hemos enviado un correo. Ábrelo para activar tu cuenta.");
  };

  return (
    <Shell>
      <Link to="/camino" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground">
        <ArrowLeft className="size-4" /> Mi camino
      </Link>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Guardar mi camino</h1>
      <p className="text-sm text-muted-foreground">Es opcional. Si no quieres, puedes seguir usando Gemas igual.</p>

      <div className="mt-5 grid gap-3">
        <div className="flex gap-3 rounded-[20px] bg-card p-4 shadow-card">
          <Smartphone className="size-5 shrink-0 text-coral" />
          <p className="text-sm"><strong>Sin cuenta:</strong> tu camino se queda solo en este móvil.</p>
        </div>
        <div className="flex gap-3 rounded-[20px] bg-card p-4 shadow-card">
          <Cloud className="size-5 shrink-0 text-menta" />
          <p className="text-sm"><strong>Con cuenta:</strong> lo ves en cualquier móvil y tu mentor puede confirmar tus pasos. Solo guardamos tu alias y tu camino.</p>
        </div>
      </div>

      {!listo ? null : email ? (
        <div className="mt-6 rounded-[20px] bg-menta-soft p-5">
          <p className="font-display text-xl font-bold">Tu camino está guardado</p>
          <p className="text-sm text-muted-foreground">Cuenta: {email}</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild><Link to="/camino">Volver a mi camino</Link></Button>
            <Button variant="soft" onClick={() => supabase.auth.signOut()}>Cerrar sesión</Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[20px] bg-card p-5 shadow-card">
          <Button variant="tinta" className="w-full" onClick={() => lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/guardar` })}>
            Continuar con Google
          </Button>
          <p className="my-3 text-center text-xs text-muted-foreground">o con tu correo</p>
          <form onSubmit={enviar} className="grid gap-2">
            <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" className="rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-coral" />
            {modo !== "olvido" && <input type="password" required minLength={6} value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Contraseña" className="rounded-xl border-2 border-input bg-card p-3 text-sm outline-none focus:border-coral" />}
            <Button type="submit" disabled={cargando}>{modo === "crear" ? "Crear cuenta y guardar" : modo === "entrar" ? "Entrar" : "Enviarme el enlace"}</Button>
          </form>
          {aviso && <p className="mt-2 text-sm font-bold">{aviso}</p>}
          {modo === "entrar" && (
            <button className="mt-3 w-full text-center text-sm font-bold text-coral underline" onClick={() => { setModo("olvido"); setAviso(null); }}>
              He olvidado mi contraseña
            </button>
          )}
          <button className="mt-3 w-full text-center text-sm font-bold text-muted-foreground underline" onClick={() => { setModo(modo === "crear" ? "entrar" : "crear"); setAviso(null); }}>
            {modo === "crear" ? "Ya tengo cuenta" : "Crear una cuenta nueva"}
          </button>
          <Link to="/camino" className="mt-2 block text-center text-sm font-bold text-muted-foreground">Ahora no, seguir sin cuenta</Link>
        </div>
      )}
    </Shell>
  );
}
