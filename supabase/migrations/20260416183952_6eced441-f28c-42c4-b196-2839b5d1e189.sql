DROP POLICY IF EXISTS "Public read publication files" ON storage.objects;
-- Bucket is public so files are reachable by URL; admins can still list via service role.
CREATE POLICY "Admins list publication files" ON storage.objects
  FOR SELECT USING (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));