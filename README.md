# Optimization Genie Cloud (MVP)

Next.js App Router dashboard for centrally managing connected Optimization Genie WordPress installs.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- Reusable dashboard components
- Secure API routes with HMAC + timestamp checks

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD`
4. `npm run dev`

## MVP Features
- Website registration: `POST /api/sites/register`
- Heartbeat intake: `POST /api/sites/heartbeat`
- Report intake: `POST /api/sites/report`
- Dashboard cards: `/dashboard`
- Site details: `/dashboard/sites/:id`
- License controls: revoke / suspend / restore
- Action logging for remote operations
- Signed admin session cookie auth
- Vercel cron endpoints for maintenance and license expiry checks
- Plugin check-in status route (`POST /api/sites/status`)

## Security Notes
- Each site has `installId` and hashed secret storage.
- Heartbeat/report routes require:
  - `x-og-timestamp`
  - `x-og-signature`
  - `x-og-secret-key`
- Timestamp is validated to reduce replay risk.
- Unsigned/expired/invalid secret requests are rejected.
- Admin action routes require authenticated admin cookie.

## Database
`supabase/schema.sql` includes suggested table definitions for moving from in-memory MVP storage to Supabase/PostgreSQL.

## Vercel Cron
- `GET /api/cron/maintenance`
- `GET /api/cron/license-expiry`

Both require `Authorization: Bearer <CRON_SECRET>`.
