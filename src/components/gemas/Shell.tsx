import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Map, Gem, Mail, Flag, HeartHandshake, BookOpen, House, NotebookPen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { actualizar, useGemas } from "@/lib/store";
import { navPara } from "@/lib/camino";
import { useLecciones } from "@/lib/leccion";
import logo from "@/assets/gemas-logo.svg.asset.json";

const ITEMS = {
  "/": { label: "Inicio", icon: House },
  "/camino": { label: "Camino", icon: Map },
  "/gemas": { label: "Mis gemas", icon: Gem },
  "/tarjeta": { label: "Tarjeta", icon: Mail },
  "/cierre": { label: "Cierre", icon: Flag },
  "/mentor": { label: "Acompañar", icon: HeartHandshake },
  "/lecciones": { label: "Lecciones", icon: BookOpen },
  "/reflexiones": { label: "Reflexiones", icon: NotebookPen },
} as const;

export function Shell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  const { tipo } = useGemas();
  const [conCuenta, setConCuenta] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  useEffect(() => {
    let activo = true;
    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      if (activo) setConCuenta(Boolean(sesion?.user));
    });
    void supabase.auth.getUser().then(({ data }) => {
      if (activo) setConCuenta(Boolean(data.user));
    });
    return () => { activo = false; data.subscription.unsubscribe(); };
  }, []);
  const cerrarSesion = async () => {
    setSaliendo(true);
    const { error } = await supabase.auth.signOut();
    setSaliendo(false);
    if (error) toast.error("No hemos podido cerrar sesión. Inténtalo de nuevo.");
    else toast.success("Sesión cerrada. Puedes seguir usando Gemas sin cuenta.");
  };
  const rutas = navPara(tipo);
  const NAV = rutas.map((to) => ({ to, ...ITEMS[to] }));
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <Link to="/" aria-label="Gemas, inicio">
          <img src={logo.url} alt="Gemas" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-1">
        <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
          {tipo === "mentor" ? "Facilitador mentor" : "Facilitador en formación"}
        </span>
        {conCuenta && <Button variant="soft" size="icon" title="Cerrar sesión" aria-label="Cerrar sesión" disabled={saliendo} onClick={cerrarSesion}><LogOut className="size-4" /></Button>}
        </div>
      </header>
      <main className={`flex-1 px-5 ${nav ? "pb-28" : "pb-10"}`}>{children}</main>
      {nav && (
        <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md px-4 pb-4">
          <ul style={{ gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))` }} className="grid rounded-3xl bg-tinta p-2 shadow-card">
            {NAV.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  {...(to === "/" ? { activeOptions: { exact: true } } : {})}
                  className="flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold text-nube/70"
                  activeProps={{ className: "bg-nube/10 text-sol" }}
                >
                  <Icon className="size-5" strokeWidth={2.2} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function Destello({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path d="M14,0 Q16,12 28,14 Q16,16 14,28 Q12,16 0,14 Q12,12 14,0 Z" className="fill-sol" />
    </svg>
  );
}

export function SelectorLeccion({ etiqueta = "Gema de esta semana" }: { etiqueta?: string }) {
  const { leccionActual } = useGemas();
  const lecciones = useLecciones();
  return (
    <label className="mt-3 block text-sm text-muted-foreground">
      {etiqueta}
      <select
        value={leccionActual}
        onChange={(ev) => actualizar((s) => ({ ...s, leccionActual: Number(ev.target.value) }))}
        className="mt-1 block w-full rounded-xl border-2 border-input bg-card p-2.5 text-base font-bold text-foreground"
      >
        {lecciones.map((l) => <option key={l.numero} value={l.numero}>{l.numero}. {l.cualidad} · {l.color_gema}</option>)}
        {!lecciones.length && <option value={leccionActual}>Lección {leccionActual}</option>}
      </select>
    </label>
  );
}

export function Seccion({ titulo, children, extra }: { titulo: string; children: ReactNode; extra?: ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">{titulo}</h2>
        {extra}
      </div>
      {children}
    </section>
  );
}
