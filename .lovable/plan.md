

## Authentication + New Splash Page

### What This Does
1. Removes the onboarding carousel slides
2. Replaces the splash page with a clean Login / Demo Mode entry point
3. Adds Supabase Auth (login, password reset) using your **external Supabase instance** (sbthgkcmbxjgaqvntjja)
4. Demo mode remains available without login — uses existing demo data flow unchanged

### Important: Which Supabase?
- **Auth** will use your external Supabase instance (sbthgkcmbxjgaqvntjja) — the one your Render backend connects to
- **Demo session data** stays on Lovable Cloud as-is (no disruption)
- You'll need to add two new env vars to the Lovable project:
  - `VITE_EXT_SUPABASE_URL` = `https://sbthgkcmbxjgaqvntjja.supabase.co`
  - `VITE_EXT_SUPABASE_ANON_KEY` = the legacy anon key from that project
- Auth client will be a separate Supabase client (`src/lib/authSupabase.ts`) so it doesn't conflict with the demo data client

### New Entry Flow

```text
App loads
  → New SplashPage
     ├── "Sign In" button → Login form (email + password)
     └── "Try Demo" button → existing ModePicker → demo flow (no auth needed)
```

No onboarding carousel. No Jamie intro card. Clean, mobile-friendly splash with the Tradie Toolbelt branding.

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/authSupabase.ts` | Separate Supabase client for external instance (auth only) |
| `src/contexts/AuthContext.tsx` | Auth state provider — session, user, loading, login, logout |
| `src/pages/LoginPage.tsx` | Email + password login form |
| `src/pages/ResetPasswordPage.tsx` | `/reset-password` route — accepts recovery link, lets user set password |

### Files to Modify

| File | Change |
|------|---------|
| `src/pages/SplashPage.tsx` | Replace Jamie intro with clean branding + "Sign In" / "Try Demo" buttons |
| `src/App.tsx` | Remove `OnboardingCarousel`, wrap in `AuthProvider`, add `/reset-password` route, gate authenticated routes behind auth check, allow demo mode without auth |
| `src/components/OnboardingCarousel.tsx` | **Delete** — no longer used |

### SplashPage Redesign
- Tradie Toolbelt logo + name (centered)
- "Sign In" button (primary) → navigates to LoginPage
- "Try Demo" button (outline) → enters demo flow (ModePicker, no auth)
- Mobile-friendly, centered layout, clean

### Auth Flow Details
- **Login**: email + password via `signInWithPassword()`
- **Password setup**: Admin creates user in Supabase dashboard (Auth → Users → Add User), then calls `resetPasswordForEmail()` which sends a setup link
- **Reset password page**: `/reset-password` — reads recovery token from URL hash, shows new password form, calls `updateUser({ password })`
- **Auth state**: `onAuthStateChange` listener set up before `getSession()` in AuthContext
- **Logout**: button in AppHeader when authenticated
- **Public signups disabled**: documented in README (done in Supabase dashboard: Auth → Settings → disable signups)

### Auth vs Demo Mode
- If user signs in → authenticated flow, future-ready for real data
- If user clicks "Try Demo" → skips auth entirely, uses existing demo data path
- Both paths converge at the ModePicker

### RLS Changes (for future, not this phase)
The user's prompt includes RLS SQL for `customers` table (adding `user_id`). This is a **schema change on the external Supabase** — not something we run via Lovable Cloud migrations. The SQL will be documented in `README.md` for manual execution. This phase focuses on getting auth working; RLS enforcement comes next once the auth flow is proven.

### What Does NOT Change
- Demo data flow (sessions, jobs, customers in Lovable Cloud)
- ModePicker component
- All existing pages and features
- Backend/Render connection

### Env Vars Needed
You'll need to add these as Lovable project secrets (Settings → Environment):
- `VITE_EXT_SUPABASE_URL`
- `VITE_EXT_SUPABASE_ANON_KEY`

