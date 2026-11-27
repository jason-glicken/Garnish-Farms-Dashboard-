# Garnish Farms — Clean Rebuild (V3)

Standalone replacement front-end. No legacy page scripts, shared-header files, or compatibility redirects are included.

## Runtime
- `index.html`, `login.html`: entry pages.
- `gf3-data.js`: Supabase client and shared data access.
- `gf3-production.js`: lifecycle calculations, counts, timelines, forecasts and tasks.
- `gf3-ui.js`: shared header, navigation, cards and timelines.
- `gf3-app.js`: page routing and interactions.
- `gf3-styles.css`: styling.
- `gf3-login.js`: sign-in.

Runtime assets use unique `gf3-` names to avoid reusing cached legacy `app.js`, `ui.js`, `gf-data.js`, or `styles.css`.

## Dashboard layout
- Home includes the live strain-mix donut chart and Strain Summary & Inventory table.
- Strain links open dedicated pages with active jar/bag/fruiting counts, a 90-day actual/target timeline, batch-spacing summary, stage-grouped records, and harvest history.
- The Garnish Farms title in the header links back to Home.
- Header KPI cards and action row use reduced vertical padding for a thinner mobile header.

## Clean deployment
1. Back up the current repository/site.
2. Remove old front-end HTML/JS/CSS entrypoints and scripts from the GitHub Pages site root, including legacy `app.js`, `ui.js`, `gf-data.js`, `shared-header.js` and old page scripts.
3. Upload the contents of this package to the site root.
4. Confirm deployed `index.html` references only `gf3-*.js` and `gf3-styles.css`.
5. Test in a private/incognito browser window.

Preserve the Supabase project, tables, migrations, authentication settings and all database records. No SQL migration is included.

## Data safety and verification
Reads existing `batches`, `batch_items`, `harvests`, and `cultures` tables. User-initiated writes use existing tables; no schema changes are included. Historical transition dates are not invented. Existing parents without child rows remain represented as legacy placeholders. JavaScript syntax and ZIP integrity were checked; authenticated live browser testing was not available, so verify sign-in and a small test workflow before relying on writes.
