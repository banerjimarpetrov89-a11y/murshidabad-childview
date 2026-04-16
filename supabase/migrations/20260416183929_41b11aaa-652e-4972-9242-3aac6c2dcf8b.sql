-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users see own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Resources
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'scheme', -- scheme | sop | manual
  stakeholder TEXT NOT NULL DEFAULT 'govt', -- govt | ngo | csr
  theme TEXT NOT NULL DEFAULT 'protection', -- child_marriage | trafficking | protection | health
  url TEXT,
  file_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins write resources" ON public.resources FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Publications
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  key_findings TEXT,
  year INT,
  type TEXT NOT NULL DEFAULT 'report', -- report | study | baseline | endline
  file_path TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read publications" ON public.publications FOR SELECT USING (true);
CREATE POLICY "Admins write publications" ON public.publications FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_publications_updated BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  location TEXT,
  type TEXT NOT NULL DEFAULT 'campaign', -- campaign | drive | intervention
  impact_story TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins write events" ON public.events FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Stakeholders
CREATE TABLE public.stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'govt', -- govt | ngo | csr
  role TEXT,
  areas TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stakeholders" ON public.stakeholders FOR SELECT USING (true);
CREATE POLICY "Admins write stakeholders" ON public.stakeholders FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_stakeholders_updated BEFORE UPDATE ON public.stakeholders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for publication PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('publications', 'publications', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read publication files" ON storage.objects
  FOR SELECT USING (bucket_id = 'publications');
CREATE POLICY "Admins upload publication files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update publication files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete publication files" ON storage.objects
  FOR DELETE USING (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));