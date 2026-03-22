import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Tradie Toolbelt API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client (lazy init)
_supabase = None


def get_supabase():
    global _supabase
    if _supabase is None:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        if url and key:
            from supabase import create_client
            _supabase = create_client(url, key)
    return _supabase


@app.get("/")
async def root():
    return {"api": "online"}


@app.get("/health")
async def health_check():
    db_status = "not_configured"
    sb = get_supabase()
    if sb:
        try:
            # Lightweight read to verify connectivity
            sb.table("_health_check_dummy").select("*").limit(1).execute()
            db_status = "connected"
        except Exception as e:
            err = str(e)
            # A "relation does not exist" error still proves the DB connection works
            if "does not exist" in err or "42P01" in err:
                db_status = "connected"
            else:
                db_status = "offline"
    return {"status": "ok", "db": db_status}
