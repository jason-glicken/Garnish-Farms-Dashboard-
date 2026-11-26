# Garnish Farms Mushroom Dashboard

This is a clean working copy of the uploaded GitHub Pages site.

## Site files
All HTML pages remain in the repository root so existing relative links and GitHub Pages routing continue to work:
- `index.html` — Home dashboard
- `list.html` — Jars, Bags, Fruiting, and All Batches
- `strain.html` — strain production view
- `batch.html` — batch details
- `new-batch.html` / `new-culture.html` — production entry
- `upcoming.html` — upcoming production tasks
- `harvest.html` — harvest entry/history
- `yield.html` — yield reporting
- `activities.html` — activity log
- `settings.html` — settings

## Shared header sync
`gf-shared-header-sync.js` is included at the bottom of every HTML page. It refreshes non-Home page headers using the exact same `batches` table query as Home. It deliberately does not make optional `batch_items` or `harvests` queries required for header sync.

Header behavior:
- Green: the shared `batches` query completed and records were loaded.
- Gray: checking, or successful query with no production rows.
- Red: the `batches` query or Supabase client failed.

Header counts use the same `batches` rows and KPI rules as Home (`index.html`). Home retains its original loader and sync indicator; all other pages use the shared script. Each page's own content loader is retained.

## Important status
- This package is a prepared clean working copy. It has not been uploaded to GitHub or deployed.
- The Home production pipeline sections that were previously displaying zero/empty are **not represented as fixed** by this packaging/header update. They need a separate diagnosis against the live returned records.
- No Supabase database rows or schema were changed.
- Existing HTML and workflows were retained; historical version notes and SQL migrations were moved into `docs/`.

## Deploy
1. Keep a backup of the current GitHub repository.
2. Upload the contents of this folder to the root of the `main` branch (not the enclosing folder).
3. Commit the files and wait for GitHub Pages deployment.
4. Open the site and test Home, Jars/Bags, Strains, Upcoming, Harvest, and Settings.

If GitHub Pages appears cached, refresh in a private tab or append `?v=1` to the site URL.
