GARNISH FARMS DASHBOARD — GLOBAL FOUNDATION DATABASE SERVICES PASS

- One shared header component and controller across all 11 dashboard pages.
- Removed duplicated V41 page-level header KPI scripts.
- One Supabase client is created in gf-data.js and reused by every page.
- Added shared data service methods for batches, batch items, cultures, and harvest history.
- Routed harvest history reads and inserts through the shared data service.
- Removed browser-local harvest-history fallback; failed harvest inserts stop before batch updates.
- Header yield reports unavailable instead of displaying a false zero when the harvest table is missing.
- Added harvests-table-migration-review.sql for owner-restricted schema setup.

IMPORTANT: Read-only inspection found public.harvests is not present. The migration is included for review only and was NOT applied. No live Supabase schema or data was modified.

Remaining: migrate all remaining page-level batch, container, and culture CRUD into domain services; browser-test the complete dashboard with the authenticated account before deployment.
