import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import { esProposito } from "@/lib/donacion";

async function registrar(fila: { referencia: string; importe_centimos: number; moneda: string; proposito: string; mensual: boolean; entorno: StripeEnv }) {
  if (!esProposito(fila.proposito) || !fila.importe_centimos) return;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("donaciones").upsert(fila, { onConflict: "referencia", ignoreDuplicates: true });
  if (error) throw error;
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = new URL(request.url).searchParams.get("env");
        if (raw !== "sandbox" && raw !== "live") return Response.json({ received: true, ignored: "invalid env" });
        const env: StripeEnv = raw;
        try {
          const event = await verifyWebhook(request, env);
          const o = event.data.object;
          // Pago único: se registra al completarse (o al liquidarse, si es diferido).
          if ((event.type === "checkout.session.completed" && o.mode === "payment" && o.payment_status !== "unpaid") || (event.type === "checkout.session.async_payment_succeeded" && o.mode === "payment")) {
            await registrar({ referencia: o.id, importe_centimos: o.amount_total, moneda: o.currency, proposito: o.metadata?.proposito, mensual: false, entorno: env });
          }
          // Donación mensual: cada factura pagada es una donación (incluida la primera).
          if (event.type === "invoice.paid") {
            const meta = o.parent?.subscription_details?.metadata ?? o.subscription_details?.metadata ?? o.lines?.data?.[0]?.metadata ?? {};
            await registrar({ referencia: o.id, importe_centimos: o.amount_paid, moneda: o.currency, proposito: meta.proposito, mensual: true, entorno: env });
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
