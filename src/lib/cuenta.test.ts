import { describe, expect, it } from "vitest";
import { normalizarAlias, aliasValido, rutaPublica } from "./cuenta";
describe("acceso a cuentas", () => {
  it("los alias no se distinguen por mayúsculas ni espacios exteriores", () => {
    expect(normalizarAlias("  Rayo  ")).toBe(normalizarAlias("rayo"));
  });
  it("valida la longitud del alias", () => {
    expect(aliasValido("Rayo")).toBe(true);
    expect(aliasValido(" ")).toBe(false);
    expect(aliasValido("a".repeat(21))).toBe(false);
  });
  it("solo acceso y recuperación son públicos", () => {
    expect(rutaPublica("/auth")).toBe(true);
    expect(rutaPublica("/reset-password")).toBe(true);
    for (const path of ["/camino", "/mentor", "/reflexiones", "/tarjeta", "/perfil", "/guardar"]) expect(rutaPublica(path)).toBe(false);
  });
});