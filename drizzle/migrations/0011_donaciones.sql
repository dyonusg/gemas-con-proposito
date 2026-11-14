CREATE TABLE public.donaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referencia text NOT NULL UNIQUE,
  importe_centimos integer NOT NULL,
  moneda text NOT NULL DEFAULT 'eur',
  proposito text NOT NULL,
  mensual boolean NOT NULL DEFAULT false,
  entorno text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.donaciones TO authenticated;
GRANT ALL ON public.donaciones TO service_role;
ALTER TABLE public.donaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin ve donaciones" ON public.donaciones FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'responsable'));