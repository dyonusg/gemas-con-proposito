import { describe, expect, it } from "vitest";
import { navPara, esCodigoMentor } from "./camino";

describe("tipos de usuario", () => {
  it("sin elegir, ve la vista de facilitador en formación", () => {
    expect(navPara(null)).toEqual(["/camino", "/gemas", "/tarjeta", "/cierre"]);
  });
  it("el facilitador mentor empieza por acompañar", () => {
    expect(navPara("mentor")[0]).toBe("/mentor");
    expect(navPara("mentor")).not.toContain("/gemas");
  });
  it("el código de mentor es un identificador válido", () => {
    expect(esCodigoMentor("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(esCodigoMentor("hola")).toBe(false);
  });
});
