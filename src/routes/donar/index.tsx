import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { ArrowLeft, Heart } from "lucide-react";
import { Shell, Seccion } from "@/components/gemas/Shell";
import { Button } from "@/components/ui/button";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { IMPORTES, PROPOSITOS, aCentimos, type PropositoId } from "@/lib/donacion";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { crearDonacion } from "@/utils/payments.functions";

export const Route = createFileRoute("/donar/")({
  head: () => ({
    meta: [
      { title: "Dona a Gemas" },
      { name: "description", content: "Apoya Gemas, un proyecto sin fines de lucro: próximos campus, libros y materiales para los niños o mejoras de la app." },
      { property: "og:title", content: "Dona a Gemas" },
      { property: "og:description", content: "Elige a qué dedicar tu donación y apoya la educación de niños y facilitadores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Donar,
});

function Donar() {
  const [proposito, setProposito] = useState<PropositoId>("materiales");
  const [importe, setImporte] = useState<number | "otro">(10);
  const [otro, setOtro] = useState("");
  const [pagando, setPagando] = useState(false);
  const [mensual, setMensual] = useState(false);
  const [error, setError] = useState("");
  const eur = importe === "otro" ? Number(otro.replace(",", ".")) : importe;
  const valido = aCentimos(eur) !== null;

  const fetchClientSecret = async () => {
    const r = await crearDonacion({ data: { importe: eur, proposito, mensual, environment: getStripeEnvironment(), returnUrl: `${window.location.origin}/donar/gracias?session_id={CHECKOUT_SESSION_ID}` } });
    if ("error" in r) { setError(r.error); throw new Error(r.error); }
    return r.clientSecret;
  };

  return (
    <>
      <PaymentTestModeBanner />
      <Shell nav={false}>
        <Button asChild variant="soft" size="sm" className="mt-4"><Link to="/"><ArrowLeft /> Volver al inicio</Link></Button>
        <h1 className="mt-3 text-3xl font-bold">Dona a Gemas</h1>
        <p className="text-sm text-muted-foreground">Gemas es un proyecto sin fines de lucro. No necesitas cuenta para donar.</p>
        {!pagando ? (
          <>
            <Seccion titulo="¿A qué quieres dedicarla?">
              <div className="space-y-2" role="radiogroup">
                {PROPOSITOS.map((p) => (
                  <button key={p.id} type="button" role="radio" aria-checked={proposito === p.id} onClick={() => setProposito(p.id)}
                    className={`w-full rounded-[20px] border-2 p-4 text-left ${proposito === p.id ? "border-coral bg-coral-soft" : "border-border bg-card"}`}>
                    <span className="block font-bold">{p.titulo}</span>
                    <span className="text-xs text-muted-foreground">{p.descripcion}</span>
                  </button>
                ))}
              </div>
            </Seccion>
            <Seccion titulo="¿Con qué frecuencia?">
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={!mensual ? "menta" : "soft"} aria-pressed={!mensual} onClick={() => setMensual(false)}>Una vez</Button>
                <Button type="button" variant={mensual ? "menta" : "soft"} aria-pressed={mensual} onClick={() => setMensual(true)}>Cada mes</Button>
              </div>
              {mensual && <p className="mt-2 text-xs text-muted-foreground">Se cobrará cada mes. Puedes pedir que la cancelemos en cualquier momento respondiendo al correo del recibo.</p>}
            </Seccion>
            <Seccion titulo="¿Cuánto quieres donar?">
              <div className="grid grid-cols-4 gap-2">
                {IMPORTES.map((v) => <Button key={v} type="button" variant={importe === v ? "menta" : "soft"} aria-pressed={importe === v} onClick={() => setImporte(v)}>{v} €</Button>)}
                <Button type="button" variant={importe === "otro" ? "menta" : "soft"} aria-pressed={importe === "otro"} onClick={() => setImporte("otro")}>Otro</Button>
              </div>
              {importe === "otro" && (
                <label className="mt-3 block text-sm font-bold">Importe en euros (mínimo 1 €)
                  <input inputMode="decimal" value={otro} onChange={(e) => setOtro(e.target.value)} placeholder="Por ejemplo: 15" className="mt-1 w-full rounded-xl border-2 border-input bg-card p-3 font-normal" />
                </label>
              )}
            </Seccion>
            <Button className="mt-6 w-full" disabled={!valido} onClick={() => { setError(""); setPagando(true); }}><Heart /> Donar {valido ? `${eur} €${mensual ? " al mes" : ""}` : ""}</Button>
            <p className="mt-4 text-center text-sm"><Link to="/" className="font-bold text-muted-foreground hover:text-foreground">Volver al inicio de Gemas</Link></p>
          </>
        ) : (
          <div className="mt-5">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Button variant="soft" size="sm" onClick={() => setPagando(false)}>← Cambiar donación</Button>
            </div>
            {error && <p role="alert" className="mb-3 rounded-xl bg-sol-soft p-3 text-sm">No se pudo iniciar el pago: {error}</p>}
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </Shell>
    </>
  );
}
