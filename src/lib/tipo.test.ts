import { describe, expect, it } from "vitest";
import { navPara, esCodigoMentor } from "./camino";

describe("tipos de usuario", () => {
  it("sin elegir, ve la vista de facilitador en formación", () => {
    expect(navPara(null)).toEqual(["/", "/camino", "/gemas", "/tarjeta", "/cierre"]);
  });
  it("el facilitador mentor empieza por acompañar y consulta lecciones, sin camino", () => {
    expect(navPara("mentor")).toEqual(["/", "/mentor", "/lecciones", "/reflexiones", "/tarjeta"]);
    expect(navPara("mentor")).not.toContain("/camino");
    expect(navPara("mentor")).not.toContain("/gemas");
  });
  it("el mentor tiene acceso a sus propias reflexiones sin recorrer el camino", () => {
    expect(navPara("mentor")).toContain("/reflexiones");
    expect(navPara("mentor")).not.toContain("/camino");
  });
  it("el código de mentor es un identificador válido", () => {
    expect(esCodigoMentor("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(esCodigoMentor("hola")).toBe(false);
  });
});
