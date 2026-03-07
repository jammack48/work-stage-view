
-- Demo sessions table
CREATE TABLE public.demo_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  label text DEFAULT ''
);

-- Demo jobs table
CREATE TABLE public.demo_jobs (
  id serial PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  job_id text NOT NULL,
  client text NOT NULL,
  job_name text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  age_days integer NOT NULL DEFAULT 0,
  urgent boolean NOT NULL DEFAULT false,
  stage text NOT NULL DEFAULT 'Lead',
  has_unread boolean NOT NULL DEFAULT false
);

-- Demo customers table
CREATE TABLE public.demo_customers (
  id serial PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  customer_id integer NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  jobs integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'leads',
  total_spend numeric NOT NULL DEFAULT 0,
  notes jsonb NOT NULL DEFAULT '[]',
  contacts jsonb NOT NULL DEFAULT '[]',
  job_history jsonb NOT NULL DEFAULT '[]'
);

-- Indexes for fast session lookups
CREATE INDEX idx_demo_jobs_session ON public.demo_jobs(session_id);
CREATE INDEX idx_demo_customers_session ON public.demo_customers(session_id);

-- Enable RLS
ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_customers ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth needed for demo/testing)
CREATE POLICY "Public access demo_sessions" ON public.demo_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access demo_jobs" ON public.demo_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access demo_customers" ON public.demo_customers FOR ALL USING (true) WITH CHECK (true);
