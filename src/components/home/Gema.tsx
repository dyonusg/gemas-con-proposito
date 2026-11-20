import type { ColorGema } from "@/lib/home-contenido";
// Personajes ilustrados en SVG (sin IA): cada color es un personaje con su propia forma.
const FILL: Record<ColorGema, string> = { coral: "fill-coral", menta: "fill-menta", sol: "fill-sol", lavanda: "fill-lavanda" };
const CUERPO: Record<ColorGema, string> = {
  sol: "M32 8c14 0 24 11 24 26s-9 24-24 24S8 49 8 34 18 8 32 8z",
  menta: "M14 20c0-8 5-12 9-12s5 5 9 5 5-5 9-5 9 4 9 12v18c0 12-8 20-18 20S14 50 14 38z",
  coral: "M32 6l6 8c10 2 18 10 18 22 0 13-10 22-24 22S8 49 8 36c0-12 8-20 18-22z",
  lavanda: "M10 30C10 16 20 8 32 8s22 8 22 22v20c0 4-3 6-6 4l-4-3-4 4c-2 2-4 2-6 0l-4-4-4 4c-2 2-4 2-6 0l-4-4-4 3c-3 2-6 0-6-4z",
};
export function Gema({ color = "lavanda", className = "", apagada = false }: { color?: ColorGema; className?: string; apagada?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d={CUERPO[color]} className={apagada ? "fill-muted-foreground/20" : FILL[color]} />
      {apagada ? (
        <text x="32" y="42" textAnchor="middle" className="fill-muted-foreground/60 font-display" fontSize="22" fontWeight="700">?</text>
      ) : (
        <g>
          <ellipse cx="24" cy="34" rx="3.2" ry="4" className="fill-tinta" />
          <ellipse cx="40" cy="34" rx="3.2" ry="4" className="fill-tinta" />
          <circle cx="25" cy="32.6" r="1.1" className="fill-nube" />
          <circle cx="41" cy="32.6" r="1.1" className="fill-nube" />
          <ellipse cx="18" cy="41" rx="3.5" ry="2.2" className="fill-nube" opacity=".45" />
          <ellipse cx="46" cy="41" rx="3.5" ry="2.2" className="fill-nube" opacity=".45" />
          <path d="M27 42q5 5 10 0" className="fill-none stroke-tinta" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
