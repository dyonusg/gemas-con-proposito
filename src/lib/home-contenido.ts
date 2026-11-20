// Contenido editable del inicio. Cambia aquí textos, gemas, niveles, cifras e historias sin tocar los componentes.
export type ColorGema = "coral" | "menta" | "sol" | "lavanda";

export const GEMAS: { id: string; nombre: string; color: ColorGema; frase: string; desbloqueo: string }[] = [
  { id: "amor", nombre: "Amor", color: "coral", frase: "Haces que cada niño se sienta visto y querido.", desbloqueo: "Recibe a los niños por su nombre en tu primera clase" },
  { id: "paciencia", nombre: "Paciencia", color: "menta", frase: "Tu calma da a los niños el tiempo que necesitan para crecer.", desbloqueo: "Acompaña a un niño que necesita más tiempo" },
  { id: "alegria", nombre: "Alegría", color: "sol", frase: "Tu entusiasmo contagia ganas de aprender.", desbloqueo: "Comparte tu primera canción con los niños" },
  { id: "generosidad", nombre: "Generosidad", color: "lavanda", frase: "Das lo mejor de ti sin esperar nada a cambio.", desbloqueo: "Prepara los materiales para toda la clase" },
  { id: "veracidad", nombre: "Veracidad", color: "menta", frase: "Tus palabras construyen confianza.", desbloqueo: "Cuenta tu primera historia a los niños" },
  { id: "valentia", nombre: "Valentía", color: "coral", frase: "Te atreves a dar el primer paso, aunque dé nervios.", desbloqueo: "Guía tu primera dinámica" },
  { id: "bondad", nombre: "Bondad", color: "sol", frase: "Tus pequeños gestos hacen grandes diferencias.", desbloqueo: "Envía tu primera tarjeta a una familia" },
  { id: "gratitud", nombre: "Gratitud", color: "lavanda", frase: "Sabes ver lo bueno en cada momento.", desbloqueo: "Escribe tu primera reflexión" },
  { id: "empatia", nombre: "Empatía", color: "coral", frase: "Entiendes lo que sienten los demás.", desbloqueo: "Escucha a tu compañero de camino" },
  { id: "constancia", nombre: "Constancia", color: "menta", frase: "Vuelves cada semana, y eso lo cambia todo.", desbloqueo: "Completa el camino de una lección" },
];

export const QUIZ: { pregunta: string; opciones: { texto: string; gema: string }[] }[] = [
  { pregunta: "Un niño está triste en clase. ¿Qué haces?", opciones: [
    { texto: "Me siento a su lado y le escucho 💛", gema: "amor" },
    { texto: "Le doy tiempo y espero a que quiera hablar", gema: "paciencia" },
    { texto: "Le invito a cantar algo divertido", gema: "alegria" },
  ] },
  { pregunta: "Falta un material para la manualidad. ¿Qué haces?", opciones: [
    { texto: "Comparto el mío sin pensarlo", gema: "generosidad" },
    { texto: "Lo digo tal cual y buscamos una solución juntos", gema: "veracidad" },
    { texto: "Respiro, y lo convierto en un juego nuevo", gema: "paciencia" },
  ] },
  { pregunta: "Te proponen contar la historia de hoy. ¿Qué sientes?", opciones: [
    { texto: "Nervios… ¡pero me lanzo!", gema: "valentia" },
    { texto: "Ganas de hacerlo con mucha energía", gema: "alegria" },
    { texto: "Ilusión por que los niños se sientan queridos", gema: "amor" },
  ] },
];

export const NIVELES: { nombre: string; texto: string; ganas: string; color: ColorGema }[] = [
  { nombre: "Chispa", texto: "Te unes y conoces a tu compañero de camino.", ganas: "Confianza para empezar", color: "sol" },
  { nombre: "Colaborador/a", texto: "Haces tus primeras misiones: preparar y practicar una lección.", ganas: "Tu primer personaje", color: "menta" },
  { nombre: "Primera clase", texto: "Acompañas una clase completa.", ganas: "Insignia de primera clase", color: "coral" },
  { nombre: "Facilitador/a", texto: "Guías tu propia clase.", ganas: "Seguridad y propósito", color: "lavanda" },
  { nombre: "Mentor/a", texto: "Acompañas a quien empieza.", ganas: "La alegría de acompañar", color: "sol" },
];

/** CIFRAS DE EJEMPLO: sustitúyelas por datos reales antes de presentarlas como tales. */
export const CIFRAS_SON_EJEMPLO = true;
export const CIFRAS: { valor: number; etiqueta: string }[] = [
  { valor: 120, etiqueta: "jóvenes en camino" },
  { valor: 480, etiqueta: "niños acompañados" },
  { valor: 950, etiqueta: "clases realizadas" },
  { valor: 12, etiqueta: "comunidades" },
];

/** HISTORIAS DE EJEMPLO (placeholder): sustitúyelas por testimonios reales con permiso. */
export const HISTORIAS: { nombre: string; edad: number; ciudad: string; gema: string; frase: string }[] = [
  { nombre: "Lucía", edad: 17, ciudad: "Madrid", gema: "alegria", frase: "Pensaba que no sabría hablar con niños. Ahora espero los sábados toda la semana." },
  { nombre: "Samuel", edad: 21, ciudad: "Valencia", gema: "paciencia", frase: "Aprendí que escuchar también es enseñar." },
  { nombre: "Aisha", edad: 19, ciudad: "Barcelona", gema: "valentia", frase: "Mi primera historia me temblaba la voz. Los niños aplaudieron igual." },
  { nombre: "Diego", edad: 24, ciudad: "Sevilla", gema: "generosidad", frase: "Doy una hora a la semana y recibo mucho más." },
];

export const COMPANIA: { titulo: string; emoji: string; detras: string }[] = [
  { titulo: "Compañero de camino", emoji: "🤝", detras: "Preparáis y vivís las clases juntos. Siempre hay alguien a tu lado." },
  { titulo: "Mentor", emoji: "🌱", detras: "Un facilitador con experiencia que te acompaña y te anima." },
  { titulo: "Comunidad de jóvenes", emoji: "✨", detras: "Gente como tú que también quiere aportar algo bueno." },
];

export const gemaPorId = (id: string) => GEMAS.find((g) => g.id === id) ?? GEMAS[0]!;
/** "Gema del Amor", "Gema de la Paciencia". */
export const nombreGema = (nombre: string) => `Guardián ${["Amor"].includes(nombre) ? "del" : "de la"} ${nombre}`;
