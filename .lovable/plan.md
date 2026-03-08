

# Foundation for Scale: Frontend + Backend + Own Supabase

## What We're Doing

Restructuring the project to decouple from Lovable Cloud and set up a proper production architecture:
- **Python/FastAPI backend** (for Render deployment) with a `/health` endpoint
- **Your own Supabase project** for data (customers, jobs, sessions)
- **Health indicator** in the header (database icon, red/green)
- **Remove AI edge function** and its references
- **Frontend talks directly to Supabase** for data, uses Render backend for custom logic (with plans to route everything through backend later)

## Folder Structure

```text
project/
├── backend/                  ← NEW: Python FastAPI
│   ├── main.py               ← FastAPI app with /health endpoint
│   ├── requirements.txt      ← fastapi, uvicorn, supabase-py
│   └── render.yaml           ← Render deployment config
├── src/                      ← Frontend (unchanged location)
│   ├── components/
│   │   ├── AppHeader.tsx      ← Add health indicator icon
│   │   └── BackendStatus.tsx  ← NEW: DB icon component with polling
│   ├── config/
│   │   └── env.ts             ← NEW: centralised env config (backend URL, Supabase URL/key)
│   ├── contexts/
│   │   └── DemoDataContext.tsx ← Update Supabase client references
│   └── ...
├── supabase/                  ← Keep for migrations/schema only
│   └── functions/             ← Remove ai-suggest-description
└── ...
```

## Implementation Steps

### 1. Create the backend folder with FastAPI health check
- `backend/main.py`: FastAPI app with CORS, single `GET /health` returning `{"status": "ok", "db": "connected"}` (later will actually ping Supabase)
- `backend/requirements.txt`: fastapi, uvicorn
- `backend/render.yaml`: basic web service config

### 2. Add environment config to frontend
- Create `src/config/env.ts` exporting `BACKEND_URL` (defaults to `http://localhost:8000` for dev)
- Add `VITE_BACKEND_URL` usage pattern

### 3. Build the health indicator component
- `src/components/BackendStatus.tsx`: small component that polls `BACKEND_URL/health` every 30 seconds
- Shows a `Database` icon from lucide-react: green when connected, red when not
- Tooltip showing "Backend connected" / "Backend offline"

### 4. Add health indicator to AppHeader
- Insert `<BackendStatus />` into the header bar alongside existing controls

### 5. Remove the AI edge function
- Delete `supabase/functions/ai-suggest-description/index.ts`
- Update the 3 files that reference it (`ScopeTab.tsx`, `SoleTraderCloseOutFlow.tsx`, `JobCompletionFlow.tsx`) to remove the AI call — replace with a toast saying "AI suggestions coming soon" or disable those buttons

### 6. Prepare Supabase swap
- The existing `src/integrations/supabase/client.ts` already reads from env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). When you set up your own Supabase project, you'll just need to provide those values.
- The existing tables (demo_sessions, demo_jobs, demo_customers) and their schema will need to be recreated in your new project. We'll keep the migration files as reference.
- Data flow stays: frontend → Supabase directly for now.

## Questions Answered
- **Backend**: Python + FastAPI on Render
- **Supabase**: Your own project (you'll provide URL + anon key when ready)
- **Data flow**: Direct to Supabase for now, through Render later

## What This Does NOT Change
- All existing UI, routing, contexts, demo data flow stays identical
- The Supabase client code continues to work — just pointed at different credentials later
- No auth changes yet

