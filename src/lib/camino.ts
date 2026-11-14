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

import type { Compartir } from "./store";
/** Quién puede leer una reflexión según lo que eligió el colaborador. */
export function puedeVer(compartir: Compartir | undefined, quien: "mentor" | "companero"): boolean {
  const c = compartir ?? "solo_yo";
  if (quien === "mentor") return c === "mentor" || c === "todos";
  return c === "todos";
}

/** Lenguaje del camino: quien guía es facilitador, no maestro. */
export const suavizar = (t: string) => t.replace(/\bmaestr[oa]s?\b/gi, (m) => (/s$/i.test(m) ? "facilitadores" : "facilitador")).replace(/^facilitador/, "Facilitador");

/** Convierte el texto de una dinámica o manualidad en pasos numerados. */
export function enPasos(texto: string | null | undefined): { titulo?: string | undefined; pasos: string[] } {
  if (!texto?.trim()) return { pasos: [] };
  const limpio = suavizar(texto.trim());
  const lineas = limpio.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lineas.length > 1) return { pasos: lineas.map((l) => l.replace(/^\d+[.)]\s*/, "")) };
  let cuerpo = limpio;
  let titulo: string | undefined;
  const m = cuerpo.match(/^«([^»]+)»\s*:\s*/);
  if (m) {
    titulo = m[1];
    cuerpo = cuerpo.slice(m[0].length);
  }
  const pasos = cuerpo
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡«])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  return { titulo, pasos };
}

export type TipoUsuario = "formacion" | "mentor";
/** Navegación inferior según el tipo de usuario (sin elegir = facilitador en formación). */
export function navPara(tipo: TipoUsuario | null) {
  return tipo === "mentor"
    ? (["/", "/mentor", "/lecciones", "/reflexiones", "/tarjeta"] as const)
    : (["/", "/camino", "/gemas", "/tarjeta", "/cierre"] as const);
}
export const esCodigoMentor = (c: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.trim());
