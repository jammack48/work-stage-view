ALTER TABLE public.variations
ADD COLUMN IF NOT EXISTS job_number text;

ALTER TABLE public.variations
ADD COLUMN IF NOT EXISTS variation_number integer;

UPDATE public.variations
SET job_number = COALESCE(job_number, job_id)
WHERE job_number IS NULL;

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY job_id ORDER BY created_at, id) AS row_num
  FROM public.variations
)
UPDATE public.variations v
SET variation_number = r.row_num
FROM ranked r
WHERE v.id = r.id
  AND v.variation_number IS NULL;

ALTER TABLE public.variations
ALTER COLUMN job_number SET NOT NULL;

ALTER TABLE public.variations
ALTER COLUMN variation_number SET NOT NULL;

ALTER TABLE public.variations
ALTER COLUMN variation_number SET DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_variations_job_number_unique
ON public.variations(job_id, variation_number);
