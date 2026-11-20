import type { ColorGema } from "@/lib/home-contenido";
const FILL: Record<ColorGema, string> = { coral: "fill-coral", menta: "fill-menta", sol: "fill-sol", lavanda: "fill-lavanda" };
export function Gema({ color = "lavanda", className = "", apagada = false }: { color?: ColorGema; className?: string; apagada?: boolean }) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden>
      <g className={apagada ? "fill-muted-foreground/25" : FILL[color]}>
        <path d="M14 2h36l14 16-32 36L0 18z" />
      </g>
      {!apagada && <g className="fill-nube">
        <path d="M14 2h36l-6 16H20z" opacity=".35" />
        <path d="M0 18h20l12 36z" opacity=".18" />
        <path d="M44 18h20L32 54z" opacity=".08" />
      </g>}
      <path d="M14 2h36l14 16-32 36L0 18zM0 18h64M20 18l12 36 12-36M14 2l6 16M50 2l-6 16" className="fill-none stroke-tinta/25" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
