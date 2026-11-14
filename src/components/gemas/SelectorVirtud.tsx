import { useId, useState } from "react";
import { Check, ChevronDown, Gem, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLecciones } from "@/lib/leccion";
import { actualizar, useGemas } from "@/lib/store";
import { propositoVirtud } from "@/lib/virtudes";

export function SelectorLeccion({ etiqueta = "Virtud de esta semana", valor, onCambiar }: { etiqueta?: string; valor?: number; onCambiar?: (numero: number) => void }) {
  const { leccionActual } = useGemas();
  const seleccion = valor ?? leccionActual;
  const lecciones = useLecciones();
  const elegida = lecciones.find((l) => l.numero === seleccion);
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const etiquetaId = useId();
  const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const visibles = lecciones.filter((l) => normalizar(l.cualidad).includes(normalizar(busqueda.trim())));

  return (
    <div className="mt-3">
      <p id={etiquetaId} className="mb-1.5 text-sm font-bold text-muted-foreground">{etiqueta}</p>
      <Popover open={abierto} onOpenChange={(valor) => { setAbierto(valor); setBusqueda(""); }}>
        <PopoverTrigger asChild>
          <Button variant="soft" aria-labelledby={etiquetaId} disabled={!lecciones.length} className="h-auto min-h-28 w-full justify-start gap-3 whitespace-normal rounded-[20px] p-4 text-left">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-menta-soft text-menta"><Gem aria-hidden="true" /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-xl leading-tight">{elegida?.cualidad ?? "Cargando virtudes…"}</span>
              {elegida && <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{propositoVirtud(elegida.numero)}</span>}
            </span>
            <ChevronDown className="text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] rounded-[20px] p-2">
          <div className="relative mb-2">
            <Search className="absolute top-3 left-3 size-4 text-muted-foreground" aria-hidden="true" />
            <Input aria-label="Buscar virtud" placeholder="Buscar virtud" value={busqueda} onChange={(ev) => setBusqueda(ev.target.value)} className="pl-9" />
          </div>
          <div className="max-h-[min(22rem,var(--radix-popover-content-available-height))] space-y-1 overflow-y-auto" role="group" aria-label="Virtudes">
            {visibles.map((l) => (
              <Button key={l.numero} variant="ghost" aria-pressed={l.numero === seleccion} onClick={() => {
                if (onCambiar) onCambiar(l.numero);
                else actualizar((s) => ({ ...s, leccionActual: l.numero }));
                setAbierto(false);
              }} className={`h-auto min-h-20 w-full justify-start gap-2 whitespace-normal rounded-xl px-3 py-3 text-left ${l.numero === seleccion ? "bg-menta-soft" : ""}`}>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold">{l.cualidad}</span>
                  <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{propositoVirtud(l.numero)}</span>
                </span>
                {l.numero === seleccion && <Check className="text-menta" aria-hidden="true" />}
              </Button>
            ))}
            {!visibles.length && <p className="p-3 text-sm text-muted-foreground" role="status">No encontramos esa virtud.</p>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}