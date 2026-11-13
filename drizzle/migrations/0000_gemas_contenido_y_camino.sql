CREATE TABLE public.lecciones (
  numero int PRIMARY KEY,
  color_gema text NOT NULL,
  cualidad text NOT NULL,
  pagina_libro int,
  oracion text, oracion_fuente text, oracion_estado text,
  cancion_titulo text, cancion_url text,
  cita text, cita_autor text, cita_fuente text,
  historia_resumen text, historia_donde text, historia_url text,
  juego text, dibujo text,
  explicacion_virtud text, dinamica text,
  manualidad_materiales text, manualidad_pasos text,
  actividad_familia text
);
GRANT SELECT ON public.lecciones TO anon, authenticated;
GRANT ALL ON public.lecciones TO service_role;
ALTER TABLE public.lecciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecciones visibles para todos" ON public.lecciones FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.oraciones (
  id serial PRIMARY KEY,
  leccion_desde int NOT NULL,
  leccion_hasta int NOT NULL,
  texto text NOT NULL,
  fuente text
);
GRANT SELECT ON public.oraciones TO anon, authenticated;
GRANT ALL ON public.oraciones TO service_role;
ALTER TABLE public.oraciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Oraciones visibles para todos" ON public.oraciones FOR SELECT TO anon, authenticated USING (true);

CREATE TYPE public.app_role AS ENUM ('colaborador', 'mentor', 'responsable');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cada uno ve sus roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  alias text NOT NULL DEFAULT 'colaborador',
  fecha_nacimiento date,
  consentimiento_papel boolean NOT NULL DEFAULT false,
  companero_id uuid,
  mentor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver mi perfil, compañero o colaboradores" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR companero_id = auth.uid() OR mentor_id = auth.uid()
         OR public.has_role(auth.uid(), 'responsable'));
CREATE POLICY "Crear mi perfil" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Editar mi perfil" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'colaborador') ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.progreso_pasos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  paso text NOT NULL CHECK (paso IN ('cancion','cita','historia','juego','media','clase')),
  leccion_numero int REFERENCES public.lecciones(numero),
  dirigido_en timestamptz NOT NULL DEFAULT now(),
  confirmado boolean NOT NULL DEFAULT false,
  confirmado_por uuid,
  reconocimiento text,
  UNIQUE (user_id, paso)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progreso_pasos TO authenticated;
GRANT ALL ON public.progreso_pasos TO service_role;
ALTER TABLE public.progreso_pasos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver progreso propio, del compañero o como mentor" ON public.progreso_pasos FOR SELECT TO authenticated
  USING (auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = progreso_pasos.user_id AND (p.companero_id = auth.uid() OR p.mentor_id = auth.uid()))
    OR public.has_role(auth.uid(), 'responsable'));
CREATE POLICY "Marcar mi paso" ON public.progreso_pasos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND confirmado = false);
CREATE POLICY "Mentor confirma" ON public.progreso_pasos FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = progreso_pasos.user_id AND p.mentor_id = auth.uid()));
CREATE POLICY "Borrar mi paso" ON public.progreso_pasos FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.notas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('reflexion','momento')),
  texto text NOT NULL,
  pregunta text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notas TO authenticated;
GRANT ALL ON public.notas TO service_role;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mis notas" ON public.notas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.tarjetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  leccion_numero int REFERENCES public.lecciones(numero),
  idea text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT 'enviada' CHECK (estado IN ('enviada','reenviada')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tarjetas TO authenticated;
GRANT ALL ON public.tarjetas TO service_role;
ALTER TABLE public.tarjetas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mis tarjetas" ON public.tarjetas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Responsable ve tarjetas" ON public.tarjetas FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'responsable'));
CREATE POLICY "Responsable marca reenviada" ON public.tarjetas FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'responsable'));

CREATE TABLE public.encuestas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  sentimiento text, acompanado text, seguir text, comentario text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.encuestas TO authenticated;
GRANT ALL ON public.encuestas TO service_role;
ALTER TABLE public.encuestas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mi encuesta" ON public.encuestas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Responsable ve encuestas" ON public.encuestas FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'responsable'));