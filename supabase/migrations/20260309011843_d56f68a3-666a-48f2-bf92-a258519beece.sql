-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public access demo_sessions" ON public.demo_sessions;
DROP POLICY IF EXISTS "Public access demo_jobs" ON public.demo_jobs;
DROP POLICY IF EXISTS "Public access demo_customers" ON public.demo_customers;

-- Create new PERMISSIVE policies for full public access (anonymous demo sessions)
CREATE POLICY "Allow all access to demo_sessions"
ON public.demo_sessions
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to demo_jobs"
ON public.demo_jobs
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to demo_customers"
ON public.demo_customers
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';