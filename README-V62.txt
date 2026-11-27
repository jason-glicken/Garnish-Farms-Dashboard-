GARNISH FARMS DASHBOARD — VISUAL REFINEMENT UPDATE

Overlay this update onto the current Garnish Farms Dashboard repository/build.

Files:
- gf3-app.js — updated strain timeline and one-line strain title.
- gf3-ui.js — corrected header bag icon.
- gf3-visual-refinement.css — matching KPI cards, smaller body typography, thinner lifecycle timelines.
- index-link-instructions.txt — add the stylesheet after gf3-styles.css in index.html.

Install:
1. Replace gf3-app.js and gf3-ui.js with the files in this ZIP.
2. Copy gf3-visual-refinement.css into the same folder as index.html.
3. In index.html, add this immediately after the gf3-styles.css link:
   <link rel="stylesheet" href="gf3-visual-refinement.css">
4. Keep all other current files and data unchanged.

Timeline:
- Solid colored segments = recorded actual stage periods.
- Dashed colored segments = targeted Grain Spawn → Bulk Substrate → Fruiting lifecycle.
- Vertical marker = today.
- Existing 90-day window remains 30 days back / 60 days ahead.

No Supabase schema, records, or credentials are modified by this UI-only update.
