import { useState } from "react";

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];
const ANO_MIN = 1930;

const pad = (n: number) => String(n).padStart(2, "0");

/** Selector de fecha de nacimiento: año y mes en desplegables, día en cuadrícula. Emite "YYYY-MM-DD". */
export function FechaNacimiento({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const hoy = new Date();
  const anoMax = hoy.getFullYear();
  const [aSel, mSel, dSel] = value ? value.split("-").map(Number) : [null, null, null];

  const [vista, setVista] = useState({ ano: aSel ?? anoMax - 15, mes: (mSel ?? 1) - 1 });

  const anos = Array.from({ length: anoMax - ANO_MIN + 1 }, (_, i) => anoMax - i);
  const diasEnMes = new Date(vista.ano, vista.mes + 1, 0).getDate();
  const huecos = (new Date(vista.ano, vista.mes, 1).getDay() + 6) % 7; // semana empieza en lunes

  const elegirDia = (d: number) => onChange(`${vista.ano}-${pad(vista.mes + 1)}-${pad(d)}`);

  const selectClase =
    "h-11 rounded-xl border-2 border-input bg-background px-3 text-sm font-bold outline-none focus:border-coral";

  return (
    <div className="mt-2 rounded-[20px] border-2 border-input bg-background p-3">
      <div className="flex gap-2">
        <select
          aria-label="Mes de nacimiento"
          value={vista.mes}
          onChange={(e) => setVista((v) => ({ ...v, mes: Number(e.target.value) }))}
          className={`${selectClase} flex-1`}
        >
          {MESES.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <select
          aria-label="Año de nacimiento"
          value={vista.ano}
          onChange={(e) => setVista((v) => ({ ...v, ano: Number(e.target.value) }))}
          className={`${selectClase} w-24`}
        >
          {anos.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground">
        {DIAS_SEMANA.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: huecos }, (_, i) => (
          <span key={`h${i}`} />
        ))}
        {Array.from({ length: diasEnMes }, (_, i) => {
          const d = i + 1;
          const elegido = dSel === d && mSel === vista.mes + 1 && aSel === vista.ano;
          return (
            <button
              key={d}
              type="button"
              onClick={() => elegirDia(d)}
              aria-pressed={elegido}
              className={`grid size-9 place-items-center rounded-full text-sm font-bold ${
                elegido ? "bg-coral text-tinta" : "hover:bg-muted"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
