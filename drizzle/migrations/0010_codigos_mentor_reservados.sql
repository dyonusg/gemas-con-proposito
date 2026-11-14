ALTER TABLE public.codigos_mentor ADD COLUMN IF NOT EXISTS correo text;
DROP FUNCTION IF EXISTS public.generar_codigo_mentor();
CREATE OR REPLACE FUNCTION public.generar_codigo_mentor(_correo text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c text; alfabeto text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; i int; e text := lower(trim(_correo));
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'responsable') THEN RAISE EXCEPTION 'No autorizado'; END IF;
  IF e IS NULL OR e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'Correo no válido'; END IF;
  LOOP
    c := '';
    FOR i IN 1..8 LOOP c := c || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1); END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.codigos_mentor WHERE codigo = c);
  END LOOP;
  INSERT INTO public.codigos_mentor (codigo, creado_por, correo) VALUES (c, auth.uid(), e);
  RETURN c;
END $$;
REVOKE ALL ON FUNCTION public.generar_codigo_mentor(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generar_codigo_mentor(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.canjear_codigo_mentor(_codigo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sin sesión'; END IF;
  IF public.has_role(auth.uid(), 'mentor') THEN RETURN; END IF;
  UPDATE public.codigos_mentor SET usado_por = auth.uid(), usado_en = now()
   WHERE codigo = upper(trim(_codigo)) AND usado_por IS NULL
     AND correo IS NOT NULL AND correo = lower(coalesce(auth.jwt() ->> 'email', ''));
  IF NOT FOUND THEN RAISE EXCEPTION 'Código no válido, ya usado o reservado para otra persona'; END IF;
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'colaborador';
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'mentor') ON CONFLICT DO NOTHING;
END $$;