CREATE TABLE IF NOT EXISTS public.variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  job_id text NOT NULL,
  description text NOT NULL DEFAULT '',
  value numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  materials jsonb NOT NULL DEFAULT '[]'::jsonb,
  labour jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_variations_job_id ON public.variations(job_id);
CREATE INDEX IF NOT EXISTS idx_variations_created_at ON public.variations(created_at DESC);

ALTER TABLE public.variations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to variations" ON public.variations;
CREATE POLICY "Allow all access to variations"
ON public.variations
FOR ALL
TO public
USING (true)
WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
