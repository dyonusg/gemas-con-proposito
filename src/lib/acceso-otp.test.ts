import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ signInWithOtp: vi.fn(), verifyOtp: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));
import { solicitarCodigo, verificarCodigo } from "./acceso-otp";

describe("acceso sin contraseña", () => {
  beforeEach(() => vi.resetAllMocks());
  it("solicita OTP tanto para cuentas nuevas como existentes sin contraseña", async () => {
    auth.signInWithOtp.mockResolvedValue({ error: null });
    await solicitarCodigo(" Persona@example.org ", "https://gemas-con-proposito.lovable.app/auth");
    expect(auth.signInWithOtp).toHaveBeenCalledWith({ email: "persona@example.org", options: {
      shouldCreateUser: true, emailRedirectTo: "https://gemas-con-proposito.lovable.app/auth",
    } });
  });
  it("verifica el código de correo y devuelve únicamente una sesión confirmada", async () => {
    auth.verifyOtp.mockResolvedValue({ data: { session: { user: { id: "owner" } } }, error: null });
    expect(await verificarCodigo("Persona@example.org", "12345678")).toEqual({ user: { id: "owner" } });
    expect(auth.verifyOtp).toHaveBeenCalledWith({ email: "persona@example.org", token: "12345678", type: "email" });
  });
  it("no concede acceso a un código rechazado", async () => {
    auth.verifyOtp.mockResolvedValue({ data: { session: null }, error: new Error("expired") });
    await expect(verificarCodigo("persona@example.org", "123456")).rejects.toThrow("expired");
  });
  it("no considera autenticado un resultado sin sesión", async () => {
    auth.verifyOtp.mockResolvedValue({ data: { session: null }, error: null });
    await expect(verificarCodigo("persona@example.org", "123456")).rejects.toThrow("No se ha confirmado");
  });
});