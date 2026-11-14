import type { Nota } from "./store";

export type TipoReflexion = "reflexiones" | "momentos";

export function guardarNota(lista: Nota[], nota: Nota, ahora = new Date().toISOString()): Nota[] {
  if (!nota.texto.trim() || !nota.leccion) throw new Error("La reflexión necesita texto y una virtud.");
  const anterior = lista.find((n) => n.id === nota.id);
  const guardada = { ...nota, texto: nota.texto.trim(), fecha: anterior?.fecha ?? ahora, ...(anterior ? { editada: ahora } : {}) };
  return anterior ? lista.map((n) => n.id === nota.id ? guardada : n) : [guardada, ...lista];
}

export function borrarNota(lista: Nota[], id: string) {
  return lista.filter((n) => n.id !== id);
}

export function mostrarFecha(fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(fecha)) return fecha;
  return new Date(fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export function fechaPersistida(fecha: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}T/.test(fecha) && !Number.isNaN(Date.parse(fecha)) ? fecha : undefined;
}