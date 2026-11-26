# Garnish Farms Mushroom Dashboard

## One shared header
Every page loads the same component:
- `shared-header.html` — canonical Home header markup
- `shared-header.css` — header styles extracted from the Home design
- `shared-header.js` — loads the shared markup/styles, sets active navigation, and refreshes inventory and sync status

Each page contains only a `gf-shared-header` mount point. Do not duplicate header markup or styling in page files. Change the three shared files to update the header everywhere.

The shared data loader uses the same Supabase project, `batches` table, query ordering, active-status exclusions, and KPI calculations as Home's `renderKPIs()`.

## Deploy
Upload the contents of this folder to the root of the `main` branch. Keep all HTML pages and the three `shared-header.*` files together at the same level.


## Shared architecture (foundation pass)

- `shared-header.html` is the single header markup source.
- `shared-header.css` is the single header stylesheet; page-local copies of the old header CSS have been removed.
- `shared-header.js` mounts the shared header and reads KPI data through the shared data layer.
- `gf-data.js` owns the shared Supabase client, cached table readers, status/stage normalization, and parent/child inventory assembly.
- The strain Production at a Glance page now consumes `GFData.inventory()` rather than maintaining its own separate parent/child merge implementation.

This is a staged migration: several other page-specific data operations remain in their existing page scripts and can be migrated onto `GFData` in subsequent passes. No database rows, IDs, or schema were changed.
