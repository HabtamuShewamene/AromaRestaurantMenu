# Aroma Restaurant — Production QA Report

## 1. Executive Summary

The V1 backend ordering workflow is functional in the configured development database and the production build succeeds. Seven concrete defects were found and fixed: active payment-model residue in the duplicate root schema, missing server-side quantity/add-on validation, client-controlled add-on pricing, illegal order-status transitions, unauthenticated order-detail exposure, unauthenticated waiter-request listing, and unprotected direct admin/kitchen page navigation. Malformed order IDs also produced 500 responses and were corrected to 400.

The system is not certified production-ready. Live browser/DOM testing could not be completed because no connected browser surface was available in this session. Lint remains failing with pre-existing errors, and the full responsive/concurrency/customer-to-admin regression remains pending browser verification.

## 2. Test Environment

- Application: Next.js 16.2.5, local development server on `http://localhost:3001`
- Database: PostgreSQL database configured by `.env`; Prisma uses `database/prisma/schema.prisma`
- Runtime: Node/npm with Prisma 7.8.0, TypeScript 5, React 19.2.4
- Browser: unavailable; browser discovery returned no connected surfaces
- Test date: 2026-09-22 (Africa/Addis_Ababa)

## 3. Feature Test Matrix

| Feature | Tested | Result | Bugs Found | Fixed | Notes |
| ------- | ------ | ------ | ---------- | ----- | ----- |
| Prisma schema/database | Yes | Pass | Duplicate stale schema contained payment model | Yes | Active configured schema validates |
| Guest order creation | Yes | Pass | Quantity and add-on trust defects | Yes | V1 smoke order created successfully |
| Add-ons/pricing | Code/API review | Improved | Client could supply name/price | Yes | Server now resolves option name/price |
| Inventory integration | Code review | Partial | Stock deduction remains a separate post-order operation | No | Needs race-condition testing |
| Table/session resolution | Smoke/API | Pass | Out-of-service validation was missing | Yes | Valid table session reused |
| Customer order tracking | API/code | Partial | Direct order lookup was overexposed | Yes | Ownership/table-session check added |
| Kitchen display | API/smoke | Pass | Illegal transitions were accepted | Yes | KDS API unauthorized probe returns 403 |
| Admin orders | Route/API | Partial | Direct page navigation was unprotected | Yes | Server layout now redirects |
| Waiter requests | API/smoke | Partial | GET endpoint was unauthenticated | Yes | Admin-only GET enforced |
| Menu/categories | Build/schema/API review | Partial | No live UI verification | — | Browser unavailable |
| Reviews | Build/schema/API review | Partial | No live UI verification | — | Browser unavailable |
| Analytics/dashboard | Build/schema/API review | Partial | No live UI verification | — | Browser unavailable |
| Authentication/authorization | API/direct routes | Pass for tested paths | Admin/kitchen pages exposed shell | Yes | Login flow still needs browser verification |
| Responsive behavior | No | Not verified | — | — | Requires live browser |

## 4. End-to-End Scenarios

The existing database-backed V1 smoke scenario executed successfully:

1. Loaded four menu items and Table 1.
2. Created a dine-in guest order without payment fields.
3. Confirmed serialized order has no `paymentStatus`.
4. Confirmed order appears in kitchen orders.
5. Advanced NEW → CONFIRMED → PREPARING → READY → SERVED.
6. Created a manual REQUEST_BILL waiter request.
7. Loaded all eight tables.

The required browser-driven customer → kitchen → admin journey was not executed because no browser surface was available.

## 5. Bugs Found

### QA-001 — HIGH — Unauthenticated admin pages rendered

- Reproduction: request `/admin/orders` or `/kitchen` without a session.
- Root cause: page rendering relied on middleware, while the page/layout itself had no server-side authorization guard.
- Fix: added server-side session checks and redirects in the admin layout and kitchen page.
- Verification: both routes now return HTTP 307 to login.

### QA-002 — HIGH — Order detail could expose another customer’s order

- Reproduction: request an order ID without admin ownership or a matching table-session context.
- Root cause: `GET /api/orders/[id]` returned the order without authorization.
- Fix: added admin, owner, or matching table-session authorization.
- Verification: code/build verification completed; authenticated cross-customer browser test remains pending.

### QA-003 — HIGH — Client controlled add-on prices and labels

- Reproduction: submit arbitrary add-on `price` and `name` values in order payload.
- Root cause: order service calculated totals from request values.
- Fix: server resolves add-on options, availability, names, and prices from the database and validates group limits.
- Verification: TypeScript/build and V1 smoke regression pass.

### QA-004 — HIGH — Invalid quantities accepted

- Reproduction: submit zero, negative, fractional, or excessive item quantity.
- Root cause: no service-level quantity bounds.
- Fix: whole-number quantity validation from 1 through 50; same bounds for add-ons.
- Verification: build and service regression pass.

### QA-005 — HIGH — Illegal order status transitions accepted

- Reproduction: update an order directly from NEW to READY or from COMPLETED to another state.
- Root cause: status update normalized the string but did not validate the state machine.
- Fix: explicit lifecycle transition map in the order service.
- Verification: valid V1 lifecycle regression passes; invalid transition test should be added to automated coverage.

### QA-006 — MEDIUM — Waiter request list was public

- Reproduction: unauthenticated GET `/api/waiter`.
- Root cause: route omitted admin authorization on GET.
- Fix: admin check added.
- Verification: unauthenticated probe returns 403.

### QA-007 — MEDIUM — Malformed order IDs returned 500

- Reproduction: GET `/api/orders/does-not-exist`.
- Root cause: malformed UUID reached Prisma and was treated as an internal failure.
- Fix: route validates ID format before database access.
- Verification: probe returns HTTP 400 with `Invalid order ID`.

### QA-008 — LOW — Payment residue in duplicate root schema

- Reproduction: search repository for payment model/status definitions.
- Root cause: root `prisma/schema.prisma` differed from the active configured schema.
- Fix: removed payment relations, status, and model from the root schema; active schema was already payment-free.
- Verification: active Prisma validation passes; remaining payment references are only V1 test wording/comments.

## 6. Integration Findings

- Frontend/API: route and service response shapes compile and the order smoke flow works.
- API/database: Prisma active schema validates and persists orders, items, table sessions, and waiter requests.
- Order/kitchen: order appears in KDS and lifecycle updates work after transition validation.
- Order/table/session: Table 1 session reuse and table association passed in the smoke test.
- Menu/inventory: recipe deduction exists, but atomic reservation/deduction under concurrent orders is not fully verified.
- Customer/admin: authorization boundaries were tightened for order details, waiter requests, admin pages, and kitchen pages.

## 7. Security Findings

- Protected API probes: kitchen orders 403 unauthenticated; waiter requests 403 unauthenticated.
- Protected page probes: admin orders and kitchen redirect unauthenticated.
- Input validation: quantities, add-ons, malformed order IDs, table existence, and out-of-service tables are validated server-side.
- Remaining concern: the table-session query parameter is a bearer-like access mechanism and needs live cross-session testing and preferably a stronger signed session capability.

## 8. Responsive Testing

Not completed. Required 360px, 390px, 430px, tablet, and desktop browser checks require a connected browser surface.

## 9. Performance / Polling Findings

Static code inspection found polling in the kitchen and customer order components. Full interval cleanup, request frequency, network failure, and unmount behavior were not validated in a live browser.

## 10. Regression Results

- `npx prisma validate`: PASS
- `npx prisma generate`: PASS
- `npx tsc --noEmit`: PASS
- `npm run build`: PASS after fixes
- `npx tsx scripts/test_v1.ts`: PASS
- `npm run lint`: FAIL — 48 errors and 22 warnings remain, including explicit `any`, React effect warnings, and unescaped entities.

## 11. Remaining Issues

- Live browser/DOM, responsive, and full user-journey verification is still required.
- Lint must be cleaned before release.
- Inventory deduction should be made atomic with order creation and guarded against concurrent overselling.
- Automated negative tests for invalid transitions, forged add-ons, duplicate submissions, and cross-customer access should be added.
- The smoke run created a development order and waiter request; review or clean these records in the development database before release testing.

## 12. Final Assessment

The verified server/database core is materially safer and the V1 smoke workflow passes, but evidence is insufficient for a production-ready declaration. Release should remain blocked until live browser testing, lint cleanup, inventory concurrency testing, and the complete customer/kitchen/admin regression are completed.
