CREATE TABLE public.codigos_mentor (
  codigo text PRIMARY KEY,
  creado_por uuid NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now(),
  usado_por uuid,
  usado_en timestamptz
);
GRANT SELECT ON public.codigos_mentor TO authenticated;
GRANT ALL ON public.codigos_mentor TO service_role;
ALTER TABLE public.codigos_mentor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin ve códigos" ON public.codigos_mentor FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'responsable'));

CREATE OR REPLACE FUNCTION public.generar_codigo_mentor()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'responsable') THEN RAISE EXCEPTION 'No autorizado'; END IF;
  LOOP
    c := upper(substr(translate(encode(gen_random_bytes(12), 'base64'), '+/=0O1Il', ''), 1, 8));
    EXIT WHEN length(c) = 8 AND NOT EXISTS (SELECT 1 FROM public.codigos_mentor WHERE codigo = c);
  END LOOP;
  INSERT INTO public.codigos_mentor (codigo, creado_por) VALUES (c, auth.uid());
  RETURN c;
END $$;
REVOKE ALL ON FUNCTION public.generar_codigo_mentor() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generar_codigo_mentor() TO authenticated;

CREATE OR REPLACE FUNCTION public.canjear_codigo_mentor(_codigo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sin sesión'; END IF;
  IF public.has_role(auth.uid(), 'mentor') THEN RETURN; END IF;
  UPDATE public.codigos_mentor SET usado_por = auth.uid(), usado_en = now()
   WHERE codigo = upper(trim(_codigo)) AND usado_por IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'Código no válido o ya usado'; END IF;
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'colaborador';
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'mentor') ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.canjear_codigo_mentor(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.canjear_codigo_mentor(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.elegir_tipo(_tipo public.app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sin sesión'; END IF;
  IF _tipo NOT IN ('colaborador', 'mentor') THEN RAISE EXCEPTION 'Tipo no permitido'; END IF;
  IF _tipo = 'mentor' AND NOT public.has_role(auth.uid(), 'mentor') THEN RAISE EXCEPTION 'Necesitas un código de mentor'; END IF;
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('colaborador', 'mentor') AND role <> _tipo;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), _tipo) ON CONFLICT DO NOTHING;
END $$;