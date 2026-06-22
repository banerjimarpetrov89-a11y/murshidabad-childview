
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION private.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION private.update_updated_at_column() FROM PUBLIC;

-- Recreate triggers to use private.update_updated_at_column
DROP TRIGGER IF EXISTS trg_resources_updated ON public.resources;
DROP TRIGGER IF EXISTS trg_publications_updated ON public.publications;
DROP TRIGGER IF EXISTS trg_events_updated ON public.events;
DROP TRIGGER IF EXISTS trg_stakeholders_updated ON public.stakeholders;
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION private.update_updated_at_column();
CREATE TRIGGER trg_publications_updated BEFORE UPDATE ON public.publications FOR EACH ROW EXECUTE FUNCTION private.update_updated_at_column();
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION private.update_updated_at_column();
CREATE TRIGGER trg_stakeholders_updated BEFORE UPDATE ON public.stakeholders FOR EACH ROW EXECUTE FUNCTION private.update_updated_at_column();

-- Recreate public-table policies against private.has_role
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users see own roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins write resources" ON public.resources;
CREATE POLICY "Admins write resources" ON public.resources FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins write publications" ON public.publications;
CREATE POLICY "Admins write publications" ON public.publications FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins write events" ON public.events;
CREATE POLICY "Admins write events" ON public.events FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins write stakeholders" ON public.stakeholders;
CREATE POLICY "Admins write stakeholders" ON public.stakeholders FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Recreate storage.objects policies against private.has_role
DROP POLICY IF EXISTS "Admins upload publication files" ON storage.objects;
DROP POLICY IF EXISTS "Admins update publication files" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete publication files" ON storage.objects;
DROP POLICY IF EXISTS "Admins list publication files" ON storage.objects;
CREATE POLICY "Admins list publication files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'publications' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins upload publication files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'publications' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update publication files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'publications' AND private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'publications' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete publication files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'publications' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Drop the old public-schema functions now that nothing depends on them
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.update_updated_at_column();
