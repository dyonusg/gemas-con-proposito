import { useSyncExternalStore } from "react";
import type { PasoId } from "./contenido";

// Solo memoria durante la sesión; el estado persistente pertenece al usuario en Cloud.
export type RegistroPaso = { dirigido: boolean; fecha?: string; confirmado?: boolean | undefined; reconocimiento?: string | undefined };
export type Compartir = "solo_yo" | "mentor" | "todos";
export type Nota = { id: string; fecha: string; texto: string; pregunta?: string | undefined; leccion?: number | undefined; compartir?: Compartir | undefined; editada?: string | undefined };
export type Tarjeta = { id: string; fecha: string; virtud: string; cita: string; cancion: string; idea: string; mensaje?: string | undefined; estado: "enviada" | "reenviada" };
export type Encuesta = { sentimiento: string; acompanado: string; seguir: string; comentario: string };

export type Tipo = "formacion" | "mentor";
export type Estado = {
  alias: string | null;
  tipo: Tipo | null;
  mentorCodigo: string;
  fechaNacimiento: string | null;
  consentimiento: boolean;
  pareja: string;
  leccionActual: number;
  pasos: Partial<Record<PasoId, RegistroPaso>>;
  pasosPareja: Partial<Record<PasoId, RegistroPaso>>;
  reflexiones: Nota[];
  momentos: Nota[];
  tarjetas: Tarjeta[];
  encuesta: Encuesta | null;
};

export const ESTADO_INICIAL: Estado = {
  alias: null,
  tipo: null,
  mentorCodigo: "",
  fechaNacimiento: null,
  consentimiento: false,
  pareja: "Estrella",
  leccionActual: 1,
  pasos: {},
  pasosPareja: { cita: { dirigido: true, confirmado: true, reconocimiento: "¡Qué energía!" }, virtud: { dirigido: true } },
  reflexiones: [],
  momentos: [],
  tarjetas: [],
  encuesta: null,
};

let estado: Estado = ESTADO_INICIAL;
const oyentes = new Set<() => void>();

export function actualizar(fn: (e: Estado) => Estado) {
  estado = fn(estado);
  oyentes.forEach((o) => o());
  alCambiar?.(estado);
}

let alCambiar: ((e: Estado) => void) | undefined;
/** Engancha un guardado opcional (p. ej. la nube) a cada cambio. */
export function alGuardar(fn: ((e: Estado) => void) | undefined) {
  alCambiar = fn;
}

export function cargarEstado(nuevo: Estado) {
  estado = nuevo;
  oyentes.forEach((o) => o());
}

export function limpiarEstado() {
  alGuardar(undefined);
  cargarEstado({ ...ESTADO_INICIAL, pasos: {}, pasosPareja: {}, reflexiones: [], momentos: [], tarjetas: [] });
  if (typeof window !== "undefined") window.localStorage.removeItem("gemas-estado-v1");
}

export function reiniciar() {
  actualizar(() => ESTADO_INICIAL);
}

export function useGemas(): Estado {
  return useSyncExternalStore(
    (cb) => {
      oyentes.add(cb);
      return () => oyentes.delete(cb);
    },
    () => {
      return estado;
    },
    () => ESTADO_INICIAL,
  );
}

export const nuevoId = () => Math.random().toString(36).slice(2, 10);
export const hoy = () => new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" });
