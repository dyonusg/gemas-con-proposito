// Pasos del camino. El contenido de cada paso sale de la lección (tabla `lecciones`).
export type PasoId = "materiales" | "cita" | "virtud" | "cancion" | "historia" | "dinamica" | "manualidad";

export const PASOS: { id: PasoId; titulo: string; corto: string; descripcion: string; color: string }[] = [
  { id: "materiales", titulo: "Preparar materiales", corto: "Materiales", descripcion: "Reúne todo lo que necesitas para la dinámica y la manualidad.", color: "bg-sol" },
  { id: "cita", titulo: "Cita de inspiración", corto: "Cita", descripcion: "Ayuda a los niños a memorizar la cita de la lección.", color: "bg-sol" },
  { id: "virtud", titulo: "La virtud", corto: "Virtud", descripcion: "Explica la virtud con palabras sencillas y ejemplos.", color: "bg-lavanda" },
  { id: "cancion", titulo: "La canción", corto: "Canción", descripcion: "Enseña y canta la canción con los niños.", color: "bg-menta" },
  { id: "historia", titulo: "La historia", corto: "Historia", descripcion: "Cuenta la historia de la lección con tus palabras.", color: "bg-coral" },
  { id: "dinamica", titulo: "La dinámica", corto: "Dinámica", descripcion: "Anima la dinámica paso a paso.", color: "bg-lavanda" },
  { id: "manualidad", titulo: "La manualidad", corto: "Manualidad", descripcion: "Guía la manualidad paso a paso.", color: "bg-menta" },
];

export const RUHI = "https://www.ruhi.org/es/";

export const PREGUNTAS_REFLEXION = [
  "¿Dónde has vivido esta virtud esta semana?",
  "¿Qué gema has visto en ti al preparar esta clase?",
  "¿Quién ha vivido esta virtud contigo últimamente? ¿Cómo te sentiste?",
];
