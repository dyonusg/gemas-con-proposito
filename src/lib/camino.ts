import { PASOS, type PasoId } from "./contenido";
import type { RegistroPaso } from "./store";

/** El siguiente paso es el primero del camino que aún no se ha dirigido. */
export function siguientePaso(pasos: Partial<Record<PasoId, RegistroPaso>>): PasoId | null {
  return PASOS.find((p) => !pasos[p.id]?.dirigido)?.id ?? null;
}

export function contarDirigidos(pasos: Partial<Record<PasoId, RegistroPaso>>) {
  return PASOS.filter((p) => pasos[p.id]?.dirigido).length;
}
