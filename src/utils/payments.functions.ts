import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { PROPOSITOS, aCentimos, esProposito, type PropositoId } from "@/lib/donacion";

type Resultado = { clientSecret: string } | { error: string };

export const crearDonacion = createServerFn({ method: "POST" })
  .inputValidator((d: { importe: number; proposito: PropositoId; mensual?: boolean; returnUrl: string; environment: StripeEnv }) => {
    if (aCentimos(d.importe) === null) throw new Error("Importe no válido");
    if (!esProposito(d.proposito)) throw new Error("Propósito no válido");
    if (d.environment !== "sandbox" && d.environment !== "live") throw new Error("Entorno no válido");
    return d;
  })
  .handler(async ({ data }): Promise<Resultado> => {
    try {
      const stripe = createStripeClient(data.environment);
      const titulo = PROPOSITOS.find((p) => p.id === data.proposito)!.titulo;
      const mensual = data.mensual === true;
      const nombre = `Donación${mensual ? " mensual" : ""} a Gemas · ${titulo}`;
      const meta = { proposito: data.proposito, mensual: String(mensual) };
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price_data: { currency: "eur", product_data: { name: nombre }, unit_amount: aCentimos(data.importe)!, ...(mensual && { recurring: { interval: "month" as const } }) }, quantity: 1 }],
        mode: mensual ? "subscription" : "payment",
        ui_mode: "embedded_page",
        locale: "es",
        return_url: data.returnUrl,
        metadata: meta,
        ...(mensual
          ? { subscription_data: { description: nombre, metadata: meta } }
          : { submit_type: "donate" as const, payment_intent_data: { description: nombre, metadata: meta } }),
      });
      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
