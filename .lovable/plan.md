

## Plan: Add AI Suggest to Job Sheet Steps

The "AI Suggest" button and edge function already exist in the Scope tab but are missing from the two close-out flows where you actually write job notes. The screenshot shows the "Job Sheet" step in the sole trader close-out flow — that's where you need it.

### What changes

**1. `src/components/job/SoleTraderCloseOutFlow.tsx`** — Job Notes step (line ~362)
- Add an "AI Suggest" button next to the "What was done on this job?" label (or alongside Dictate)
- On press, call `supabase.functions.invoke("ai-suggest-description", { body: { jobTitle: job.jobName, client: job.client, address: job.address } })`
- Replace/append the jobSheet textarea content with the AI response
- Show a loading spinner while generating

**2. `src/components/job/JobCompletionFlow.tsx`** — Same change on its jobsheet step (~line 394)
- Add the same AI Suggest button and logic

**3. `supabase/functions/ai-suggest-description/index.ts`** — Update prompt
- Change from a "scope of works" writer to a "job completion notes" writer
- Given a job title like "Solar Install", generate practical completion notes like: "Arrived on site. Spoke with customer regarding installation location. Installed solar panel system as per requirements. Tested and commissioned system, confirmed operational. Cleaned up site."
- Keep it trade-focused, plain text, Australian language

### No new files needed
The edge function already exists and handles the API call. Just need to update the prompt and add the button to the two close-out flows.

