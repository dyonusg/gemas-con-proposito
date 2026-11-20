export const PROPOSITOS = [
  { id: "campus", titulo: "Próximos campus", descripcion: "Ayuda a organizar nuevos grupos de peques y facilitadores." },
  { id: "materiales", titulo: "Libros y materiales para los peques", descripcion: "Libros, colores, papel y todo lo necesario para los grupos." },
  { id: "app", titulo: "Seguir mejorando la app", descripcion: "Mantener Gemas y añadir nuevas herramientas." },
] as const;
export type PropositoId = (typeof PROPOSITOS)[number]["id"];
export const IMPORTES = [5, 10, 25] as const;
export const MINIMO_EUR = 1;
export const MAXIMO_EUR = 10000;

export function esProposito(v: unknown): v is PropositoId {
  return PROPOSITOS.some((p) => p.id === v);
}
/** Convierte euros a céntimos, o null si el importe no es válido. */
export function aCentimos(eur: number): number | null {
  if (!Number.isFinite(eur) || eur < MINIMO_EUR || eur > MAXIMO_EUR) return null;
  return Math.round(eur * 100);
}
