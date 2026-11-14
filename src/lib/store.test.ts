import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ESTADO_INICIAL, actualizar, cargarEstado, limpiarEstado, useGemas } from "./store";
describe("privacidad entre sesiones", () => {
  it("cerrar sesión elimina todas las reflexiones del estado visible y del almacenamiento antiguo", () => {
    const { result } = renderHook(() => useGemas());
    localStorage.setItem("gemas-estado-v1", JSON.stringify({ alias: "Rayo" }));
    act(() => cargarEstado({ ...ESTADO_INICIAL, alias: "Rayo", reflexiones: [{ id: "privada", fecha: "hoy", texto: "Solo mi cuenta" }] }));
    expect(result.current.reflexiones).toHaveLength(1);
    act(() => limpiarEstado());
    expect(result.current.alias).toBeNull();
    expect(result.current.reflexiones).toEqual([]);
    expect(localStorage.getItem("gemas-estado-v1")).toBeNull();
  });
  it("no mezcla las reflexiones de dos cuentas", () => {
    const { result } = renderHook(() => useGemas());
    act(() => cargarEstado({ ...ESTADO_INICIAL, alias: "Rayo", reflexiones: [{ id: "a", fecha: "hoy", texto: "Cuenta A" }] }));
    act(() => cargarEstado({ ...ESTADO_INICIAL, alias: "Luna", reflexiones: [] }));
    expect(result.current.alias).toBe("Luna");
    expect(result.current.reflexiones).toEqual([]);
    act(() => actualizar((s) => ({ ...s, alias: "Estrella" })));
    expect(localStorage.getItem("gemas-estado-v1")).toBeNull();
  });
});