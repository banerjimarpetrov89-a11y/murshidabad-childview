
-- Atomic first-admin bootstrap: checks no admin exists and inserts caller as admin.
-- Lives in private schema so it isn't directly exposed as a PostgREST RPC; called via has_admin_exists + admin_bootstrap RPC in public.

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role);
$$;

REVOKE ALL ON FUNCTION public.admin_exists() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO authenticated;

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Lock to prevent races; only succeed if zero admins exist.
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role FOR UPDATE) THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (caller, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;
