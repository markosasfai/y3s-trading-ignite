CREATE TABLE public.challenge_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  source text NOT NULL DEFAULT 'landing_page',
  consent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT challenge_registrations_name_length CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  CONSTRAINT challenge_registrations_email_length CHECK (char_length(email) BETWEEN 5 AND 255),
  CONSTRAINT challenge_registrations_phone_length CHECK (char_length(phone) BETWEEN 8 AND 32),
  CONSTRAINT challenge_registrations_source_length CHECK (char_length(source) BETWEEN 1 AND 80)
);

GRANT INSERT ON public.challenge_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenge_registrations TO authenticated;
GRANT ALL ON public.challenge_registrations TO service_role;

ALTER TABLE public.challenge_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit registrations"
ON public.challenge_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (consent = true);

CREATE POLICY "Authenticated users can view registrations"
ON public.challenge_registrations
FOR SELECT
TO authenticated
USING (true);

CREATE INDEX challenge_registrations_created_at_idx ON public.challenge_registrations (created_at DESC);
CREATE INDEX challenge_registrations_email_idx ON public.challenge_registrations (lower(email));