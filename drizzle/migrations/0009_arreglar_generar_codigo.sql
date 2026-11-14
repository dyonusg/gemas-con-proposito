CREATE OR REPLACE FUNCTION public.generar_codigo_mentor()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c text; alfabeto text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; i int;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'responsable') THEN RAISE EXCEPTION 'No autorizado'; END IF;
  LOOP
    c := '';
    FOR i IN 1..8 LOOP c := c || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1); END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.codigos_mentor WHERE codigo = c);
  END LOOP;
  INSERT INTO public.codigos_mentor (codigo, creado_por) VALUES (c, auth.uid());
  RETURN c;
END $$;