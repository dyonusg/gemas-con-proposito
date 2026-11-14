import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Seccion, SelectorLeccion } from "@/components/gemas/Shell";
import { useLeccion } from "@/lib/leccion";
import { actualizar, hoy, nuevoId, useGemas } from "@/lib/store";
import isotipo from "@/assets/gemas-isotipo.svg.asset.json";

export const Route = createFileRoute("/tarjeta")({
  head: () => ({
    meta: [
      { title: "Tarjeta para las familias · Gemas" },
      { name: "description", content: "Crea la tarjeta de la clase con la virtud, la cita, la canción y una idea para casa." },
      { property: "og:title", content: "Tarjeta para las familias · Gemas" },
      { property: "og:description", content: "Que los niños sigan viviendo la virtud en casa durante la semana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TarjetaPage,
});

function TarjetaPage() {
  const e = useGemas();
  const l = useLeccion(e.leccionActual);
  const L = { virtud: l?.cualidad ?? "", cita: l?.cita ?? "", cancion: l?.cancion_titulo ?? "", idea: l?.actividad_familia ?? "" };
  const [mensaje, setMensaje] = useState("");
  const [enviada, setEnviada] = useState(false);
  const [copiada, setCopiada] = useState(false);

  const enviar = async () => {
    const texto = [
      `✨ Esta semana en clase: ${L.virtud}`,
      `“${L.cita}”`,
      `🎵 Canción: ${L.cancion}`,
      `💡 Idea para casa: ${L.idea}`,
      ...(mensaje.trim() ? [`💌 Mensaje del facilitador: ${mensaje.trim()}`] : []),
      "— Enviado desde Gemas",
    ].join("\n");
    actualizar((s) => ({
      ...s,
      tarjetas: [{ id: nuevoId(), fecha: hoy(), virtud: L.virtud, cita: L.cita, cancion: L.cancion, idea: L.idea, mensaje: mensaje.trim() || undefined, estado: "enviada" }, ...s.tarjetas],
    }));
    setMensaje("");
    setEnviada(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: `Tarjeta de la clase: ${L.virtud}`, text: texto });
      } else {
        await navigator.clipboard.writeText(texto);
        setCopiada(true);
      }
    } catch {
      /* la persona canceló el compartir; la tarjeta ya quedó guardada */
    }
  };

  return (
    <Shell>
      <h1 className="mt-2 text-[32px] font-bold leading-[38px]">Tarjeta para las familias</h1>
      <p className="text-sm text-muted-foreground">Compártela con quien quieras desde tu móvil: WhatsApp, correo o la app que prefieras. Gemas nunca ve tus contactos.</p>
      <SelectorLeccion etiqueta="Gema de la tarjeta" />

      <div className="mt-5 overflow-hidden rounded-[20px] bg-card shadow-card">
        <div className="h-2 bg-gema" />
        <div className="p-5">
          <div className="flex items-center gap-2">
            <img src={isotipo.url} alt="" className="size-8" />
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Esta semana en clase</p>
          </div>
          <h2 className="mt-2 text-2xl font-bold">{L.virtud}</h2>
          <p className="mt-2 text-sm italic">{L.cita}</p>
          <p className="mt-2 text-sm"><strong>Canción:</strong> {L.cancion}</p>
          <p className="mt-2 text-sm"><strong>Idea para casa:</strong> {L.idea}</p>
          <label htmlFor="mensaje" className="mt-4 block text-sm font-bold">Un mensajito para las familias <span className="font-normal text-muted-foreground">(opcional)</span></label>
          <textarea id="mensaje" value={mensaje} onChange={(ev) => setMensaje(ev.target.value)} rows={2} placeholder="Ej.: ¡gracias por acompañar a vuestros peques cada semana!" className="mt-2 w-full rounded-xl border-2 border-input bg-background p-3 text-sm outline-none focus:border-coral" />
        </div>
      </div>
      {enviada && (
        <p className="mt-3 rounded-2xl bg-menta-soft p-3 text-sm font-bold">
          {copiada ? "No se pudo abrir el compartir, pero la tarjeta está copiada: pégala donde quieras." : "¡Tarjeta lista! Elige a quién enviarla desde tu móvil."}
        </p>
      )}
      <Button size="lg" className="mt-4 w-full" onClick={enviar}><Send /> Enviar</Button>

      <Seccion titulo="Tarjetas enviadas">
        {e.tarjetas.length === 0 ? (
          <p className="rounded-[20px] border-2 border-dashed border-border p-4 text-sm text-muted-foreground">Todavía no has enviado ninguna.</p>
        ) : (
          <ul className="space-y-2">
            {e.tarjetas.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-[20px] bg-card p-4 shadow-card">
                <span><strong>{t.virtud}</strong><span className="block text-xs text-muted-foreground">{t.fecha}</span></span>
                <button
                  type="button"
                  aria-pressed={t.estado === "reenviada"}
                  title="Toca para cambiar el estado"
                  onClick={() =>
                    actualizar((s) => ({
                      ...s,
                      tarjetas: s.tarjetas.map((x) => (x.id === t.id ? { ...x, estado: x.estado === "reenviada" ? "enviada" : "reenviada" } : x)),
                    }))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${t.estado === "reenviada" ? "bg-menta" : "bg-sol-soft"}`}
                >
                  {t.estado === "reenviada" ? "Reenviada" : "Enviada"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Seccion>
    </Shell>
  );
}
