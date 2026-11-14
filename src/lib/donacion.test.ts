import { describe, expect, it } from "vitest";
import { aCentimos, esProposito, IMPORTES } from "./donacion";

describe("donaciones", () => {
  it("ofrece 5, 10 y 25 euros", () => expect([...IMPORTES]).toEqual([5, 10, 25]));
  it("acepta los tres propósitos y rechaza otros", () => {
    expect(esProposito("campus")).toBe(true);
    expect(esProposito("materiales")).toBe(true);
    expect(esProposito("app")).toBe(true);
    expect(esProposito("otro")).toBe(false);
  });
  it("convierte a céntimos y exige al menos 1 €", () => {
    expect(aCentimos(12.5)).toBe(1250);
    expect(aCentimos(0.5)).toBeNull();
    expect(aCentimos(1)).toBe(100);
  });
});
