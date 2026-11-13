import { describe, expect, it } from "vitest";
import { siguientePaso, contarDirigidos } from "./camino";

describe("camino de ayudante a maestro", () => {
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
