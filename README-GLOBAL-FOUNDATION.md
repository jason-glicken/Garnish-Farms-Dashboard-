# Garnish Farms Dashboard — Global Foundation

This development ZIP uses a shared global application header, one Supabase client, and shared repository services for batches, individual containers (`batch_items`), cultures, and harvests.

The design rule is that Supabase is authoritative for production records. Dashboard pages call the shared repository API rather than independently composing table queries. Browser storage is reserved for preferences/planning inputs; local production-record fallbacks are being removed.

## Current release
See `VERSION-58-README.txt` and `VERIFICATION-V8.txt` for this build's changes and verification limits.

## Database safety
No live database schema or records were changed. `harvests-table-migration-review.sql` remains review-only. The preceding read-only schema inspection found no `public.harvests` table, so harvest history is not yet verified as database-persistent. The reviewed migration now adds `batch_pk` as a foreign key to `batches.id` while retaining `batch_id` as the human-readable label. The harvest form sends both values.

## Known architectural transition
The Supabase client is private to `gf-data.js`; page scripts no longer receive the raw client. The lifecycle write path lives in `gf-data.js`. `batch_items.stage` and the lifecycle date columns are the operational projection; `batch_items.stage_history` records transitions and date corrections. Legacy parent-batch date tags remain read-only compatibility fallbacks. Do not delete them until historical rows have been reconciled and authenticated tests pass. Harvest rows also retain their display batch label while using `batch_pk` for a real relational link; deleting a parent batch sets that link to null rather than deleting harvest history.

## Deployment
This is a development ZIP, not a production deployment. Test authenticated workflows in a staging copy before replacing the live GitHub Pages files.

## Authentication status
The shared header now checks whether a Supabase Auth session exists and reports sign-in requirements clearly. This source ZIP does not contain a login page or sign-in flow; do not treat static checks as proof of authenticated access. A sign-in method must be selected and tested before production deployment.


## Version 59 — existing-account authentication
Adds an email/password login page using the existing Supabase Auth user, page access guard, and shared-header sign-out. No account creation, password reset, database migration, database mutation, or deployment is performed. See VERSION-59-README.txt and VERIFICATION-V9.txt.
