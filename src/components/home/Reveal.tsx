import { useEffect, useRef, useState, type ReactNode } from "react";
export function useVisible<T extends Element>(umbral = 0.25) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: umbral });
    io.observe(el);
    return () => io.disconnect();
  }, [umbral]);
  return [ref, visible] as const;
}
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [ref, visible] = useVisible<HTMLDivElement>(0.15);
  return <div ref={ref} data-visible={visible} className={`revelar ${className}`}>{children}</div>;
}
