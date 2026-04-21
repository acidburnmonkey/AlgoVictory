# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (Django)
```bash
# Python deps managed with uv (pyproject.toml + uv.lock)
uv sync                    # install/sync deps
source .venv/bin/activate  # activate venv before running manage.py

python manage.py runserver

# Migrations
python manage.py makemigrations
python manage.py migrate

# Django shell
python manage.py shell
```

### Frontend (Vite + React)
```bash
cd frontend
npm run dev       # dev server on http://127.0.0.1:5173
npm run build     # tsc + vite build → dist/
npm run preview   # preview production build locally
npm run lint      # eslint
```

### Stripe webhook testing (local)
```bash
stripe listen --forward-to 127.0.0.1:8000/payments/stripe-webhook/
stripe trigger checkout.session.completed
```

### Test scripts (ad hoc, not a test suite)
```bash
# Located in testScripts/ — run individually, e.g.:
python testScripts/endpointTest.py
```

There are no automated test suites (Django tests or Jest). The `testScripts/` directory contains one-off Python scripts for manual endpoint and flow verification.

## Architecture

### Django apps

| App | Responsibility |
|---|---|
| `api` | Custom `User` model (extends `AbstractUser`), auth views, allauth adapter |
| `sports` | MMA data models, sportsdata.io API jobs, scheduled ingestion |
| `payments` | Stripe checkout session + webhook handler |
| `divinatio` | Django project config; `apps.py` starts the APScheduler on server boot |

### URL routing
- `api/token/` — JWT obtain/refresh (simplejwt)
- `api/user/register/` — user registration
- `api/` → `api.urls` — user info, social token exchange, password reset
- `sports/` → `sports.urls` — event list, fight card, test view
- `payments/` → `payments.urls` — Stripe pay + webhook
- `accounts/` → allauth (Google/Twitter OAuth)

**Important:** the axios `baseURL` in the frontend defaults to `http://127.0.0.1:8000` (not `/api`). `sports/` and `payments/` endpoints are at the backend root, not under `/api/`. Calls to those endpoints must include the full prefix (e.g. `api.get('/sports/fight-card/')`).

### Auth flow
Two auth paths both converge on JWT stored in `localStorage`:
1. **Email/password** — POST to `api/token/` → store `access`/`refresh` tokens
2. **Social (Google/Twitter)** — allauth session login → Django redirects to `api/social-token/` → exchanges session for JWT → redirects to frontend `/home?access=...&refresh=...`

`AuthContext` (`frontend/src/components/AuthContext.tsx`) is the central auth state. It checks token expiry on mount, auto-refreshes, and fetches `api/user-info/` to populate `username`, `avatar`, and `isPremium`. Wrap protected UI in `<ProtectedRoute>` (requires auth) or `<LogedInLock>` (blocks already-logged-in users from login/register).

### Sports data ingestion (APScheduler)
`divinatio/apps.py` → `runapscheduler.py` starts APScheduler when the Django dev server's main process launches (`RUN_MAIN=true`). All four jobs also fire **immediately on startup**, then repeat on their interval:
- `fetch_mma_schedules` — every 20 days, pulls UFC schedule from sportsdata.io, upserts `UpcomingEventsModel`
- `get_fighter_stats` — every 15 days, fetches fighter stats per event and populates `FighterModel` + `FightModel` + `FightFighterModel`
- `set_fighter_image` — every 15 days, fills missing `imageURL` on `FighterModel` via octagon-api.com
- `schedule_archive` — every 1 day, schedules a one-shot `archive_event` job to run the day after the next event's date

Jobs are stored in the DB via `DjangoJobStore` and visible in the Django admin.

### Data model relationships (sports app)
```
UpcomingEventsModel (eventId unique) ──archived──▶ PastEventsModel
    └── FightModel (FK → UpcomingEventsModel.eventId)
            └── FightFighterModel (FK → FightModel, FK → FighterModel)
                    └── FighterModel (fighter_id PK)
```
`FightFighterModel` is the M2M join table and also stores per-fight data: moneyline odds and each fighter's pre-fight record (wins/losses/draws). This is where fight-specific stats live, not on `FighterModel` itself.

`archive_event()` copies the first `UpcomingEventsModel` row to `PastEventsModel` using a `__class__` reassignment trick (`entry.__class__ = PastEventsModel`), then deletes it from `UpcomingEventsModel`.

`FightCardView` serves the upcoming event's fight card by looking up `UpcomingEventsModel.objects.values_list('eventId').first()` at class definition time — this means the queryset is evaluated once at startup, not per request.

`CardSerializer` (used by `FightCardView`) nests `FightFighterSerializer` → `FighterSerializer` but only exposes the `fighter` object — `moneyline` and pre-fight record fields from `FightFighterModel` are not included in the API response.

### Frontend structure
- `src/api.ts` — configured axios instance; reads `VITE_API_URL` from env, falls back to `http://127.0.0.1:8000`
- `src/interfaces.ts` — all shared TypeScript interfaces mirroring backend serializers
- `src/App.tsx` — route definitions; lazy-loads heavy pages (`PasswordReset`, `PaymentResponse`, `Settings`, `PrivacyPolicy`, `TermsOfService`)
- MUI + Tailwind CSS v4 are both active; MUI theme is in `src/styles/theme`

### Environment variables

**Backend (`.env` in repo root):**
| Variable | Purpose |
|---|---|
| `production` | If set (any truthy value), enables prod mode — ports/URLs read from env, password validators enabled |
| `SENDGRID_API_KEY` | Transactional email |
| `STRIPE_SECRET` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `SPORTS_API_KEY` | sportsdata.io MMA API |

**Frontend (`frontend/.env`):**
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL (default: `http://127.0.0.1:8000`) |
| `VITE_PROD_WIP` | Shows `ConstructionBanner` when true |

### Premium / payments
`payments/views.py` creates Stripe checkout sessions and handles `checkout.session.completed` webhooks. On success, `User.premium` is set to `True` and `User.payment_date` + `User.payment_expires` (1 month out) are recorded. `AuthContext` exposes `isPremium` derived from the `/api/user-info/` response.

### Shared dev config (`api/dev.py`)
`api/dev.py` centralises port/URL constants and provides `get_logger()`. In dev mode (no `production` env var), all ports and URLs are hardcoded defaults. Import from here rather than repeating `os.getenv` calls in view files.
