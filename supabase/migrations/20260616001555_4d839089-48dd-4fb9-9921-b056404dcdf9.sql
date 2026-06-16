DROP POLICY IF EXISTS "Authenticated users can view registrations" ON public.challenge_registrations;
REVOKE SELECT, UPDATE, DELETE ON public.challenge_registrations FROM authenticated;
GRANT INSERT ON public.challenge_registrations TO authenticated;