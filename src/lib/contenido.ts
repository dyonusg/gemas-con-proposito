// Pasos del camino. El contenido de cada paso sale de la lección (tabla `lecciones`).
export type PasoId = "materiales" | "cita" | "virtud" | "cancion" | "historia" | "dinamica" | "manualidad";

export const PASOS: { id: PasoId; titulo: string; corto: string; descripcion: string; color: string }[] = [
  { id: "materiales", titulo: "Preparar materiales", corto: "Materiales", descripcion: "Tener todo a mano te ayuda a empezar con calma y dedicar tu atención a los niños.", color: "bg-sol" },
  { id: "cita", titulo: "Cita de inspiración", corto: "Cita", descripcion: "La cita deja en los niños palabras que inspiran y les recuerdan la cualidad que están cultivando.", color: "bg-sol" },
  { id: "virtud", titulo: "La virtud", corto: "Virtud", descripcion: "Los ejemplos cotidianos ayudan a los niños a reconocer esta cualidad y vivirla cada día.", color: "bg-lavanda" },
  { id: "cancion", titulo: "La canción", corto: "Canción", descripcion: "Cantar juntos llena el círculo de alegría y ayuda a recordar la cualidad de la lección.", color: "bg-menta" },
  { id: "historia", titulo: "La historia", corto: "Historia", descripcion: "La historia da vida a la cualidad y ayuda a imaginar cómo ponerla en práctica.", color: "bg-coral" },
  { id: "dinamica", titulo: "La dinámica", corto: "Dinámica", descripcion: "Jugar y colaborar permite a los niños practicar la cualidad y aprender unos de otros.", color: "bg-lavanda" },
  { id: "manualidad", titulo: "La manualidad", corto: "Manualidad", descripcion: "Crear con sus manos ayuda a los niños a expresar lo aprendido y llevarse un recuerdo de la cualidad.", color: "bg-menta" },
];

export const RUHI = "https://www.ruhi.org/es/";

export const PREGUNTAS_REFLEXION = [
  "¿Dónde has vivido esta virtud esta semana?",
  "¿Qué gema has visto en ti al preparar este círculo?",
  "¿Quién ha vivido esta virtud contigo últimamente? ¿Cómo te sentiste?",
];
