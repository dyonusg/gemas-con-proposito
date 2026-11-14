import { describe, expect, it } from "vitest";
import { guardarNota, borrarNota, fechaPersistida } from "./reflexiones";

describe.each(["personales", "sobre los niños"])("reflexiones %s", () => {
  it("guarda la virtud y fecha completa de creación", () => {
    const [n] = guardarNota([], { id: "a", fecha: "", texto: "Compartir", leccion: 5 }, "2026-11-14T12:50:00Z");
    expect(n?.leccion).toBe(5);
    expect(n?.fecha).toBe("2026-11-14T12:50:00Z");
  });
  it("edita texto y virtud sin cambiar la fecha de creación", () => {
    const original = { id: "a", texto: "Compartir", leccion: 5, fecha: "2026-11-14T12:50:00Z" };
    const [n] = guardarNota([original], { ...original, texto: "Esperar", leccion: 23 }, "2026-11-15T10:00:00Z");
    expect(n?.texto).toBe("Esperar");
    expect(n?.leccion).toBe(23);
    expect(n?.fecha).toBe(original.fecha);
    expect(n?.editada).toBe("2026-11-15T10:00:00Z");
  });
  it("elimina únicamente la reflexión elegida", () => {
    expect(borrarNota([{ id: "a", fecha: "", texto: "uno" }, { id: "b", fecha: "", texto: "dos" }], "a").map(n => n.id)).toEqual(["b"]);
  });
  it("no permite guardar sin virtud", () => {
    expect(() => guardarNota([], { id: "a", fecha: "", texto: "uno" })).toThrow();
  });
});

it("conserva la fecha exacta al persistir y no inventa una fecha completa para notas antiguas", () => {
  expect(fechaPersistida("2026-11-14T12:50:00Z")).toBe("2026-11-14T12:50:00Z");
  expect(fechaPersistida("14 nov")).toBeUndefined();
});