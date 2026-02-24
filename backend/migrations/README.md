# Database migrations (Neon / PostgreSQL)

Migrations are run with [node-pg-migrate](https://github.com/salsita/node-pg-migrate). They use the same `DATABASE_URL` as the app (from `.env`).

## Commands (from `backend/`)

| Command | Description |
|--------|-------------|
| `npm run migrate:up` | Apply all pending migrations |
| `npm run migrate:down` | Roll back the last migration |
| `npm run migrate:create -- <name>` | Create a new migration file (e.g. `add_user_preferences`) |

## First-time setup (Neon)

1. Set `DATABASE_URL` in `backend/.env` to your Neon connection string (pooled).
2. Run:

   ```bash
   cd backend
   npm run migrate:up
   ```

   This creates the `pgmigrations` table and runs the initial schema (extensions, enums, tables, indexes).

## Adding a new migration

1. Create the migration:

   ```bash
   npm run migrate:create -- add_user_preferences
   ```

2. Edit the new file in `migrations/` and implement `up(pgm)` and optionally `down(pgm)` (e.g. `pgm.createTable(...)`, `pgm.sql('...')`).
3. Run `npm run migrate:up` to apply it.

## Production / CI

In production or CI, set `DATABASE_URL` to your production Neon URL and run `npm run migrate:up` before (or right after) starting the app so the schema is always up to date.
