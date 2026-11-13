import { describe, expect, it } from "vitest";
import { siguientePaso, contarDirigidos, esMenor } from "./camino";

describe("camino de colaborador a facilitador", () => {
  it("empieza por la canción", () => {
    expect(siguientePaso({})).toBe("cancion");
  });
  it("el siguiente es el primer paso sin dirigir", () => {
    expect(siguientePaso({ cancion: { dirigido: true }, cita: { dirigido: true } })).toBe("historia");
  });
  it("al dirigir la clase entera ya no hay siguiente paso", () => {
    const todos = Object.fromEntries(["cancion", "cita", "historia", "juego", "media", "clase"].map((k) => [k, { dirigido: true }]));
    expect(siguientePaso(todos)).toBeNull();
    expect(contarDirigidos(todos)).toBe(6);
  });
});

describe("mayoría de edad", () => {
  const hoy = new Date("2026-11-13T12:00:00");
  it("quien tiene 16 años es menor", () => {
    expect(esMenor("2010-06-01", hoy)).toBe(true);
  });
  it("quien tiene 26 años no es menor", () => {
    expect(esMenor("2000-01-01", hoy)).toBe(false);
  });
  it("el día que cumple 18 ya no es menor", () => {
    expect(esMenor("2008-11-13", hoy)).toBe(false);
  });
  it("el día antes de cumplir 18 aún es menor", () => {
    expect(esMenor("2008-11-14", hoy)).toBe(true);
  });
});
