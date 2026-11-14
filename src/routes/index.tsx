import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Destello } from "@/components/gemas/Shell";
import { FechaNacimiento, MESES } from "@/components/gemas/FechaNacimiento";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { actualizar, reiniciar, useGemas } from "@/lib/store";
import { esMenor } from "@/lib/camino";
import { supabase } from "@/integrations/supabase/client";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";
import logo from "@/assets/gemas-logo.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gemas · De colaborador a facilitador" },
      { name: "description", content: "Un camino acompañado para que los jóvenes colaboradores den el paso a facilitar las clases de niños." },
      { property: "og:title", content: "Gemas · De colaborador a facilitador" },
      { property: "og:description", content: "Sirve con un compañero de camino, descubre tus gemas y avanza paso a paso hasta facilitar una clase." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bienvenida,
});

function Bienvenida() {
  const estado = useGemas();
  const navigate = useNavigate();
  const [alias, setAlias] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);
  const [consiente, setConsiente] = useState(false);
  const [tipo, setTipo] = useState<"formacion" | "mentor">("formacion");
  const [cambiando, setCambiando] = useState(false);
  const [conCuenta, setConCuenta] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setConCuenta(!!data.session));
  }, []);

  const destino = estado.tipo === "mentor" ? "/mentor" : "/camino";

  const cambiarPerfil = () => {
    reiniciar();
    setAlias("");
    setNacimiento("");
    setConsiente(false);
    setTipo("formacion");
    setCambiando(true);
  };

  if (estado.alias && !cambiando) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <img src={isotipo.url} alt="" className="h-32 w-32 animate-pop" />
        <h1 className="mt-6 text-3xl font-extrabold">¡Hola, {estado.alias}!</h1>
        <p className="mt-2 text-muted-foreground">Tu camino te espera donde lo dejaste.</p>
        <Button size="lg" className="mt-6 w-full" onClick={() => navigate({ to: destino })}>
          Continuar mi camino
        </Button>
        {conCuenta ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Tienes sesión iniciada. Para cambiar de perfil, cierra sesión primero en «Guardar mi camino».
          </p>
        ) : (
          <button type="button" onClick={cambiarPerfil} className="mt-4 text-sm font-bold text-coral underline underline-offset-4">
            Cambiar de perfil
          </button>
        )}
      </div>
    );
  }

  const menor = nacimiento ? esMenor(nacimiento) : false;
  const listo = alias.trim() && nacimiento && (!menor || consiente);
  const [aN, mN, dN] = nacimiento ? nacimiento.split("-").map(Number) : [0, 1, 0];
  const resumenNacimiento = nacimiento ? `${dN} de ${(MESES[(mN ?? 1) - 1] ?? "").toLowerCase()} de ${aN}` : "";

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listo) return;
    actualizar((s) => ({ ...s, alias: alias.trim(), fechaNacimiento: nacimiento, consentimiento: true, tipo }));
    navigate({ to: tipo === "mentor" ? "/mentor" : "/camino" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
      <img src={logo.url} alt="Gemas" className="h-10 w-auto self-start" />

      <div className="relative mt-10 flex justify-center">
        <div className="absolute inset-x-10 top-6 h-40 rounded-full bg-gema opacity-25 blur-3xl" />
        <img src={isotipo.url} alt="" className="relative h-40 w-40 animate-pop" />
      </div>

      <h1 className="mt-8 text-[40px] font-extrabold leading-[44px]">
        De colaborador <br />
        a facilitador<Destello className="ml-1 inline size-6 -translate-y-4" />
      </h1>
      <p className="mt-3 text-muted-foreground">
        Ya colaboras en una clase de niños. Gemas te acompaña, paso a paso y con un compañero de camino, para que te atrevas a facilitarla.
      </p>

      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex gap-3"><Heart className="size-5 shrink-0 text-coral" /> Ve el efecto de tu servicio en los niños.</li>
        <li className="flex gap-3"><Users className="size-5 shrink-0 text-menta" /> Sirves con tu compañero de camino y tu mentor te acompaña.</li>
        <li className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-lavanda" /> No necesitas experiencia previa. Aquí cabe todo el mundo.</li>
      </ul>

      <form onSubmit={entrar} className="mt-8 rounded-[20px] bg-card p-5 shadow-card">
        <p className="text-sm font-bold">¿Cómo usarás Gemas?</p>
        <div className="mt-2 mb-4 grid grid-cols-2 gap-2">
          {([["formacion", "Facilitador en formación", "Recorro el camino"], ["mentor", "Facilitador mentor", "Acompaño a otros"]] as const).map(([v, t, d]) => (
            <button type="button" key={v} onClick={() => setTipo(v)} aria-pressed={tipo === v}
              className={`rounded-xl border-2 p-3 text-left ${tipo === v ? "border-coral bg-coral-soft" : "border-input"}`}>
              <span className="block text-sm font-bold leading-tight">{t}</span>
              <span className="text-xs text-muted-foreground">{d}</span>
            </button>
          ))}
        </div>
        <label htmlFor="alias" className="text-sm font-bold">Elige un alias</label>
        <input
          id="alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          maxLength={20}
          placeholder="Por ejemplo: Rayo"
          className="mt-2 h-12 w-full rounded-xl border-2 border-input bg-background px-4 outline-none focus:border-coral"
        />
        <p className="mt-2 text-xs text-muted-foreground">Sin email ni datos personales. Solo tu alias.</p>

        <label htmlFor="nacimiento" className="mt-4 block text-sm font-bold">Tu fecha de nacimiento</label>
        <Popover open={calendarioAbierto} onOpenChange={setCalendarioAbierto}>
          <PopoverTrigger asChild>
            <button
              id="nacimiento"
              type="button"
              className={`mt-2 flex h-12 w-full items-center gap-2 rounded-xl border-2 border-input bg-background px-4 text-left outline-none focus:border-coral ${nacimiento ? "font-bold" : "text-muted-foreground"}`}
            >
              <CalendarIcon className="size-5 shrink-0 text-coral" />
              {nacimiento ? resumenNacimiento : "Toca para elegir"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 pointer-events-auto" align="start">
            <FechaNacimiento
              value={nacimiento}
              onChange={(v) => {
                setNacimiento(v);
                setCalendarioAbierto(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {menor && (
          <label className="mt-4 flex items-start gap-3 text-sm">
            <input type="checkbox" checked={consiente} onChange={(e) => setConsiente(e.target.checked)} className="mt-1 size-5 accent-coral" />
            <span>Mi familia ha firmado el consentimiento en papel al inscribirme en el campus.</span>
          </label>
        )}

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={!listo}>
          {tipo === "mentor" ? "Empezar a acompañar" : "Empezar mi camino"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Proyecto educativo y sin ánimo de lucro. Complementa los materiales del Instituto Ruhí, nunca los sustituye.
      </p>
    </div>
  );
}
