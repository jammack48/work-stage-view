

## Update README: Add Infrastructure & Accounts Reference

### What
Add a persistent "Infrastructure & Accounts" section to the README as a single source of truth for all services, logins, and integrations the app uses. The user will maintain this over time.

### Content to Add

**File**: `README.md` — add a new section after the intro:

```markdown
## Infrastructure & Accounts

| Service | Purpose | Login / Account |
|---------|---------|-----------------|
| **Lovable** | Frontend hosting, IDE, deployment | macieinvestments |
| **Lovable Cloud (Supabase)** | Demo database — session jobs, customers, pipeline data | Managed by Lovable (no separate login) |
| **Supabase Standalone** | Production database (future) | jamie@thermalvolt.co.nz |
| **Render** | Backend server (FastAPI) | jamie@ostelelectrical.co.nz |

### Notes
- Lovable Cloud project ID: `ttpndqaghjuoqnngdwlh`
- Render backend URL: `https://tradie-toolbelt-server.onrender.com`
- Backend currently only serves a health-check endpoint — no business logic yet
- Add new services to this table as they are introduced
```

### One file change
- `README.md` — insert the infrastructure table after the project description, before the "How can I edit this code?" section.

