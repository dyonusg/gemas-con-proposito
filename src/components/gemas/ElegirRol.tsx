import { CheckCircle2, HeartHandshake, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TipoUsuario } from "@/lib/camino";

type Rol = {
  id: TipoUsuario;
  titulo: string;
  para: string;
  hace: string;
  veras: string;
  extra: string;
  icon: typeof Sprout;
};

/** Los dos roles con los que se puede registrar una persona en Gemas. */
export const ROLES: Rol[] = [
  {
    id: "formacion",
    titulo: "Facilitador en formación",
    para: "Empiezas tú",
    hace: "Recorres el camino paso a paso: preparas y diriges las lecciones con los peques.",
    veras: "Camino · Mis gemas · Tarjeta · Cierre",
    extra: "No necesitas ningún código.",
    icon: Sprout,
  },
  {
    id: "mentor",
    titulo: "Facilitador mentor",
    para: "Ya tienes experiencia dirigiendo",
    hace: "Acompañas a quien se está formando: consultas lecciones, ves los avances que te compartan y guardas tus propias reflexiones.",
    veras: "Acompañar · Lecciones · Reflexiones · Tarjeta",
    extra: "Necesitas un código que da la administración de Gemas.",
    icon: HeartHandshake,
  },
];

export function ElegirRol({ valor, onChange }: { valor: TipoUsuario; onChange: (t: TipoUsuario) => void }) {
  return (
    <fieldset>
      <legend className="text-base font-bold">¿Cómo quieres empezar en Gemas?</legend>
      <p className="mt-1 text-xs text-muted-foreground">
        Elige la que más se parezca a ti ahora. El camino va de colaborador a facilitador.
      </p>
      <div className="mt-3 grid gap-2" role="radiogroup" aria-label="Forma de participar en Gemas">
        {ROLES.map(({ id, titulo, para, hace, veras, extra, icon: Icon }) => {
          const activo = valor === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => onChange(id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition-colors",
                activo ? "border-menta bg-menta-soft" : "border-border bg-card hover:border-coral",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
                  activo ? "bg-menta text-tinta" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-bold">{titulo}</span>
                  {activo && <CheckCircle2 className="size-4 shrink-0 text-menta" aria-hidden />}
                </span>
                <span className="mt-0.5 block text-xs font-bold text-muted-foreground">{para}</span>
                <span className="mt-1 block text-sm leading-snug">{hace}</span>
                <span className="mt-1.5 block text-xs font-bold">Verás: {veras}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{extra}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Podrás cambiarlo desde tu perfil. Para volver a mentor hace falta otro código.
      </p>
    </fieldset>
  );
}
