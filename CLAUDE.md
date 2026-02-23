# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm migrate          # Apply pending DB migrations
pnpm migrate:baseline # Mark all pending migrations as applied without running them (use once on existing DB)
```

**Requirements:** Node.js >= 18, pnpm >= 8.14.3

## Architecture

**Formula 1 Prediction Pool** — a Next.js App Router application where users predict race/season outcomes and earn points based on accuracy.

### Stack
- **Next.js** (App Router) with **TypeScript** strict mode
- **PostgreSQL** on Supabase via `postgres` npm client (no ORM — raw SQL with tagged template literals)
- **NextAuth.js** (Google OAuth) with custom session extending user ID
- **Tailwind CSS** + **HeroUI** component library
- **Chart.js** / **react-chartjs-2** for data visualization
- **Zod** for schema validation

### Key Directories
- [app/lib/](app/lib/) — Core logic: `data.ts` (DB queries), `actions.ts` (server actions/mutations), `definitions.ts` (TypeScript types)
- [app/ui/](app/ui/) — Reusable components organized by feature (`admin/`, `my-predictions/`)
- [app/dashboard/](app/dashboard/) — Main dashboard with leaderboard, last events, track chart
- [app/my-predictions/](app/my-predictions/) — User prediction forms and display
- [app/results/](app/results/) — Race results and scoring
- [app/admin/](app/admin/) — Admin panel for managing prediction configs
- [app/grid/](app/grid/) — F1 grid & calendar page: teams with car images, drivers with headshots, full season calendar grouped by month
- [app/layout/](app/layout/) — Root layout components (header, sidenav, providers)

### Data Model
Key tables: `events`, `prediction_groups`, `prediction_group_items`, `points_definitions`, `points_exceptions`, `user_predictions`, `prediction_templates`, `event_results`, `season_results`, `drivers`, `teams`, `users`.

`prediction_templates` — stores a user's reusable race pick template (one row per `user_id` + `prediction_group_item_id`, no `event_id`). Used to pre-fill the next upcoming event's prediction form via "Cargar plantilla". Updated via "Guardar y Actualizar Plantilla" button in the event predictions form.

Prediction scoring types: `EXACT`, `ANY_IN_ITEMS`, `RESULTS_INCLUDES`. Selection types: `DRIVER_UNIQUE`, `TEAM_UNIQUE`, `DRIVER_MULTIPLE`, `TEAM_MULTIPLE`, `POSITION`.

### Auth & Routing
- `middleware.ts` protects all routes except `/`, `/login`, `/api/*`, `/_next/*`, static files
- `auth.config.ts` — NextAuth with Google provider; stores user in DB on first login
- Session includes database `userId` (see [types/next-auth.d.ts](types/next-auth.d.ts))

### Patterns
- Data fetching happens in **Server Components** via functions in `app/lib/data.ts`
- Mutations use **Server Actions** in `app/lib/actions.ts`
- Components that need interactivity are `"use client"` components
- Images from `media.formula1.com` and `cdn-icons-png.flaticon.com` are allowed in `next.config.ts`
- F1 team colors are safelisted in Tailwind config for dynamic class generation
- Team colors are applied inline via `style={{ borderColor: \`#${team.colour}\` }}` since dynamic Tailwind classes are not safelisted for all hex values

## Environment Variables

Required in `.env` (locally) / Vercel environment (production):
```
POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_HOST
SUPABASE_URL, SUPABASE_JWT_SECRET, SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXTAUTH_SECRET, NEXTAUTH_URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

> **Note:** Use `.env` locally, not `.env.local`. The migration script (`scripts/migrate.ts`) reads from `.env`.

## Database Migrations

Schema changes are managed via plain SQL migration files. No ORM — uses the same `postgres` client as the rest of the app.

### Key files
- [migrations/](migrations/) — SQL migration files, named `NNNN_description.sql` (e.g. `0001_initial_schema.sql`)
- [scripts/migrate.ts](scripts/migrate.ts) — Migration runner script (reads `.env`, creates `schema_migrations` table, applies pending files in order)

### How it works
- A `schema_migrations` table tracks which files have been applied (by filename)
- Each migration runs in a transaction; on success its filename is recorded
- Vercel deployments automatically run `pnpm migrate` before `next build` (see `vercel.json`)

### Adding a new migration
1. Create `migrations/NNNN_your_change.sql` (increment the number)
2. Run `pnpm migrate` locally to apply it
3. Deploy — Vercel will apply it automatically during build

### First-time setup on an existing DB
Run `pnpm migrate:baseline` once — marks the initial migration as applied without executing the SQL, so only future migrations run.

### First-time setup on a fresh DB
Run `pnpm migrate` — creates all tables from `0001_initial_schema.sql` and all subsequent migrations.

## Deployment

Deployed on Vercel. Config in `vercel.json` uses `pnpm migrate && pnpm run build` and `pnpm install --no-frozen-lockfile`.
