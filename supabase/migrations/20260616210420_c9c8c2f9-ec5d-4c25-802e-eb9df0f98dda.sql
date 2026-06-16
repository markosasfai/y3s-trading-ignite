
-- 1. Drop unused phone_verifications table (replaced by Twilio Verify)
DROP TABLE IF EXISTS public.phone_verifications;

-- 2. Revoke read/update/delete from anon and authenticated on sensitive tables
REVOKE SELECT, UPDATE, DELETE ON public.leads FROM anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.challenge_registrations FROM anon, authenticated;

-- Keep INSERT for submissions
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT INSERT ON public.challenge_registrations TO anon, authenticated;

-- Ensure service_role retains full access for backend operations
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.challenge_registrations TO service_role;

-- 3. Add explicit deny-all SELECT/UPDATE/DELETE policies so RLS is unambiguous
DROP POLICY IF EXISTS "No public read access" ON public.leads;
CREATE POLICY "No public read access" ON public.leads
  FOR SELECT TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "No public update" ON public.leads;
CREATE POLICY "No public update" ON public.leads
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No public delete" ON public.leads;
CREATE POLICY "No public delete" ON public.leads
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "No public read access" ON public.challenge_registrations;
CREATE POLICY "No public read access" ON public.challenge_registrations
  FOR SELECT TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "No public update" ON public.challenge_registrations;
CREATE POLICY "No public update" ON public.challenge_registrations
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No public delete" ON public.challenge_registrations;
CREATE POLICY "No public delete" ON public.challenge_registrations
  FOR DELETE TO anon, authenticated USING (false);
