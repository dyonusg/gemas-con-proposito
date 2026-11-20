/** Texto editorial breve para acompañar las virtudes de las 24 lecciones. */
const PROPOSITOS: Record<number, string> = {
  1: "Ayuda a los peques a actuar con buenas intenciones y cuidar lo que llevan en el corazón.",
  2: "Ayuda a los peques a tratar a todos con equidad y reconocer lo que es justo.",
  3: "Ayuda a los peques a expresar cariño y hacer que otros se sientan queridos.",
  4: "Ayuda a los peques a decir la verdad y construir confianza con los demás.",
  5: "Ayuda a los peques a compartir con alegría y descubrir el valor de dar.",
  6: "Ayuda a los peques a tener en cuenta las necesidades de otros, además de las propias.",
  7: "Ayuda a los peques a encontrar motivos para sonreír y compartir su alegría.",
  8: "Ayuda a los peques a expresar lo que sienten y actuar sin fingir.",
  9: "Ayuda a los peques a aprender de los demás y reconocer que todos tienen algo que aportar.",
  10: "Ayuda a los peques a valorar lo que reciben y expresar su gratitud.",
  11: "Ayuda a los peques a dejar atrás el enfado y dar una nueva oportunidad.",
  12: "Ayuda a los peques a respetar lo ajeno y actuar con honestidad, aunque nadie los vea.",
  13: "Ayuda a los peques a comprender cómo se sienten otros y ofrecerles apoyo.",
  14: "Ayuda a los peques a disfrutar sin aferrarse a las cosas y compartir con libertad.",
  15: "Ayuda a los peques a encontrar paz y valorar lo bueno, incluso cuando algo no sale como esperaban.",
  16: "Ayuda a los peques a cuidar a los demás con pequeños gestos de amabilidad.",
  17: "Ayuda a los peques a afrontar sus miedos y atreverse a hacer lo correcto.",
  18: "Ayuda a los peques a mantener la esperanza y confiar en Dios ante las dificultades.",
  19: "Ayuda a los peques a cumplir sus compromisos y ser personas con las que otros pueden contar.",
  20: "Ayuda a los peques a expresar su amor a Dios a través del cuidado y el servicio a los demás.",
  21: "Ayuda a los peques a transmitir alegría y calidez con sus palabras y acciones.",
  22: "Ayuda a los peques a cuidar sus vínculos y mantenerse fieles a sus buenos propósitos.",
  23: "Ayuda a los peques a esperar con calma y seguir intentando cuando algo cuesta.",
  24: "Ayuda a los peques a perseverar en lo bueno, incluso cuando encuentran dificultades.",
};

export function propositoVirtud(numero: number) {
  return PROPOSITOS[numero] ?? "Ayuda a los peques a cultivar esta virtud en su vida cotidiana.";
}