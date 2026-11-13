import { PASOS, type PasoId } from "./contenido";
import type { RegistroPaso } from "./store";

/** El siguiente paso es el primero del camino que aún no se ha dirigido. */
export function siguientePaso(pasos: Partial<Record<PasoId, RegistroPaso>>): PasoId | null {
  return PASOS.find((p) => !pasos[p.id]?.dirigido)?.id ?? null;
}

export function contarDirigidos(pasos: Partial<Record<PasoId, RegistroPaso>>) {
  return PASOS.filter((p) => pasos[p.id]?.dirigido).length;
}

/** Menor de edad = aún no ha cumplido 18 años en la fecha de referencia. */
export function esMenor(fechaNacimiento: string, hoy: Date = new Date()): boolean {
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return false;
  const cumple18 = new Date(nacimiento);
  cumple18.setFullYear(cumple18.getFullYear() + 18);
  return hoy < cumple18;
}
