import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Map, Gem, Mail, Flag, HeartHandshake, BookOpen } from "lucide-react";
import { useGemas } from "@/lib/store";
import { navPara } from "@/lib/camino";
import logo from "@/assets/gemas-logo.svg.asset.json";

const ITEMS = {
  "/camino": { label: "Camino", icon: Map },
  "/gemas": { label: "Mis gemas", icon: Gem },
  "/tarjeta": { label: "Tarjeta", icon: Mail },
  "/cierre": { label: "Cierre", icon: Flag },
  "/mentor": { label: "Acompañar", icon: HeartHandshake },
} as const;

export function Shell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  const { tipo } = useGemas();
  const rutas = navPara(tipo);
  const NAV = rutas.map((to) => ({ to, ...ITEMS[to], ...(tipo === "mentor" && to === "/camino" ? { label: "Lecciones", icon: BookOpen } : {}) }));
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <Link to="/camino" aria-label="Gemas, inicio">
          <img src={logo.url} alt="Gemas" className="h-9 w-auto" />
        </Link>
        <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
          {tipo === "mentor" ? "Facilitador mentor" : "Facilitador en formación"}
        </span>
      </header>
      <main className={`flex-1 px-5 ${nav ? "pb-28" : "pb-10"}`}>{children}</main>
      {nav && (
        <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md px-4 pb-4">
          <ul style={{ gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))` }} className="grid rounded-3xl bg-tinta p-2 shadow-card">
            {NAV.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
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
