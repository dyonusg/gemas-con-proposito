import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAcceso } from "@/components/gemas/Acceso";
import logo from "@/assets/gemas-logo.svg.asset.json";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar o crear cuenta · Gemas" }, { name: "description", content: "Accede a Gemas con tu correo o Google y recupera tu contraseña." },
    { property: "og:title", content: "Entrar o crear cuenta · Gemas" }, { property: "og:description", content: "Tu cuenta personal para acompañar y aprender en Gemas." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Autenticacion,
});

function Autenticacion() {
  const { uid } = useAcceso();
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "crear" | "olvido">("entrar");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [repite, setRepite] = useState("");
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);
  useEffect(() => { if (uid) void navigate({ to: "/perfil", replace: true }); }, [uid, navigate]);
  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault(); setAviso("");
    if (modo === "crear" && clave !== repite) { setAviso("Las contraseñas no coinciden."); return; }
    setCargando(true);
    try {
      if (modo === "olvido") {
        const { error } = await supabase.auth.resetPasswordForEmail(correo, { redirectTo: `${window.location.origin}/reset-password` });
        setAviso(error ? "No se pudo enviar el enlace. Inténtalo más tarde." : "Si hay una cuenta con ese correo, recibirás un enlace para recuperar la contraseña.");
      } else if (modo === "crear") {
        const { data, error } = await supabase.auth.signUp({ email: correo, password: clave, options: { emailRedirectTo: window.location.origin } });
        setAviso(error ? "No se pudo crear la cuenta. Prueba una contraseña más segura o inténtalo más tarde." : !data.session ? "Revisa tu correo y confirma la cuenta antes de entrar." : "Cuenta creada.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
        if (error) setAviso("No hemos podido entrar. Revisa el correo, la contraseña y la confirmación de tu cuenta.");
      }
    } catch { setAviso("No hemos podido conectar. Inténtalo de nuevo."); }
    finally { setCargando(false); }
  };
  return <div className="mx-auto min-h-screen max-w-md px-6 py-8">
    <img src={logo.url} alt="Gemas" className="h-10 w-auto" />
    <img src={isotipo.url} alt="" className="mx-auto mt-8 size-24" />
    <h1 className="mt-5 text-3xl font-bold">{modo === "crear" ? "Crea tu cuenta" : modo === "olvido" ? "Recupera tu contraseña" : "Bienvenido a Gemas"}</h1>
    <p className="mt-2 text-sm text-muted-foreground">{modo === "olvido" ? "Te enviaremos un enlace a tu correo." : "Tu espacio para aprender, acompañar y guardar tus ideas."}</p>
    {modo !== "olvido" && <>
      <Button variant="outline" className="google-sign-in mt-6 w-full" disabled={cargando} onClick={async () => {
        setCargando(true); setAviso("");
        try { const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin }); if (result.error) setAviso("No se pudo entrar con Google. Inténtalo de nuevo."); }
        catch { setAviso("No se pudo entrar con Google. Inténtalo de nuevo."); }
        finally { setCargando(false); }
      }}>
        <svg aria-hidden="true" className="size-[18px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
        Continuar con Google
      </Button>
      <p className="my-4 text-center text-xs text-muted-foreground">o con tu correo</p>
    </>}
    <form onSubmit={enviar} className="mt-4 grid gap-3">
      <label className="text-sm font-bold">Correo<input type="email" autoComplete="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal" /></label>
      {modo !== "olvido" && <label className="text-sm font-bold">Contraseña<input type="password" autoComplete={modo === "crear" ? "new-password" : "current-password"} required minLength={modo === "crear" ? 8 : 1} value={clave} onChange={(e) => setClave(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal" /></label>}
      {modo === "crear" && <label className="text-sm font-bold">Repite la contraseña<input type="password" autoComplete="new-password" required minLength={8} value={repite} onChange={(e) => setRepite(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal" /></label>}
      <Button type="submit" disabled={cargando}>{cargando ? "Un momento…" : modo === "crear" ? "Crear cuenta" : modo === "olvido" ? "Enviar enlace" : "Entrar"}</Button>
    </form>
    {aviso && <p role="status" className="mt-3 rounded-xl bg-sol-soft p-3 text-sm">{aviso}</p>}
    {modo === "entrar" && <Button variant="link" className="mt-2 w-full" onClick={() => { setModo("olvido"); setAviso(""); }}>He olvidado mi contraseña</Button>}
    <Button variant="link" className="mt-2 w-full" onClick={() => { setModo(modo === "crear" ? "entrar" : modo === "olvido" ? "entrar" : "crear"); setAviso(""); }}>{modo === "entrar" ? "Crear una cuenta" : "Ya tengo cuenta, entrar"}</Button>
  </div>;
}