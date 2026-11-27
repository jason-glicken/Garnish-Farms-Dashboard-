# Garnish Farms — Fresh Modular Rebuild

This is a clean replacement application. It does not copy the legacy page implementations.

## Architecture
- `gf-data.js`: one Supabase client, auth, shared read/write repository, parent/child normalization.
- `production.js`: pure production-domain functions (stage normalization, lifecycle dates, timelines, counts, forecast, task generation, navigation targets).
- `ui.js`: shared header, shared container cards, timeline renderer, formatting and reusable UI.
- `views/*.js`: page-specific presentation and interaction only. Views consume the same `GF.store` snapshot and `GF.production` functions.
- HTML entrypoints are thin shells. `index.html?page=...` routes to views; named HTML pages are direct links for familiar URLs.

## Pages
Home / Production at a Glance, Strain Summary, All Batches, Jars, Bags, Fruiting, Container Management, Batch Details, New Batch, New Culture, Harvest, Yield, Upcoming Tasks, Calendar, Activities, Settings.

## Database safety
Uses existing `batches`, `batch_items`, `harvests`, and `cultures` tables. No SQL migrations or schema changes are included. The client uses the existing Supabase project URL and publishable key. Writes are limited to existing columns/tables. Deleting records is deliberately not included in this first rebuild.

## Important behavior
- `batch_items` are individual containers; `batches` are parent batches.
- Parent batches without child rows remain visible as legacy inventory placeholders. They are not silently inserted or migrated.
- Container lifecycle dates are only shown when recorded. Missing historical transitions are not invented.
- Actual timelines preserve completed stage segments; targeted timelines use each record's `target_days` when available, then farm defaults.
- Links carry record IDs and open the relevant container/batch in context.
- Settings are browser-local and do not change database schema.

## Deploy
Upload the contents of this folder to the site root. Test sign-in and read/write workflows on the live Supabase project before relying on them operationally. No authenticated end-to-end browser test was available during packaging.
