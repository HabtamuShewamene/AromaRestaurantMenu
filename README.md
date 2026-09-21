# Cafe Menu

Next.js cafe ordering app with a clear split between frontend features, backend server code, and database assets.

## Structure

```text
src/
  app/                  Next.js pages, layouts, and API routes
  components/           Shared UI shell pieces such as layout and providers
  features/             Frontend feature modules grouped by domain
    admin/
    cart/
    menu/
    orders/
    reviews/
  server/               Backend-only code
    auth/
    db/
    integrations/
    legacy/
  shared/               Cross-cutting types and utilities

database/
  prisma/               Prisma schema and migrations
  scripts/              Database setup, seed, and connection helpers
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Notes

- Shared frontend types now follow the active Prisma `id` / `itemId` shape instead of the older Mongo `_id` structure.
