import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { solicitarCodigo, verificarCodigo } from "@/lib/acceso-otp";
import { lovable } from "@/integrations/lovable";
import { useAcceso } from "@/components/gemas/Acceso";
import logo from "@/assets/gemas-logo.svg.asset.json";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar o crear cuenta · Gemas" }, { name: "description", content: "Accede a Gemas con un código de un solo uso por correo o con Google, sin contraseña." },
    { property: "og:title", content: "Entrar o crear cuenta · Gemas" }, { property: "og:description", content: "Tu cuenta personal para acompañar y aprender en Gemas." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Autenticacion,
});

function Autenticacion() {
  const { uid } = useAcceso();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [correoEnviado, setCorreoEnviado] = useState("");
  const [codigo, setCodigo] = useState("");
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);
  useEffect(() => { if (uid) void navigate({ to: "/perfil", replace: true }); }, [uid, navigate]);
  const pedirCodigo = async () => {
    setAviso(""); setCargando(true);
    try {
      const { error } = await solicitarCodigo(correo, `${window.location.origin}/auth`);
      if (error) {
        setAviso(error.status === 429 ? "Espera un poco antes de pedir otro código." : "No se pudo enviar el código. Inténtalo de nuevo más tarde.");
        return;
      }
      setCorreoEnviado(correo.trim().toLowerCase());
      setCodigo("");
      setAviso("Revisa tu correo, incluida la carpeta de spam.");
    } catch { setAviso("No hemos podido conectar. Inténtalo de nuevo."); }
    finally { setCargando(false); }
  };
  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!correoEnviado) { await pedirCodigo(); return; }
    setAviso(""); setCargando(true);
    try { await verificarCodigo(correoEnviado, codigo); }
    catch { setAviso("El código no es válido o ha caducado. Revísalo o pide uno nuevo."); }
    finally { setCargando(false); }
  };
  return <div className="mx-auto min-h-screen max-w-md px-6 py-8">
    <Link to="/" aria-label="Gemas, volver al inicio"><img src={logo.url} alt="Gemas" className="h-10 w-auto" /></Link>
    <img src={isotipo.url} alt="" className="mx-auto mt-8 size-24" />
    <h1 className="mt-5 text-3xl font-bold">{correoEnviado ? "Revisa tu correo" : "Bienvenido a Gemas"}</h1>
    <p className="mt-2 text-sm text-muted-foreground">{correoEnviado ? `Hemos enviado un código de un solo uso a ${correoEnviado}.` : "Entra o crea tu cuenta con tu correo, sin contraseña."}</p>
    {!correoEnviado && <>
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
      {!correoEnviado ? <label className="text-sm font-bold">Correo<input type="email" autoComplete="email" required disabled={cargando} value={correo} onChange={(e) => setCorreo(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal" /></label> :
        <label className="text-sm font-bold">Código del correo<input type="text" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6,8}" minLength={6} maxLength={8} value={codigo} disabled={cargando} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 text-center text-2xl font-bold" /></label>}
      <Button type="submit" disabled={cargando}>{cargando ? "Un momento…" : correoEnviado ? "Confirmar y entrar" : "Enviar código"}</Button>
    </form>
    {aviso && <p role="status" className="mt-3 rounded-xl bg-sol-soft p-3 text-sm">{aviso}</p>}
    {correoEnviado ? <div className="mt-2 grid gap-1">
      <Button variant="link" disabled={cargando} onClick={() => void pedirCodigo()}>Enviar un código nuevo</Button>
      <Button variant="link" disabled={cargando} onClick={() => { setCorreoEnviado(""); setCodigo(""); setAviso(""); }}>Cambiar correo</Button>
    </div> : <p className="mt-4 text-xs text-muted-foreground">Si es tu primera vez, al entrar elegirás si recorres el camino o acompañas a otras personas.</p>}
    <Link to="/donar" className="mt-6 block rounded-[20px] bg-coral-soft p-4 text-center text-sm font-bold">💛 ¿Quieres apoyar Gemas? Haz una donación, sin necesidad de cuenta</Link>
  </div>;
}