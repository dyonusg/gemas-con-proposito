// Contenido de EJEMPLO para el prototipo. Los textos oficiales se consultan siempre en ruhi.org.
export type PasoId = "cancion" | "cita" | "historia" | "juego" | "media" | "clase";

export const PASOS: { id: PasoId; titulo: string; corto: string; descripcion: string; color: string }[] = [
  { id: "cancion", titulo: "Dirigir la canción", corto: "Canción", descripcion: "Enseña y canta la canción de la lección con los niños.", color: "bg-menta" },
  { id: "cita", titulo: "Enseñar la cita", corto: "Cita", descripcion: "Ayuda a los niños a memorizar la cita de la virtud.", color: "bg-sol" },
  { id: "historia", titulo: "Contar la historia", corto: "Historia", descripcion: "Cuenta la historia de la lección con tus palabras.", color: "bg-coral" },
  { id: "juego", titulo: "Dirigir el juego", corto: "Juego", descripcion: "Explica y anima el juego cooperativo.", color: "bg-lavanda" },
  { id: "media", titulo: "Media clase", corto: "Media clase", descripcion: "Dirige la mitad de la clase junto a tu compañero de camino.", color: "bg-menta" },
  { id: "clase", titulo: "La clase entera", corto: "Clase entera", descripcion: "Dirige una clase completa, con tu mentor al lado.", color: "bg-coral" },
];

export const LECCION = {
  virtud: "Generosidad",
  cancion: {
    titulo: "Canción de ejemplo",
    letra: [
      "Lo que tengo lo comparto,",
      "una sonrisa, un abrazo,",
      "dar con alegría es",
      "la gema que hay en mí.",
    ],
  },
  cita: "Texto de ejemplo: «Da con alegría lo que tienes, y tu corazón brillará como una gema.»",
  historia: {
    resumen:
      "Una niña lleva una manzana para el recreo. Ve a un compañero sin nada que comer y decide compartirla. Al final, los dos descubren que la manzana sabía mejor a medias.",
    pautas: [
      "Léela dos veces en casa y cuéntala en voz alta una vez.",
      "No hace falta memorizarla: cuéntala con tus palabras.",
      "Mira a los niños a los ojos y haz pausas en los momentos clave.",
      "Al terminar, pregunta: «¿Cuándo has compartido tú algo?».",
      "Si te quedas en blanco, respira y vuelve al resumen. ¡Pasa a todos!",
    ],
  },
  juego: {
    nombre: "El tesoro compartido",
    pautas: [
      "Explica las reglas en tres frases cortas.",
      "Haz tú una ronda de ejemplo.",
      "Nadie gana solo: el equipo gana cuando todos tienen tesoro.",
    ],
  },
  ruhi: "https://www.ruhi.org/es/",
};

export const PREGUNTAS_REFLEXION = [
  "¿Dónde has vivido la generosidad esta semana?",
  "¿Qué gema has visto en ti al preparar esta clase?",
  "¿Quién ha sido generoso contigo últimamente? ¿Cómo te sentiste?",
];
