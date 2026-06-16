-- Leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  phone_verified boolean NOT NULL DEFAULT false,
  device_type text,
  country text,
  user_agent text,
  ip_address text,
  source text NOT NULL DEFAULT 'landing_page',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  consent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent = true);

-- Phone verifications table (server-only)
CREATE TABLE public.phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code_hash text NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  verified boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX phone_verifications_phone_idx ON public.phone_verifications (phone, created_at DESC);

GRANT ALL ON public.phone_verifications TO service_role;

ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (backend) can access.