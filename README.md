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
