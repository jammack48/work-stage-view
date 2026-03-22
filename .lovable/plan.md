

## Connect Standalone Supabase DB to Backend

### What This Does
Your FastAPI backend on Render will connect to your standalone Supabase DB (`sbthgkcmbxjgaqvntjja.supabase.co`). The `/health` endpoint will ping the DB and report connection status. The frontend status panel will show both "Server online" and "DB connected" states.

### How DB Check Works
No need to write data — the backend uses `supabase-py` to run a lightweight read query (e.g., list a table or call a simple RPC). If it responds, DB is connected. No writes needed.

### Steps

**1. Update backend to connect to Supabase**
- `backend/main.py` — import `supabase`, init client from env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`), update `/health` to ping DB and return `{"status": "ok", "db": "connected"}` or `{"status": "ok", "db": "offline"}`
- `backend/requirements.txt` — add `supabase` package

**2. Update frontend to show DB status**
- `src/contexts/BackendContext.tsx` — parse `db` field from health response, expose `dbConnected` state
- `src/components/BackendLogPanel.tsx` — show DB connection status (green/red dot) alongside server status
- `src/components/BackendStatus.tsx` — tooltip shows both server and DB status

**3. Update README**
- Add standalone Supabase project URL (`sbthgkcmbxjgaqvntjja.supabase.co`) to the infrastructure table

**4. User action required: Set env vars on Render**
- You'll need to add two environment variables in your Render dashboard for the backend service:
  - `SUPABASE_URL` = `https://sbthgkcmbxjgaqvntjja.supabase.co`
  - `SUPABASE_SERVICE_KEY` = your service role key from the Supabase dashboard

### Files to Change

| File | Change |
|------|--------|
| `backend/main.py` | Add supabase client init + DB ping in `/health` |
| `backend/requirements.txt` | Add `supabase` |
| `src/contexts/BackendContext.tsx` | Parse and expose `dbConnected` from health response |
| `src/components/BackendLogPanel.tsx` | Show DB status row |
| `src/components/BackendStatus.tsx` | Update tooltip to include DB status |
| `README.md` | Add standalone Supabase URL to infrastructure table |

