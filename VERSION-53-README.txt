GARNISH FARMS DASHBOARD — GLOBAL FOUNDATION V3

Purpose
This pass continues the database-first architecture work. It centralizes the normal batch, individual-container, culture, and harvest data operations in gf-data.js so page scripts no longer build table queries independently.

Changes
- Added repository methods for batches: list, get, create, update, remove, and createWithItems.
- Added repository methods for batch items: list, create, update, and remove.
- Added repository methods for cultures: list, create, and remove.
- Added repository methods for harvests: list and create (backed by the existing shared harvest methods).
- Batch creation now goes through one shared operation. If child-container insertion fails, the service attempts to roll back the parent and returns an explicit error including rollback status.
- Migrated batch and culture reads/writes in the home, activity, strain, upcoming, harvest, list, new-batch, new-culture, and batch-detail pages to the shared repository API.
- The only direct table access for batches, batch_items, cultures, and harvests is now inside gf-data.js.
- Existing Supabase client remains the only client instance; no page creates its own client.

Important boundaries
- No Supabase SQL, migration, schema, policy, or production data was changed.
- The public.harvests table was not found during the preceding read-only schema audit. Harvest writes will continue to fail visibly until the proposed migration is reviewed and approved/applied.
- Browser localStorage is still used by existing UI preference and stage-timing features. This pass does not convert those preferences to database storage.
- Existing legacy local cache behavior on the home page has not yet been removed. It must be clearly treated as a display cache, not an authoritative write source, and is a remaining cleanup item.
- This ZIP has static syntax and structural checks only; it has not been browser-tested against the authenticated live Supabase account.

Verification
- JavaScript syntax checks passed for gf-data.js and all inline scripts in dashboard HTML pages.
- Structural scan found no direct page-level .from('batches'|'batch_items'|'cultures'|'harvests') calls; those table accesses are confined to gf-data.js.
- One shared createClient call remains in gf-data.js.
- ZIP integrity check passed after packaging.

Next
1. Review and approve the harvests table migration before running it.
2. Browser-test all page workflows with the authenticated account.
3. Review and remove misleading local cache fallback behavior where it could be mistaken for live production data.
4. Add database-backed lifecycle/audit history and transaction-safe operations where needed, without altering existing production records until approved.
