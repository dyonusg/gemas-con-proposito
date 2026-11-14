const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"] as string | undefined;

export function PaymentTestModeBanner() {
  if (!clientToken) return <div className="w-full bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">Las donaciones aún no están activas en esta versión.</div>;
  if (clientToken.startsWith("pk_test_"))
    return <div className="w-full bg-sol-soft px-4 py-2 text-center text-sm">Modo de prueba: no se cobra dinero real.</div>;
  return null;
}
