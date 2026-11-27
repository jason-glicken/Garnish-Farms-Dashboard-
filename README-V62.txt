GARNISH FARMS DASHBOARD — V62 VISUAL REFINEMENT UPDATE

This ZIP contains the V62 UI refinement files plus an updated index.html that already loads the refinement stylesheet.

Included:
- index.html — current repository page shell, with gf3-visual-refinement.css linked immediately after gf3-styles.css.
- gf3-app.js — updated strain lifecycle timeline and one-line strain title.
- gf3-ui.js — corrected substrate bag icon in the header.
- gf3-visual-refinement.css — matching header KPI cards, tighter typography, and thinner timeline presentation.

Install:
1. Back up your current site files.
2. Upload/replace these four files in the same folder as your existing index.html.
3. Keep the existing gf3-styles.css, gf3-data.js, and gf3-production.js files. Do not replace or remove them.
4. Deploy/refresh the site and hard-refresh the browser if the old styling is cached.

This is a four-file overlay, not a full standalone website. It relies on the existing data and production modules in your current deployment. It does not modify Supabase schema, production records, or credentials.
