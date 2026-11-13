import { useSyncExternalStore } from "react";
import type { PasoId } from "./contenido";

// Prototipo: el estado vive en este dispositivo (localStorage). Sin datos personales.
export type RegistroPaso = { dirigido: boolean; fecha?: string; confirmado?: boolean | undefined; reconocimiento?: string | undefined };
export type Compartir = "solo_yo" | "mentor" | "todos";
export type Nota = { id: string; fecha: string; texto: string; pregunta?: string | undefined; leccion?: number | undefined; compartir?: Compartir | undefined; editada?: string | undefined };
export type Tarjeta = { id: string; fecha: string; virtud: string; cita: string; cancion: string; idea: string; estado: "enviada" | "reenviada" };
export type Encuesta = { sentimiento: string; acompanado: string; seguir: string; comentario: string };

export type Estado = {
  alias: string | null;
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

const KEY = "gemas-estado-v1";
export const ESTADO_INICIAL: Estado = {
  alias: null,
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
let cargado = false;
const oyentes = new Set<() => void>();

function cargar() {
  if (cargado || typeof window === "undefined") return;
  cargado = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) estado = { ...ESTADO_INICIAL, ...JSON.parse(raw) };
  } catch {
    /* estado inicial */
  }
}

export function actualizar(fn: (e: Estado) => Estado) {
  cargar();
  estado = fn(estado);
  window.localStorage.setItem(KEY, JSON.stringify(estado));
  oyentes.forEach((o) => o());
  alCambiar?.(estado);
}

let alCambiar: ((e: Estado) => void) | undefined;
/** Engancha un guardado opcional (p. ej. la nube) a cada cambio. */
export function alGuardar(fn: (e: Estado) => void) {
  alCambiar = fn;
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
      cargar();
      return estado;
    },
    () => ESTADO_INICIAL,
  );
}

export const nuevoId = () => Math.random().toString(36).slice(2, 10);
export const hoy = () => new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" });
