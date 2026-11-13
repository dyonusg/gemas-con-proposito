import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Destello } from "@/components/gemas/Shell";
import { actualizar, useGemas } from "@/lib/store";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";
import logo from "@/assets/gemas-logo.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gemas · Del ayudante al maestro" },
      { name: "description", content: "Un camino acompañado para que los jóvenes ayudantes den el paso a dirigir las clases de niños." },
      { property: "og:title", content: "Gemas · Del ayudante al maestro" },
      { property: "og:description", content: "Sirve en pareja, descubre tus gemas y avanza paso a paso hasta dirigir una clase." },
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
  const [consiente, setConsiente] = useState(false);

  useEffect(() => {
    if (estado.alias) navigate({ to: "/camino" });
  }, [estado.alias, navigate]);

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim() || !consiente) return;
    actualizar((s) => ({ ...s, alias: alias.trim(), consentimiento: true }));
    navigate({ to: "/camino" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
      <img src={logo.url} alt="Gemas" className="h-10 w-auto self-start" />

      <div className="relative mt-10 flex justify-center">
        <div className="absolute inset-x-10 top-6 h-40 rounded-full bg-gema opacity-25 blur-3xl" />
        <img src={isotipo.url} alt="" className="relative h-40 w-40 animate-pop" />
      </div>

      <h1 className="mt-8 text-[40px] font-extrabold leading-[44px]">
        Del ayudante <br />
        al maestro<Destello className="ml-1 inline size-6 -translate-y-4" />
      </h1>
      <p className="mt-3 text-muted-foreground">
        Ya ayudas en una clase de niños. Gemas te acompaña, paso a paso y en pareja, para que te atrevas a ponerte al frente.
      </p>

      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex gap-3"><Heart className="size-5 shrink-0 text-coral" /> Ve el efecto de tu servicio en los niños.</li>
        <li className="flex gap-3"><Users className="size-5 shrink-0 text-menta" /> Sirves con tu pareja y tu maestro te acompaña.</li>
        <li className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-lavanda" /> No necesitas ser bahá'í. Aquí cabe todo el mundo.</li>
      </ul>

      <form onSubmit={entrar} className="mt-8 rounded-[20px] bg-card p-5 shadow-card">
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

        <label className="mt-4 flex items-start gap-3 text-sm">
          <input type="checkbox" checked={consiente} onChange={(e) => setConsiente(e.target.checked)} className="mt-1 size-5 accent-coral" />
          <span>Mi familia ha firmado el consentimiento en papel al inscribirme en el campus.</span>
        </label>

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={!alias.trim() || !consiente}>
          Empezar mi camino
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Proyecto educativo y sin ánimo de lucro. Complementa los materiales del Instituto Ruhí, nunca los sustituye.
      </p>
    </div>
  );
}
