GARNISH FARMS — SHARED HEADER UPDATE v1

This is a focused header/navigation patch for the current main-branch GF3 site.
It is NOT a replacement for the entire dashboard.

Files in this ZIP:
- index.html
- gf3-header.js
- gf3-header-layout.css

Install:
1. Keep the existing gf3-data.js, gf3-production.js, gf3-ui.js,
   gf3-app.js, and gf3-styles.css files.
2. Replace index.html with the included index.html.
3. Add gf3-header.js and gf3-header-layout.css to the repository root.
4. Do not delete or rename existing production files.

What this changes:
- One compact static title/sync/settings bar.
- One shared main navigation row beneath it.
- One shared strain-filter ribbon beneath the main navigation.
- Active page and selected strain are shown.
- The existing centralized GFUI.header() call is reused.
- Existing data, Supabase tables, production logic, and page renderers are not changed.

Important scope note:
The current gf3-app.js calls U.header(d) once from its central render(d)
function. This patch overrides that shared header function; it does not
rewrite page renderers or change production behavior. The KPI/action strip
that used to be inside the header is intentionally removed from the global
header so the top area stays clean and consistent.

Validation:
This patch was checked for ZIP integrity and required file presence.
It has not been deployed to GitHub Pages or visually tested against the
live Supabase-backed site from this package.
