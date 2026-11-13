CREATE OR REPLACE FUNCTION public.elegir_tipo(_tipo public.app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sin sesión'; END IF;
  IF _tipo NOT IN ('colaborador', 'mentor') THEN RAISE EXCEPTION 'Tipo no permitido'; END IF;
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('colaborador', 'mentor') AND role <> _tipo;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), _tipo) ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.elegir_tipo(public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.elegir_tipo(public.app_role) TO authenticated;