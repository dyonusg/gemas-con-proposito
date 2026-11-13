ALTER TABLE public.notas ADD COLUMN IF NOT EXISTS leccion_numero integer REFERENCES public.lecciones(numero);
ALTER TABLE public.notas ADD COLUMN IF NOT EXISTS compartir text NOT NULL DEFAULT 'solo_yo';
ALTER TABLE public.notas ADD COLUMN IF NOT EXISTS local_id text;
CREATE POLICY "Mentor ve reflexiones compartidas" ON public.notas FOR SELECT TO authenticated
USING (compartir IN ('mentor','todos') AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = notas.user_id AND p.mentor_id = auth.uid()));
CREATE POLICY "Compañero ve reflexiones compartidas" ON public.notas FOR SELECT TO authenticated
USING (compartir = 'todos' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = notas.user_id AND p.companero_id = auth.uid()));